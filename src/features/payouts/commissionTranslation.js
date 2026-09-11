import { useTranslation } from "react-i18next";
import i18n from "../../i18n/index.js";
const options = { ns: "adminCommission", keySeparator: false, nsSeparator: false };
export function useCommissionLanguage() { return useTranslation("adminCommission").i18n.resolvedLanguage; }
export function cmt(value, values = {}) {
  const text = String(value ?? "");
  return i18n.t(text, { ...options, defaultValue: text, ...values });
}
export function commissionError(value, fallback = "Please try again.") {
  const message = String(value?.message || value || "");
  return i18n.exists(message, options) ? cmt(message) : i18n.resolvedLanguage === "en" && message ? message : cmt(fallback);
}
export function commissionDialog(options) {
  const result = { confirmButtonText: cmt("OK"), closeButtonAriaLabel: cmt("Close"), ...options };
  for (const key of ["title", "text", "confirmButtonText", "cancelButtonText"]) {
    if (typeof result[key] === "string") result[key] = cmt(result[key]);
  }
  return result;
}
