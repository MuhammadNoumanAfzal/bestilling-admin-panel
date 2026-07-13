import { ADMIN_DEMO_USER } from "../authConfig.js";

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
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return createEmptySession();
    }

    const parsed = JSON.parse(raw);
    const accessToken = parsed?.accessToken || null;
    const user = parsed?.user || null;

    if (!accessToken || !user?.id || user.role !== "admin") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return createEmptySession();
    }

    return {
      accessToken,
      user: {
        ...ADMIN_DEMO_USER,
        ...user,
      },
    };
  } catch {
    return createEmptySession();
  }
}

export function persistAuthSession(session) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session?.accessToken || !session?.user?.id) {
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
