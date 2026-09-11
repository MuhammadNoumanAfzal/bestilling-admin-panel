import { useTranslation } from "react-i18next";
import i18n from "../../i18n/index.js";

const options = { ns: "adminNotifications", keySeparator: false, nsSeparator: false };
export function useNotificationLanguage() {
  return useTranslation("adminNotifications").i18n.resolvedLanguage;
}
export function notificationLocale() {
  return i18n.resolvedLanguage === "nb" ? "nb-NO" : "en-GB";
}
export function nt(value, values = {}) {
  const text = String(value ?? "");
  return i18n.t(text, { ...options, defaultValue: text, ...values });
}
export function notificationError(value, fallback = "Please try again.") {
  const message = String(value?.message || value || "");
  return i18n.exists(message, options) ? nt(message) : i18n.resolvedLanguage === "en" && message ? message : nt(fallback);
}
export function notificationDialog(options) {
  const result = { confirmButtonText: nt("OK"), closeButtonAriaLabel: nt("Close"), ...options };
  for (const key of ["title", "text", "confirmButtonText", "cancelButtonText"]) {
    if (typeof result[key] === "string") result[key] = nt(result[key]);
  }
  return result;
}
export function notificationDate(value, dateOnly = false) {
  if (!value) return nt("Not available");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return nt(value);
  return new Intl.DateTimeFormat(notificationLocale(), {
    dateStyle: "medium", ...(dateOnly ? {} : { timeStyle: "short" }), timeZone: "Europe/Oslo",
  }).format(date);
}
export function notificationChannels(channels) {
  return channels.length ? channels.map(channel => nt({ push: "Push", email: "Email", "in-app": "In-App", sms: "SMS" }[channel] || channel)).join(", ") : nt("None selected");
}
