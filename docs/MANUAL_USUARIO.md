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

**CIS** (Control de Ingresos y Salidas) es un sistema web de gestión financiera y administrativa. Permite registrar y controlar ingresos y egresos, administrar activos fijos, gestionar socios comerciales, generar reportes consolidados y detallados, y configurar catálogos maestros.

### Requisitos técnicos
- Navegador web moderno (Chrome, Firefox, Edge, Safari).
- Conexión a internet (o a la red local donde esté alojado el servidor).

---

## 2. Acceso al Sistema

### 2.1 Pantalla de Login

Al ingresar a la aplicación verá una pantalla con el logo **CIS** y un formulario de inicio de sesión.

**Campos:**
- **Correo electrónico** — su correo registrado en el sistema.
- **Contraseña** — su contraseña.

Presione **Iniciar sesión** para ingresar.

### 2.2 Recuperación de contraseña

Si no recuerda su contraseña:

1. En la pantalla de login, presione el enlace **¿Olvidaste tu contraseña?**.
2. Ingrese su **correo electrónico** registrado.
3. Presione **Enviar** — recibirá un código de restablecimiento en su correo.
4. En la pantalla de **Restablecer contraseña** (a la que llega desde el enlace del correo):
   - **Nueva contraseña** — ingrese la nueva clave.
   - **Confirmar contraseña** — repita la nueva clave.
5. Presione **Guardar** para completar el cambio.

> Nota: Los campos de correo y código se cargan automáticamente desde el enlace recibido por email.

---

## 3. Interfaz Principal

Una vez autenticado, ingresa al **layout privado** compuesto por:

### 3.1 Barra lateral (SideNavbar)

Menú de navegación colapsable con las siguientes secciones:

| Sección | Rutas |
|---|---|
| **INICIO** | Dashboard |
| **OPERACIONES** | Ingresos, Egresos, Períodos |
| **INVENTARIO** | Activo Fijo |
| **INFORMES** | Consolidado, Detallado, Libro Bancario |
| **SOCIOS COMERCIALES** | Socios, Categorías, Tipos, Roles |
| **CATALOGOS** | Bancos, Tipo Ingreso, Tipo Egreso, Tipo Documento, Cuentas Bancarias, Categoría Activo, Ubicación Activo, Estado Activo, Marca |
| **ADMINISTRACION** | Usuarios, Roles, Permisos por Rol, Configuración App |

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
- **Medidor de estado:** cantidad de operaciones en borrador, confirmadas y anuladas.

---

## 6. Operaciones

### 6.1 Ingresos

Registro de transacciones de ingreso (dinero que entra).

#### Listado de Ingresos
Muestra una tabla paginada con todos los ingresos, incluyendo indicador de estado (Borrador / Confirmado / Anulado). Cada fila es clickeable para editar. Botón **Crear** para registrar un nuevo ingreso.

#### Campos del formulario de Ingreso

| Campo | Descripción |
|---|---|
| Número | Generado automáticamente por el sistema (solo lectura) |
| Fecha de movimiento | Fecha en que se realizó el ingreso |
| Cuenta bancaria | Seleccione la cuenta destino |
| Tipo Ingreso | Categoría del ingreso (ej. Venta, Servicio) |
| Tipo Documento | Tipo de documento asociado (Factura, Recibo, etc.) |
| Socio | Seleccione un socio comercial cliente (búsqueda con autocompletado) |
| Descripción | Detalle del ingreso (máx. 500 caracteres) |
| No. Documento | Número del documento asociado |
| Monto | Valor del ingreso en la moneda configurada |
| Archivo adjunto | Opcional: suba una imagen o documento PDF (máx. 1 MB, formatos: PDF, JPG, PNG, DOC, DOCX) |

#### Estados del Ingreso

- **Borrador:** puede editar todos los campos. El comprobante aún no está confirmado.
- **Confirmado:** registro congelado, no permite edición. Puede imprimir o descargar el comprobante en PDF.
- **Anulado:** estado final irreversible. El registro permanece para auditoría pero no afecta saldos.

