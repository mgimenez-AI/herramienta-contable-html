// Configuración de Entra ID (Azure AD). Ver SETUP.md para cómo obtener estos valores.
export const AZURE_CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID || '';
export const AZURE_TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID || '';
export const AZURE_REDIRECT_URI = import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin;

export const isSharePointConfigured = Boolean(
  AZURE_CLIENT_ID && AZURE_TENANT_ID && import.meta.env.VITE_SP_SITE_HOSTNAME && import.meta.env.VITE_SP_SITE_PATH
);

export const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
    redirectUri: AZURE_REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

// Sites.ReadWrite.All (o Sites.Selected, más restringido) + User.Read.
// Ver SETUP.md, sección "Permisos de API".
export const GRAPH_SCOPES = ['User.Read', 'Sites.ReadWrite.All'];
