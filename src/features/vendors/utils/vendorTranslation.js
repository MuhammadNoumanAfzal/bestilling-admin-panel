import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/index.js";

export function useVendorLanguage() {
  return useTranslation("adminVendors").i18n.resolvedLanguage;
}

export function vendorLocale() {
  return i18n.resolvedLanguage === "nb" ? "nb-NO" : "en-GB";
}

export function vt(value, options = {}) {
  if (value == null || value === "") return value || "";
  const text = String(value);
  const countedTab = text.match(/^(All|Active|Draft|Published) \((\d+)\)$/);
  if (countedTab) return vt(countedTab[1]) + " (" + vendorNumber(countedTab[2]) + ")";
  const unitLabel = text.match(/^(\d+(?:\.\d+)?) (Hours?|Guests?|Districts?|Miles?)$/i);
  if (unitLabel) {
    const units = { hour: ["hour", "timer"], guest: ["guest", "gjester"], district: ["district", "distrikter"], mile: ["mile", "miles"] };
    const key = unitLabel[2].toLowerCase().replace(/s$/, "");
    return vendorLocale() === "nb-NO" ? vendorNumber(unitLabel[1]) + " " + units[key][1] : text;
  }
  const relative = text.match(/^(\d+) (minute|hour|day|week|month|year)s? ago$/i);
  if (relative) return new Intl.RelativeTimeFormat(vendorLocale(), { numeric: "auto" }).format(-Number(relative[1]), relative[2].toLowerCase());
  return i18n.t(text, { ns: "adminVendors", keySeparator: false, nsSeparator: false, defaultValue: text, ...options });
}

export function vendorError(error, fallback = "Something went wrong. Please try again.") {
  if (error?.isAuthenticationError) return vt("Your session has expired. Please log in again.");
  const message = error instanceof Error ? error.message : String(error || "");
  return i18n.exists(message, { ns: "adminVendors", keySeparator: false, nsSeparator: false })
    ? vt(message)
    : i18n.resolvedLanguage === "en" && message ? message : vt(fallback);
}

export function vendorMessage(message) {
  return i18n.exists(message || "", { ns: "adminVendors", keySeparator: false, nsSeparator: false })
    ? vt(message)
    : i18n.resolvedLanguage === "en" && message ? message : vt("Changes saved successfully.");
}

export function vendorDate(value, fallback = "Not available") {
  if (!value) return vt(fallback);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? vt(value) : date.toLocaleDateString(vendorLocale(), {
    day: "2-digit", month: "short", year: "numeric", timeZone: "Europe/Oslo",
  });
}

export function vendorNumber(value, options = {}) {
  return Number(value || 0).toLocaleString(vendorLocale(), options);
}

export function vendorHtml(value, options) {
  return String(vt(value, options)).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}
