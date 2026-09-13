import { getStoredAccessToken } from "../../auth/store/authStorage.js";

function getContactRestBaseUrl() {
  const explicitBaseUrl = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_BACKEND_BASE_URL ?? "";

  if (explicitBaseUrl) {
    return `${explicitBaseUrl}`.replace(/\/+$/, "");
  }

  const graphqlUrl =
    import.meta.env.VITE_GRAPHQL_API_URL ??
    import.meta.env.VITE_GRAPHQL_URL ??
    "https://api.gocatering.no/graphql/";

  return `${graphqlUrl}`.replace(/\/graphql\/?$/i, "").replace(/\/+$/, "");
}

async function parseJsonResponse(response) {
  const rawBody = await response.text();

  try {
    return rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return null;
  }
}

function getFirstArray(payload) {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.inquiries)) return payload.data.inquiries;
  if (Array.isArray(payload?.inquiries)) return payload.inquiries;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function normalizeDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? `${value}` : date.toISOString();
}

function formatDate(value) {
  const normalized = normalizeDate(value);
  if (!normalized) return "Not available";

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return normalized;

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function normalizeStatus(value) {
  const normalized = `${value ?? ""}`.trim().toUpperCase();

  if (["NEW", "OPEN", "PENDING"].includes(normalized)) return "Open";
  if (["IN_PROGRESS", "IN PROGRESS", "REVIEWING"].includes(normalized)) return "In Progress";
  if (["RESOLVED", "CLOSED", "DONE"].includes(normalized)) return "Resolved";
  return normalized ? normalized.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "Open";
}

function normalizeInquiry(item) {
  const requester = item?.requester || item?.customer || item?.user || {};
  const name = item?.name || requester.fullName || requester.name || "Unknown sender";
  const email = item?.email || requester.email || "";
  const createdAt = item?.createdAt || item?.submittedAt || item?.created_on || item?.created || "";

  return {
    id: `${item?.id ?? item?.ticketId ?? item?.uuid ?? `${email}-${createdAt}`}`,
    ticketId: `${item?.ticketId ?? item?.supportTicketId ?? item?.ticket?.id ?? ""}`,
    name,
    email,
    company: item?.company || requester.company || "",
    phone: item?.phone || requester.phone || "",
    topic: item?.topic || item?.category || item?.subject || "General question",
    status: normalizeStatus(item?.status || item?.ticket?.status),
    message: item?.message || item?.description || item?.body || "",
    source: item?.source || "web-contact-page",
    locale: item?.locale || "",
    pageUrl: item?.pageUrl || item?.page_url || "",
    createdAt: normalizeDate(createdAt),
    createdAtLabel: formatDate(createdAt),
  };
}

function buildQueryString(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && `${value}`.trim() !== "") {
      params.set(key, value);
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getAdminContactInquiriesRequest(filters = {}) {
  const accessToken = getStoredAccessToken();

  if (!accessToken) {
    const error = new Error("Your session has expired. Please log in again.");
    error.isAuthenticationError = true;
    throw error;
  }

  const page = Number(filters.page || 1);
  const pageSize = Number(filters.pageSize || 10);
  const url = `${getContactRestBaseUrl()}/api/contact/inquiries${buildQueryString({
    search: filters.search,
    status: filters.status,
    topic: filters.topic,
    page,
    pageSize,
  })}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `JWT ${accessToken}`,
    },
  });

  const payload = await parseJsonResponse(response);

  if (response.status === 404 || response.status === 405) {
    const error = new Error("Admin contact inquiry list API is not available yet.");
    error.missingApi = true;
    throw error;
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || "Unable to load contact form responses.");
  }

  const items = getFirstArray(payload).map(normalizeInquiry);
  const pageInfo = payload?.pageInfo || payload?.data?.pageInfo || payload?.pagination || {};
  const totalItems = Number(pageInfo.totalItems ?? pageInfo.total ?? payload?.total ?? payload?.data?.total ?? items.length);
  const totalPages = Number(pageInfo.totalPages ?? Math.max(1, Math.ceil(totalItems / pageSize)));

  return {
    items,
    pageInfo: {
      page: Number(pageInfo.page ?? page),
      pageSize: Number(pageInfo.pageSize ?? pageInfo.limit ?? pageSize),
      totalItems,
      totalPages,
      hasNextPage: Boolean(pageInfo.hasNextPage ?? page < totalPages),
      hasPreviousPage: Boolean(pageInfo.hasPreviousPage ?? page > 1),
    },
  };
}
