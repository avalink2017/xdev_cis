# Manual Técnico — CIS API Backend

> **Sistema:** Control de Ingresos y Salidas (CIS) V3  
> **Stack:** .NET 10 — ASP.NET Core Web API + PostgreSQL 16  
> **Repositorio:** `E:\VS 2026\CISApi`

---

## Índice

1. [Arquitectura General](#1-arquitectura-general)
2. [Estructura del Proyecto](#2-estructura-del-proyecto)
3. [Modelo de Datos](#3-modelo-de-datos)
4. [DbContext y Configuración EF Core](#4-dbcontext-y-configuración-ef-core)
5. [Patrón Repositorio](#5-patrón-repositorio)
6. [Capa de Negocio (BLs)](#6-capa-de-negocio-bls)
7. [Servicios Transversales](#7-servicios-transversales)
8. [Controladores y Endpoints](#8-controladores-y-endpoints)
9. [Seguridad y Autenticación](#9-seguridad-y-autenticación)
10. [Permisos y Matriz de Acceso](#10-permisos-y-matriz-de-acceso)
11. [Validación con FluentValidation](#11-validación-con-fluentvalidation)
12. [Reportes con QuestPDF](#12-reportes-con-questpdf)
13. [Envío de Correos](#13-envío-de-correos)
14. [Rate Limiting y Caching](#14-rate-limiting-y-caching)
15. [Manejo de Errores](#15-manejo-de-errores)
16. [Seed Data](#16-seed-data)
17. [Configuración y Despliegue](#17-configuración-y-despliegue)
18. [Docker](#18-docker)

---

## 1. Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    CISApi (Web API)                      │
│  ┌─────────────┐ ┌──────────┐ ┌──────────────────────┐  │
│  │ Controllers  │ │Middleware│ │ Infrastructure       │  │
│  │ (34)         │ │          │ │ Permissions, Caching  │  │
│  └──────┬───────┘ └──────────┘ └──────────────────────┘  │
└─────────┼─────────────────────────────────────────────────┘
          │ depende
┌─────────▼─────────────────────────────────────────────────┐
│                CISUnitWork (Business Logic)                │
│  ┌──────────┐ ┌────────┐ ┌─────────┐ ┌────────────────┐  │
│  │ BLs (16) │ │ DTOs   │ │Services │ │ ReportBuilders  │  │
│  │          │ │ (~40)  │ │ (11)    │ │ (4)             │  │
│  └────┬─────┘ └────────┘ └────┬────┘ └────────────────┘  │
│       │                       │                          │
│  ┌────▼───────────────────────▼────┐                     │
│  │        Validators (24)          │                     │
│  └─────────────────────────────────┘                     │
└─────────────────────────┬─────────────────────────────────┘
                          │ depende
┌─────────────────────────▼─────────────────────────────────┐
│                   CISModel (Data Layer)                    │
│  ┌──────────┐ ┌──────────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Entities  │ │ EF Configs   │ │Repositorio│ │ Seed Data│ │
│  │ (37)      │ │ (34)         │ │ (1+iface) │ │ (10)     │ │
│  └──────────┘ └──────────────┘ └──────────┘ └──────────┘ │
│                    ┌──────────────┐                       │
│                    │ ApplicationDb │                       │
│                    │   Context     │                       │
│                    └──────────────┘                       │
└───────────────────────────────────────────────────────────┘
```

### Principios arquitectónicos

- **Clean Architecture** en 3 capas: API → Business Logic → Data
- **Inyección de dependencias** nativa de .NET
- **Patrón repositorio genérico** con `IQueryable<T>` síncrono
- **DTOs como contratos** — las entidades de dominio nunca se exponen en la API
- **Mapeo con Mapster** (TypeAdapterConfig) — toda la conversión entidad↔DTO
- **CQRS tácito** — consultas vs comandos separados en métodos distintos, no en buses

---

## 2. Estructura del Proyecto

```
CISApi.slnx
├── CISApi/                           # Web API (presentación)
│   ├── Controllers/
│   │   ├── GenericController.cs      # CRUD genérico con caching
│   │   ├── AuthController.cs
│   │   ├── AccountController.cs
│   │   ├── BancoController.cs
│   │   ├── CountryController.cs / RegionController.cs / CityController.cs / DistrictController.cs
│   │   ├── PartnerTypeController.cs / PartnerRoleController.cs / PartnerCategoryController.cs
│   │   ├── PartnerController.cs
│   │   ├── TipoIngresoController.cs / TipoEgresoController.cs / TipoDocumentoFinancieroController.cs
│   │   ├── CuentaBancoController.cs
│   │   ├── IngresoController.cs / EgresoController.cs
│   │   ├── CierreMesController.cs
│   │   ├── DashboardController.cs
│   │   ├── AssetController.cs / AssetCategoryController.cs / AssetLocationController.cs
│   │   ├── AssetStatusController.cs / BrandController.cs
│   │   ├── UserController.cs / RoleController.cs
│   │   ├── RolePermissionController.cs / PermissionMatrixController.cs
│   │   ├── NumberRangeController.cs
│   │   ├── AppSettingsController.cs
│   │   ├── BankingBookController.cs
│   │   ├── OperationConsolitedController.cs
│   │   └── OperationDetailController.cs
│   ├── Infrastructure/
│   │   ├── Permissions/
│   │   │   ├── ModuleAttribute.cs
│   │   │   ├── EntityDisplayAttribute.cs
│   │   │   ├── ActionDisplayAttribute.cs
│   │   │   ├── RoleAuthorizeAttribute.cs
│   │   │   └── PermissionAutoRegistrationService.cs
│   │   ├── ApplicationUserClaimsFactory.cs
│   │   ├── CustomPolicyCache.cs
│   │   ├── EmailExtractionMiddlewareExtensions.cs
│   │   ├── FileService.cs
│   │   └── ManageImageService.cs
│   ├── Program.cs                   # Entry point
│   ├── appsettings.json
│   └── appsettings.Development.json
│
├── CISUnitWork/                     # Business Logic
│   ├── Business/
│   │   ├── GenericBL.cs             # CRUD Genérico
│   │   ├── AccountBL.cs
│   │   ├── UserBL.cs
│   │   ├── RoleBL.cs
│   │   ├── RolePermissionBL.cs
│   │   ├── PermissionMatrixBL.cs
│   │   ├── DashboardBL.cs
│   │   ├── AppSettingsBL.cs
│   │   ├── PartnerBL.cs
│   │   ├── CuentaBancoBL.cs
│   │   ├── IngresoBL.cs
│   │   ├── EgresoBL.cs
│   │   ├── CierreMesBL.cs
│   │   ├── AssetBL.cs
│   │   ├── TipoIngresoBL.cs
│   │   └── ReportBL.cs
│   ├── Model/                       # DTOs (~40 archivos)
│   │   ├── AccountDTO.cs
│   │   ├── LoginDTO.cs
│   │   ├── IngresoDTO.cs / EgresoDTO.cs
│   │   ├── CuentaBancoDTO.cs
│   │   ├── PartnerDTO.cs
│   │   ├── DashboardSummaryDTO.cs
│   │   ├── PermissionMatrixDTO.cs
│   │   ├── PagedList.cs / PaginationDTO.cs
│   │   └── ... (resto de DTOs)
│   ├── Services/
│   │   ├── CurrentUserService.cs
│   │   ├── DataProtectorService.cs
│   │   ├── DomainErrorLogService.cs
│   │   ├── EmailSenderService.cs
│   │   ├── FluentEmailServiceProvider.cs
│   │   ├── ResendServiceProvider.cs
│   │   ├── SendGridServiceProvider.cs
│   │   ├── NumberRangeService.cs
│   │   ├── PermissionService.cs
│   │   ├── TemplateRenderService.cs
│   │   └── DataTransferService.cs
│   ├── Reports/
│   │   ├── ReceiptAssembler.cs / ReceiptBuilder.cs / ReceiptModel.cs
│   │   ├── BankingBookAssembler.cs / BankingBookBuilder.cs / BankingBookModel.cs
│   │   ├── ConsolidatedReportAssembler.cs / ConsolidatedReportBuilder.cs / ConsolidatedReportModel.cs
│   │   ├── ConsolidatedReportDetBuilder.cs
│   │   ├── ReportBuilderResolver.cs
│   │   ├── ReportGeneratorService.cs
│   │   └── FormatHelper.cs
│   ├── Validators/                  # 24 validadores FluentValidation
│   ├── Custom/
│   │   ├── BusinessMappings.cs      # Mapster TypeAdapterConfig global
│   │   ├── BusinessServiceRegistration.cs
│   │   ├── ValidatorServiceRegistration.cs
│   │   ├── DomainException.cs
│   │   ├── IdentityException.cs
│   │   ├── CustomIdentityError.cs
│   │   ├── GlobalExceptionMiddleware.cs
│   │   ├── IgnoreInTransferAttribute.cs
│   │   ├── PagedList.cs
│   │   ├── PaginationHeaderFilter.cs
│   │   ├── QueryableExtensions.cs
│   │   ├── UtilExtension.cs
│   │   └── ValidationFilter.cs
│   └── Templates/                   # Scriban email templates
│       ├── forgot-password.html
│       └── reset-password.html
│
└── CISModel/                        # Data Layer
    ├── Entities/
    │   ├── Security/                # ApplicationUser, ApplicationRole, etc.
    │   ├── Geography/               # Country, Region, City, District
    │   ├── Partners/                # Partner, PartnerType, PartnerRole, etc.
    │   ├── Finances/                # Banaco, CuentaBanco, Ingreso, Egreso, etc.
    │   ├── Assets/                  # Asset, Brand, AssetCategory, etc.
    │   ├── AppModule.cs / AppEntity.cs / AppAction.cs / RolePermission.cs
    │   ├── CierreMes.cs
    │   ├── NumberRange.cs
    │   ├── AppSettings.cs
    │   ├── AuditLog.cs / DomainErrorLog.cs
    │   └── AuditEntity.cs           # Base class con auditoría
    ├── Configuration/               # 34 configuraciones EF Core
    ├── ApplicationDbContext.cs
    ├── Repository/
    │   ├── IRepository.cs
    │   ├── Repository.cs
    │   ├── UpdateConfiguration.cs
    │   ├── CurrentUserDTO.cs
    │   └── RepositoryRegistration.cs
    └── SeedData/                    # 10 archivos de semilla
```

---

## 3. Modelo de Datos

### 3.1 Entidades Base

```csharp
// CISModel/Entities/AuditEntity.cs
public interface IAuditEntity
{
    string CreatedBy { get; set; }
    DateTimeOffset CreatedAt { get; set; }
    string? LastUpdatedBy { get; set; }
    DateTimeOffset? LastUpdatedAt { get; set; }
    string ConcurrencyStamp { get; set; }
}

public abstract class AuditEntity : IAuditEntity { /* ... */ }
```

- `ConcurrencyStamp` es el `rowversion` de PostgreSQL para control de concurrencia optimista.
- Todas las entidades de negocio heredan de `AuditEntity`.
- `IAuditEntity` se usa en `SaveChangesAsync` para asignar auditoría automática.

### 3.2 Identity y Seguridad

```
ApplicationUser : IdentityUser, IAuditEntity
├── Name (string)
├── Active (bool)
├── AvatarUrl (string?)
└── CreatedBy / CreatedAt / LastUpdatedBy / LastUpdatedAt / ConcurrencyStamp

ApplicationRole : IdentityRole, IAuditEntity
├── RoleName (string)
├── IsAdmin (bool)
└── auditoría

ApplicationUserRole : IdentityUserRole<string>
ApplicationRoleClaim : IdentityRoleClaim<string>
```

### 3.3 Permisos

```
AppModule (ej. "Seguridad", "Operaciones")
└── AppEntity (ej. "Ingresos", "Usuarios")
    └── AppAction (ej. "Ver", "Crear", "Confirmar")
        └── RolePermission (RoleId + AppActionId)
```

- `AppAction.ActionType`: `enum ActionType { Create, Read, Update, Delete, Custom, Report }`
- `RolePermission` tiene unique constraint `(RoleId, AppActionId)`.

### 3.4 Geografía (cascada 4 niveles)

```
Country  (ej. SV = El Salvador)
└── Region (14 departamentos)
    └── City (262 municipios)
        └── District
```

Todas con `Code` (código único) y `Name`.

### 3.5 Socios Comerciales

```
Partner
├── PartnerType (enum: Persona Natural / Jurídica)
├── PartnerCategory (ej. Mayorista, Minorista)
├── PartnerRoles (M:N) → PartnerRole (Cliente, Proveedor)
├── PartnerIdentityDocument (M:N) → IdentityDocument (DUI, NIT, Pasaporte)
├── Country → Region → City (geografía)
└── PartnerCustom (configuración de código personalizado por tipo)
```

### 3.6 Operaciones Financieras

```
CuentaBanco
├── Banco (FK)
├── Codigo, NumeroCuenta, TipoCuenta, SaldoInicial
└── Active

Ingreso (análogo Egreso)
├── CuentaBanco (FK)
├── TipoIngreso / TipoEgreso (FK)
├── TipoDocumentoFinanciero (FK)
├── Partner (FK) — socio comercial
├── FechaMovimiento, Mes, Anio
├── Monto (decimal)
├── Confirmed (bool), Canceled (bool)
├── ConcurrencyStamp — evita doble confirmación
└── FileName, Url (adjuntos)
```

### 3.7 Cierre de Mes

```
CierreMes
├── CuentaBancoId, Mes, Anio  ← unique constraint
├── SaldoInicial, TotalIngresos, TotalEgresos, SaldoFinal
├── Cerrado (bool), FechaCierre (DateTimeOffset)
├── CerradoPor (UserId), Observacion
└── ConcurrencyStamp
```

### 3.8 Activos Fijos

```
Asset
├── Brand (FK)
├── AssetCategory (FK) — con DepreciationYears
├── AssetStatus (FK) — con Severity, Disposed
├── AssetLocation (FK)
├── Partner (FK) — proveedor
├── Code (inventario), Name, Model, SerialNumber, Color
├── AcquisitionDate, AcquisitionValue, CurrentValue
├── Custody, InvoiceNumber
└── Active, Disposed, DisposalDate
```

### 3.9 Configuración de la App

```
AppSettings (key-value)
├── AppSettingsId = "emailProvider" → "Smtp"
├── AppSettingsId = "smtpHost" → "smtp.gmail.com"
└── ... todos los settings como filas individuales
```

### 3.10 Auditoría y Logging

```
AuditLog
├── TableName (ej. "Ingreso")
├── EntityId (PK del registro)
├── AuditType (Create/Update/Delete)
├── OldValues (JSON), NewValues (JSON)
├── ChangedColumns (JSON array)
└── UserId

DomainErrorLog
├── ErrorSource, ExceptionType, Message
├── StackTrace, RequestData (JSON)
├── UserName, IpAddress, Environment
└── Resolved (bool), ResolutionNotes
```

---

## 4. DbContext y Configuración EF Core

### 4.1 ApplicationDbContext

```csharp
// CISModel/ApplicationDbContext.cs
public class ApplicationDbContext
    : IdentityDbContext<ApplicationUser, ApplicationRole, string,
        IdentityUserClaim<string>, ApplicationUserRole,
        IdentityUserLogin<string>, IdentityRoleClaim<string>,
        IdentityUserToken<string>>
```

- `SaveChangesAsync` override:
  1. Asigna `CreatedBy`/`CreatedAt` en entradas `Added` con `IAuditEntity`
  2. Asigna `LastUpdatedBy`/`LastUpdatedAt` en entradas `Modified`
  3. Genera `AuditLog` para cada cambio (serializa OldValues/NewValues con `ReferenceHandler.IgnoreCycles`)
- `OnModelCreating`: aplica las 34 configuraciones vía `ApplyConfigurationsFromAssembly` + seed data

### 4.2 Convenciones de Configuración

Cada entidad tiene su archivo en `CISModel/Configuration/`.

**Clase base abstracta:**
```csharp
public abstract class AuditableConfig<TEntity> : IEntityTypeConfiguration<TEntity>
    where TEntity : class, IAuditEntity
{
    // Configura CreatedBy (200), CreatedAt, ConcurrencyStamp (ConcurrencyToken)
}
```

**Patrón común en todas las configuraciones:**
```csharp
builder.Property(x => x.Name).HasMaxLength(100).IsRequired();
builder.Property(x => x.Active).HasDefaultValue(true);
builder.HasIndex(x => x.Code).IsUnique();
builder.HasOne(x => x.CuentaBanco)
    .WithMany(x => x.Ingresos)
    .HasForeignKey(x => x.CuentaBancoId)
    .OnDelete(DeleteBehavior.Restrict);
builder.Property(x => x.Monto).HasColumnType("DECIMAL(18,2)");
builder.Property(x => x.FechaMovimiento).HasColumnType("timestamptz");
```

**Reglas:**
- `DateTimeOffset` → `timestamptz` en PostgreSQL
- `decimal` → `DECIMAL(18,2)`
- FK deletions → `DeleteBehavior.Restrict` (nunca Cascade)
- IDs string (GUID) generados en BL, no autoincrementales

---

## 5. Patrón Repositorio

### 5.1 Interface

```csharp
// CISModel/Repository/IRepository.cs
public interface IRepository<T> where T : class
{
    IQueryable<T> Query();                          // Síncrono — devuelve IQueryable
    Task<T?> GetByIdAsync(object id);
    Task<List<T>> GetAllAsync();
    Task AddAsync(T entity);
    void Update(T entity);
    void DeleteRange(IEnumerable<T> entities);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
    Task ExecuteInTransactionAsync(Func<Task> action, CancellationToken ct = default);
}
```

### 5.2 Implementación

- `Query()` es **síncrono** (devuelve `IQueryable<T>`, no `Task<IQueryable<T>>`)
- Usa `IUnitOfWork` implícito (el contexto compartido por request)
- `UpdateConfiguration<T>` para actualizaciones parciales:

```csharp
var config = new UpdateConfiguration<Partner>();
config.ConfigureUpdate(p => p.Name);
config.ConfigureUpdate(p => p.Email);
// Solo Name y Email se marcan como modificados
```

### 5.3 Registro Automático

```csharp
// RepositoryRegistration.cs
services.AddScoped<IRepository<Banco>, Repository<Banco>>();
services.AddScoped<IRepository<Ingreso>, Repository<Ingreso>>();
// ... para TODAS las entidades
```

---

## 6. Capa de Negocio (BLs)

### 6.1 GenericBL — CRUD Genérico

```csharp
public class GenericBL<TEntity, TDto> : IGenericBL<TEntity, TDto>
    where TEntity : class, IAuditEntity, new()
    where TDto : AuditEntityDTO
{
    // Métodos principales:
    Task<PagedList<TDto>> GetPagedAsync(PaginationDTO pagination,
        Expression<Func<TEntity, bool>>? filter = null, CancellationToken ct = default);
    Task<List<TDto>> GetListAsync(Expression<Func<TEntity, bool>>? filter = null,
        CancellationToken ct = default);
    Task<TDto> GetByIdAsync(object id, CancellationToken ct = default);
    Task<TDto> CreateAsync(TDto dto, CancellationToken ct = default);
    Task<TDto> UpdateAsync(TDto dto,
        Action<UpdateConfiguration<TEntity>>? configureUpdate = null,
        CancellationToken ct = default);
    Task DeleteAsync(string[] ids, CancellationToken ct = default);
}
```

**Comportamiento:**
- `GetPagedAsync` — paginación + ordenamiento dinámico + búsqueda por string
- `CreateAsync` — asigna `Id = Guid.NewGuid().ToString()`, llama a `AuditHelper.SetCreated`
- `UpdateAsync` — verifica `ConcurrencyStamp` (concurrencia optimista)
- `DeleteAsync` — borrado lógico (soft-delete) cuando existe campo `Active`

### 6.2 BLs específicos

| BL | Métodos clave |
|---|---|
| **AccountBL** | `LoginAsync`, `LogoutAsync`, `ForgotPassword`, `ResetPassword`, `ChangePassword`, `RefreshToken` |
| **UserBL** | CRUD + `ChangePassword` + paginación con búsqueda por email/nombre |
| **IngresoBL** | CRUD + `ConfirmAsync` (valida CierreMes, lanza eventos de auditoría) + `CancelAsync` + `PrintAsync` (genera PDF) |
| **EgresoBL** | CRUD + `ConfirmAsync` + `CancelAsync` + `PrintAsync` |
| **CierreMesBL** | `AperturaAsync` (crea período), `CierreAsync` (valida y cierra), `ReaperturaAsync` |
| **PartnerBL** | CRUD + manejo de `PartnerRoles` (M:N) + `PartnerIdentityDocument` + código personalizado |
| **DashboardBL** | KPIs: ingresos/egresos anuales y mensuales, saldos por cuenta, últimas operaciones |
| **AssetBL** | CRUD + paginación con filtros por estado/categoría/ubicación |
| **RolePermissionBL** | `GetPermissionsByRoleAsync` + `SavePermissionsAsync` (borra e inserta en transacción) |
| **ReportBL** | `GetBankingBookAsync`, `GetConsolidatedAsync`, `GetDetailAsync` |
| **CuentaBancoBL** | CRUD + cálculo de saldo actual vía `SUM()` de Ingresos/Egresos |

### 6.3 Reglas de Negocio Críticas

- **Cierre de Mes:** antes de confirmar un Ingreso/Egreso, se valida que el `CierreMes` para esa cuenta + mes + año esté abierto.
- **Concurrencia en confirmación:** se usa `ConcurrencyStamp` para evitar doble confirmación (el segundo request recibe un `DbUpdateConcurrencyException`).
- **Recálculo en cascada:** al cerrar un mes y modificar uno anterior, se recalculan todos los meses siguientes automáticamente.
- **Códigos auto-generados:** `NumberRangeService` genera códigos secuenciales con formato `{Prefijo}{Número}` usando semáforos por prefijo (`ConcurrentDictionary<string, SemaphoreSlim>`).

---

## 7. Servicios Transversales

| Servicio | Interface | Propósito |
|---|---|---|
| **CurrentUserService** | `ICurrentUserService` | Extrae `UserId`, `UserName`, `Email`, `IpAddress` del `HttpContext` via `IHttpContextAccessor` |
| **DataProtectorService** | `IDataProtectorService` | Cifrado/descifrado de strings con ASP.NET Data Protection |
| **DomainErrorLogService** | `IDomainErrorLogService` | Persiste errores no controlados en `DomainErrorLog` con contexto completo |
| **EmailSenderService** | `IEmailSenderService` | Enrutador: delega al provider activo según `AppSettings.EmailProvider` |
| **FluentEmailServiceProvider** | `IEmailServiceProvider` | SMTP vía FluentEmail (host, puerto, usuario, pass, SSL desde DB) |
| **ResendServiceProvider** | `IEmailServiceProvider` | API Resend.com |
| **SendGridServiceProvider** | `IEmailServiceProvider` | API SendGrid |
| **NumberRangeService** | `INumberRangeService` | Generación thread-safe de números secuenciales `{Prefijo}{Número}` |
| **PermissionService** | `IPermissionService` | Verifica si un usuario tiene permiso específico (`HasPermissionAsync(userId, actionCode)`) |
| **TemplateRenderService** | `ITemplateRenderService` | Renderiza templates Scriban desde recursos incrustados |
| **DataTransferService** | `IDataTransferService` | Importación/exportación CSV con CsvHelper (delimitador `\|`) |

### 7.1 Email Sender (Strategy Pattern)

```csharp
public interface IEmailServiceProvider
{
    Task<bool> SendEmailAsync(string to, string subject, string body);
}

// EmailSenderService resuelve qué provider usar:
var provider = _appSettingsBL.GetValue("EmailProvider") switch
{
    "Smtp"    => _fluentEmailService,
    "Resend"  => _resendService,
    "SendGrid" => _sendGridService,
    _         => null  // None — no-op
};
```

### 7.2 NumberRangeService

```csharp
// Generación thread-safe con semáforo por prefijo
private static readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();

public async Task<string> GetNextNumberAsync(string prefix)
{
    var semaphore = _locks.GetOrAdd(prefix, _ => new SemaphoreSlim(1, 1));
    await semaphore.WaitAsync();
    try
    {
        var range = await _repository.GetByPrefixAsync(prefix);
        var number = range.NextNumber++;
        await _repository.SaveChangesAsync();
        return $"{prefix}{number:D5}";
    }
    finally { semaphore.Release(); }
}
```

---

## 8. Controladores y Endpoints

### 8.1 GenericController

```csharp
[ApiController]
[Authorize]
[OutputCache(PolicyName = "ApiPolicy", Tags = ["{cacheTag}"])]
public class GenericController<TEntity, TDto> : ControllerBase
    where TEntity : class, IAuditEntity, new()
    where TDto : AuditEntityDTO
{
    [HttpGet("paged")]       // GET  /api/{entity}/paged?page=1&pageSize=10&search=...
    [HttpGet]                // GET  /api/{entity}?filter=...
    [HttpGet("{id}")]        // GET  /api/{entity}/{id}
    [HttpPost]               // POST /api/{entity}
    [HttpPut("{id}")]        // PUT  /api/{entity}/{id}
    [HttpDelete]             // DELETE /api/{entity}  (body: string[])
}
```

**Salida de paginación:**
- Body: `PagedList<TDto>` con `Items`, `TotalCount`, `Page`, `PageSize`, `TotalPages`
- Header: `X-Pagination` con JSON metadata

**Caching:**
- Output cache con `VaryByQuery` para GET paged
- Tags por entidad (`partnerCache`, `bancoCache`, etc.)
- Los endpoints POST/PUT/DELETE invalidan el caché llamando a `OutputCacheStore.EvictByTagAsync()`

### 8.2 Controladores que extienden GenericController

| Controller | Route | Cache Tag | Overrides |
|---|---|---|---|
| `CountryController` | `api/country` | `countryCache` | Update personalizado (Name, AltCode) |
| `RegionController` | `api/region` | `regionCache` | GetPaged/GetList filtrado por `countryId` |
| `CityController` | `api/city` | `cityCache` | GetPaged/GetList filtrado por `regionId` |
| `DistrictController` | `api/district` | `districtCache` | GetPaged/GetList filtrado por `cityId` |
| `BancoController` | `api/banco` | `bancoCache` | Update restringido |
| `PartnerTypeController` | `api/partnertype` | `partnerTypeCache` | — |
| `PartnerRoleController` | `api/partnerole` | `partnerRoleCache` | — |
| `PartnerCategoryController` | `api/partnercategory` | `partnerCategoryCache` | — |
| `TipoDocumentoFinancieroController` | `api/tipodocfin` | `tipoDocumentoFinancieroCache` | — |
| `TipoEgresoController` | `api/tipoegreso` | `tipoEgresoCache` | — |
| `AssetCategoryController` | `api/assetcategory` | `assetCategoryCache` | — |
| `AssetLocationController` | `api/assetlocation` | `assetLocationCache` | — |
| `AssetStatusController` | `api/assetstatus` | `assetStatusCache` | Update con Severity, Disposed |
| `BrandController` | `api/brand` | `brandCache` | — |
| `NumberRangeController` | `api/numberrange` | `numrngCache` | +GetActives, +Search (sin cache) |

### 8.3 Controladores Standalone

#### AuthController (`/api/auth`)

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/token` | Login — devuelve JWT + refresh token |
| POST | `/api/auth/refresh` | Refresca JWT con refresh token |
| POST | `/api/auth/logout` | Revoca refresh token, cierra sesión |
| POST | `/api/auth/forgot-password` | Envía email con código de restablecimiento |
| POST | `/api/auth/reset-password` | Restablece contraseña con código |
| POST | `/api/auth/resend-confirmation` | Reenvía email de confirmación |

**Rate limiting:** 5 intentos por minuto en `/api/auth/token`, keyeado por email.

#### AccountController (`/api/account`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/account/profile` | Perfil del usuario autenticado |
| PUT | `/api/account/profile` | Actualiza perfil |
| GET | `/api/account/permissions` | Matriz de permisos del usuario |
| POST | `/api/account/change-password` | Cambia contraseña |

#### IngresoController (`/api/ingreso`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/ingreso/paged` | Lista paginada |
| GET | `/api/ingreso/{id}` | Detalle por ID |
| POST | `/api/ingreso` | Crear (multipart FormData con archivo opcional) |
| PUT | `/api/ingreso/{id}` | Actualizar (multipart FormData) |
| DELETE | `/api/ingreso` | Eliminar (body: string[]) |
| POST | `/api/ingreso/{id}/confirm` | Confirmar ingreso (valida CierreMes) |
| POST | `/api/ingreso/{id}/cancel` | Anular ingreso |
| GET | `/api/ingreso/{id}/print` | Descarga PDF del comprobante |

**EgresoController** — misma estructura con ruta `/api/egreso`.

#### CierreMesController (`/api/cierremes`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/cierremes/paged` | Lista paginada de períodos |
| POST | `/api/cierremes/apertura` | Abre nuevo período |
| POST | `/api/cierremes/cierre` | Cierra período (body: cuenta + mes + año + observación) |
| POST | `/api/cierremes/reapertura` | Reabre período cerrado |
| GET | `/api/cierremes/historial` | Historial de cierres |

#### DashboardController (`/api/dashboard`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/dashboard/summary?year={year}` | KPIs: totales YTD, del mes, balance |
| GET | `/api/dashboard/incomes?year={year}` | Ingresos por mes |
| GET | `/api/dashboard/expenses?year={year}` | Egresos por mes |
| GET | `/api/dashboard/account-balances` | Saldos por cuenta bancaria |

#### Reportes

| Controlador | Endpoint | Descripción |
|---|---|---|
| `BankingBookController` | GET `/api/bankingbook?cuentaBancoId={}&mes={}&anio={}` | Libro bancario |
| | GET `/api/bankingbook/pdf?...` | PDF del libro bancario |
| `OperationConsolitedController` | GET `/api/operationconsolited?...` | Reporte consolidado |
| | GET `/api/operationconsolited/pdf?...` | PDF consolidado |
| `OperationDetailController` | GET `/api/operationdetail?...` | Reporte detallado |

#### Permisos

| Controlador | Endpoint | Descripción |
|---|---|---|
| `RolePermissionController` | GET `/api/rolepermission/{roleId}` | Permisos asignados a un rol |
| | POST `/api/rolepermission/assign` | Guarda matriz de permisos |
| `PermissionMatrixController` | GET `/api/permissionmatrix/user-permissions` | Permisos del usuario autenticado (para UI) |

---

## 9. Seguridad y Autenticación

### 9.1 Identity Configuration (Program.cs)

```csharp
services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = false;
    options.Password.RequireSpecialChar = false;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders()
.AddUserManager<UserManager<ApplicationUser>>()
.AddSignInManager<SignInManager<ApplicationUser>>();
```

### 9.2 JWT Bearer

```csharp
services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        ValidIssuer = Configuration["Jwt:Issuer"],
        ValidAudience = Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]!))
    };
});
```

- JWT contiene claims: `sub` (UserId), `email`, `name`, `role`, `permission` (lista de permisos).
- Duración configurable vía `Jwt:DurationMinutes` (default 120 min).

### 9.3 UserClaimsPrincipalFactory

```csharp
// ApplicationUserClaimsFactory.cs
// Agrega claims adicionales al principal:
// - "permission": lista de códigos "Módulo.Entidad.Acción"
// - Roles del usuario
// Se usa en RoleAuthorizeAttribute para validar permisos sin consultar DB en cada request
```

---

## 10. Permisos y Matriz de Acceso

### 10.1 Atributos de Permisos

```csharp
// Marcar un controlador (nivel módulo y entidad):
[Module("Seguridad")]
[EntityDisplay("Usuarios")]
public class UserController : GenericController<ApplicationUser, UserDTO> { ... }

// Marcar una acción:
[ActionDisplay("Ver")]
[HttpGet("paged")]
public async Task<IActionResult> GetPaged(...) { ... }
```

### 10.2 RoleAuthorizeAttribute

```csharp
// Filtro global de autorización que verifica claims
public class RoleAuthorizeAttribute : IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // 1. Extrae Module + EntityDisplay + ActionDisplay del controller/action
        // 2. Si el usuario es admin (claim IsAdmin) → permite
        // 3. Busca claim "permission" con formato "Module.Entity.Action"
        // 4. Si no tiene el claim → 403 Forbidden
    }
}
```

### 10.3 PermissionAutoRegistrationService

```csharp
// IHostedService que se ejecuta al inicio de la aplicación
// 1. Escanea todos los controladores en busca de [Module], [EntityDisplay], [ActionDisplay]
// 2. Crea/actualiza AppModule, AppEntity, AppAction en DB
// 3. Asigna todas las acciones al rol Admin
// Se deshabilita con: AppSettings:PermissionAutoRegister=false
```

### 10.4 Matriz de Permisos (para UI)

El endpoint `GET /api/permissionmatrix/user-permissions` devuelve:

```json
{
  "modules": [
    {
      "name": "Seguridad",
      "entities": [
        {
          "name": "Usuarios",
          "actions": [
            { "name": "Ver", "hasAccess": true },
            { "name": "Crear", "hasAccess": true }
          ]
        }
      ]
    }
  ]
}
```

La UI (TreeTable en Angular) consume este JSON para construir la interfaz de asignación de permisos.

---

## 11. Validación con FluentValidation

### 11.1 Registro

```csharp
// ValidatorServiceRegistration.cs
services.AddValidatorsFromAssemblyContaining<LoginDTOValidator>();
// Escanea todo el assembly CISUnitWork y registra IValidator<T> para cada DTO
```

### 11.2 ValidationFilter

```csharp
// Filtro global que ejecuta antes de cada acción del controlador:
// 1. Valida ModelState (data annotations)
// 2. Busca IValidator<T> en DI para el parámetro
// 3. Ejecuta validator.ValidateAsync()
// 4. Si hay errores → 422 ValidationProblemDetails
```

### 11.3 Validadores incluidos (24)

| Validador | Reglas clave |
|---|---|
| `LoginDTOValidator` | Email not empty + valid format, Password not empty |
| `ChangePasswordValidator` | CurrentPassword not empty, NewPassword min 8, Confirm igual |
| `ForgotPasswordValidator` | Email not empty |
| `ResetPasswordValidator` | Email + Code not empty, NewPassword min 8 |
| `IngresoValidator` | FechaMovimiento required, Monto > 0, CuentaBancoId/TipoIngresoId/PartnerId not empty |
| `EgresoValidator` | Mismas reglas + NoCheque not empty |
| `PartnerCreateValidator` / `PartnerUpdateValidator` | Name required max 200, Email valid format, validaciones condicionales de DUI/NIT |
| `UserCreateValidator` / `UserUpdateValidator` | Email + Name required, Password en create |
| `BancoDTOValidator` | Code max 2, Name max 100 |
| `TipoIngresoDTOValidator` | Code max 4, Name max 100, PartnerCategoryId exists |
| `CuentaBancoDTOValidator` | Nombre max 200, NumeroCuenta max 50, SaldoInicial ≥ 0 |
| `AssetDTOValidator` | Name required, Price ≥ 0 |
| ... |

---

## 12. Reportes con QuestPDF

### 12.1 Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    Controller                         │
│  GET /api/ingreso/{id}/print → PrintAsync()          │
│  GET /api/bankingbook/pdf → ReportBL                 │
└──────────────┬──────────────────────────────────────┘
               ▼
┌───────────────────────────────┐
│     Assembler (ensambla datos) │
│  BankingBookAssembler.cs       │
│  Recibe entidades → Produce   │
│  BankingBookModel (DTO plano)  │
└──────────────┬────────────────┘
               ▼
┌───────────────────────────────┐
│     Builder (construye PDF)   │
│  BankingBookBuilder.cs         │
│  Recibe Model → QuestPDF       │
│  Document.Create(container =>  │
│    page.Header().DefaultText() │
│    page.Content().Table()      │
│  )                             │
└──────────────┬────────────────┘
               ▼
┌───────────────────────────────┐
│  ReportGeneratorService        │
│  Generate<T>(model) → byte[]  │
└───────────────────────────────┘
```

### 12.2 FormatHelper

```csharp
// Conversión de zona horaria
public static DateTimeOffset ToLocal(DateTimeOffset utc)
    => TimeZoneInfo.ConvertTime(utc, TimeZoneInfo.FindSystemTimeZoneById("America/El_Salvador"));

// Formatos
public static string Currency(decimal amount) => amount.ToString("C2", new CultureInfo("es-SV"));
public static string Date(DateTimeOffset date) => date.ToString("dd/MM/yyyy");
public static string DateTime(DateTimeOffset date) => date.ToString("dd/MM/yyyy HH:mm");
```

### 12.3 ReportBuilderResolver

```csharp
// Resuelve IReportBuilder<T> por nombre de formulario
public interface IReportBuilder<T> { byte[] Generate(T model); }

// Registro en DI:
services.AddKeyedSingleton<IReportBuilder<BankingBookModel>, BankingBookBuilder>("BankingBook");
services.AddKeyedSingleton<IReportBuilder<ConsolidatedReportModel>, ConsolidatedReportBuilder>("Consolidated");
services.AddKeyedSingleton<IReportBuilder<ConsolidatedReportDetModel>, ConsolidatedReportDetBuilder>("ConsolidatedDet");
```

---

## 13. Envío de Correos

### 13.1 Template Rendering (Scriban)

Los templates HTML están en `CISUnitWork/Templates/` como recursos incrustados.

```html
<!-- forgot-password.html -->
<h2>Restablecer contraseña</h2>
<p>Hola {{name}},</p>
<p>Tu código de restablecimiento es: <strong>{{code}}</strong></p>
<a href="{{resetUrl}}">Restablecer contraseña</a>
```

```csharp
// TemplateRenderService
var template = Template.Parse(embeddedResource);
var body = template.Render(new { Name = user.Name, Code = code, ResetUrl = url });
```

### 13.2 Providers

| Provider | Configuración en AppSettings |
|---|---|
| `None` | No-op, no envía correos |
| `Smtp` | `smtpHost`, `smtpPort`, `smtpUser`, `smtpPass`, `smtpUseSsl` |
| `Resend` | `resendApiKey` |
| `SendGrid` | `sendGridApiKey` |

Los valores se leen desde la tabla `AppSettings` (no de appsettings.json), permitiendo configuración en tiempo de ejecución sin redeploy.

---

## 14. Rate Limiting y Caching

### 14.1 Rate Limiting

```csharp
// Program.cs
services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("AuthPolicy", opt =>
    {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0;
    });
});

// Aplicado solo en /api/auth/token
// La clave es el email extraído del body via EmailExtractionMiddleware
```

### 14.2 Output Caching

```csharp
services.AddOutputCache(options =>
{
    options.AddBasePolicy(policy => policy.NoCache());  // Default: no cache
    options.AddPolicy("ApiPolicy", new CustomPolicyCache());  // Solo GET con query params
});

// CustomPolicyCache: VaryByQuery, NoCache si hay cookie o status ≠ 200
```

**Invalidación manual en controladores:**
```csharp
[HttpPost]
public async Task<IActionResult> Create([FromBody] TDto dto)
{
    var result = await _bl.CreateAsync(dto);
    await HttpContext.Response.OutputCacheStore.EvictByTagAsync(_cacheTag, default);
    return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
}
```

---

## 15. Manejo de Errores

### 15.1 GlobalExceptionMiddleware

```csharp
public class GlobalExceptionMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainException ex)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = 422;
            await context.Response.WriteAsJsonAsync(new { errors = ex.Errors });
        }
        catch (IdentityException ex)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            // Log a DomainErrorLog
            await _errorLogService.LogErrorAsync(ex, context);
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new { error = "Error interno del servidor" });
        }
    }
}
```

### 15.2 DomainException

```csharp
public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
    public DomainException(string message, Exception inner) : base(message, inner) { }
}

// Uso: lanzar desde BL para errores de negocio predecibles
throw new DomainException("El período seleccionado ya está cerrado.");
```

### 15.3 CustomIdentityError

```csharp
// Mapea códigos de IdentityError a mensajes en español
public static string GetErrorMessage(IdentityError error)
{
    return error.Code switch
    {
        "PasswordTooShort" => "La contraseña debe tener al menos 8 caracteres.",
        "DuplicateEmail" => "El correo electrónico ya está registrado.",
        "PasswordMismatch" => "La contraseña actual es incorrecta.",
        // ...
    };
}
```

---

## 16. Seed Data

Los seeds se ejecutan en `OnModelCreating` del DbContext vía `builder.HasData()`.

### 16.1 AdminSeed.cs
- Crea rol `Admin` con `IsAdmin = true`
- Crea usuario `admin@avalink.com` con contraseña hasheada
- Asigna rol Admin al usuario

### 16.2 PermissionSeed.cs
- 5 módulos: Seguridad, Configuración, Socios Comerciales, Operaciones, Activos
- 19 entidades (User, Role, Banco, Partner, Ingreso, Egreso, Asset, etc.)
- 8 acciones por entidad: Ver, Crear, Editar, Eliminar, Confirmar, Anular, Imprimir

### 16.3 GeographySeed.cs
- País: SV (El Salvador)
- 14 regiones/departamentos
- 262 ciudades/municipios
- Distritos (pueden estar vacíos inicialmente)

### 16.4 FinanceSeed.cs
- Tipos de Ingreso (5): Venta, Servicio, Alquiler, Interés, Otro
- Tipos de Egreso (5): Compra, Servicio Público, Salario, Alquiler, Otro
- Tipos de Documento Financiero (4): Factura, Recibo, Nota de Crédito, Otro

### 16.5 AssetSeed.cs
- Categorías: Equipo de Cómputo, Mobiliario, Vehículo, Maquinaria, Edificio
- Estados: Bueno, Regular, Dañado, En Reparación, Dado de baja
- Ubicaciones: Oficina Central, Bodega, Sucursal

### 16.6 BrandSeed.cs
- Marcas: Dell, HP, Sony, Toyota, Caterpillar, etc.

### 16.7 IdentityDocumentSeed.cs
- DUI, NIT, Pasaporte, Carné de Residente

---

## 17. Configuración y Despliegue

### 17.1 appsettings.json

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=CISDB;Username=postgres;Password=..."
  },
  "Jwt": {
    "Key": "...",
    "Issuer": "CISApi",
    "Audience": "CISApp",
    "DurationMinutes": 120
  },
  "AppSettings": {
    "PermissionAutoRegister": true
  }
}
```

### 17.2 Variables de Entorno

| Variable | Propósito | Default |
|---|---|---|
| `DB_CONNECTION_STRING` | Conexión a PostgreSQL (sobrescribe appsettings) | — |
| `ASPNETCORE_ENVIRONMENT` | Environment | Production |
| `ASPNETCORE_URLS` | URLs de escucha | `http://+:8080` |

### 17.3 Migraciones EF Core

```bash
# En directorio CISModel/
dotnet ef migrations add NombreMigracion --startup-project ../CISApi
dotnet ef database update --startup-project ../CISApi
```

### 17.4 Perfil de Lanzamiento

```json
// Properties/launchSettings.json
{
  "profiles": {
    "CISApi": {
      "applicationUrl": "http://localhost:5000;https://localhost:5001",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

---

## 18. Docker

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish CISApi/CISApi.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .
RUN mkdir -p /mnt/data && chmod 755 /mnt/data
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
USER root
ENTRYPOINT ["dotnet", "CISApi.dll"]
```

**Build:**
```bash
docker build -t cis-api .
docker run -p 8080:8080 -e DB_CONNECTION_STRING="..." cis-api
```

**Volúmenes persistentes:**
- `/mnt/data` — archivos subidos (adjuntos de Ingresos/Egresos/Activos)

---

## Apéndice A: Mapa de Endpoints

```
MÓDULO              CONTROLADOR                     RUTA BASE
──────────────────────────────────────────────────────────────
Auth                AuthController                  /api/auth
Account             AccountController               /api/account
Dashboard           DashboardController             /api/dashboard
Config              BancoController                 /api/banco
Config              CuentaBancoController           /api/cuentabanco
Config              TipoIngresoController           /api/tipoingreso
Config              TipoEgresoController            /api/tipoegreso
Config              TipoDocumentoFinancieroCont     /api/tipodocfin
Config              CountryController               /api/country
Config              RegionController                /api/region
Config              CityController                  /api/city
Config              DistrictController               /api/district
Config              NumberRangeController           /api/numberrange
Config              AppSettingsController           /api/appsettings
Socios Comerciales  PartnerController               /api/partner
Socios Comerciales  PartnerTypeController           /api/partnertype
Socios Comerciales  PartnerRoleController           /api/partnerrole
Socios Comerciales  PartnerCategoryController       /api/partnercategory
Operaciones         IngresoController               /api/ingreso
Operaciones         EgresoController                /api/egreso
Operaciones         CierreMesController             /api/cierremes
Activos             AssetController                 /api/asset
Activos             AssetCategoryController         /api/assetcategory
Activos             AssetLocationController         /api/assetlocation
Activos             AssetStatusController           /api/assetstatus
Activos             BrandController                 /api/brand
Seguridad           UserController                  /api/user
Seguridad           RoleController                  /api/role
Seguridad           RolePermissionController        /api/rolepermission
Seguridad           PermissionMatrixController      /api/permissionmatrix
Reportes            BankingBookController           /api/bankingbook
Reportes            OperationConsolitedController   /api/operationconsolited
Reportes            OperationDetailController       /api/operationdetail
```

## Apéndice B: Dependencias NuGet

| Proyecto | Paquete | Versión |
|---|---|---|
| **CISApi** | `Microsoft.AspNetCore.Authentication.JwtBearer` | 10.0 |
| | `Microsoft.AspNetCore.Identity.EntityFrameworkCore` | 10.0 |
| | `Scalar.AspNetCore` | 2.x |
| | `Swashbuckle.AspNetCore` | 7.x |
| | `AspNetCoreRateLimit` | 5.x |
| **CISModel** | `Npgsql.EntityFrameworkCore.PostgreSQL` | 10.0 |
| | `Microsoft.EntityFrameworkCore.Design` | 10.0 |
| **CISUnitWork** | `Mapster` | 7.x |
| | `FluentValidation` | 11.x |
| | `QuestPDF` | 2025.x |
| | `FluentEmail.Smtp` | 3.x |
| | `Resend` | 3.x |
| | `SendGrid` | 9.x |
| | `CsvHelper` | 33.x |
| | `Scriban` | 5.x |

## Apéndice C: Flujo de Confirmación de Operación

```
POST /api/ingreso/{id}/confirm
  → IngresoBL.ConfirmAsync(id)
    → Obtiene Ingreso con Tracking
    → Valida que Confirmed == false
    → Valida que Canceled == false
    → Valida CierreMes abierto para (CuentaBancoId, Mes, Anio):
        - CierreMesBL.ValidatePeriodOpen(cuentaBancoId, mes, anio)
        - Lanza DomainException si el período está cerrado
    → Set Confirmed = true
    → Incrementa ConcurrencyStamp
    → SaveChangesAsync
      → DbUpdateConcurrencyException si otro request ya confirmó
    → Invalida caché (tag: "ingresoCache")
    → Opcional: actualiza CierreMes.TotalIngresos
    → Retorna IngresoDTO confirmado
```

## Apéndice D: Flujo de Cierre de Mes

```
POST /api/cierremes/cierre
  → CierreMesBL.CierreAsync(cuentaBancoId, mes, anio, observacion)
    → Obtiene o crea CierreMes
    → Valida que no esté ya cerrado (concurrency)
    → Calcula saldos:
        - SaldoInicial = de apertura o saldoFinal del mes anterior
        - TotalIngresos = SUM(Ingreso.Monto) WHERE confirmado y no anulado
        - TotalEgresos = SUM(Egreso.Monto) WHERE confirmado y no anulado
        - SaldoFinal = SaldoInicial + TotalIngresos - TotalEgresos
    → Set Cerrado = true, FechaCierre = ahora, CerradoPor = currentUser
    → SaveChangesAsync
    → Si el mes siguiente existe y está cerrado → recálculo en cascada
```

---

*Documento generado con base en el código fuente del proyecto CISApi V3.*
