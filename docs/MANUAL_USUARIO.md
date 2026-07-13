# Manual de Usuario — CIS (Control de Ingresos y Salidas)

## Índice

1. [Introducción](#1-introducción)
2. [Acceso al Sistema](#2-acceso-al-sistema)
3. [Interfaz Principal](#3-interfaz-principal)
4. [Personalización de Tema](#4-personalización-de-tema)
5. [Dashboard](#5-dashboard)
6. [Operaciones](#6-operaciones)
   - [Ingresos](#61-ingresos)
   - [Egresos](#62-egresos)
   - [Períodos](#63-períodos)
7. [Inventario — Activo Fijo](#7-inventario--activo-fijo)
8. [Socios Comerciales](#8-socios-comerciales)
9. [Catálogos de Configuración](#9-catálogos-de-configuración)
10. [Informes](#10-informes)
11. [Administración](#11-administración)
12. [Perfil de Usuario](#12-perfil-de-usuario)
13. [Estructura de Navegación](#13-estructura-de-navegación)

---

## 1. Introducción

**CIS** (Control de Ingresos y Salidas) es un sistema web de gestión financiera y administrativa. Permite registrar y controlar ingresos y egresos, administrar activos fijos, gestionar socios comerciales, generar reportes consolidados y configurar catálogos maestros.

### Requisitos técnicos
- Navegador web moderno (Chrome, Firefox, Edge, Safari).
- Conexión a internet (o a la red local donde esté alojado el servidor).

---

## 2. Acceso al Sistema

### 2.1 Pantalla de Login

Al ingresar a la aplicación verá una pantalla con el logo **CIS** y un formulario de inicio de sesión.

![Login](placeholder-login.png)

**Campos:**
- **Correo electrónico** — su correo registrado en el sistema.
- **Contraseña** — su contraseña.

Presione **Iniciar sesión** para ingresar.

### 2.2 Recuperación de acceso

Si no recuerda su contraseña, contacte al administrador del sistema para restablecerla.

---

## 3. Interfaz Principal

Una vez autenticado, ingresa al **layout privado** compuesto por:

### 3.1 Barra lateral (SideNavbar)

Menú de navegación colapsable con las siguientes secciones:

| Sección | Rutas |
|---|---|
| **INICIO** | Dashboard |
| **OPERACIONES** | Ingresos, Egreso, Períodos |
| **INVENTARIO** | Activo Fijo |
| **INFORMES** | Consolidado |
| **CATALOGOS** | Bancos, Tipo Ingreso, Tipo Egreso, Tipo Documento, Cuentas Bancarias, Categoría Activo, Ubicación Activo, Estado Activo, Marca |
| **SOCIOS COMERCIALES** | Socios, Categorías, Tipos, Roles |
| **ADMINISTRACION** | Usuarios, Roles |

Cada grupo se expande/colapsa al hacer clic en su encabezado.

### 3.2 Barra superior (TopNavbar)

- **Icono de menú (hamburguesa):** abre/cierra el menú lateral en dispositivos móviles.
- **Selector de tema:** abre el panel de personalización visual.
- **Menú de usuario:** nombre del usuario con opciones para Perfil, Cambiar contraseña y Cerrar sesión.

### 3.3 En dispositivos móviles

El menú lateral se muestra como un **Drawer** (panel deslizable) al presionar el icono de hamburguesa.

---

## 4. Personalización de Tema

Haga clic en el icono de **paleta/ajustes** en la barra superior para abrir el panel de personalización.

### Opciones disponibles:

- **Presets:** Aura, Material, Lara, Nora — cambia el estilo visual completo de los componentes PrimeNG.
- **Color primario:** seleccione entre una paleta de colores para los elementos principales (botones, acentos).
- **Color de superficie:** define el fondo de tarjetas, paneles y contenedores.
- **Modo oscuro:** active o desactive el tema oscuro con un solo clic.

Los cambios se guardan automáticamente en el navegador (localStorage) y persisten entre sesiones.

---

## 5. Dashboard

La pantalla principal después del login. Muestra un resumen financiero del año seleccionado.

### 5.1 Selector de año

En la parte superior puede elegir el año a visualizar (últimos 5 años disponibles).

### 5.2 Tarjetas KPI

Seis indicadores principales:

| Indicador | Descripción |
|---|---|
| Ingresos YTD | Total de ingresos acumulados en el año |
| Egresos YTD | Total de egresos acumulados en el año |
| Balance YTD | Diferencia (ingresos − egresos) del año |
| Ingresos del Mes | Total de ingresos del mes actual |
| Egresos del Mes | Total de egresos del mes actual |
| Balance del Mes | Diferencia del mes actual |

### 5.3 Gráficos

- **Gráfico de barras mensual:** evolución de ingresos, egresos y balance mes a mes.
- **Gráficos de dona:** distribución de ingresos por tipo y egresos por tipo.

---

## 6. Operaciones

### 6.1 Ingresos

Registro de transacciones de ingreso (dinero que entra).

#### Listado de Ingresos
Muestra una tabla paginada con todos los ingresos. Cada fila es clickeable para editar. Botón **Crear** para registrar un nuevo ingreso.

#### Campos del formulario de Ingreso

| Campo | Descripción |
|---|---|
| Número | Generado automáticamente (solo lectura) |
| Fecha de movimiento | Fecha del ingreso |
| Cuenta bancaria | Seleccione la cuenta destino |
| Tipo Ingreso | Categoría del ingreso (ej. Venta, Servicio) |
| Tipo Documento | Tipo de documento asociado (Factura, Recibo, etc.) |
| Socio | Seleccione un socio comercial cliente (autocompletado) |
| Descripción | Detalle del ingreso (máx. 500 caracteres) |
| No. Documento | Número del documento asociado |
| Monto | Valor del ingreso |
| Archivo adjunto | Opcional: suba una imagen o documento PDF (máx. 1 MB) |

#### Estados del Ingreso

- **Borrador:** puede editar todos los campos.
- **Confirmado:** congelado, no permite edición. Puede imprimir o descargar el comprobante.
- **Anulado:** estado final irreversible.

#### Acciones por estado

| Estado | Acciones disponibles |
|---|---|
| Borrador | Guardar, Confirmar |
| Confirmado | Imprimir, Descargar |
| Activo (no anulado) | Anular |

### 6.2 Egresos

Registro de transacciones de egreso (dinero que sale). Funciona de manera similar a Ingresos.

#### Campos adicionales vs Ingreso

| Campo | Descripción |
|---|---|
| No. Cheque | Número de cheque asociado (obligatorio) |
| Tipo Egreso | Categoría del egreso |
| Socio | Seleccione un socio comercial proveedor (autocompletado) |

#### Estados y acciones

Mismos estados que Ingresos: Borrador → Confirmado → Anulado.

### 6.3 Períodos

Gestión de apertura y cierre de meses por cuenta bancaria.

#### Apertura de período
1. Presione **Crear**.
2. Seleccione: Cuenta bancaria, Mes y Año.
3. El sistema registrará la apertura con el saldo inicial de la cuenta.

#### Cierre de período
1. En la lista, presione el icono de cierre en el período deseado.
2. Agregue una observación opcional.
3. Confirme el cierre. Una vez cerrado un período, no se pueden registrar más movimientos en ese mes para esa cuenta.

#### Columnas del listado

| Columna | Descripción |
|---|---|
| Cuenta Bancaria | Nombre y número de cuenta |
| Mes/Año | Período |
| Saldo Inicial | Saldo al abrir el mes |
| Total Ingresos | Suma de ingresos del mes |
| Total Egresos | Suma de egresos del mes |
| Saldo Final | Saldo calculado al cierre |
| Estado | Abierto / Cerrado |

---

## 7. Inventario — Activo Fijo

### 7.1 Listado de Activos

Tabla paginada con todos los activos fijos registrados. Botón **Crear** para agregar uno nuevo.

### 7.2 Formulario de Activo

| Campo | Descripción |
|---|---|
| Código de inventario | Código único del activo (solo lectura en edición) |
| Descripción | Nombre o descripción del activo |
| Marca | Seleccione la marca |
| Modelo | Modelo del activo |
| Número de serie | Serie del activo |
| Color | Color del activo |
| Precio | Valor de adquisición |
| Proveedor | Socio comercial proveedor (autocompletado) |
| Factura No. | Número de factura de compra |
| Fecha de compra | Fecha de adquisición |
| Categoría | Categoría del activo |
| Ubicación | Ubicación física |
| Estado | Estado actual (Bueno, Dañado, etc.) |
| Notas | Observaciones adicionales |
| Activo | Si está operativo o dado de baja |

---

## 8. Socios Comerciales

### 8.1 Socios

Registro de personas o empresas con las que se comercia (clientes, proveedores, etc.).

#### Campos del formulario

| Campo | Descripción |
|---|---|
| Código | Código único del socio (solo lectura en edición) |
| Nombre | Nombre o razón social |
| Nombre comercial | Nombre de fantasía |
| Tipo de socio | Cliente, Proveedor, Ambos |
| Categoría | Categoría del socio |
| Roles | Roles que cumple (ej. Cliente, Proveedor) |
| Email | Correo electrónico |
| Teléfono | Número de contacto |
| NIT | Número de Identificación Tributaria |
| NRC | Número de Registro de Contribuyente |
| DUI | Documento Único de Identidad |
| Pasaporte | Número de pasaporte |
| Dirección | Dirección física |
| País / Región / Ciudad / Distrito | Ubicación geográfica (en cascada) |

### 8.2 Catálogos auxiliares de Socios

- **Categorías:** agrupación de socios (ej. Mayorista, Minorista).
- **Tipos:** clasificación por tipo (Persona Natural, Jurídica).
- **Roles:** funciones del socio (Cliente, Proveedor).

---

## 9. Catálogos de Configuración

Estos catálogos alimentan las listas desplegables en los formularios principales.

### 9.1 Bancos
Registro de instituciones bancarias.
- **Código** (máx. 2 caracteres, no editable tras crear).
- **Nombre** (máx. 100 caracteres).
- **Activo** — inhabilitar un banco lo oculta en los formularios.

### 9.2 Cuentas Bancarias
Cuentas específicas por banco.
| Campo | Descripción |
|---|---|
| Nombre | Identificador de la cuenta |
| Número de cuenta | Número de cuenta bancaria |
| Banco | Seleccione el banco |
| Tipo de cuenta | Ahorros o Corriente |
| Fecha de apertura | Fecha de creación |
| Saldo inicial | Saldo al momento del registro |

### 9.3 Tipos de Ingreso
Categorías para clasificar ingresos (ej. Venta, Servicio, Alquiler).
- **Código** (máx. 4 caracteres, no editable tras crear).
- **Nombre** (máx. 100 caracteres).

### 9.4 Tipos de Egreso
Categorías para clasificar egresos (ej. Compra, Servicio público, Salario).
- **Código** (máx. 4 caracteres, no editable tras crear).
- **Nombre** (máx. 100 caracteres).

### 9.5 Tipos de Documento
Tipos de documentos financieros (Factura, Recibo, Nota de crédito, etc.).
- **Código** (máx. 4 caracteres).
- **Nombre** (máx. 100 caracteres).
- **Activo.**

### 9.6 Activos Fijos — Catálogos

- **Categoría de Activo:** clasificación del activo (ej. Equipo de cómputo, Mobiliario).
- **Ubicación de Activo:** lugar físico donde se encuentra (ej. Oficina central, Bodega).
- **Estado de Activo:** condición actual (Bueno, Regular, Dañado, En reparación, Dado de baja).
- **Marca:** marcas de los activos (ej. Dell, Sony, Toyota).

---

## 10. Informes

### 10.1 Reporte Consolidado

Genera un resumen mensual detallado de ingresos y egresos.

**Parámetros:**
- **Cuenta bancaria:** seleccione la cuenta a reportar.
- **Mes y Año:** período del reporte.

Presione **Generar** para visualizar el reporte.

**Estructura del reporte:**
- Encabezado con datos de la cuenta bancaria y período.
- Líneas detalladas con concepto y monto, agrupadas por tipo (ingresos/egresos).
- Subtotales por tipo.
- Resumen final con total de ingresos, egresos y balance.

---

## 11. Administración

### 11.1 Usuarios

Gestión de usuarios del sistema.

**Campos:**

| Campo | Descripción |
|---|---|
| Email | Correo electrónico del usuario |
| Nombre | Nombre completo |
| Contraseña | Solo al crear o restablecer |
| Confirmar contraseña | Debe coincidir con la anterior |
| Roles | Selección de roles (Administrador, Usuario, etc.) |
| Activo | Habilitar o deshabilitar el acceso |

**Acciones:**
- **Crear usuario** — formulario con todos los campos.
- **Editar usuario** — haga clic en una fila de la tabla.
- **Eliminar usuario** — confirme la eliminación en el diálogo.

### 11.2 Roles

Gestión de roles del sistema (en desarrollo). Define los permisos y niveles de acceso.

---

## 12. Perfil de Usuario

### 12.1 Menú de usuario

Haga clic en su nombre (esquina superior derecha) para abrir el menú:

| Opción | Acción |
|---|---|
| Perfil | Ver información del perfil (en desarrollo) |
| Cambiar contraseña | Abre un diálogo para cambiar la contraseña |
| Cerrar sesión | Finaliza la sesión y redirige al login |

### 12.2 Cambiar contraseña

1. Seleccione **Cambiar contraseña** del menú de usuario.
2. Ingrese: Contraseña actual, Nueva contraseña, Confirmar nueva contraseña.
3. Presione **Guardar**.

---

## 13. Estructura de Navegación

### Árbol completo de rutas

```
/login                          → Login
/app                            → Layout privado
  /app/dashboard                → Dashboard
  /app/operation/ingreso        → Listado de Ingresos
  /app/operation/ingreso/create → Nuevo Ingreso
  /app/operation/ingreso/edit/:id → Editar Ingreso
  /app/operation/egreso         → Listado de Egresos
  /app/operation/egreso/create  → Nuevo Egreso
  /app/operation/egreso/edit/:id → Editar Egreso
  /app/operation/periodo        → Períodos
  /app/inventory/asset          → Activo Fijo
  /app/partner                  → Socios Comerciales
  /app/partner/category         → Categorías de Socio
  /app/partner/type             → Tipos de Socio
  /app/partner/role             → Roles de Socio
  /app/config/bancos            → Bancos
  /app/config/cuentas-banco     → Cuentas Bancarias
  /app/config/tipo-ingreso      → Tipos de Ingreso
  /app/config/tipo-egreso       → Tipos de Egreso
  /app/config/tipo-doc          → Tipos de Documento
  /app/config/asset-category    → Categorías de Activo
  /app/config/asset-location    → Ubicaciones de Activo
  /app/config/asset-status      → Estados de Activo
  /app/config/brand             → Marcas
  /app/admin/user               → Usuarios
  /app/admin/role               → Roles
  /app/report/consolidated      → Reporte Consolidado
```

### Convenciones de la interfaz

- **Tablas:** todas las tablas tienen paginación, ordenamiento por columnas y filtros de búsqueda.
- **Formularios en diálogo:** catálogos simples se editan en ventanas modales (dinámicas).
- **Formularios en panel lateral:** entidades complejas (Socios, Activos, Usuarios) se editan en un drawer lateral.
- **Formularios en página completa:** Ingresos y Egresos usan una página dedicada para crear/editar.

---

*Documento generado con base en el código fuente del proyecto. Para soporte técnico, contacte al administrador del sistema.*
