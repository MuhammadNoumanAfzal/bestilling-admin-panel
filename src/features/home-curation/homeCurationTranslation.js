import { useTranslation } from "react-i18next";
import i18n from "../../i18n/index.js";

const options = { ns: "adminHomeCuration", keySeparator: false, nsSeparator: false };

export function useHomeCurationLanguage() {
  return useTranslation("adminHomeCuration").i18n.resolvedLanguage;
}

export function hct(value, values = {}) {
  const text = String(value ?? "");
  return i18n.t(text, { ...options, defaultValue: text, ...values });
}

export function homeCurationError(value) {
  const message = String(value?.message || value || "");
  return i18n.exists(message, options) ? hct(message) : i18n.resolvedLanguage === "en" && message ? message : hct("Please try again.");
}

export function homeCurationDialog(options) {
  const result = { confirmButtonText: hct("OK"), closeButtonAriaLabel: hct("Close"), ...options };
  for (const key of ["title", "text", "confirmButtonText", "cancelButtonText"]) {
    if (typeof result[key] === "string") result[key] = hct(result[key]);
  }
  return result;
}

export function homeCurationRating(value) {
  return new Intl.NumberFormat(i18n.resolvedLanguage === "nb" ? "nb-NO" : "en-GB", {
    minimumFractionDigits: 1, maximumFractionDigits: 1,
  }).format(Number(value) || 0);
}
