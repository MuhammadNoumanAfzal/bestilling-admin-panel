import { isAllowedAdminRole } from "../authConfig.js";

const AUTH_STORAGE_KEY = "bestilling-admin-auth";
let inMemorySession = null;

function createEmptySession() {
  return {
    accessToken: null,
    user: null,
  };
}

function isValidAdminSession(session) {
  return Boolean(
    session?.accessToken &&
      session?.user?.id &&
      session?.user?.email &&
      session?.user?.isAdmin &&
      isAllowedAdminRole(session?.user?.role),
  );
}

export function loadStoredAuthSession() {
  if (isValidAdminSession(inMemorySession)) {
    return inMemorySession;
  }

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

    if (!isValidAdminSession({ accessToken, user })) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      inMemorySession = createEmptySession();
      return createEmptySession();
    }

    inMemorySession = {
      accessToken,
      user,
    };

    return inMemorySession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    inMemorySession = createEmptySession();
    return createEmptySession();
  }
}

export function persistAuthSession(session) {
  inMemorySession = isValidAdminSession(session) ? session : createEmptySession();

  if (typeof window === "undefined") {
    return;
  }

  if (!isValidAdminSession(session)) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAuthSession() {
  inMemorySession = createEmptySession();

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getStoredAccessToken() {
  return inMemorySession?.accessToken || loadStoredAuthSession().accessToken || null;
}
