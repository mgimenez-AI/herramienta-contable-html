# Gestion Contable

Herramienta web para organizar tareas, proyectos y carga de trabajo de un equipo de Contabilidad e Impuestos.

Incluye tablero Kanban, calendario de vencimientos, vista de carga del equipo, gestion de proyectos, reporte imprimible, importacion masiva desde Excel/CSV y modo oscuro.

La aplicacion puede usarse de dos formas:

- **Modo local:** no requiere configuracion. Guarda los datos solo en el navegador de cada persona.
- **Modo SharePoint:** permite compartir datos del equipo mediante listas de SharePoint y autenticacion Microsoft 365.

## Tipo de proyecto

Este proyecto esta construido con **React + Vite**.

## Estructura general

```text
public/
  favicon.svg
scripts/
  create-sharepoint-lists.ps1
src/
  auth/         Configuracion de login Microsoft Entra ID
  components/   Vistas, cabecera, barra lateral y modales
  context/      Proveedor de datos de la app
  data/         Datos iniciales y constantes
  hooks/        Logica principal de la aplicacion
  services/     Guardado local y conexion con Microsoft Graph / SharePoint
  styles/       Estilos visuales
  utils/        Funciones auxiliares
index.html
package.json
vite.config.js
```

## Instalar dependencias

Necesitas tener instalado Node.js.

Luego, desde la carpeta del proyecto:

```bash
npm install
```

## Ejecutar localmente

```bash
npm run dev
```

La terminal mostrara una direccion local, normalmente:

```text
http://localhost:5173/
```

Abri esa direccion en el navegador.

Si no configuraste SharePoint, la app funciona en modo local y guarda los datos en el navegador.

## Generar version de produccion

```bash
npm run build
```

Esto crea una carpeta `dist/` con los archivos listos para publicar.

Para revisar localmente la version generada:

```bash
npm run preview
```

## Publicar en GitHub Pages

Este repositorio se llama `herramienta-contable-html`, por eso `vite.config.js` esta configurado con:

```js
base: '/herramienta-contable-html/'
```

Esa configuracion permite que los archivos funcionen correctamente cuando GitHub Pages publica el sitio en:

```text
https://mgimenez-AI.github.io/herramienta-contable-html/
```

Pasos sugeridos:

1. Revisar y aprobar el Pull Request hacia `main`.
2. En GitHub, entrar a **Settings > Pages**.
3. Elegir una estrategia de publicacion:
   - usar GitHub Actions para construir con `npm install` y `npm run build`;
   - o publicar manualmente el contenido generado en `dist/`.
4. Confirmar que la pagina publicada carga correctamente.

Nota: si en el futuro se publica en un dominio propio o en la raiz de una cuenta de GitHub Pages, habra que revisar el valor de `base` en `vite.config.js`.

## Conectar con SharePoint

La configuracion completa esta en [SETUP.md](./SETUP.md).

Resumen:

1. Crear las listas de SharePoint requeridas.
2. Registrar una aplicacion en Microsoft Entra ID.
3. Copiar `.env.example` a `.env`.
4. Completar las variables `VITE_*` en `.env`.
5. Ejecutar nuevamente la app.

Importante: el archivo `.env` real no debe subirse al repositorio.

## Advertencias para usuario no tecnico

- Si solo queres probar la herramienta, no necesitas configurar SharePoint.
- En modo local, los datos quedan guardados en tu navegador y no los ve el resto del equipo.
- Para datos reales o compartidos, coordina la configuracion de SharePoint y Microsoft Entra ID con IT/Sistemas.
- No compartas ni subas claves, credenciales ni archivos `.env` reales.

## Errores frecuentes

**La terminal dice que `npm` no existe**

Instala Node.js y volve a abrir la terminal.

**La pagina queda en blanco despues de publicar en GitHub Pages**

Revisa que `vite.config.js` tenga:

```js
base: '/herramienta-contable-html/'
```

Despues ejecuta nuevamente:

```bash
npm run build
```

**No aparece el login de Microsoft**

La app entra en modo SharePoint solo si estan completas las variables de entorno necesarias. Revisa `.env` y `SETUP.md`.

**Los datos no se comparten con otras personas**

Probablemente estas usando modo local. Para compartir datos hay que completar la configuracion de SharePoint.

**Error de permisos con Microsoft Graph o SharePoint**

Revisa que la aplicacion registrada en Entra ID tenga permisos delegados adecuados y que el usuario tenga acceso a las listas de SharePoint.

## Comandos disponibles

```bash
npm run dev      # iniciar en modo desarrollo
npm run build    # generar version de produccion
npm run preview  # revisar la version de produccion
npm run lint     # revisar el codigo con oxlint
```
