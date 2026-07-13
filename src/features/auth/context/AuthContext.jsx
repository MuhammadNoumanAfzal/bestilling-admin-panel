import { useEffect, useMemo, useState } from "react";
import { ADMIN_DEMO_CREDENTIALS, ADMIN_DEMO_USER } from "../authConfig.js";
import {
  clearStoredAuthSession,
  loadStoredAuthSession,
  persistAuthSession,
} from "../utils/authSession.js";
import { AuthContext } from "./authContext.js";

function buildAccessToken() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `admin-${crypto.randomUUID()}`;
  }

  return `admin-${Date.now()}`;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadStoredAuthSession());

  useEffect(() => {
    if (session?.accessToken && session?.user) {
      persistAuthSession(session);
      return;
    }

    clearStoredAuthSession();
  }, [session]);

  async function login(credentials) {
    const email = String(credentials?.email || "").trim().toLowerCase();
    const password = String(credentials?.password || "");

    if (email !== ADMIN_DEMO_CREDENTIALS.email || password !== ADMIN_DEMO_CREDENTIALS.password) {
      throw new Error("Use the demo admin credentials to sign in.");
    }

    const nextSession = {
      accessToken: buildAccessToken(),
      user: {
        ...ADMIN_DEMO_USER,
        lastLogin: new Date().toISOString(),
      },
    };

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

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session?.accessToken && session?.user),
      accessToken: session?.accessToken || null,
      user: session?.user || null,
      login,
      logout,
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
