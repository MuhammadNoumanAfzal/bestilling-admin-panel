import { useTranslation } from "react-i18next";
import i18n from "../../i18n/index.js";

export function useReportLanguage() {
  return useTranslation("adminReports").i18n.resolvedLanguage;
}

export function reportLocale() {
  return i18n.resolvedLanguage === "nb" ? "nb-NO" : "en-GB";
}

export function rt(value, values = {}) {
  const text = String(value ?? "");
  return i18n.t(text, { ns: "adminReports", keySeparator: false, nsSeparator: false, defaultValue: text, ...values });
}

export function reportError(value) {
  const message = value instanceof Error ? value.message : String(value || "");
  return i18n.resolvedLanguage === "en" ? message : rt("Unable to load reports snapshot.");
}
