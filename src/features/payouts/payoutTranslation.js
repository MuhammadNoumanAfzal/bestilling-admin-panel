import { useTranslation } from "react-i18next";
import i18n from "../../i18n/index.js";
const options = { ns: "adminPayouts", keySeparator: false, nsSeparator: false };
export function usePayoutLanguage() { return useTranslation("adminPayouts").i18n.resolvedLanguage; }
export function pt(value, values = {}) {
  const text = String(value ?? "");
  return i18n.t(text, { ...options, defaultValue: text, ...values });
}
export function payoutError(value, fallback = "Please try again.") {
  const message = String(value?.message || value || "");
  return i18n.exists(message, options) ? pt(message) : i18n.resolvedLanguage === "en" && message ? message : pt(fallback);
}
export function payoutDialog(options) {
  const result = { confirmButtonText: pt("OK"), cancelButtonText: pt("Cancel"), closeButtonAriaLabel: pt("Close"), ...options };
  for (const key of ["title", "text", "confirmButtonText", "cancelButtonText", "inputLabel", "inputPlaceholder", "closeButtonAriaLabel"]) {
    if (typeof result[key] === "string") result[key] = pt(result[key]);
  }
  return result;
}
export function payoutHtml(value) {
  return pt(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

export function payoutDate(value, withTime = true) {
  if (!value || ["Pending update", "Not available", "Not scheduled"].includes(value)) return pt(value || "Not available");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return pt(value);
  return new Intl.DateTimeFormat(i18n.resolvedLanguage === "nb" ? "nb-NO" : "en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}
