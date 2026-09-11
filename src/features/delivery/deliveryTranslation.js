import { useTranslation } from "react-i18next";
import i18n from "../../i18n/index.js";
const options = { ns: "adminDelivery", keySeparator: false, nsSeparator: false };
export function useDeliveryLanguage() { return useTranslation("adminDelivery").i18n.resolvedLanguage; }
export function dt(value, values = {}) {
  const text = String(value ?? "");
  return i18n.t(text, { ...options, defaultValue: text, ...values });
}
export function deliveryError(value, fallback = "Please try again.") {
  const message = String(value?.message || value || "");
  return i18n.exists(message, options) ? dt(message) : i18n.resolvedLanguage === "en" && message ? message : dt(fallback);
}
export function deliveryMessage(value, fallback = "Changes saved successfully.") { return deliveryError(value, fallback); }
export function deliveryDialog(options) {
  const result = { confirmButtonText: dt("OK"), cancelButtonText: dt("Cancel"), closeButtonAriaLabel: dt("Close"), ...options };
  for (const key of ["title", "text", "confirmButtonText", "cancelButtonText"]) {
    if (typeof result[key] === "string") result[key] = dt(result[key]);
  }
  return result;
}
