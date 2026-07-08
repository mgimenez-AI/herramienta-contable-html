import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig, GRAPH_SCOPES, isSharePointConfigured } from './msalConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const msal = useMemo(() => (isSharePointConfigured ? new PublicClientApplication(msalConfig) : null), []);
  const [account, setAccount] = useState(null);
  const [initializing, setInitializing] = useState(isSharePointConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!msal) return;
    let cancelled = false;
    (async () => {
      try {
        await msal.initialize();
        const result = await msal.handleRedirectPromise();
        if (cancelled) return;
        const active = result?.account || msal.getAllAccounts()[0] || null;
        if (active) {
          msal.setActiveAccount(active);
          setAccount(active);
        }
      } catch (e) {
        setError(e?.message || 'Error inicializando el login de Microsoft.');
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [msal]);

  const login = useCallback(async () => {
    if (!msal) throw new Error('SharePoint no está configurado todavía (ver SETUP.md).');
    await msal.loginRedirect({ scopes: GRAPH_SCOPES });
  }, [msal]);

  const logout = useCallback(async () => {
    if (!msal) return;
    await msal.logoutRedirect();
  }, [msal]);

  const getAccessToken = useCallback(async () => {
    if (!msal) throw new Error('SharePoint no está configurado todavía (ver SETUP.md).');
    const active = msal.getActiveAccount();
    if (!active) throw new Error('No hay una sesión iniciada.');
    try {
      const res = await msal.acquireTokenSilent({ scopes: GRAPH_SCOPES, account: active });
      return res.accessToken;
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        await msal.acquireTokenRedirect({ scopes: GRAPH_SCOPES });
        return null;
      }
      throw e;
    }
  }, [msal]);

  const value = { account, initializing, error, login, logout, getAccessToken, isAuthenticated: !!account };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
