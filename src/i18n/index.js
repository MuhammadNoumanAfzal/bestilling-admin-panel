import settings from "./settings";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import nb from "./nb";
import en from "./en";
import shell from "./shell";
import vendors from "./vendors";
import orders from "./orders";
import customers from "./customers";
import reports from "./reports";
import support from "./support";
import vendorSettings from "./vendorSettings";
import homeCuration from "./homeCuration";
import notifications from "./notifications";
import delivery from "./delivery";
import commission from "./commission";
import payouts from "./payouts";

const LANGUAGE_STORAGE_KEY = "admin-panel-language";
const supportedLanguages = ["nb", "en"];

function resolveInitialLanguage() {
  if (typeof window === "undefined") {
    return "nb";
  }

  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (supportedLanguages.includes(savedLanguage)) {
    return savedLanguage;
  }

  return "nb";
}

const initialLanguage = resolveInitialLanguage();

i18n.use(initReactI18next).init({
  resources: { nb: { translation: nb, adminSettings: settings, adminPayouts: payouts, adminCommission: commission, adminDelivery: delivery, adminNotifications: notifications, adminHomeCuration: homeCuration, adminVendorSettings: vendorSettings, adminSupport: support, adminReports: reports, adminCustomers: customers, adminOrders: orders, adminVendors: vendors, adminShell: shell }, en: { translation: en, adminSettings: Object.fromEntries(Object.keys(settings).map(key => [key, key])), adminPayouts: Object.fromEntries(Object.keys(payouts).map(key => [key, key])), adminCommission: Object.fromEntries(Object.keys(commission).map(key => [key, key])), adminDelivery: Object.fromEntries(Object.keys(delivery).map(key => [key, key])), adminNotifications: Object.fromEntries(Object.keys(notifications).map(key => [key, key])), adminHomeCuration: Object.fromEntries(Object.keys(homeCuration).map(key => [key, key])), adminVendorSettings: Object.fromEntries(Object.keys(vendorSettings).map(key => [key, key])), adminSupport: Object.fromEntries(Object.keys(support).map(key => [key, key])), adminReports: Object.fromEntries(Object.keys(reports).map(key => [key, key])), adminCustomers: Object.fromEntries(Object.keys(customers).map(key => [key, key])), adminOrders: Object.fromEntries(Object.keys(orders).map(key => [key, key])), adminVendors: Object.fromEntries(Object.keys(vendors).map(key => [key, key])), adminShell: Object.fromEntries(Object.keys(shell).map(key => [key, key])) } },
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

document.documentElement.lang = initialLanguage;
i18n.on("languageChanged", (language) => {
  document.documentElement.lang = language;

  if (typeof window !== "undefined" && supportedLanguages.includes(language)) {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
});

export default i18n;
