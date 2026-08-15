import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ARCHIVE_NOTIFICATION_MUTATION,
  MARK_ALL_NOTIFICATIONS_READ_MUTATION,
  MARK_NOTIFICATION_READ_MUTATION,
  NOTIFICATION_BELL_QUERY,
  NOTIFICATION_COUNTS_QUERY,
  NOTIFICATIONS_QUERY,
  UNARCHIVE_NOTIFICATION_MUTATION,
} from "./notificationsQueries.js";

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

function parseMetadata(metadata) {
  if (!metadata) {
    return {};
  }

  if (typeof metadata === "object") {
    return metadata;
  }

  try {
    return JSON.parse(metadata);
  } catch {
    return {};
  }
}

function formatAudienceLabel(audienceType) {
  switch (String(audienceType || "").toUpperCase()) {
    case "CUSTOMER":
    case "CUSTOMERS":
      return "Customers";
    case "VENDOR":
    case "VENDORS":
      return "Vendors";
    case "ADMIN":
    case "ADMINS":
      return "Admins";
    case "USER":
    case "USERS":
      return "All User";
    default:
      return String(audienceType || "All User")
        .toLowerCase()
        .split("_")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
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
  if (item?.isArchived) {
    return "Archived";
  }

  if (item?.isRead) {
    return "Read";
  }

  return "Unread";
}

function deriveChannels(item) {
  const channels = [];

  if (item?.channelEmail) {
    channels.push("email");
  }
  if (item?.channelSms) {
    channels.push("push");
  }
  if (item?.channelInApp) {
    channels.push("in-app");
  }

  return channels.length ? channels : ["in-app"];
}

function normalizeNotification(item) {
  const metadata = parseMetadata(item?.metadata);
  const statusLabel = formatStatusLabel(item);

  return {
    id: item?.id ?? "",
    title: item?.title ?? "Notification",
    subject: item?.title ?? "Notification",
    message: item?.message ?? "",
    code: item?.code ?? "",
    type: item?.code ?? "",
    typeLabel: formatTypeLabel(item?.code),
    status: statusLabel.toUpperCase(),
    statusLabel,
    createdAt: item?.createdAt ?? "",
    createdAtDisplay: formatDisplayDate(item?.createdAt),
    readAt: item?.readAt ?? "",
    readAtDisplay: item?.readAt ? formatDisplayDate(item?.readAt) : "",
    scheduledAt: formatDisplayDate(item?.createdAt),
    audience: formatAudienceLabel(item?.audienceType),
    channels: deriveChannels(item),
    sendEmail: Boolean(item?.channelEmail),
    sendPush: Boolean(item?.channelSms),
    sendInApp: Boolean(item?.channelInApp),
    sentBy: item?.actorName || "System",
    actionUrl: item?.actionUrl ?? "",
    entityId: item?.entityId ?? "",
    entityType: item?.entityType ?? "",
    entityCode: item?.entityCode ?? "",
    priority: item?.priority ?? "",
    audienceType: item?.audienceType ?? "",
    audienceId: item?.audienceId ?? "",
    actorType: item?.actorType ?? "",
    actorId: item?.actorId ?? "",
    isRead: Boolean(item?.isRead),
    isArchived: Boolean(item?.isArchived),
    metadata,
    rawMetadata: Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : "",
  };
}

function normalizeBellNotification(item) {
  return {
    id: item?.id ?? "",
    title: item?.title ?? "Notification",
    message: item?.message ?? "",
    type: item?.entityType ?? "",
    entityType: item?.entityType ?? "",
    entityId: item?.entityId ?? "",
    actionUrl: item?.actionUrl ?? "",
    unread: !item?.isRead,
    createdAt: item?.createdAt ?? "",
  };
}

export async function getMyNotificationsRequest({ page, pageSize, status, type, search, audience } = {}) {
  const filter = {
    search: search || null,
    audienceType: audience || null,
    code: type || null,
    isRead: status === "READ" ? true : status === "UNREAD" ? false : null,
    isArchived: status === "ARCHIVED" ? true : status ? false : null,
  };

  const data = await executeProtectedGraphqlRequest(NOTIFICATIONS_QUERY, {
    filter,
    pagination: {
      page: page || 1,
      pageSize: pageSize || 10,
    },
  });

  const result = data?.notifications;
  const items = Array.isArray(result?.items) ? result.items.map(normalizeNotification) : [];
  const totalItems = Number(result?.totalCount ?? items.length) || 0;

  return {
    items,
    pageInfo: {
      page: page || 1,
      pageSize: pageSize || 10,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / (pageSize || 10))),
      unreadCount: Number(result?.unreadCount ?? 0) || 0,
    },
  };
}

export async function getMyNotificationUnreadCountRequest() {
  const data = await executeProtectedGraphqlRequest(NOTIFICATION_COUNTS_QUERY, {});
  return Number(data?.notificationCounts?.unread ?? 0) || 0;
}

export async function getNotificationBellRequest() {
  const data = await executeProtectedGraphqlRequest(NOTIFICATION_BELL_QUERY, {});
  const bell = data?.notificationBell;

  return {
    unreadCount: Number(bell?.unreadCount ?? 0) || 0,
    items: Array.isArray(bell?.items) ? bell.items.map(normalizeBellNotification) : [],
  };
}

export async function getNotificationCountsRequest() {
  const data = await executeProtectedGraphqlRequest(NOTIFICATION_COUNTS_QUERY, {});
  return {
    total: Number(data?.notificationCounts?.total ?? 0) || 0,
    unread: Number(data?.notificationCounts?.unread ?? 0) || 0,
    archived: Number(data?.notificationCounts?.archived ?? 0) || 0,
    highPriority: Number(data?.notificationCounts?.highPriority ?? 0) || 0,
  };
}

export async function markNotificationReadRequest(id) {
  const data = await executeProtectedGraphqlRequest(MARK_NOTIFICATION_READ_MUTATION, { id });
  const notification = data?.markNotificationRead?.notification;

  if (!notification?.id) {
    throw new Error("Unable to mark notification as read.");
  }

  return {
    id: notification.id,
    status: "READ",
    statusLabel: "Read",
    isRead: true,
    readAt: notification.readAt ?? "",
    readAtDisplay: notification.readAt ? formatDisplayDate(notification.readAt) : "Just now",
  };
}

export async function markAllNotificationsReadRequest() {
  const data = await executeProtectedGraphqlRequest(MARK_ALL_NOTIFICATIONS_READ_MUTATION, {});
  const result = data?.markAllNotificationsRead;

  if (!result?.success) {
    throw new Error("Unable to mark notifications as read.");
  }

  return {
    count: Number(result?.unreadCount ?? 0) || 0,
    message: "Notifications marked as read.",
  };
}

export async function archiveNotificationRequest(id) {
  const data = await executeProtectedGraphqlRequest(ARCHIVE_NOTIFICATION_MUTATION, { id });
  const result = data?.archiveNotification;

  if (!result?.success) {
    throw new Error(result?.message || "Unable to archive notification.");
  }

  return {
    message: result?.message ?? "Notification archived successfully.",
  };
}

export async function unarchiveNotificationRequest(id) {
  const data = await executeProtectedGraphqlRequest(UNARCHIVE_NOTIFICATION_MUTATION, { id });
  const result = data?.unarchiveNotification;

  if (!result?.id) {
    throw new Error("Unable to unarchive notification.");
  }

  return {
    id: result.id,
    isArchived: Boolean(result.isArchived),
  };
}
