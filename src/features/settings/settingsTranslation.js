import { useTranslation } from "react-i18next";
import i18n from "../../i18n/index.js";

const options = { ns: "adminSettings", keySeparator: false, nsSeparator: false };
export function useSettingsLanguage() {
  return useTranslation("adminSettings").i18n.resolvedLanguage;
}
export function st(value, values = {}) {
  const text = String(value ?? "");
  return i18n.t(text, { ...options, defaultValue: text, ...values });
}
export function settingsMessage(value, fallback = "Please try again.") {
  const message = String(value?.message || value || "");
  return i18n.exists(message, options) ? st(message) : i18n.resolvedLanguage === "en" && message ? message : st(fallback);
}
export function settingsDialog(config) {
  const result = { confirmButtonText: st("OK"), cancelButtonText: st("Cancel"), closeButtonAriaLabel: st("Close"), ...config };
  for (const key of ["title", "text", "confirmButtonText", "cancelButtonText"]) {
    if (typeof result[key] === "string") result[key] = st(result[key]);
  }
  return result;
}
export function settingsDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return st("Not available");
  return new Intl.DateTimeFormat(i18n.resolvedLanguage === "nb" ? "nb-NO" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
