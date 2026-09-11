import { st, supportLocale } from "./supportTranslation.js";
export function formatStatusLabel(value) {
  return st(String(value || "OPEN")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase()));
}

export function formatPriorityLabel(value) {
  return st(String(value || "MEDIUM")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase()));
}

export function formatUserTypeLabel(value) {
  return st(String(value || "requester")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase()));
}

export function formatReadableDate(value, options = {}) {
  if (!value) {
    return st("Not available");
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return st("Not available");
  }

  return new Intl.DateTimeFormat(supportLocale(), {
    dateStyle: "medium",
    timeStyle: options.includeTime === false ? undefined : "short",
  }).format(date);
}

export function formatRelativeTime(value) {
  if (!value) {
    return st("Not available");
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return st("Not available");
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes <= 0) {
    return st("Just now");
  }

  if (diffMinutes < 60) {
    return new Intl.RelativeTimeFormat(supportLocale()).format(-diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return new Intl.RelativeTimeFormat(supportLocale()).format(-diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return new Intl.RelativeTimeFormat(supportLocale()).format(-diffDays, "day");
  }

  return formatReadableDate(value, { includeTime: false });
}

export function formatMetadataSummary(metadata) {
  if (!metadata) {
    return "";
  }

  try {
    const parsed = typeof metadata === "string" ? JSON.parse(metadata) : metadata;

    if (!parsed || typeof parsed !== "object") {
      return String(metadata);
    }

    return Object.entries(parsed)
      .map(([key, value]) => `${formatStatusLabel(key)}: ${["status", "priority", "previousStatus", "newStatus", "old_status", "new_status", "old_priority", "new_priority"].includes(key) ? formatStatusLabel(value) : String(value)}`)
      .join(" • ");
  } catch {
    return String(metadata);
  }
}
