# Gestion Contable

Herramienta web para organizar tareas, proyectos, vencimientos y carga de trabajo de un equipo contable.

Esta version esta pensada como demo publica y simple: no usa SharePoint ni base de datos externa. Los datos compartidos viven en un archivo JSON dentro del propio repositorio:

```text
data/app-data.json
```

## Como funciona el guardado

- La app lee los datos desde `data/app-data.json`.
- Cuando alguien crea, edita o elimina datos, la app actualiza ese archivo usando la API de GitHub.
- Cada guardado genera un commit en el repositorio.
- Para guardar cambios desde el navegador hace falta un token de GitHub con permiso **Contents: Read and write**.
- Si no hay token, la app puede leer datos publicos, pero no puede guardar cambios compartidos.

Esta solucion es simple y sirve para una demo con datos ficticios. No usarla con informacion sensible.

## Estructura

```text
data/
  app-data.json          Datos compartidos de la demo
public/
  favicon.svg
src/
  components/           Pantallas, cabecera, barra lateral y modales
  context/              Proveedor de datos
  data/                 Datos iniciales de respaldo
  hooks/                Logica principal de la app
  services/             Almacenamiento local y almacenamiento en GitHub
  styles/               Estilos
  utils/                Funciones auxiliares
index.html
package.json
vite.config.js
```

## Instalar dependencias

Necesitas Node.js instalado.

```bash
npm install
```

## Ejecutar localmente

```bash
npm run dev
```

La terminal mostrara una URL local, normalmente:

```text
http://localhost:5173/
```

## Generar version de produccion

```bash
npm run build
```

Esto crea la carpeta `dist/`.

Para revisarla:

```bash
npm run preview
```

## Publicar en GitHub Pages

El proyecto ya tiene Vite configurado para el repositorio:

```js
base: '/herramienta-contable-html/'
```

Pasos:

1. Hacer merge del Pull Request a `main`.
2. En GitHub, ir a **Settings > Pages**.
3. Configurar GitHub Pages para publicar el sitio.
4. Usar una GitHub Action o publicar el contenido generado por `npm run build`.

La URL esperada sera:

```text
https://mgimenez-AI.github.io/herramienta-contable-html/
```

## Configuracion de GitHub como almacenamiento

El archivo `.env.example` trae los valores base:

```text
VITE_DATA_BACKEND=github
VITE_GITHUB_OWNER=mgimenez-AI
VITE_GITHUB_REPO=herramienta-contable-html
VITE_GITHUB_BRANCH=main
VITE_GITHUB_DATA_PATH=data/app-data.json
```

Para guardar cambios desde la app, crea un token de GitHub con permiso sobre este repositorio:

```text
Contents: Read and write
```

La primera vez que intentes guardar un cambio, la app va a pedir ese token y lo guardara en el navegador.

## Advertencias

- Esta solucion es deliberadamente simple.
- El repo publico permite que cualquiera vea `data/app-data.json`.
- Si varias personas editan exactamente al mismo tiempo, puede aparecer un conflicto de guardado. En ese caso, recargar la pagina y repetir el cambio.
- No subas datos reales, claves, contrasenas ni informacion sensible.
- Para una version productiva conviene reemplazar esto por una API segura o una base de datos.

## Errores frecuentes

**La app no guarda cambios**

Falta el token de GitHub o el token no tiene permiso `Contents: Read and write`.

**La app carga datos viejos**

Recarga la pagina. GitHub Pages y el navegador pueden cachear contenido por unos minutos.

**La pagina queda en blanco en GitHub Pages**

Revisar que `vite.config.js` tenga:

```js
base: '/herramienta-contable-html/'
```

**No aparece el archivo `data/app-data.json` actualizado**

Cada guardado crea un commit. Revisar la pestaña **Commits** del repositorio y confirmar que el token tenga permisos de escritura.

## Comandos disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```
