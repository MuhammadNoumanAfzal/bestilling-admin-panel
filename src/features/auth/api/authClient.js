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

  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload, "Unable to reach the authentication service right now."),
    );
  }

  if (payload?.errors?.length) {
    const error = new Error(getErrorMessage(payload, "Authentication request failed."));
    error.isAuthenticationError = isAuthenticationError(payload);
    error.isAuthorizationError = isAuthorizationError(payload);
    throw error;
  }

  return payload?.data ?? null;
}