#### Acciones por estado

| Estado | Acciones disponibles |
|---|---|
| Borrador | Guardar cambios, Confirmar ingreso |
| Confirmado | Imprimir comprobante, Descargar PDF |
| Confirmado (no anulado) | Anular ingreso |
| Anulado | Solo visualización |

### 6.2 Egresos

Registro de transacciones de egreso (dinero que sale). Funciona de manera similar a Ingresos.

#### Campos del formulario de Egreso

| Campo | Descripción |
|---|---|
| Número | Generado automáticamente por el sistema (solo lectura) |
| Fecha de movimiento | Fecha en que se realizó el egreso |
| Cuenta bancaria | Seleccione la cuenta de origen |
| Tipo Egreso | Categoría del egreso (ej. Compra, Servicio público) |
| Tipo Documento | Tipo de documento asociado |
| Socio | Seleccione un socio comercial **proveedor** (búsqueda con autocompletado filtrada por rol Proveedor) |
| Descripción | Detalle del egreso (máx. 500 caracteres) |
| No. Documento | Número del documento asociado |
| No. Cheque | Número de cheque asociado (obligatorio) |
| Monto | Valor del egreso |
| Archivo adjunto | Opcional: suba una imagen o documento PDF (máx. 1 MB) |

#### Estados y acciones

Mismos estados que Ingresos: Borrador → Confirmado → Anulado, con las mismas acciones disponibles.

### 6.3 Períodos

Gestión de apertura y cierre de meses por cuenta bancaria. Controla que no se puedan registrar operaciones en meses cerrados.

#### Apertura de período
1. Presione **Crear**.
2. Seleccione: **Cuenta bancaria**, **Mes** y **Año**.
3. El sistema registrará la apertura con el saldo inicial de la cuenta.

#### Cierre de período
1. En la lista, presione el icono de cierre en el período deseado.
2. Agregue una **observación** opcional (ej. "Cierre mensual sin novedades").
3. Confirme el cierre. Una vez cerrado un período, no se pueden registrar más movimientos en ese mes para esa cuenta. Para registrar operaciones adicionales deberá aperturar un nuevo período o solicitar la reapertura al administrador.

#### Columnas del listado

| Columna | Descripción |
|---|---|
| Cuenta Bancaria | Nombre y número de cuenta |
| Mes/Año | Período contable |
| Saldo Inicial | Saldo al abrir el mes |
| Total Ingresos | Suma de ingresos del mes |
| Total Egresos | Suma de egresos del mes |
| Saldo Final | Saldo calculado (Inicial + Ingresos - Egresos) |
| Estado | Abierto / Cerrado |
| Cerrado por | Usuario que realizó el cierre |
| Fecha de cierre | Fecha y hora del cierre |

---

## 7. Inventario — Activo Fijo

### 7.1 Listado de Activos

Tabla paginada con todos los activos fijos registrados. Botón **Crear** para agregar uno nuevo. Cada fila es clickeable para editar.

### 7.2 Formulario de Activo

| Campo | Descripción |
|---|---|
| Código de inventario | Código único del activo (generado automáticamente, solo lectura en edición) |
| Descripción | Nombre o descripción del activo |
| Marca | Seleccione la marca (ej. Dell, Sony, Toyota) |
| Modelo | Modelo específico del activo |
| Número de serie | Serie del activo |
| Color | Color del activo |
| Precio | Valor de adquisición |
| Proveedor | Socio comercial proveedor (búsqueda con autocompletado) |
| Factura No. | Número de factura de compra |
| Fecha de compra | Fecha de adquisición |
| Fecha de descargo | Fecha en que se dio de baja (si aplica) |
| Categoría | Categoría del activo (ej. Equipo de cómputo, Mobiliario) |
| Ubicación | Ubicación física (ej. Oficina central, Bodega) |
| Estado | Estado actual (Bueno, Regular, Dañado, En reparación, Dado de baja) |
| Notas | Observaciones adicionales |
| Archivo adjunto | Opcional: suba una imagen o documento PDF |
| Activo | Indica si el activo está operativo o fue dado de baja |

