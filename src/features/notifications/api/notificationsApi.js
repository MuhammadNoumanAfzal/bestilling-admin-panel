import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADMIN_ORDER_NOTIFICATIONS_QUERY,
  ADMIN_FINANCE_NOTIFICATIONS_QUERY,
  FINANCE_NOTIFICATION_DETAIL_QUERY,
  MARK_ALL_FINANCE_NOTIFICATIONS_READ_MUTATION,
  MARK_FINANCE_NOTIFICATION_READ_MUTATION,
} from "./notificationsQueries.js";

const ADMIN_FINANCE_AUDIENCE = "ADMIN";

function appendNotificationContext(path, notification) {
  const normalizedPath = String(path || "").trim();

  if (!normalizedPath || /^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  const notificationId = String(notification?.id || "").trim();
  if (!notificationId) {
    return normalizedPath;
  }

  const separator = normalizedPath.includes("?") ? "&" : "?";
  return `${normalizedPath}${separator}notificationId=${encodeURIComponent(notificationId)}`;
}

function formatDisplayDate(value, options = {}) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: options.includeTime === false ? undefined : "short",
  }).format(date);
}

function formatAudienceLabel(audienceType) {
  switch (String(audienceType || "").toUpperCase()) {
    case "CLIENT":
    case "CUSTOMER":
      return "Customers";
    case "VENDOR":
      return "Vendors";
    case "ADMIN":
      return "Admins";
    default:
      return "Finance";
  }
}

function formatTypeLabel(code) {
  return String(code || "")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatStatusLabel(item) {
  if (item?.isRead) {
    return "Read";
  }

  return "Unread";
}

function deriveChannels(item) {
  return ["in-app"];
}

function sortNotificationsByCreatedAtDesc(items) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left?.createdAt || 0).getTime();
    const rightTime = new Date(right?.createdAt || 0).getTime();
    return rightTime - leftTime;
  });
}

function getNotificationDedupKey(item) {
  const entityType = String(item?.entityType || item?.metadata?.type || "").trim().toUpperCase();
  const entityId = String(item?.entityId || item?.orderId || item?.payoutId || item?.invoiceId || "").trim();
  const createdAt = String(item?.createdAt || "").trim();
  const title = String(item?.title || "").trim().toLowerCase();
  const message = String(item?.message || "").trim().toLowerCase();

  return [entityType, entityId, createdAt, title, message].join("|");
}

function dedupeNotifications(items = []) {
  const seenKeys = new Set();

  return items.filter((item) => {
    const key = getNotificationDedupKey(item);

    if (seenKeys.has(key)) {
      return false;
    }

    seenKeys.add(key);
    return true;
  });
}

function formatRelativeTime(value) {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffInSeconds);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 60) {
    return rtf.format(diffInSeconds, "second");
  }

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, "hour");
  }

  return rtf.format(Math.round(diffInHours / 24), "day");
}

function buildAdminNotificationTarget(item) {
  if (item?.payoutId) {
    return appendNotificationContext(
      `/payouts/${encodeURIComponent(item.payoutId)}`,
      item,
    );
  }

  if (item?.orderId) {
    return appendNotificationContext(
      `/orders/${encodeURIComponent(item.orderId)}`,
      item,
    );
  }

  if (item?.invoiceId) {
    return appendNotificationContext(
      `/payouts?invoiceId=${encodeURIComponent(item.invoiceId)}`,
      item,
    );
  }

  return appendNotificationContext("/notifications", item);
}

