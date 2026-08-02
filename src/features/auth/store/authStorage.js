import { isAllowedAdminRole } from "../authConfig.js";

const AUTH_STORAGE_KEY = "bestilling-admin-auth";

function createEmptySession() {
  return {
    accessToken: null,
    user: null,
  };
}

export function loadStoredAuthSession() {
  if (typeof window === "undefined") {
    return createEmptySession();
  }

  try {
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawSession) {
      return createEmptySession();
    }

    const parsedSession = JSON.parse(rawSession);
    const accessToken = parsedSession?.accessToken || null;
    const user = parsedSession?.user || null;

    if (!accessToken || !user?.id || !user?.email || !user?.isAdmin || !isAllowedAdminRole(user?.role)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return createEmptySession();
    }

    return {
      accessToken,
      user,
    };
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return createEmptySession();
  }
}

export function persistAuthSession(session) {
  if (typeof window === "undefined") {
    return;
  }

  if (
    !session?.accessToken ||
    !session?.user?.id ||
    !session?.user?.email ||
    !session?.user?.isAdmin ||
    !isAllowedAdminRole(session?.user?.role)
  ) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
