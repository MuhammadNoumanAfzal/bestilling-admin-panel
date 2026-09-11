import { useTranslation } from "react-i18next";
import i18n from "../../i18n/index.js";

const options = { ns: "adminVendorSettings", keySeparator: false, nsSeparator: false };

export function useVendorSettingsLanguage() {
  return useTranslation("adminVendorSettings").i18n.resolvedLanguage;
}

export function vst(value, values = {}) {
  const text = String(value ?? "");
  return i18n.t(text, { ...options, defaultValue: text, ...values });
}

export function vendorSettingsError(value) {
  const message = String(value?.message || value || "");
  return i18n.exists(message, options) ? vst(message) : i18n.resolvedLanguage === "en" && message ? message : vst("Please try again.");
}

export function vendorSettingsDialog(options) {
  const result = { confirmButtonText: vst("OK"), closeButtonAriaLabel: vst("Close"), ...options };
  for (const key of ["title", "text", "confirmButtonText", "cancelButtonText"]) {
    if (typeof result[key] === "string") result[key] = vst(result[key]);
  }
  return result;
}

export function vendorSettingsMeta(item) {
  return item.raw?.slug ? vst("Slug: {{slug}}", { slug: item.raw.slug }) : vst(item.meta);
}