---

## 8. Socios Comerciales

### 8.1 Socios

Registro de personas o empresas con las que se comercia (clientes, proveedores, etc.). El formulario se despliega en un panel lateral (drawer).

#### Campos del formulario

| Campo | Descripción |
|---|---|
| Código | Código único del socio (generado automáticamente, solo lectura en edición) |
| Nombre | Nombre completo o razón social |
| Nombre comercial | Nombre de fantasía o comercial |
| Tipo de socio | Persona Natural o Jurídica |
| Categoría | Categoría del socio (ej. Mayorista, Minorista) |
| Roles | Roles que cumple: Cliente, Proveedor, Ambos (selección múltiple) |
| Email | Correo electrónico de contacto |
| Teléfono | Número de contacto |
| NIT | Número de Identificación Tributaria |
| NRC | Número de Registro de Contribuyente |
| DUI | Documento Único de Identidad (para personas naturales) |
| Pasaporte | Número de pasaporte (para extranjeros) |
| Dirección | Dirección física completa |
| País / Región / Ciudad / Distrito | Ubicación geográfica en cascada (al seleccionar un país se cargan sus regiones, etc.) |

> Nota: Al crear un socio, este aparecerá en los campos de autocompletado de Ingresos (clientes) y Egresos (proveedores) según los roles asignados.

### 8.2 Catálogos auxiliares de Socios

- **Categorías:** agrupación de socios (ej. Mayorista, Minorista, VIP).
- **Tipos:** clasificación por tipo (Persona Natural, Persona Jurídica).
- **Roles:** funciones del socio (Cliente, Proveedor). El rol determina si el socio aparece en los autocompletados de Ingresos o Egresos.

---

## 9. Catálogos de Configuración

Estos catálogos alimentan las listas desplegables en los formularios principales. Todos se gestionan mediante tablas con paginación y filtros, y se editan en ventanas modales (diálogos).

### 9.1 Bancos
Registro de instituciones bancarias.
- **Código** (máx. 2 caracteres, no editable tras crear).
- **Nombre** (máx. 100 caracteres).
- **Activo** — inhabilitar un banco lo oculta en los formularios de selección.

### 9.2 Cuentas Bancarias
Cuentas específicas por banco. Se editan en un panel lateral (drawer).

| Campo | Descripción |
|---|---|
| Nombre | Identificador interno de la cuenta |
| Número de cuenta | Número de cuenta bancaria (no editable tras crear) |
| Banco | Seleccione el banco |
| Tipo de cuenta | Ahorros o Corriente |
| Fecha de apertura | Fecha de creación de la cuenta |
| Saldo inicial | Saldo al momento del registro |
| Activo | Habilita o deshabilita la cuenta |

### 9.3 Tipos de Ingreso
Categorías para clasificar ingresos (ej. Venta, Servicio, Alquiler).
- **Código** (máx. 4 caracteres, no editable tras crear).
- **Nombre** (máx. 100 caracteres).
- **Categoría de socio** — opcional: asocia el tipo de ingreso a una categoría de socio específica.

### 9.4 Tipos de Egreso
Categorías para clasificar egresos (ej. Compra, Servicio público, Salario).
- **Código** (máx. 4 caracteres, no editable tras crear).
- **Nombre** (máx. 100 caracteres).

### 9.5 Tipos de Documento
Tipos de documentos financieros (Factura, Recibo, Nota de crédito, etc.).
- **Código** (máx. 4 caracteres, no editable tras crear).
- **Nombre** (máx. 100 caracteres).
- **Activo.**

### 9.6 Activos Fijos — Catálogos

- **Categoría de Activo:** clasificación del activo (ej. Equipo de cómputo, Mobiliario, Vehículo).
- **Ubicación de Activo:** lugar físico donde se encuentra (ej. Oficina central, Bodega, Sucursal).
- **Estado de Activo:** condición actual. Incluye bandera **Dado de baja** para activos fuera de servicio (Bueno, Regular, Dañado, En reparación, Dado de baja).
- **Marca:** marcas de los activos (ej. Dell, Sony, Toyota, Caterpillar).

