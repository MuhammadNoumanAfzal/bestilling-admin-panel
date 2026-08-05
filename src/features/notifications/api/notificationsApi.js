import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ARCHIVE_NOTIFICATION_MUTATION,
  MARK_ALL_NOTIFICATIONS_READ_MUTATION,
  MARK_NOTIFICATION_READ_MUTATION,
  MY_NOTIFICATIONS_QUERY,
  MY_NOTIFICATION_UNREAD_COUNT_QUERY,
} from "./notificationsQueries.js";

function getFirstErrorMessage(result, fallbackMessage) {
  return result?.errors?.find((item) => item?.message)?.message || result?.message || fallbackMessage;
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
    dateStyle: options.includeTime === false ? "medium" : "medium",
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

function formatAudienceLabel(audience) {
  switch (String(audience || "").toLowerCase()) {
    case "users":
      return "All User";
    case "customers":
      return "Customers";
    case "vendors":
      return "Vendors";
    case "admins":
      return "Admins";
    default:
      return "All User";
  }
}

function formatTypeLabel(type) {
  return String(type || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function formatStatusLabel(status) {
  switch (String(status || "").toUpperCase()) {
    case "UNREAD":
      return "Unread";
    case "READ":
      return "Read";
    case "ARCHIVED":
      return "Archived";
    default:
      return status || "Unknown";
  }
}

function deriveChannels(metadata) {
  const channels = [];

  if (metadata.sendEmail) {
    channels.push("email");
  }
  if (metadata.sendPush) {
    channels.push("push");
  }
  if (metadata.sendInApp) {
    channels.push("in-app");
  }

  return channels.length ? channels : ["in-app"];
}

function normalizeNotification(item) {
  const metadata = parseMetadata(item?.metadata);
  const prettyMetadata = Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : "";

  return {
    id: item?.id ?? "",
    title: item?.title ?? "Notification",
    subject: item?.title ?? "Notification",
    message: item?.message ?? "",
    type: item?.type ?? "",
    typeLabel: formatTypeLabel(item?.type),
    status: item?.status ?? "UNREAD",
    statusLabel: formatStatusLabel(item?.status),
    createdAt: item?.createdAt ?? "",
    createdAtDisplay: formatDisplayDate(item?.createdAt),
    readAt: item?.readAt ?? "",
    readAtDisplay: formatDisplayDate(item?.readAt),
    scheduledAt: formatDisplayDate(item?.createdAt),
    audience: formatAudienceLabel(metadata.audience),
    channels: deriveChannels(metadata),
    sendEmail: Boolean(metadata.sendEmail),
    sendPush: Boolean(metadata.sendPush),
    sendInApp: Boolean(metadata.sendInApp),
    sentBy: "System",
    actionUrl: item?.actionUrl ?? "",
    entityId: item?.entityId ?? "",
    entityType: item?.entityType ?? "",
    metadata,
    rawMetadata: prettyMetadata,
  };
}

export async function getMyNotificationsRequest({ page, pageSize, status, type }) {
  const data = await executeProtectedGraphqlRequest(MY_NOTIFICATIONS_QUERY, {
    page,
    pageSize,
    status: status || null,
    type: type || null,
  });
  const result = data?.myNotifications;

  return {
    items: (result?.items || []).map(normalizeNotification),
    pageInfo: {
      page: result?.pageInfo?.page ?? page,
      pageSize: result?.pageInfo?.pageSize ?? pageSize,
      totalItems: result?.pageInfo?.totalItems ?? 0,
      totalPages: result?.pageInfo?.totalPages ?? 1,
      unreadCount: result?.pageInfo?.unreadCount ?? 0,
    },
  };
}

export async function getMyNotificationUnreadCountRequest() {
  const data = await executeProtectedGraphqlRequest(MY_NOTIFICATION_UNREAD_COUNT_QUERY, {});
  return data?.myNotificationUnreadCount?.count ?? 0;
}

export async function markNotificationReadRequest(id) {
  const data = await executeProtectedGraphqlRequest(MARK_NOTIFICATION_READ_MUTATION, { id });
  const result = data?.markNotificationRead;

  if (!result?.success || !result?.notification) {
    throw new Error(getFirstErrorMessage(result, "Unable to mark notification as read."));
  }

  return {
    id: result.notification.id ?? id,
    status: result.notification.status ?? "READ",
    statusLabel: formatStatusLabel(result.notification.status),
    readAt: result.notification.readAt ?? "",
    readAtDisplay: formatDisplayDate(result.notification.readAt),
  };
}

export async function markAllNotificationsReadRequest() {
  const data = await executeProtectedGraphqlRequest(MARK_ALL_NOTIFICATIONS_READ_MUTATION, {});
  const result = data?.markAllNotificationsRead;

  if (!result?.success) {
    throw new Error(getFirstErrorMessage(result, "Unable to mark notifications as read."));
  }

  return {
    count: result?.count ?? 0,
    message: result?.message ?? "Notifications marked as read.",
  };
}

export async function archiveNotificationRequest(id) {
  const data = await executeProtectedGraphqlRequest(ARCHIVE_NOTIFICATION_MUTATION, { id });
  const result = data?.archiveNotification;

  if (!result?.success) {
    throw new Error(getFirstErrorMessage(result, "Unable to archive notification."));
  }

  return {
    message: result?.message ?? "Notification archived successfully.",
  };
}