export function resolveAdminNotificationTarget(notification) {
  const actionUrl = String(notification?.actionUrl || "").trim();
  const entityId = String(notification?.entityId || "").trim();
  const entityType = String(notification?.entityType || "").trim().toUpperCase();
  const type = String(notification?.type || "").trim().toUpperCase();

  if (/^https?:\/\//i.test(actionUrl)) {
    return actionUrl;
  }

  if (actionUrl) {
    let normalizedPath = actionUrl.replace(/^\/admin\b/i, "");

    if (entityId && normalizedPath.includes(":id")) {
      normalizedPath = normalizedPath.replace(":id", encodeURIComponent(entityId));
    }

    if (normalizedPath && normalizedPath !== "/" && !normalizedPath.includes(":")) {
      return appendNotificationContext(normalizedPath, notification);
    }
  }

  if (entityType === "SUPPORT_TICKET" || type === "SUPPORT_REPLY" || type === "SUPPORT_TICKET_UPDATED") {
    return appendNotificationContext(
      entityId ? `/support/${encodeURIComponent(entityId)}` : "/support",
      notification,
    );
  }

  if (entityType === "ORDER" || type === "ORDER_UPDATED" || type === "ORDER_CANCELLED") {
    return appendNotificationContext(
      entityId ? `/orders/${encodeURIComponent(entityId)}` : "/orders",
      notification,
    );
  }

  if (entityType === "PAYOUT" || type === "PAYOUT_UPDATED") {
    return appendNotificationContext(
      entityId ? `/payouts/${encodeURIComponent(entityId)}` : "/payouts",
      notification,
    );
  }

  if (entityType === "INVOICE") {
    return appendNotificationContext(
      entityId ? `/payouts?invoiceId=${encodeURIComponent(entityId)}` : "/payouts",
      notification,
    );
  }

  if (entityType === "VENDOR" || type === "VENDOR_APPROVED") {
    return appendNotificationContext(
      entityId ? `/vendors/${encodeURIComponent(entityId)}` : "/vendors",
      notification,
    );
  }

  if (entityType === "CUSTOMER") {
    return appendNotificationContext(
      entityId ? `/customers/${encodeURIComponent(entityId)}` : "/customers",
      notification,
    );
  }

  return appendNotificationContext("/notifications", notification);
}

function buildMetadata(item) {
  return {
    invoiceId: item?.invoiceId || "",
    orderId: item?.orderId || "",
    payoutId: item?.payoutId || "",
    paymentStatus: item?.paymentStatus || "",
    settlementStatus: item?.settlementStatus || "",
    payoutStatus: item?.payoutStatus || "",
    actorType: item?.actorType || "",
    actorId: item?.actorId || "",
    actorName: item?.actorName || "",
    note: item?.note || "",
    rejectionReason: item?.rejectionReason || "",
    receiptUrl: item?.receiptUrl || "",
    transferReference: item?.transferReference || "",
    paymentDate: item?.paymentDate || "",
    audience: item?.audience || "",
    type: item?.type || "",
  };
}

function buildMessage(item) {
  const fragments = [String(item?.message || "").trim()];

  if (item?.note) {
    fragments.push(`Note: ${item.note}`);
  }

  if (item?.rejectionReason) {
    fragments.push(`Reason: ${item.rejectionReason}`);
  }

  if (item?.transferReference) {
    fragments.push(`Reference: ${item.transferReference}`);
  }

  return fragments.filter(Boolean).join(" ");
}

function normalizeNotification(item) {
  const metadata = buildMetadata(item);
  const statusLabel = formatStatusLabel(item);

  return {
    id: item?.id ?? "",
    title: item?.title ?? "Finance notification",
    subject: item?.title ?? "Finance notification",
    message: buildMessage(item),
    code: item?.type ?? "",
    type: item?.type ?? "",
    typeLabel: formatTypeLabel(item?.type),
    status: statusLabel.toUpperCase(),
    statusLabel,
    createdAt: item?.createdAt ?? "",
    createdAtDisplay: formatDisplayDate(item?.createdAt),
    readAt: "",
    readAtDisplay: item?.isRead ? "Opened in app" : "",
    scheduledAt: formatDisplayDate(item?.createdAt),
    audience: formatAudienceLabel(item?.audience),
    channels: deriveChannels(item),
    sendEmail: false,
    sendPush: false,
    sendInApp: true,
    sentBy: item?.actorName || "Finance system",
    actionUrl: buildAdminNotificationTarget(item),
    entityId: item?.payoutId || item?.orderId || item?.invoiceId || "",
    entityType: item?.payoutId ? "PAYOUT" : item?.orderId ? "ORDER" : "INVOICE",
    entityCode: item?.invoiceId || item?.orderId || item?.payoutId || "",
    priority: item?.isRead ? "normal" : "high",
    audienceType: item?.audience ?? "",
    audienceId: "",
    actorType: item?.actorType ?? "",
    actorId: item?.actorId ?? "",
    isRead: Boolean(item?.isRead),
    isArchived: false,
    metadata,
    rawMetadata: Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : "",
    timeLabel: formatRelativeTime(item?.createdAt),
    note: metadata.note,
    rejectionReason: metadata.rejectionReason,
    receiptUrl: metadata.receiptUrl,
    transferReference: metadata.transferReference,
    paymentDate: metadata.paymentDate,
    invoiceId: metadata.invoiceId,
    orderId: metadata.orderId,
    payoutId: metadata.payoutId,
    paymentStatus: metadata.paymentStatus,
    settlementStatus: metadata.settlementStatus,
    payoutStatus: metadata.payoutStatus,
  };
}

