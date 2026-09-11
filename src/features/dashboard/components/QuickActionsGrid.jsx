import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserCheck, ClipboardList, CircleDollarSign, LifeBuoy, FileText, Settings } from "lucide-react";

const iconMap = {
  vendors: UserCheck,
  orders: ClipboardList,
  payouts: CircleDollarSign,
  support: LifeBuoy,
  reports: FileText,
  settings: Settings,
};

const fallbackActions = [
  { key: "vendors", route: "/vendors", enabled: true },
  { key: "orders", route: "/orders", enabled: true },
  { key: "payouts", route: "/payments", enabled: true },
  { key: "support", route: "/support", enabled: true },
  { key: "reports", route: "/reports", enabled: true },
  { key: "settings", route: "/settings", enabled: true },
];

export default function QuickActionsGrid({ actions = [] }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const items = actions.length > 0 ? actions : fallbackActions;

  return (
    <section className="mt-5 rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <h2 className="mb-4 text-[18px] font-bold text-[#18120f]">{t("adminDashboard.quickActions.title")}</h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((action) => {
          const Icon = iconMap[action.key] || FileText;
          const isDisabled = !action.enabled || !action.route;
          const label = t(`adminDashboard.quickActions.${action.key}`, { defaultValue: action.label || t("adminDashboard.common.action") });

          return (
            <button
              key={action.key || label}
              onClick={() => {
                if (!isDisabled) {
                  navigate(action.route);
                }
              }}
              className={`flex items-center justify-center gap-2.5 rounded-[10px] border px-4 py-3.5 text-[14px] font-bold transition ${isDisabled ? "cursor-not-allowed border-[#e8dfd8] bg-[#f4efeb] text-[#b3a79d] opacity-70" : "cursor-pointer border-[#ddd6cf] bg-[#faf8f6] text-[#18120f] hover:border-[#d96834] hover:bg-white"}`}
              disabled={isDisabled}
              type="button"
              title={label}
            >
              <Icon size={16} className={isDisabled ? "text-[#b3a79d]" : "text-[#cf6432]"} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
