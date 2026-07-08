# Puesta en marcha — Gestión Contable

Esta app tiene dos modos, elegidos automáticamente según si configurás las variables
de entorno de SharePoint:

- **Modo local** (por defecto, sin configurar nada): guarda los datos en el
  `localStorage` de tu navegador. No hay login, no se comparte con el equipo.
  Sirve para probar la interfaz.
- **Modo SharePoint** (una vez completado este documento): cada persona inicia
  sesión con su cuenta de Microsoft 365, y las tareas/equipo/proyectos se leen y
  escriben en 3 Listas de SharePoint compartidas, en tiempo real.

## 0. Correr la app en modo local (para probar ya mismo)

```bash
npm install
npm run dev
```

Abrí la URL que muestra la terminal. No hace falta nada más.

---

## 1. Crear las 3 Listas de SharePoint

**Opción rápida (recomendada): script automático.** `scripts/create-sharepoint-lists.ps1`
crea las 3 listas con todas las columnas de una sola vez. Requiere el módulo
[PnP.PowerShell](https://pnp.github.io/powershell/) instalado en tu máquina:

```powershell
Install-Module PnP.PowerShell -Scope CurrentUser   # una sola vez
cd scripts
./create-sharepoint-lists.ps1 -siteUrl "https://disacsp.sharepoint.com/diur/DIUR-A06-00005776"
```

Te va a pedir iniciar sesión (usá tu cuenta de la empresa, la misma con la que
ya tenés acceso al sitio). Es seguro volver a correrlo: si una lista o columna
ya existe, la deja como está.

**Opción manual:** si preferís crearlas a mano, en tu sitio de SharePoint andá a
**Nuevo → Lista → Lista en blanco**. Creá estas tres, con estas columnas exactas
(los nombres importan: son los que usa el código).

> Nota respecto al documento de diseño original (`Implementacion SharePoint.dc.html`):
> ahí se sugería que **Responsable** fuera una columna de tipo **Persona** (ligada
> a las cuentas de Microsoft 365). Acá se usa en cambio una columna de tipo
> **Búsqueda (Lookup)** contra la lista **Equipo**. Es más simple de mantener,
> evita las limitaciones de la API de Graph con campos de tipo Persona, y sigue
> restringiendo el valor a la gente real de tu sector (la lista Equipo). También
> se agregó la columna **TipoProyecto** a Proyectos, que el documento original no
> incluía (se sumó después, en el chat de diseño, para distinguir proyectos
> recurrentes de extraordinarios). Se llama `TipoProyecto` y no `Tipo` porque
> `Tipo` es un nombre reservado por SharePoint y no se puede usar como columna.

### Lista: `Tareas`

| Columna | Tipo | Notas |
|---|---|---|
| Título | Texto (por defecto) | Nombre de la tarea |
| Descripcion | Texto (varias líneas) | Detalle de la tarea |
| Responsable | Búsqueda (Lookup) → lista `Equipo`, columna `Título` | Quién la ejecuta |
| Proyecto | Búsqueda (Lookup) → lista `Proyectos`, columna `Título` | Proyecto asociado |
| Prioridad | Elección | Opciones: `Alta`, `Media`, `Baja` |
| Estado | Elección | Opciones: `Pendiente`, `En progreso`, `En revisión`, `Completado` |
| Vencimiento | Fecha | Solo fecha (sin hora) |
| RecurrenteMensual | Sí/No | Marca las tareas que se repiten cada mes |

### Lista: `Equipo`

| Columna | Tipo | Notas |
|---|---|---|
| Título | Texto (por defecto) | Nombre y apellido |
| Rol | Texto | Cargo (ej: Analista Contable) |
| Color | Texto | Color hex de identificación (ej: `#00549E`) |

### Lista: `Proyectos`

| Columna | Tipo | Notas |
|---|---|---|
| Título | Texto (por defecto) | Nombre del proyecto |
| Descripcion | Texto | Descripción breve |
| Color | Texto | Color hex de acento |
| TipoProyecto | Elección | Opciones: `Recurrente`, `Extraordinario` |

Dale **permiso de edición** sobre estas listas (o sobre todo el sitio) a cada
integrante del equipo.

---

## 2. Registrar la aplicación en Entra ID (Azure AD)

Esto es lo que permite que cada persona inicie sesión con su cuenta de Microsoft
365 y que la app pueda leer/escribir en las Listas en su nombre. Lo hace alguien
con permisos de administrador en Entra ID (típicamente IT).

1. Andá a **portal.azure.com → Microsoft Entra ID → Registros de aplicaciones →
   Nuevo registro**.
2. Nombre: `Gestión Contable` (o el que prefieran).
3. Tipos de cuenta admitidos: **Cuentas solo en este directorio organizativo**
   (single tenant), salvo que necesiten otra cosa.
4. Tipo de plataforma de **Redireccionamiento**: `SPA` (Single-page application).
   URI: la URL donde va a vivir la app (ver sección "Hosting" abajo). Podés
   agregar varias URIs (por ejemplo una de desarrollo `http://localhost:5173` y
   otra definitiva).
5. Guardá y copiá el **ID de aplicación (cliente)** y el **ID de directorio
   (inquilino)** — van en el `.env` (`VITE_AZURE_CLIENT_ID`, `VITE_AZURE_TENANT_ID`).
6. **Permisos de API → Agregar un permiso → Microsoft Graph → Permisos
   delegados**, y agregá:
   - `User.Read`
   - `Sites.ReadWrite.All` (o, más restringido, `Sites.Selected` — en ese caso
     hay que además concederle acceso específico al sitio vía Graph o
     PowerShell; preguntale a IT cuál prefieren).
7. Si el tenant lo requiere, un administrador debe **otorgar consentimiento de
   administrador** para esos permisos.

---

## 3. Completar el archivo `.env`

Copiá `.env.example` a `.env` y completá:

```bash
cp .env.example .env
```

```
VITE_AZURE_CLIENT_ID=<ID de aplicación (cliente)>
VITE_AZURE_TENANT_ID=<ID de directorio (inquilino)>
VITE_AZURE_REDIRECT_URI=<URL final de la app, debe matchear el Redirect URI de Entra ID>

VITE_SP_SITE_HOSTNAME=<tuempresa>.sharepoint.com
VITE_SP_SITE_PATH=/sites/<NombreDelSitio>

VITE_SP_LIST_TAREAS=Tareas
VITE_SP_LIST_EQUIPO=Equipo
VITE_SP_LIST_PROYECTOS=Proyectos
```

En cuanto estas variables estén completas, al reiniciar la app (`npm run dev` o
un nuevo build) va a mostrar la pantalla de **"Iniciar sesión con Microsoft"** en
lugar de arrancar directo en modo local.

---

## 4. Alojar la app (hosting)

El código es una app web estática (`npm run build` genera una carpeta `dist/`
autocontenida). Cualquiera de estas opciones sirve; elegí la que IT prefiera:

- **Azure Static Web Apps**: la más simple de conectar con Entra ID (mismo
  ecosistema Microsoft), tiene capa gratuita.
- **Servidor interno / IIS**: sirve los archivos de `dist/` como sitio estático.
- **Como archivo en una biblioteca de SharePoint**: es posible, pero requiere
  configuración adicional para que SharePoint sirva el `index.html` con el
  tipo de contenido correcto en lugar de forzar la descarga — consultar con
  IT si este es el camino elegido.

Sea cual sea la elección, esa URL final es la que va en el Redirect URI de
Entra ID (paso 2) y en `VITE_AZURE_REDIRECT_URI`.

---

## 5. Notas de seguridad

Son datos contables e impositivos de una multinacional. Con este esquema no
salen del Microsoft 365 de la empresa (viven en SharePoint, el login es Entra
ID). Aun así, confirmá con IT/Sistemas el sitio, los permisos de las Listas, y
si exigen alguna configuración adicional de Conditional Access antes de cargar
datos reales.
