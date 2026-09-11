import { useTranslation } from "react-i18next";
import i18n from "../../i18n/index.js";

const options = { ns: "adminOrders", keySeparator: false, nsSeparator: false };

export function useOrderLanguage() {
  return useTranslation("adminOrders").i18n.resolvedLanguage;
}

export function orderLocale() {
  return i18n.resolvedLanguage === "nb" ? "nb-NO" : "en-GB";
}

export function ot(value, values = {}) {
  if (value == null || value === "") return value || "";
  const text = String(value);
  return i18n.t(text, { ...options, defaultValue: text, ...values });
}

export function orderError(error, fallback = "Something went wrong. Please try again.") {
  if (error?.isAuthenticationError) return ot("Your session has expired. Please log in again.");
  const message = error instanceof Error ? error.message : String(error || "");
  if (i18n.exists(message, options)) return ot(message);
  return i18n.resolvedLanguage === "en" && message ? message : ot(fallback);
}

export function orderMessage(message, fallback = "The order was updated successfully.") {
  return i18n.exists(message || "", options) ? ot(message)
    : i18n.resolvedLanguage === "en" && message ? message : ot(fallback);
}

export function orderDate(value, withTime = true) {
  if (!value) return ot("Not available");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return ot(value);
  return new Intl.DateTimeFormat(orderLocale(), {
    day: "2-digit", month: "short", year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Europe/Oslo",
  }).format(date);
}
