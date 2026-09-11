import { useTranslation } from "react-i18next";
import i18n from "../../i18n/index.js";

const options = { ns: "adminSupport", keySeparator: false, nsSeparator: false };

export function useSupportLanguage() {
  return useTranslation("adminSupport").i18n.resolvedLanguage;
}

export function supportLocale() {
  return i18n.resolvedLanguage === "nb" ? "nb-NO" : "en-GB";
}

export function st(value, values = {}) {
  const text = String(value ?? "");
  return i18n.t(text, { ...options, defaultValue: text, ...values });
}

export function supportError(value, fallback = "Please try again.") {
  const message = value instanceof Error ? value.message : String(value || "");
  return i18n.exists(message, options) ? st(message) : i18n.resolvedLanguage === "en" && message ? message : st(fallback);
}

export function supportDialog(options) {
  const result = { confirmButtonText: st("OK"), closeButtonAriaLabel: st("Close"), ...options };
  for (const key of ["title", "text", "confirmButtonText", "cancelButtonText"]) {
    if (typeof result[key] === "string") result[key] = st(result[key]);
  }
  return result;
}
