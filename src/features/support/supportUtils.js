export function formatStatusLabel(value) {
  return String(value || "OPEN")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatPriorityLabel(value) {
  return String(value || "MEDIUM")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatUserTypeLabel(value) {
  return String(value || "requester")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatReadableDate(value, options = {}) {
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

export function formatRelativeTime(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes <= 0) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
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
      .map(([key, value]) => `${formatStatusLabel(key)}: ${String(value)}`)
      .join(" • ");
  } catch {
    return String(metadata);
  }
}