function normalizeOrderNotification(item) {
  const statusLabel = formatStatusLabel(item);
  const typeLabel = formatTypeLabel(item?.type || "NEW_ORDER_PLACED");

  return {
    id: item?.id ?? "",
    title: item?.title ?? "Order notification",
    subject: item?.title ?? "Order notification",
    message: String(item?.message || "").trim() || "A new order requires admin attention.",
    code: item?.type ?? "NEW_ORDER_PLACED",
    type: item?.type ?? "NEW_ORDER_PLACED",
    typeLabel,
    status: statusLabel.toUpperCase(),
    statusLabel,
    createdAt: item?.createdAt ?? "",
    createdAtDisplay: formatDisplayDate(item?.createdAt),
    readAt: "",
    readAtDisplay: item?.isRead ? "Opened in app" : "",
    scheduledAt: formatDisplayDate(item?.createdAt),
    audience: formatAudienceLabel(item?.audience || "ADMIN"),
    channels: deriveChannels(item),
    sendEmail: false,
    sendPush: false,
    sendInApp: true,
    sentBy: item?.actorName || "Order system",
    actionUrl: item?.orderId ? `/orders/${encodeURIComponent(item.orderId)}` : "/orders",
    entityId: item?.orderId || "",
    entityType: "ORDER",
    entityCode: item?.orderId || "",
    priority: item?.isRead ? "normal" : "high",
    audienceType: item?.audience ?? "ADMIN",
    audienceId: "",
    actorType: item?.actorType ?? "",
    actorId: item?.actorId ?? "",
    isRead: Boolean(item?.isRead),
    isArchived: false,
    metadata: {
      orderId: item?.orderId || "",
      actorType: item?.actorType || "",
      actorId: item?.actorId || "",
      actorName: item?.actorName || "",
      audience: item?.audience || "ADMIN",
      type: item?.type || "NEW_ORDER_PLACED",
    },
    rawMetadata: "",
    timeLabel: formatRelativeTime(item?.createdAt),
    note: "",
    rejectionReason: "",
    receiptUrl: "",
    transferReference: "",
    paymentDate: "",
    invoiceId: "",
    orderId: item?.orderId || "",
    payoutId: "",
    paymentStatus: "",
    settlementStatus: "",
    payoutStatus: "",
  };
}

async function fetchAdminFinanceNotifications({ first = 50, status = null } = {}) {
  const data = await executeProtectedGraphqlRequest(ADMIN_FINANCE_NOTIFICATIONS_QUERY, {
    first,
    status,
  });

  return data?.adminFinanceNotifications || {
    edges: [],
    unreadCount: 0,
    totalCount: 0,
  };
}

async function fetchAdminOrderNotifications({ first = 50, status = null } = {}) {
  const data = await executeProtectedGraphqlRequest(ADMIN_ORDER_NOTIFICATIONS_QUERY, {
    first,
    status,
  });

  return data?.adminOrderNotifications || {
    edges: [],
    unreadCount: 0,
    totalCount: 0,
  };
}

