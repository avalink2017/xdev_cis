# Manual Técnico — Sistema CIS V3

> **Sistema:** Control de Ingresos y Salidas (CIS) V3  
> **Cliente:** Comité Interministerial de Servicios — El Salvador  
> **Arquitectura:** Frontend Angular 21 + Backend .NET 10 + PostgreSQL 16

---

## Índice

1. [Visión General del Sistema](#1-visión-general-del-sistema)
2. [Backend — API .NET 10](#2-backend--api-net-10)
   - 2.1 [Arquitectura y Stack](#21-arquitectura-y-stack)
   - 2.2 [Estructura de Proyectos](#22-estructura-de-proyectos)
   - 2.3 [Modelo de Datos](#23-modelo-de-datos)
   - 2.4 [DbContext y EF Core](#24-dbcontext-y-ef-core)
   - 2.5 [Patrón Repositorio y Unit of Work](#25-patrón-repositorio-y-unit-of-work)
   - 2.6 [Capa de Negocio (BLs)](#26-capa-de-negocio-bls)
   - 2.7 [Servicios Transversales](#27-servicios-transversales)
   - 2.8 [Controladores y Endpoints](#28-controladores-y-endpoints)
   - 2.9 [Seguridad y Autenticación](#29-seguridad-y-autenticación)
   - 2.10 [Permisos y Matriz de Acceso](#210-permisos-y-matriz-de-acceso)
   - 2.11 [Validación, Caching, Rate Limiting y Errores](#211-validación-caching-rate-limiting-y-errores)
   - 2.12 [Reportes con QuestPDF](#212-reportes-con-questpdf)
   - 2.13 [Configuración y Despliegue](#213-configuración-y-despliegue)
3. [Frontend — Angular 21](#3-frontend--angular-21)
   - 3.1 [Arquitectura y Stack](#31-arquitectura-y-stack)
   - 3.2 [Estructura del Proyecto](#32-estructura-del-proyecto)
   - 3.3 [Routing y Navegación](#33-routing-y-navegación)
   - 3.4 [Componentes y Páginas](#34-componentes-y-páginas)
   - 3.5 [Servicios](#35-servicios)
   - 3.6 [Autenticación y Seguridad](#36-autenticación-y-seguridad)
   - 3.7 [Estados Reactivos con Signals](#37-estados-reactivos-con-signals)
   - 3.8 [Formularios y Controles Personalizados](#38-formularios-y-controles-personalizados)
   - 3.9 [Sistema de Temas (Theming)](#39-sistema-de-temas-theming)
   - 3.10 [Estilos y Tailwind CSS v4](#310-estilos-y-tailwind-css-v4)
   - 3.11 [Entornos y Build](#311-entornos-y-build)
   - 3.12 [Testing](#312-testing)
4. [Comunicación Frontend-Backend](#4-comunicación-frontend-backend)
5. [Flujo de Desarrollo](#5-flujo-de-desarrollo)
6. [Despliegue](#6-despliegue)
7. [Apéndices](#7-apéndices)

---

## 1. Visión General del Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                      NAVEGADOR (Cliente)                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │            Angular 21 SPA (xdev-cis)                         │   │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐   │   │
│  │  │ Pages   │ │ Features │ │ Shared   │ │ Core (Services, │   │   │
│  │  │(6)      │ │ (20+)    │ │ (16)     │ │ Guards, Interc) │   │   │
│  │  └─────────┘ └──────────┘ └──────────┘ └────────────────┘   │   │
│  │  Signals · PrimeNG · Tailwind v4 · Lucide Icons · Chart.js   │   │
│  └──────────────────────────┬───────────────────────────────────┘   │
│                             │ HTTPS + Cookies (withCredentials)      │
│                             │ X-API-Key (opcional)                   │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────────┐
│                 .NET 10 Web API (CISApi)                             │
│  ┌────────────┐ ┌───────────────┐ ┌────────────────────────────┐   │
│  │Controllers │ │ Infrastructure│ │ Middleware (Auth, CSRF,    │   │
│  │(33)        │ │ Permissions   │ │ Rate Limiting, Caching,    │   │
│  │            │ │ Caching       │ │ Global Exception Handler)  │   │
│  └─────┬──────┘ └───────────────┘ └────────────────────────────┘   │
│        │                                                            │
│  ┌─────▼────────────────────────────────────────────────────────┐  │
│  │              CISUnitWork (Business Logic)                    │  │
│  │  ┌─────┐ ┌────────┐ ┌──────────┐ ┌────────┐ ┌───────────┐  │  │
│  │  │ BLs │ │ DTOs   │ │ Services │ │Reports │ │Validators │  │  │
│  │  │(16) │ │ (~40)  │ │ (11)     │ │(4)     │ │(24)       │  │  │
│  │  └─────┘ └────────┘ └──────────┘ └────────┘ └───────────┘  │  │
│  └──────────────────────────┬───────────────────────────────────┘  │
│                             │                                       │
│  ┌──────────────────────────▼───────────────────────────────────┐  │
│  │               CISModel (Data Layer)                          │  │
│  │  ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │ Entities │ │ EF Configs │ │Repository│ │Seed Data (8) │  │  │
│  │  │ (37)     │ │ (34)       │ │(Genérico)│ │              │  │  │
│  │  └──────────┘ └────────────┘ └──────────┘ └──────────────┘  │  │
│  │                   ┌──────────────────┐                       │  │
│  │                   │ ApplicationDbContext │                    │  │
│  │                   └──────────────────┘                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ Npgsql
              ┌───────────────▼───────────────┐
              │     PostgreSQL 16             │
              │     Base: CISDB               │
              └───────────────────────────────┘
```

### Stack Tecnológico Resumido

| Capa | Tecnología | Versión |
|---|---|---|
| **Frontend** | Angular (Standalone Components) | ^21.2.0 |
| | PrimeNG UI | ^21.1.9 |
| | Tailwind CSS | ^4.1.12 |
| | Chart.js | ^4.5.1 |
| | Lucide Icons | ^1.21.0 |
| | TypeScript | ~5.9.2 |
| **Backend** | ASP.NET Core | 10.0 |
| | Entity Framework Core | 10.0.9 |
| | Npgsql (PostgreSQL) | 10.0.2 |
| | Mapster | 10.0.10 |
| | QuestPDF | 2026.6.1 |
| | FluentValidation | 12.1.1 |
| | C# | 13 |
| **Base de datos** | PostgreSQL | 16 |
| **Herramientas** | pnpm (Frontend) | 11.9.0 |
| | Vitest (Testing Frontend) | ^4.0.8 |
| | Docker | — |
| | Vercel (Deploy Frontend) | — |

---

## 2. Backend — API .NET 10

> **Repositorio:** `E:\VS 2026\CISApi`  
> **Documento detallado:** `docs/MANUAL_TECNICO_BACKEND.md` (en el repositorio frontend)

### 2.1 Arquitectura y Stack

- **Arquitectura:** 3 capas (API → Business Logic → Data)
- **Base de datos:** PostgreSQL 16 con Npgsql
- **ORM:** Entity Framework Core 10.0.9
- **Mapeo:** Mapster 10.0.10 (reemplazo de AutoMapper)
- **Validación:** FluentValidation 12.1.1
- **Reportes PDF:** QuestPDF 2026.6.1 (community)
- **Correo:** FluentEmail.Smtp / Resend / SendGrid (estrategia intercambiable)
- **Auto-documentación API:** Scalar.AspNetCore 2.16.8

### 2.2 Estructura de Proyectos

La solución contiene 3 proyectos:

```
CISApi.slnx
├── CISApi/           → Web API (controladores, middleware, infraestructura)
├── CISModel/         → Data Layer (entidades, DbContext, repositorio, configuraciones EF, seed data)
└── CISUnitWork/      → Business Logic (BLs, DTOs, servicios, validadores, reportes)
```

### 2.3 Modelo de Datos

37 entidades principales agrupadas en dominios:

**Seguridad e Identity:**
- `ApplicationUser` : IdentityUser con `Name`, `Active`, `AvatarUrl`
- `ApplicationRole` : IdentityRole con `RoleName`, `IsAdmin`
- `RolePermission` : asignación de acciones a roles

**Permisos (jerarquía Module → Entity → Action):**
- `AppModule` → `AppEntity` → `AppAction` → `RolePermission` → `ApplicationRole`

**Geografía (cascada 4 niveles):**
- `Country` → `Region` → `City` → `District`

**Socios Comerciales:**
- `Partner` (con `PartnerType`, `PartnerCategory`, `PartnerRole` M:N vía `PartnerRoles`)

**Operaciones Financieras:**
- `Banco`, `CuentaBanco` (con `TipoCuenta` enum: Ahorro/Corriente)
- `Ingreso`, `Egreso` (con `StatusIO` enum: draft/confirmed/canceled)
- `TipoIngreso`, `TipoEgreso`, `TipoDocumentoFinanciero`
- `CierreMes` (control de períodos contables)

**Activos Fijos:**
- `Asset` (con `Brand`, `AssetCategory`, `AssetStatus`, `AssetLocation`)

**Sistema:**
- `AppSettings`, `AuditLog`, `DomainErrorLog`, `NumberRange`

**Base Auditoría:** Todas las entidades de negocio heredan de `AuditEntity` que implementa `IAuditEntity` con `CreatedBy`, `CreatedAt`, `LastUpdatedBy`, `LastUpdatedAt`, `ConcurrencyStamp`.

### 2.4 DbContext y EF Core

**Archivo:** `CISModel/ApplicationDbContext.cs`

- **Herencia múltiple:** `IdentityDbContext<...>` + `IDataProtectionKeyContext` + `IUnitOfWork`
- **Base:** PostgreSQL via `UseNpgsql()`
- **Configuración automática:** `ApplyConfigurationsFromAssembly()` — escanea las 34 configuraciones Fluent API
- **Auto-auditoría:** `SaveChangesAsync()` override que:
  - Asigna automáticamente `CreatedBy`/`CreatedAt` en inserciones
  - Asigna `LastUpdatedBy`/`LastUpdatedAt` en modificaciones
  - Genera registros `AuditLog` con snapshots JSON de valores antes/después
  - Usa `ConcurrencyStamp` como token de concurrencia optimista (rowversion)

### 2.5 Patrón Repositorio y Unit of Work

**Interface:** `IRepository<TEntity>` en `CISModel/Interfaces/IRepository.cs`

Métodos principales:
- `GetByIdAsync`, `GetAsync`, `ListAsync`, `Query()` (síncrono)
- `AddAsync`, `AddRangeAsync`, `UpdateAsync`, `UpdatePartialAsync`, `Remove`
- `ExistsAsync`, `SaveChangesAsync`

**Características:**
- `Query()` devuelve `IQueryable<T>` síncrono (no async) para composición LINQ
- `UpdatePartialAsync` usa patrón `Entry(entity).Property(p).IsModified = true`
- Actualizaciones parciales configurables via `IUpdatePropertyConfigurator<TEntity>`

### 2.6 Capa de Negocio (BLs)

**CRUD Genérico — `GenericBL<TEntity, TDto>`:**

Métodos: `CreateAsync`, `GetByIdAsync`, `GetListAsync`, `GetPagedAsync`, `UpdateAsync` (full y partial), `DeleteAsync`. Manejo automático de GUIDs, concurrencia optimista y paginación.

**BLs específicos (16 total):**

| BL | Métodos clave |
|---|---|
| `AccountBL` | Login, logout, forgot/reset password, change password |
| `UserBL` | CRUD + paginación con búsqueda |
| `RoleBL` | CRUD + listado |
| `RolePermissionBL` | Obtener/asignar permisos por rol |
| `PermissionMatrixBL` | Matriz de permisos (columns = actions) |
| `IngresoBL` / `EgresoBL` | CRUD + confirm/cancel + print PDF |
| `CierreMesBL` | Apertura, cierre, reapertura de períodos |
| `PartnerBL` | CRUD + búsqueda + manejo de roles M:N |
| `CuentaBancoBL` | CRUD + saldo actual |
| `DashboardBL` | KPIs, series mensuales, desglose por tipo |
| `AssetBL` | CRUD con filtros |
| `AppSettingsBL` | Configuración del sistema |
| `TipoIngresoBL` | CRUD con validación de categorías |
| `ReportBL` | Consultas para reportes detallados, consolidados y libro bancario |

### 2.7 Servicios Transversales

| Servicio | Propósito |
|---|---|
| `CurrentUserService` | Extrae usuario actual del HttpContext (UserId, Name, Email, IP) |
| `DataProtectorService` | Cifrado/descifrado con ASP.NET Data Protection |
| `DomainErrorLogService` | Persiste errores no controlados |
| `EmailSenderService` | Enrutador de emails (delega al provider configurado) |
| `FluentEmailServiceProvider` | SMTP vía FluentEmail |
| `ResendServiceProvider` | API de Resend.com |
| `SendGridServiceProvider` | API de SendGrid |
| `NumberRangeService` | Generación thread-safe de números secuenciales (con SemaphoreSlim por prefijo) |
| `PermissionService` | Verificación de permisos con caché en memoria |
| `TemplateRenderService` | Renderizado de templates Scriban |
| `DataTransferService` | Importación/exportación CSV con CsvHelper |

### 2.8 Controladores y Endpoints

**Controlador Genérico — `GenericController<TEntity, TDto>`:**
Provee CRUD completo con paginación, caching y autorización:

| Método | Ruta | Descripción |
|---|---|---|
| GET | `paged` | Lista paginada con filtros y ordenamiento |
| GET | `list` | Lista completa (catálogo) |
| GET | `{id}` | Obtener por ID |
| POST | (raíz) | Crear |
| PUT | (raíz) | Actualizar |
| DELETE | (raíz) | Eliminación masiva (body: string[]) |

**Controladores que heredan de GenericController (16+):**
`Banco`, `Country`, `Region`, `City`, `District`, `PartnerType`, `PartnerRole`, `PartnerCategory`, `TipoEgreso`, `TipoDocumentoFinanciero`, `NumberRange`, `AssetCategory`, `AssetStatus`, `AssetLocation`, `Brand`, `TipoIngreso`

**Controladores Standalone:**

| Controller | Ruta Base | Endpoints principales |
|---|---|---|
| `AuthController` | `/api/auth` | `token`, `me`, `logout`, `forgotPassword`, `resetPassword` |
| `AccountController` | `/api/account` | Avatar, cambio de contraseña |
| `PartnerController` | `/api/partner` | CRUD + search + partial update |
| `IngresoController` | `/api/ingreso` | CRUD + confirm + cancel + print (multipart) |
| `EgresoController` | `/api/egreso` | CRUD + confirm + cancel + print (multipart) |
| `CuentaBancoController` | `/api/cuentabanco` | CRUD + list |
| `CierreMesController` | `/api/cierremes` | CRUD + apertura/cierre/reapertura + historial |
| `DashboardController` | `/api/dashboard` | KPIs y series financieras |
| `UserController` | `/api/user` | CRUD de usuarios + roles |
| `RoleController` | `/api/role` | CRUD de roles |
| `RolePermissionController` | `/api/rolepermission` | Asignación de permisos |
| `PermissionMatrixController` | `/api/permissionmatrix` | Matriz visual de permisos |
| `AssetController` | `/api/asset` | CRUD + paged |
| `AppSettingsController` | `/api/appsettings` | Configuración del sistema |
| `OperationDetailController` | `/api/operationdetail` | Reporte detallado |
| `OperationConsolitedController` | `/api/operationconsolited` | Reporte consolidado (JSON + PDF) |
| `BankingBookController` | `/api/bankingbook` | Libro bancario (JSON + PDF) |

### 2.9 Seguridad y Autenticación

- **ASP.NET Core Identity** con cookies (`access_token`, HttpOnly, Secure, SameSite=None)
- **Fallback Policy:** Todas las rutas requieren autenticación por defecto
- **Excepciones:** `[AllowAnonymous]` en login, forgot-password, reset-password
- **Claims personalizados:** `ApplicationUserClaimsFactory` agrega `UserData` (JSON con Id, Name, Email, Roles)
- **CSRF:** Middleware personalizado que valida el header `Origin` en métodos inseguros (POST, PUT, DELETE)
- **Rate Limiting:** 10 req/min en login, 3/15min en forgot-password, 5/15min en reset-password

### 2.10 Permisos y Matriz de Acceso

Sistema jerárquico Module → Entity → Action:

- Atributos `[Module]`, `[EntityDisplay]`, `[ActionDisplay]` decoran controladores y acciones
- `RoleAuthorizeAttribute` es un `IAsyncAuthorizationFilter` que verifica permisos vía `IPermissionService`
- `PermissionAutoRegistrationService` (IHostedService) escanea todos los controladores al iniciar la app y auto-registra los permisos en BD
- La UI consume `GET /api/permissionmatrix/{roleId}` para construir la interfaz de asignación

### 2.11 Validación, Caching, Rate Limiting y Errores

**Validación:**
- 24 validadores FluentValidation auto-descubiertos vía `AddValidatorsFromAssemblyContaining<>()`
- `ValidationFilter` global aplica validación a todos los parámetros de acciones

**Output Caching:**
- Política `ApiPolicy`: solo GET, varía por query params, no cachea si hay cookies
- Tags por entidad (`partnerCache`, `bancoCache`, etc.) — invalidación manual en POST/PUT/DELETE

**Manejo de Errores:**
- `GlobalExceptionMiddleware` captura y clasifica:
  - `ValidationException` → 400 (VALIDATION)
  - `DomainException` → 400 (DOMAIN)
  - `DbUpdateException` / Postgres `SqlState` → 400/409 traducidos
  - Errores no controlados → 500 + registro en `DomainErrorLog`

### 2.12 Reportes con QuestPDF

Arquitectura basada en Assembler + Builder + Generator:

- **Assembler:** Convierte entidades en modelos planos (e.g., `BankingBookAssembler`)
- **Builder:** Construye PDF con QuestPDF (e.g., `BankingBookBuilder`)
- **Generator:** `ReportGeneratorService` orquesta el proceso
- **Resolver:** `ReportBuilderResolver` selecciona el builder por nombre de formulario

Reportes disponibles: Comprobante de Ingreso/Egreso, Libro Bancario, Reporte Consolidado.

### 2.13 Configuración y Despliegue

**Variables de Entorno requeridas:**

| Variable | Propósito |
|---|---|
| `DB_CONNECTION_STRING` | Cadena de conexión PostgreSQL |
| `CORS_FRONTEND` | Origen(es) CORS permitidos |
| `ASPNETCORE_ENVIRONMENT` | `Development` o `Production` |
| `PermissionAutoRegister` | `true`/`false` — auto-registro de permisos al iniciar |

**Migraciones EF Core:**
```bash
dotnet ef migrations add Nombre --startup-project ../CISApi
dotnet ef database update --startup-project ../CISApi
```

**Docker:**
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "CISApi.dll"]
```

---

## 3. Frontend — Angular 21

> **Repositorio:** `E:\Angular\21\xdev_cis`  
> **Stack:** Angular 21 Standalone Components + PrimeNG 21 + Tailwind CSS v4

### 3.1 Arquitectura y Stack

- **Framework:** Angular 21 con **componentes standalone** (sin NgModules)
- **UI Library:** PrimeNG 21 con preset Aura (configurable en runtime)
- **Estilos:** Tailwind CSS v4 + `tailwindcss-primeui` (integración con PrimeNG)
- **Iconos:** Lucide Icons (vía `@lucide/angular`)
- **Gráficos:** Chart.js 4.5.1 (vía componente `UIChart` de PrimeNG)
- **Formularios:** Signal-based forms (`@angular/forms/signals`)
- **Estado:** Signals nativos de Angular (sin librerías externas de estado)
- **Testing:** Vitest 4 + jsdom 28
- **Package manager:** pnpm 11.9
- **Build:** `@angular/build:application` (basado en Vite)

### 3.2 Estructura del Proyecto

```
src/
├── index.html                      # Entry HTML (lang="es", Inter font)
├── main.ts                         # bootstrapApplication(App, appConfig)
├── styles.css                      # Tailwind v4 @import + custom theme
│
├── environments/
│   ├── environment.ts              # Producción (sobrescrito por set-env.ts)
│   └── environment.development.ts  # Desarrollo (ng serve)
│
└── app/
    ├── app.ts / app.html           # Componente raíz (auth check, overlay, toasts)
    ├── app.config.ts               # Providers globales (router, http, PrimeNG, icons)
    ├── app.routes.ts               # Rutas raíz (login, forgot-password, resetPassword, /app)
    │
    ├── core/                       # Servicios, guards, interceptors (singletons)
    │   ├── services/               # (10 servicios: auth, api, endpoint, theme, etc.)
    │   ├── guards/auth.guard.ts    # CanActivate funcional
    │   ├── interceptors/auth.interceptor.ts  # HttpInterceptorFn
    │   ├── functions/              # Utilidades (Form2FormData, global functions)
    │   └── model/                  # Interfaces compartidas (ApiResponse, Pagination, etc.)
    │
    ├── layouts/
    │   ├── external-layout/        # Layout público (login, forgot/reset password)
    │   └── private-layout/         # Layout autenticado (sidebar + topbar)
    │       └── private.routes.ts   # Rutas hijas de /app
    │
    ├── pages/
    │   ├── external/               # Login, ForgotPassword, ResetPassword
    │   └── private/                # Dashboard, Profile, Notacces
    │
    ├── features/                   # Módulos funcionales (lazy-loaded)
    │   ├── configuration/          # Banco, TipoIngreso, TipoEgreso, CuentaBanco, etc.
    │   ├── partner/                # Partner, PartnerCategory, PartnerType, PartnerRole
    │   ├── operation/              # Ingreso, Egreso, Periodo (con create/edit)
    │   ├── administration/         # User, Role, RolePermission, AppSettings
    │   ├── inventory/              # Asset
    │   ├── reports/                # Consolidated, Details, BankingBook
    │   └── account/                # ChangePassword (dialog)
    │
    └── shared/
        ├── components/             # Icon, PageLayout, LoadingBlock, SideNavbar,
        │                           # TopNavbar, UserMenu, ThemeSwitcher, TableView, etc.
        └── custom/                 # Form controls: InputNg, SelectNg, DatePickerNg,
                                    # FilePickerNg, SearchAutocomplete, StatusBarNg, etc.
```

### 3.3 Routing y Navegación

**Rutas raíz** (`app.routes.ts`):

| Ruta | Layout | Componente | Guard |
|---|---|---|---|
| `/` | — | Redirect → `/app` | — |
| `/login` | ExternalLayout | LoginPage | — |
| `/forgot-password` | ExternalLayout | ForgotPassword | — |
| `/resetPassword` | ExternalLayout | ResetPassword | — |
| `/app` | PrivateLayout | Hijas (PRIVATE_ROUTES) | `authGuard` |
| `/**` | — | Redirect → `/app` | — |

**Rutas hijas de /app** (`private.routes.ts`):

| Ruta | Componente |
|---|---|
| `/app/dashboard` | DashboardPage |
| `/app/config/bancos` | Bank |
| `/app/config/tipo-ingreso` | TipoIngreso |
| `/app/config/tipo-egreso` | TipoEgreso |
| `/app/config/tipo-doc` | TipoDocumento |
| `/app/config/cuentas-banco` | BankAccount |
| `/app/config/asset-category` | AssetCategory |
| `/app/config/asset-location` | AssetLocation |
| `/app/config/asset-status` | AssetStatus |
| `/app/config/brand` | Brand |
| `/app/partner/category` | PartnerCategory |
| `/app/partner/type` | PartnerType |
| `/app/partner/role` | PartnerRole |
| `/app/partner` | Partner |
| `/app/operation/periodo` | Periodo |
| `/app/operation/ingreso` | Ingreso (lista) |
| `/app/operation/ingreso/create` | IngresoEdit (crear) |
| `/app/operation/ingreso/edit/:inid` | IngresoEdit (editar) |
| `/app/operation/egreso` | Egreso (lista) |
| `/app/operation/egreso/create` | EgresoEdit (crear) |
| `/app/operation/egreso/edit/:egid` | EgresoEdit (editar) |
| `/app/admin/user` | User |
| `/app/admin/role` | Role |
| `/app/admin/role-permission` | RolePermission |
| `/app/admin/app-settings` | AppSettings |
| `/app/inventory/asset` | Asset |
| `/app/report/consolidated-operation` | ConsolidatedReport |
| `/app/report/detail-operation` | DetailsReport |
| `/app/report/bankingbook` | BankingbookReport |
| `/app/notaccess` | Notacces |

**Características del Router:**
- `withViewTransitions()` — transiciones animadas entre rutas
- `withComponentInputBinding()` — bind de parámetros de ruta como inputs (usado en ResetPassword para recibir `email` y `code`)
- **Todas las rutas lazy-loaded** vía `loadComponent` / `loadChildren`

### 3.4 Componentes y Páginas

#### Componente Raíz (`App`)

Selector `app-root`, maneja:
1. Inicialización del tema (`ThemeService.initialize()`)
2. Verificación de autenticación (`AuthService.checkAuth()`)
3. Pantalla de carga con spinner mientras verifica conexión
4. Pantalla de error offline con botón de reintento
5. 7 toasts globales (una por posición)
6. Confirm dialog global con template headless personalizado

#### Layouts

**ExternalLayout:**
- Fondo con gradiente `bg-gradient-mesh` (azul tenue en modo claro, azul marino radial en modo oscuro)
- `<router-outlet>` centrado
- Footer con copyright
- Usado por: login, forgot-password, reset-password

**PrivateLayout:**
- Sidebar fijo en desktop (≥1024px), drawer en mobile/tablet
- TopNavbar con hamburger menu, branding, theme switcher, user menu
- Sidebar y TopNavbar cargados dinámicamente vía `ViewContainerRef` + `import()`
- Drawer de PrimeNG para navegación mobile
- Cierra el drawer al navegar (suscripción a `NavigationEnd`)

#### Páginas Públicas:

**LoginPage (`pages/external/login/`):**
- Formulario con signal-based forms
- Campos: email + password
- Botón de submit con loading state
- Links: "¿Olvidaste tu contraseña?"

**ForgotPassword (`pages/external/forgot-password/`):**
- Campo de email
- Llama a `auth/forgotPassword`

**ResetPassword (`pages/external/reset-password/`):**
- Recibe `email` y `code` como inputs de ruta
- Campos: nueva contraseña + confirmación
- Validación cruzada (contraseñas deben coincidir)

#### Páginas Privadas:

**DashboardPage (`pages/private/dashboard/`):**
- Default export (por el `loadComponent` que usa `.then(m => m.default)`)
- KPIs financieros (ingresos YTD, egresos YTD, balance, etc.)
- Gráfico de barras (ingresos/egresos mensuales) vía Chart.js
- Gráficos donut (desglose por tipo)
- Meter groups para estados de ingresos/egresos

**Profile, Notacces:** Páginas placeholder.

#### Shared Components:

| Componente | Descripción |
|---|---|
| **Icon** | Renderiza SVG dinámicamente desde Lucide icons registry |
| **PageLayout** | Header reutilizable con icono, título, subtítulo y slot de acciones |
| **LoadingBlock** | Modal con spinner y mensaje configurable |
| **SideNavbar** | Navegación lateral con 7 grupos: INICIO, OPERACIONES, INVENTARIO, INFORMES, CATÁLOGOS, SOCIOS COMERCIALES, ADMINISTRACIÓN |
| **TopNavbar** | Barra superior: hamburger menu, branding, theme switcher, user menu |
| **ThemeSwitcher** | Popover (desktop) o drawer (mobile) para personalizar tema |
| **ThemePanel** | Selector de preset (Aura/Material/Lara/Nora), color primario, superficie y dark mode |
| **UserMenu** | Dropdown del usuario: perfil, cambiar contraseña (dialog dinámico), cerrar sesión |
| **TableView\<T\>** | Tabla genérica con lazy loading, sorting, filtering, paginación, toolbar CRUD |
| **TableColumn** | Definición de columna (field, header, width, sort, filter, type, templates) |
| **TableToolbar** | Toolbar: crear, refrescar, importar, exportar |
| **TableFilterText** | Filtro de texto para columnas |

#### Custom Form Controls (`shared/custom/`):

| Componente | Implementa | Características |
|---|---|---|
| **InputNg** | `FormValueControl<string>` | Label, validación, mask |
| **InputNumberNg** | `FormValueControl<number>` | Fraction digits, min/max, grouping |
| **SelectNg** | `FormValueControl<string>` | optionLabel/optionValue |
| **DatePickerNg** | `FormValueControl<Date\|null>` | Date/time picker |
| **TextAreaNg** | `FormValueControl<string>` | Auto-resize, uppercase |
| **CheckNg** | `FormCheckboxControl` | Checkbox binario |
| **ToggleButtonNg** | `FormCheckboxControl` | Toggle button |
| **SearchAutocomplete** | `FormValueControl<string>` | Búsqueda remota, resolución por ID |
| **FilePickerNg** | `model<File \| null>` | Drag & drop, preview, 1MB max |
| **BackButton** | — | Navegación atrás |
| **StatusBarNg** | — | Barra de estado (draft/confirmed/canceled) |

### 3.5 Servicios

#### ApiService (`core/services/api.service.ts`)
Servicio HTTP genérico inyectable en root.

| Método | Descripción |
|---|---|
| `get<T>(url, params?)` | GET request |
| `post<T>(url, body)` | POST request |
| `put<T>(url, body)` | PUT request |
| `patch<T>(url, body)` | PATCH request |
| `delete<T>(url, body?)` | DELETE con body opcional |
| `getFile(url)` | Descarga archivo como blob + nombre desde Content-Disposition |
| `downloadFile(url)` | Descarga y dispara download en navegador |

**Características:**
- Base URL desde `environment.apiUrl`
- `withCredentials: true` en todas las requests (cookies)
- Header `x-api-key` opcional

#### ApiPagedService (`core/services/api.paged.service.ts`)
Servicio para datos paginados. **No es singleton** — se provee por componente.

| State | Tipo | Descripción |
|---|---|---|
| `data` | `Signal<any>` | Datos de la respuesta |
| `loading` | `Signal<boolean>` | Indicador de carga |
| `totalRecords` | `Signal<number>` | Total de registros (header `Total-Count`) |
| `totalPages` | `Signal<number>` | Total de páginas (header `Total-Pages`) |

| Método | Descripción |
|---|---|
| `fetchData<T>(endpoint, query?)` | GET con parámetros de paginación, parsea headers de paginación |

#### AuthService (`core/services/auth.service.ts`)
Servicio singleton de autenticación.

| State | Tipo | Descripción |
|---|---|---|
| `user` | `Signal<User \| null>` | Usuario autenticado |
| `authStatus` | `Signal<AuthStatus>` | `'loading' \| 'authenticated' \| 'unauthenticated'` |

| Método | Descripción |
|---|---|
| `checkAuth()` | GET `auth/me` — verifica sesión activa |
| `login(email, password)` | POST `auth/token` |
| `logout()` | POST `auth/logout` + limpia estado + redirect a `/login` |
| `isAuthenticated()` | `authStatus() === 'authenticated'` |
| `isOfflineError(err)` | Detecta error de conexión (status 0) |

**Interfaz User:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  emailConfirmed: boolean;
  roles: string[];
}
```

#### EndpointService (`core/services/endpoint.service.ts`)
Construye URLs completas y exporta constantes de endpoints (50+).

Constantes: `urlAccount`, `urlBank`, `urlTpoIngreso`, `urlTpoEgreso`, `urlCuentaBanco`, `urlPartner`, `urlCountry`, `urlIngreso`, `urlEgreso`, `urlUser`, `urlRole`, `urlAsset`, etc.

#### CountryService (`core/services/country.service.ts`)
Cascada geográfica: país → región → ciudad → distrito.

| State | Métodos clave |
|---|---|
| `countryList`, `regionList`, `cityList`, `districtList` | `onCountryChange(id)`, `onRegionChange(id)` |
| `selectedCountryId`, `selectedRegionId` | `onCityChange(id)`, `onCityChange(id)` |
| `selectedCityId`, `selectedDistrictId` | `initForEdit(id, id?, id?, id?)` |

#### TableService\<T\> (`core/services/table.service.ts`)
Servicio de tabla genérica con lazy loading. Se provee a nivel de `TableView`.

| State | Métodos clave |
|---|---|
| `data`, `loading`, `totalRecords`, `totalPages` | `init(cfg)`, `loadData()` |
| `first`, `pageLinkSize`, `preSortOrder`, `pageSize` | `onPageChange(event)`, `lazyLoad(event)` |

#### NotificationService (`core/services/notification.service.ts`)
Wrapper sobre `MessageService` de PrimeNG.

| Método | Descripción |
|---|---|
| `showSuccess(summary, msg, position?)` | Toast de éxito |
| `showError(summary, msg, position?)` | Toast de error |
| `showInfo(summary, msg, position?)` | Toast informativo |
| `showWarn(summary, msg, position?)` | Toast de advertencia |

Soporta 7 posiciones: `top-right` (default), `top-left`, `top-center`, `bottom-right`, `bottom-left`, `bottom-center`, `center`.

#### DeviceService (`core/services/device.service.ts`)
Detección de breakpoints responsive vía `window.matchMedia`.

| Señal | Breakpoint | Descripción |
|---|---|---|
| `isSm` | ≥640px | Small |
| `isMd` | ≥768px | Medium |
| `isLg` | ≥1024px | Large |
| `isMobile` | <640px | Computado |
| `isTablet` | 640-1023px | Computado |
| `isHandsetOrTablet` | <1024px | Computado |

#### ThemeService (`core/services/theme.service.ts`)
Sistema completo de personalización de tema PrimeNG.

| State | Descripción |
|---|---|
| `themeState` | `{ preset, primary, surface, darkTheme }` |

| Método | Descripción |
|---|---|
| `initialize()` | Carga estado guardado, aplica dark mode |
| `toggleDarkMode()` | Dark mode con View Transition API |
| `selectPreset(key)` | Cambia preset (Aura/Material/Lara/Nora) |
| `selectPrimary(color)` | Cambia color primario (18 colores + "noir" + "yuro") |
| `selectSurface(surface)` | Cambia paleta de superficie (8 opciones) |

**Persistencia:** `localStorage` key `cis-theme-state`

#### IconRegistryService (`core/services/icon.registry.service.ts`)
Registro de iconos Lucide. 55+ iconos registrados en `icon.registry.ts`.

### 3.6 Autenticación y Seguridad

**Flujo completo:**

1. **App boot**: `AuthService.checkAuth()` → GET `auth/me`
   - Si el path es `/resetPassword`, se omite la verificación
   - Si hay error de conexión (status 0): muestra overlay de error offline con botón "Reintentar"
   - Si no hay sesión: redirige a `/login`
2. **Login**: POST `auth/token` con email + password
   - Éxito: `user` signal actualizado, `authStatus` → `'authenticated'`, navega a `/app`
   - Error: muestra "Inicio de Sesión Incorrecto"
3. **AuthGuard** (funcional, aplicado a `/app`):
   - `isAuthenticated()` → permite acceso
   - `authStatus === 'unauthenticated'` → redirect a `/login`
   - `authStatus === 'loading'` → permite (espera a que checkAuth resuelva)
4. **Interceptor** (`authInterceptor`):
   - 401: limpia sesión, redirige a `/login`
   - Otros errores: muestra toast con mensaje en español
   - Extracción de errores: soporta formato `{ details }`, arrays, y strings planos
5. **Logout**: POST `auth/logout` → limpia signals → navega a `/login`

**Almacenamiento de sesión:** El backend usa **cookies** (HttpOnly, Secure). El frontend no almacena tokens JWT en localStorage. El objeto `user` solo existe en memoria (signal).

### 3.7 Estados Reactivos con Signals

El proyecto usa **Angular Signals** como única estrategia de estado reactivo (sin NgRx, Akita, etc.).

**Patrones usados:**

| Patrón | Ejemplos |
|---|---|
| **`signal<T>()`** | Estado simple: `user`, `authStatus`, `loading`, `error` |
| **`computed()`** | Estado derivado: `isMobile`, `isAuthenticated`, `hasFilters`, `kpiCards` |
| **`effect()`** | Side effects: guardar tema en localStorage, cerrar drawer al navegar, recargar datos al cambiar refresh |
| **`model()`** | Two-way binding en componentes: `InputNg.value`, `LoadingBlock.visible`, `TableView.refresh` |
| **`input()`** | Inputs de componente: `ResetPassword.email`, `ResetPassword.code` |
| **`output()`** | Outputs de componente |
| **`afterNextRender()`** | Efectos post-render: aplicar preset de tema |
| **`viewChild()`** | Acceso a ViewContainerRef: carga dinámica de SideNavbar/TopNavbar |

**Estado global gestionado con signals:**
- `AuthService`: `user`, `authStatus`
- `ThemeService`: `themeState`
- `DeviceService`: `isSm`, `isMd`, `isLg` (desde matchMedia)
- `CountryService`: `countryList`, `regionList`, `cityList`, `districtList`

**Estado por componente:**
- `TableView`: `ApiPagedService.data`, `ApiPagedService.loading`
- `DashboardService`: `data`, `loading`, `meterIncomes`, `meterExpenses`

### 3.8 Formularios y Controles Personalizados

**Signal-based Forms** de `@angular/forms/signals`:

```typescript
// Ejemplo de LoginPage
readonly form = form({
  email: formControl('', [validators.required(), validators.email()]),
  password: formControl('', [validators.required()]),
});

async login() {
  const { email, password } = this.form.value;
  // ...
}
```

**Controles personalizados** implementan interfaces de `@angular/forms/signals`:
- `FormValueControl<T>` — para valores escalares (InputNg, SelectNg, DatePickerNg)
- `FormCheckboxControl` — para booleanos (CheckNg, ToggleButtonNg)

### 3.9 Sistema de Temas (Theming)

Sistema completo de personalización en runtime usando `@primeuix/themes`:

**Presets disponibles:** Aura (default), Material, Lara, Nora

**Colores primarios:** 18 colores + "noir" (monocromático) + "yuro" (paleta azul personalizada)

**Superficies (8):** slate, gray, zinc, neutral, stone, soho, viva, ocean

**Dark mode:** Selector `.dark-theme` en `<html>`, toggle con View Transition API

**Persistencia:** Estado completo guardado en `localStorage` (`cis-theme-state`)

### 3.10 Estilos y Tailwind CSS v4

**Configuración** (`src/styles.css`):
```css
@import 'tailwindcss';
@import 'tailwindcss-primeui';
@import "primeicons/primeicons.css";

@custom-variant dark (&:where(.dark-theme, .dark-theme *));

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --breakpoint-xs: 31.25rem;    /* 500px */
  --breakpoint-md2: 57.5rem;    /* 920px */
}

:root {
  --app-font-size: 14px;
}
```

**Características:**
- Tailwind v4 con sintaxis `@import` (sin `tailwind.config.js`)
- Dark mode via `@custom-variant dark` con selector `.dark-theme`
- Integración PrimeNG + Tailwind via `tailwindcss-primeui`
- Fuente Inter (Google Fonts + `@fontsource/inter` npm)
- Breakpoints personalizados: `xs` (500px), `md2` (920px)
- CSS Layers: `theme, base, primeng`

### 3.11 Entornos y Build

**Entornos:**

| Archivo | Propósito | `apiUrl` |
|---|---|---|
| `src/environments/environment.ts` | Producción (sobrescrito en build) | `PLACEHOLDER_API_URL` |
| `src/environments/environment.development.ts` | Desarrollo (`ng serve`) | `https://localhost:7096/api` |

**Build Script** (`set-env.ts`):
```typescript
// Lee API_URL y API_KEY de variables de entorno
// Escribe environment.ts en tiempo de build
const envConfigFile = `
export const environment = {
  production: true,
  apiUrl: '${process.env['API_URL'] || 'PLACEHOLDER_API_URL'}',
  apiKey: '${process.env['API_KEY'] || ''}',
};
`;
```

**Comandos:**

| Script | Comando | Descripción |
|---|---|---|
| `npm start` | `ng serve` | Dev server (usa environment.development.ts) |
| `npm run build` | `tsx set-env.ts && ng build --configuration production` | Build producción |
| `npm run test` | `ng test` | Ejecuta tests con Vitest |
| `npm run vercel-build` | Mismo que build | Para Vercel |

**angular.json:**
- Builder: `@angular/build:application` (Vite-based)
- Budgets: Initial (1.5MB warn / 2MB error), Component Style (4kB warn / 8kB error)
- File replacement: `environment.ts` → `environment.development.ts` en desarrollo

### 3.12 Testing

- **Runner:** Vitest v4.0.8
- **DOM:** jsdom v28.0.0
- **Configuración:** Via Angular CLI (`@angular/build:unit-test`)
- **Comando:** `ng test`
- **Tests existentes:** Solo `app.spec.ts` (prueba básica de creación del componente raíz)

---

## 4. Comunicación Frontend-Backend

### Protocolo
- **HTTP/HTTPS** con métodos REST estándar (GET, POST, PUT, DELETE)
- **Autenticación:** Cookies HttpOnly (enviadas automáticamente con `withCredentials: true`)
- **Header opcional:** `x-api-key` (configurado via environment)

### Formato de Datos
- **Request/Response:** JSON (`application/json`) para datos estructurados
- **File upload:** `multipart/form-data` (ingresos/egresos con adjuntos)
- **File download:** `application/octet-stream` (PDFs, archivos adjuntos)
- **Paginación:** Headers de respuesta: `Total-Count`, `Total-Pages`, `Page`, `Page-Size`

### Flujo de Datos Típico (ej: Lista de Ingresos)

```
1. Angular TableView
   → TableService.loadData()
     → ApiPagedService.fetchData('ingreso/paged', { page: 1, pageSize: 10 })
       → ApiService.get('ingreso/paged', params)
         → HttpClient.get('https://localhost:7096/api/ingreso/paged?page=1&pageSize=10',
             { withCredentials: true })

2. Backend AuthController?
   NO → Cookie de sesión se envía automáticamente
   → AuthMiddleware valida cookie y establece HttpContext.User

3. IngresoController.GetPaged()
   → RoleAuthorizeAttribute (verifica permiso "Ingresos.list")
     → IPermissionService.HasPermissionAsync(userId, "Ingresos", "list")
   → IGenericBL<Ingreso, IngresoDTO>.GetPagedAsync(pagination)
     → IRepository<Ingreso>.Query().ApplyFilters().ApplyOrderBy()
       → EF Core → PostgreSQL
   → Mapster: Ingreso → IngresoDTO
   → Response: 200 OK + JSON body + pagination headers

4. Angular recibe respuesta
   → ApiPagedService actualiza: data.set(response.body), totalRecords.set(header)
   → TableService.data (signal) se actualiza → TableView re-renderiza
```

---

## 5. Flujo de Desarrollo

### Requisitos

| Herramienta | Versión Mínima |
|---|---|
| Node.js | 22.x |
| pnpm | 11.9 |
| .NET SDK | 10.0 |
| PostgreSQL | 16 |
| Docker (opcional) | Latest |

### Setup Local

**Backend:**
```bash
# 1. Configurar User Secrets
cd E:\VS 2026\CISApi\CISApi
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Port=5432;Database=CISDB;Username=postgres;Password=..."
dotnet user-secrets set "CORS_FRONTEND" "https://localhost:4200"

# 2. Aplicar migraciones
cd E:\VS 2026\CISApi\CISModel
dotnet ef database update --startup-project ../CISApi

# 3. Ejecutar API
cd E:\VS 2026\CISApi\CISApi
dotnet run
# API disponible en: https://localhost:7096
```

**Frontend:**
```bash
# 1. Instalar dependencias
cd E:\Angular\21\xdev_cis
pnpm install

# 2. Ejecutar dev server
npm start
# App disponible en: https://localhost:4200
```

**Seed Data:**
El seed se ejecuta automáticamente al aplicar migraciones. Usuario por defecto:
- **Email:** `admin@avalink.com`
- **Rol:** Administrador de Sistema

### Convenciones de Código

| Aspecto | Frontend (Angular) | Backend (C#) |
|---|---|---|
| **Lenguaje** | TypeScript strict mode | C# 13, nullable enabled |
| **Indentación** | 2 espacios | 4 espacios |
| **Comillas** | Simples (TS), dobles (HTML) | Dobles |
| **Nombres** | camelCase (vars), PascalCase (classes) | PascalCase |
| **Formateo** | Prettier (printWidth 100) | dotnet format |
| **Testing** | Vitest + jsdom | — (no hay tests aún) |

---

## 6. Despliegue

### Frontend (Vercel)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno:
   - `API_URL` → URL del backend (ej: `https://cis-api.vercel.app/api`)
   - `API_KEY` → (opcional)
3. Build command: `npm run vercel-build`
4. Output directory: `dist/xdev_cis/browser`
5. SPA rewrites automáticas via `vercel.json`

### Backend (Docker)

```bash
# Build
docker build -t cis-api .

# Run
docker run -p 8080:8080 \
  -e DB_CONNECTION_STRING="Host=..." \
  -e CORS_FRONTEND="https://cis-app.vercel.app" \
  -e ASPNETCORE_ENVIRONMENT=Production \
  cis-api
```

### Variables de Entorno Requeridas

| Variable | Dónde se usa | Propósito |
|---|---|---|
| `API_URL` | Frontend (set-env.ts) | URL base del backend |
| `API_KEY` | Frontend (set-env.ts) | API key opcional |
| `DB_CONNECTION_STRING` | Backend | Cadena de conexión PostgreSQL |
| `CORS_FRONTEND` | Backend | Origen CORS permitido |
| `PermissionAutoRegister` | Backend | Auto-registro de permisos |

---

## 7. Apéndices

### A. Mapa Completo de Endpoints

```
MÓDULO              CONTROLADOR                     RUTA BASE
──────────────────────────────────────────────────────────────
Auth                AuthController                  /api/auth
Account             AccountController               /api/account
Dashboard           DashboardController             /api/dashboard
Configuración       BancoController                 /api/banco
                    CuentaBancoController           /api/cuentabanco
                    TipoIngresoController           /api/tipoingreso
                    TipoEgresoController            /api/tipoegreso
                    TipoDocumentoFinancieroCont     /api/tipodocfin
                    CountryController               /api/country
                    RegionController                /api/region
                    CityController                  /api/city
                    DistrictController              /api/district
                    NumberRangeController           /api/numberrange
                    AppSettingsController           /api/appsettings
Socios Comerciales  PartnerController               /api/partner
                    PartnerTypeController           /api/partnertype
                    PartnerRoleController           /api/partnerrole
                    PartnerCategoryController       /api/partnercategory
Operaciones         IngresoController               /api/ingreso
                    EgresoController                /api/egreso
                    CierreMesController             /api/cierremes
Activos Fijos       AssetController                 /api/asset
                    AssetCategoryController         /api/assetcategory
                    AssetLocationController         /api/assetlocation
                    AssetStatusController           /api/assetstatus
                    BrandController                 /api/brand
Seguridad           UserController                  /api/user
                    RoleController                  /api/role
                    RolePermissionController        /api/rolepermission
                    PermissionMatrixController      /api/permissionmatrix
Reportes            BankingBookController           /api/bankingbook
                    OperationConsolitedController   /api/operationconsolited
                    OperationDetailController       /api/operationdetail
```

### B. Dependencias Frontend

| Paquete | Versión | Propósito |
|---|---|---|
| `@angular/core` | ^21.2.0 | Framework Angular |
| `@angular/router` | ^21.2.0 | Routing con lazy loading |
| `@angular/forms` | ^21.2.0 | Signal-based forms |
| `primeng` | ^21.1.9 | UI Components |
| `primeicons` | ^7.0.0 | Icon set PrimeNG |
| `@primeuix/themes` | ^2.0.3 | Temas PrimeNG |
| `tailwindcss` | ^4.1.12 | CSS utility framework |
| `@tailwindcss/postcss` | ^4.1.12 | PostCSS plugin |
| `tailwindcss-primeui` | ^0.6.1 | Integración PrimeNG+Tailwind |
| `chart.js` | ^4.5.1 | Gráficos |
| `@lucide/angular` | ^1.21.0 | Iconos Lucide |
| `@fontsource/inter` | ^5.2.8 | Fuente Inter |
| `zod` | ^4.4.3 | Validación (declarado, no usado aún) |
| `rxjs` | ~7.8.0 | Reactive extensions |

### C. Dependencias Backend

| Proyecto | Paquete | Versión |
|---|---|---|
| **CISApi** | `Scalar.AspNetCore` | 2.16.8 |
| | `Mapster` + DI | 10.0.10 |
| | `FluentEmail.Core` + Smtp | 3.0.2 |
| **CISModel** | `Npgsql.EntityFrameworkCore.PostgreSQL` | 10.0.2 |
| | `Microsoft.AspNetCore.Identity.EntityFrameworkCore` | 10.0.9 |
| | `Microsoft.EntityFrameworkCore.Design` | 10.0.9 |
| **CISUnitWork** | `FluentValidation.DependencyInjectionExtensions` | 12.1.1 |
| | `QuestPDF` | 2026.6.1 |
| | `CsvHelper` | 33.1.0 |
| | `Scriban` | 7.2.5 |
| | `SendGrid` | 9.29.3 |
| | `Resend` | 0.5.1 |
| | `Newtonsoft.Json` | 13.0.4 |
| | `SkiaSharp` (+ Linux) | 4.148.0 |

### D. Flujo de Confirmación de Ingreso/Egreso

```
POST /api/ingreso/{id}/confirm
  1. IngresoBL.ConfirmAsync(id)
  2. Valida que no esté ya confirmado ni cancelado
  3. Valida que el período (CierreMes) esté abierto
  4. Set Status = confirmed, incrementa ConcurrencyStamp
  5. SaveChangesAsync (concurrencia optimista)
  6. Invalida caché (tag: "ingresoCache")
  7. Actualiza CierreMes.TotalIngresos
  8. Retorna IngresoDTO confirmado
```

### E. Flujo de Cierre de Mes

```
POST /api/cierremes/cierre
  1. CierreMesBL.CierreAsync(cuentaBancoId, mes, anio, observacion)
  2. Obtiene CierreMes (o crea si no existe)
  3. Valida que no esté cerrado
  4. Calcula:
     - SaldoInicial = saldoFinal del mes anterior o saldo apertura
     - TotalIngresos = SUM de ingresos confirmados
     - TotalEgresos = SUM de egresos confirmados
     - SaldoFinal = SaldoInicial + TotalIngresos - TotalEgresos
  5. Set Cerrado = true, FechaCierre = now
  6. SaveChangesAsync
  7. Si mes siguiente existe y está cerrado → recálculo en cascada
```

---

*Documento generado con base en el código fuente del Sistema CIS V3.*  
*Backend: `E:\VS 2026\CISApi` · Frontend: `E:\Angular\21\xdev_cis`*
