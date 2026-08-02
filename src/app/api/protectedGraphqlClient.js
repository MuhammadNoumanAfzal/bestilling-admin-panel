import { executeGraphqlRequest } from "../../features/auth/api/authClient.js";
import { clearStoredAuthSession, loadStoredAuthSession } from "../../features/auth/store/authStorage.js";

function createSessionExpiredError() {
  const error = new Error("Your session has expired. Please log in again.");
  error.isAuthenticationError = true;
  return error;
}

export function getCurrentAccessToken() {
  return loadStoredAuthSession().accessToken || null;
}

export async function executeProtectedGraphqlRequest(query, variables, options = {}) {
  const accessToken = options.accessToken || getCurrentAccessToken();

  if (!accessToken) {
    clearStoredAuthSession();
    throw createSessionExpiredError();
  }

  try {
    return await executeGraphqlRequest(query, variables, {
      ...options,
      accessToken,
    });
  } catch (error) {
    if (error?.isAuthenticationError) {
      clearStoredAuthSession();
    }

    throw error;
  }
}