---

## 10. Informes

### 10.1 Reporte Consolidado

Genera un resumen mensual detallado de ingresos y egresos agrupados por tipo.

**Parámetros:**
- **Cuenta bancaria:** seleccione la cuenta a reportar.
- **Mes y Año:** período del reporte.

**Estructura del reporte:**
- Encabezado con datos de la cuenta bancaria y período.
- Líneas detalladas con concepto, tipo y monto, agrupadas por tipo (ingresos/egresos).
- Subtotales por tipo de operación.
- Resumen final con total de ingresos, total de egresos y balance.
- **Gráfico de dona:** distribución visual del consolidado.

**Acciones:** Presione **Descargar PDF** para obtener una copia imprimible del reporte.

### 10.2 Reporte Detallado

Genera un listado detallado de todas las operaciones individuales (ingresos y egresos) en un período.

**Parámetros:**
- **Cuenta bancaria:** seleccione la cuenta.
- **Mes y Año:** período del reporte.
- **Tipo de operación:** Ingresos, Egresos o Todos.

**Estructura:**
- Tabla con cada operación: fecha, tipo, socio, referencia, número de cheque (si aplica), concepto e importe.
- Total calculado al pie de la tabla.
- Cada fila contiene un enlace para editar la operación directamente.

**Acciones:** Presione **Descargar PDF** para obtener una copia imprimible.

### 10.3 Libro Bancario (Banking Book)

Genera el libro bancario mensual con saldo corriente (running balance).

**Parámetros:**
- **Cuenta bancaria:** seleccione la cuenta.
- **Mes y Año:** período del reporte.

**Estructura:**
- Tabla cronológica con: fecha, tipo de transacción, concepto, referencia, número de cheque, débito, crédito y **saldo** actualizado línea por línea.
- El saldo inicial corresponde al saldo de apertura del período.
- Cada transacción actualiza el saldo de forma acumulativa.

**Acciones:** Presione **Descargar PDF** para obtener una copia imprimible.

---

## 11. Administración

### 11.1 Usuarios

Gestión de usuarios del sistema. Se editan en un panel lateral (drawer).

**Campos:**

| Campo | Descripción |
|---|---|
| Email | Correo electrónico del usuario (usado para iniciar sesión) |
| Nombre | Nombre completo del usuario |
| Contraseña | Solo al crear o restablecer; opcional en edición |
| Confirmar contraseña | Debe coincidir con la anterior |
| Roles | Selección múltiple de roles (Administrador, Usuario, etc.) |
| Activo | Habilitar o deshabilitar el acceso al sistema |

**Acciones:**
- **Crear usuario** — formulario completo con contraseña obligatoria.
- **Editar usuario** — haga clic en una fila de la tabla.
- **Eliminar usuario** — confirme la eliminación en el diálogo de confirmación.

### 11.2 Roles

Gestión de roles del sistema.

| Campo | Descripción |
|---|---|
| Nombre | Nombre del rol (ej. Administrador, Usuario, Auditor) |
| Nombre interno | Identificador único del rol usado en el sistema |
| Es administrador | Marque si este rol tiene permisos administrativos totales |

### 11.3 Permisos por Rol

Asignación detallada de permisos a cada rol mediante una matriz de permisos.

**Interfaz:**
- **Selector de rol:** elija el rol a configurar en la parte superior.
- **Tabla de matriz:** muestra módulos del sistema (filas) y acciones (columnas: Ver, Crear, Editar, Eliminar, Confirmar, Anular, Imprimir, etc.).
- **Casillas de verificación:** marque o desmarque permisos individuales. Al marcar un módulo completo, se seleccionan todas sus acciones.
- **Estados indeterminados:** si solo algunas acciones de un módulo están seleccionadas, la casilla del módulo se muestra parcialmente marcada.

