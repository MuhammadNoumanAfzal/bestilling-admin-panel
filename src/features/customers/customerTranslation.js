import { useTranslation } from "react-i18next";
import i18n from "../../i18n/index.js";

const options = { ns: "adminCustomers", keySeparator: false, nsSeparator: false };

export function useCustomerLanguage() {
  return useTranslation("adminCustomers").i18n.resolvedLanguage;
}

export function customerLocale() {
  return i18n.resolvedLanguage === "nb" ? "nb-NO" : "en-GB";
}

export function ct(value, values = {}) {
  if (value == null || value === "") return value || "";
  const text = String(value);
  return i18n.t(text, { ...options, defaultValue: text, ...values });
}

export function customerError(error, fallback = "Something went wrong. Please try again.") {
  if (error?.isAuthenticationError) return ct("Your session has expired. Please log in again.");
  const message = error instanceof Error ? error.message : String(error || "");
  if (i18n.exists(message, options)) return ct(message);
  return i18n.resolvedLanguage === "en" && message ? message : ct(fallback);
}

export function customerMessage(message, fallback = "Changes saved successfully.") {
  return i18n.exists(message || "", options) ? ct(message)
    : i18n.resolvedLanguage === "en" && message ? message : ct(fallback);
}

export function customerDate(value, withTime = false) {
  if (!value) return ct("Not available");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return ct(value);
  return new Intl.DateTimeFormat(customerLocale(), {
    day: "2-digit", month: "short", year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Europe/Oslo",
  }).format(date);
}
