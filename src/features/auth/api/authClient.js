const DEFAULT_GRAPHQL_API_URL = "https://api.gocatering.no/graphql/";

const GRAPHQL_API_URL =
  import.meta.env.VITE_GRAPHQL_API_URL ??
  import.meta.env.VITE_GRAPHQL_URL ??
  DEFAULT_GRAPHQL_API_URL;

function getErrorMessage(payload, fallbackMessage) {
  const firstError = payload?.errors?.[0];
  const fieldErrors = firstError?.extensions?.errors;

  if (fieldErrors && typeof fieldErrors === "object") {
    const firstFieldMessage = Object.values(fieldErrors).find(
      (value) => typeof value === "string" && value.trim(),
    );

    if (firstFieldMessage) {
      return firstFieldMessage;
    }
  }

  if (firstError?.message) {
    return firstError.message;
  }

  return fallbackMessage;
}

export function isAuthenticationError(payload) {
  const firstError = payload?.errors?.[0];
  const code = String(firstError?.extensions?.code || "").toLowerCase();
  const message = String(firstError?.message || "").toLowerCase();

  return (
    code === "unauthorized" ||
    code === "unauthenticated" ||
    code === "invalid_token" ||
    code === "authentication_failed" ||
    message.includes("authentication failed") ||
    message.includes("invalid token") ||
    message.includes("expired token") ||
    message.includes("token expired") ||
    message.includes("token is invalid") ||
    message.includes("login required") ||
    message.includes("session expired") ||
    message.includes("please log in") ||
    message.includes("login required")
  );
}

export function isAuthorizationError(payload) {
  const firstError = payload?.errors?.[0];
  const code = String(firstError?.extensions?.code || "").toLowerCase();
  const message = String(firstError?.message || "").toLowerCase();

  return (
    code === "permission_denied" ||
    message.includes("not authorized") ||
    message.includes("not authorised") ||
    message.includes("permission denied") ||
    message.includes("insufficient permissions")
  );
}

export async function executeGraphqlRequest(query, variables, options = {}) {
  if (!GRAPHQL_API_URL) {
    throw new Error(
      "Missing GraphQL endpoint. Add VITE_GRAPHQL_API_URL or VITE_GRAPHQL_URL to your environment configuration.",
    );
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (options.accessToken) {
    headers.Authorization = `JWT ${options.accessToken}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  let response;
  let payload;
  try {
    response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({ query, variables }),
    });
    try {
      payload = await response.json();
    } catch (error) {
      if (controller.signal.aborted) throw error;
      payload = null;
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("The server took too long to respond. Please try again. If you were updating a payment, refresh its status before retrying.");
    }
    throw new Error("Unable to connect to the server. Check your connection and try again.", { cause: error });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const error = new Error(getErrorMessage(payload,
      response.status === 401 ? "Your session has expired. Please log in again."
        : response.status === 403 ? "You do not have permission to access this resource."
        : "The server is temporarily unavailable. Please try again shortly.",
    ));
    error.isAuthenticationError = response.status === 401;
    error.isAuthorizationError = response.status === 403;
    throw error;
  }

  if (payload?.errors?.length) {
    const error = new Error(getErrorMessage(payload, "Authentication request failed."));
    error.isAuthenticationError = isAuthenticationError(payload);
    error.isAuthorizationError = isAuthorizationError(payload);
    throw error;
  }

  if (!payload?.data || typeof payload.data !== "object") {
    throw new Error("The server returned an invalid response. Please try again shortly.");
  }
  return payload.data;
}