**Funcionamiento:**
1. Seleccione un rol.
2. Marque las acciones permitidas para cada módulo.
3. Presione **Guardar** para aplicar los cambios.

**Restricciones:**
- El rol Administrador tiene todos los permisos por defecto.
- Los cambios aplican inmediatamente a todos los usuarios con ese rol (deberán volver a iniciar sesión para refrescar permisos).

### 11.4 Configuración de la Aplicación

Configuración global del sistema para el envío de correos electrónicos.

**Campos:**

| Campo | Descripción |
|---|---|
| Proveedor de email | Ninguno, SMTP, Resend o SendGrid |
| Servidor SMTP | Solo si el proveedor es SMTP |
| Puerto SMTP | Puerto del servidor SMTP |
| Usuario SMTP | Usuario de autenticación SMTP |
| Contraseña SMTP | Contraseña de autenticación SMTP |
| SSL | Habilita conexión segura SSL/TLS |
| Correo remitente | Dirección de correo que aparece como remitente |
| API Key | Clave API (para proveedores Resend o SendGrid) |
| API Email | Correo asociado a la API |

> Nota: Los campos se habilitan/deshabilitan automáticamente según el proveedor de email seleccionado.

---

## 12. Perfil de Usuario

### 12.1 Menú de usuario

Haga clic en su nombre (esquina superior derecha) para abrir el menú:

| Opción | Acción |
|---|---|
| Perfil | Ver información del perfil (próximamente) |
| Cambiar contraseña | Abre un diálogo para cambiar la contraseña |
| Cerrar sesión | Finaliza la sesión y redirige al login |

### 12.2 Cambiar contraseña

1. Seleccione **Cambiar contraseña** del menú de usuario.
2. Ingrese:
   - **Contraseña actual**
   - **Nueva contraseña**
   - **Confirmar nueva contraseña**
3. Presione **Guardar**.
4. Si el cambio es exitoso, verá un mensaje de confirmación.

---

## 13. Estructura de Navegación

### Árbol completo de rutas

```
/login                          → Login
/forgot-password                → Recuperar contraseña
/resetPassword                  → Restablecer contraseña
/app                            → Layout privado (requiere autenticación)
  /app/dashboard                → Dashboard
  /app/operation/ingreso        → Listado de Ingresos
  /app/operation/ingreso/create → Nuevo Ingreso
  /app/operation/ingreso/edit/:id → Editar Ingreso
  /app/operation/egreso         → Listado de Egresos
  /app/operation/egreso/create  → Nuevo Egreso
  /app/operation/egreso/edit/:id → Editar Egreso
  /app/operation/periodo        → Períodos (apertura/cierre)
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
  /app/admin/role-permission    → Permisos por Rol
  /app/admin/app-settings       → Configuración de la App
  /app/report/consolidated      → Reporte Consolidado
  /app/report/detail-operation  → Reporte Detallado
  /app/report/bankingbook       → Libro Bancario
  /app/notaccess                → Sin Acceso (403)
```

### Convenciones de la interfaz

- **Tablas:** todas las tablas tienen paginación, ordenamiento por columnas (clic en encabezado) y filtros de búsqueda por texto.
- **Formularios en diálogo:** catálogos simples (Bancos, Tipos, etc.) se editan en ventanas modales.
- **Formularios en panel lateral (drawer):** entidades complejas (Socios, Activos, Usuarios, Cuentas Bancarias) se editan en un drawer lateral que se desliza desde la derecha.
- **Formularios en página completa:** Ingresos y Egresos usan una página dedicada para crear/editar, con barra de estado y acciones contextuales según el estado del documento.
- **Búsqueda con autocompletado:** los campos de Socio en Ingresos/Egresos/Activos usan búsqueda inteligente mientras escribe.
- **Validación en tiempo real:** los formularios validan los campos mientras escribe, mostrando mensajes de error claros.
- **Cierre de período:** los meses cerrados no permiten nuevos movimientos en la cuenta correspondiente.

---

*Documento generado con base en el código fuente del proyecto. Para soporte técnico, contacte al administrador del sistema.*
