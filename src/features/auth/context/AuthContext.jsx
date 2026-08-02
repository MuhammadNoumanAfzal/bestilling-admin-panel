import { useEffect, useMemo, useState } from "react";
import {
  getCurrentAdminRequest,
  loginAdminRequest,
} from "../api/authApi.js";
import {
  clearStoredAuthSession,
  loadStoredAuthSession,
  persistAuthSession,
} from "../store/authStorage.js";
import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadStoredAuthSession());
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (session?.accessToken && session?.user) {
      persistAuthSession(session);
      return;
    }

    clearStoredAuthSession();
  }, [session]);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      if (!session?.accessToken) {
        if (isMounted) {
          setIsInitializing(false);
        }
        return;
      }

      try {
        const user = await getCurrentAdminRequest(session.accessToken);

        if (isMounted) {
          setSession({
            accessToken: session.accessToken,
            user,
          });
        }
      } catch {
        if (isMounted) {
          clearStoredAuthSession();
          setSession({
            accessToken: null,
            user: null,
          });
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [session?.accessToken]);

  async function login(credentials) {
    const nextSession = await loginAdminRequest({
      email: credentials?.email,
      password: credentials?.password,
    });

    setSession(nextSession);
    return nextSession;
  }

  async function logout() {
    setSession({
      accessToken: null,
      user: null,
    });
    clearStoredAuthSession();
  }

  function updateSessionUser(userUpdates) {
    setSession((current) => {
      if (!current?.accessToken || !current?.user) {
        return current;
      }

      return {
        ...current,
        user: {
          ...current.user,
          ...userUpdates,
        },
      };
    });
  }

  const value = useMemo(
    () => ({
      isInitializing,
      isAuthenticated: Boolean(session?.accessToken && session?.user),
      accessToken: session?.accessToken || null,
      user: session?.user || null,
      login,
      logout,
      updateSessionUser,
    }),
    [isInitializing, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