async function fetchCombinedAdminNotifications({ first = 50, status = null } = {}) {
  const [financeConnection, orderConnection] = await Promise.all([
    fetchAdminFinanceNotifications({ first, status }),
    fetchAdminOrderNotifications({ first, status }).catch(() => ({
      edges: [],
      unreadCount: 0,
      totalCount: 0,
    })),
  ]);

  const financeItems = Array.isArray(financeConnection?.edges)
    ? financeConnection.edges.map((edge) => normalizeNotification(edge?.node)).filter(Boolean)
    : [];
  const orderItems = Array.isArray(orderConnection?.edges)
    ? orderConnection.edges.map((edge) => normalizeOrderNotification(edge?.node)).filter(Boolean)
    : [];
  const dedupedItems = dedupeNotifications([...financeItems, ...orderItems]);
  const items = sortNotificationsByCreatedAtDesc(dedupedItems);
  const unreadCount = items.filter((item) => !item.isRead && !item.isArchived).length;

  return {
    items,
    unreadCount,
    totalCount: items.length,
  };
}

export async function getMyNotificationsRequest({ page, pageSize, status } = {}) {
  const safePage = Math.max(1, page || 1);
  const safePageSize = Math.max(1, pageSize || 10);
  const connection = await fetchCombinedAdminNotifications({
    first: Math.max(safePage * safePageSize, 50),
    status: status === "UNREAD" ? "UNREAD" : status === "READ" ? "READ" : null,
  });
  const allItems = Array.isArray(connection?.items) ? connection.items : [];
  const totalItems = Number(connection?.totalCount ?? allItems.length) || 0;
  const startIndex = (safePage - 1) * safePageSize;
  const items = allItems.slice(startIndex, startIndex + safePageSize);

  return {
    items,
    pageInfo: {
      page: safePage,
      pageSize: safePageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(Math.max(totalItems, allItems.length) / safePageSize)),
      unreadCount: Number(connection?.unreadCount ?? 0) || 0,
    },
  };
}

export async function getMyNotificationUnreadCountRequest() {
  const connection = await fetchCombinedAdminNotifications({ first: 200 });
  return Number(connection?.unreadCount ?? 0) || 0;
}

export async function getNotificationBellRequest() {
  const connection = await fetchCombinedAdminNotifications({ first: 200 });

  return {
    unreadCount: Number(connection?.unreadCount ?? 0) || 0,
    items: Array.isArray(connection?.items) ? connection.items.slice(0, 5) : [],
  };
}

export async function getNotificationCountsRequest() {
  const connection = await fetchCombinedAdminNotifications({ first: 50 });
  return {
    total: Number(connection?.totalCount ?? 0) || 0,
    unread: Number(connection?.unreadCount ?? 0) || 0,
    archived: 0,
    highPriority: Number(connection?.unreadCount ?? 0) || 0,
  };
}

export async function markNotificationReadRequest(id) {
  const data = await executeProtectedGraphqlRequest(MARK_FINANCE_NOTIFICATION_READ_MUTATION, {
    id,
  });
  const result = data?.markFinanceNotificationRead;
  const notification = result?.notification;

  if (!result?.success || !notification?.id) {
    throw new Error(result?.message || "Unable to mark notification as read.");
  }

  return {
    id: notification.id,
    status: "READ",
    statusLabel: "Read",
    isRead: true,
    readAt: "",
    readAtDisplay: "Opened in app",
  };
}

export async function markAllNotificationsReadRequest() {
  const data = await executeProtectedGraphqlRequest(
    MARK_ALL_FINANCE_NOTIFICATIONS_READ_MUTATION,
    {
      audience: ADMIN_FINANCE_AUDIENCE,
    },
  );
  const result = data?.markAllFinanceNotificationsRead;

  if (!result?.success) {
    throw new Error(result?.message || "Unable to mark notifications as read.");
  }

  return {
    count: 0,
    message: result?.message || "Notifications marked as read.",
  };
}

export async function archiveNotificationRequest() {
  throw new Error("Finance notifications cannot be archived.");
}

export async function unarchiveNotificationRequest() {
  throw new Error("Finance notifications cannot be unarchived.");
}

export async function getFinanceNotificationDetailRequest(id) {
  const data = await executeProtectedGraphqlRequest(FINANCE_NOTIFICATION_DETAIL_QUERY, { id });
  return normalizeNotification(data?.financeNotification);
}
