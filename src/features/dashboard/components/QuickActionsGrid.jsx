import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  ClipboardList,
  CircleDollarSign,
  LifeBuoy,
  FileText,
  Settings,
} from "lucide-react";

const iconMap = {
  vendors: UserCheck,
  orders: ClipboardList,
  payouts: CircleDollarSign,
  support: LifeBuoy,
  reports: FileText,
  settings: Settings,
};

const fallbackActions = [
  { key: "vendors", label: "Approve Vendors", route: "/vendors", enabled: true },
  { key: "orders", label: "View Orders", route: "/orders", enabled: true },
  { key: "payouts", label: "Process Payouts", route: "/payments", enabled: true },
  { key: "support", label: "Review Tickets", route: "/support", enabled: true },
  { key: "reports", label: "View Reports", route: "/reports", enabled: true },
  { key: "settings", label: "Settings", route: "/settings", enabled: true },
];

export default function QuickActionsGrid({ actions = [] }) {
  const navigate = useNavigate();
  const items = actions.length > 0 ? actions : fallbackActions;

  return (
    <section className="mt-5 rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <h2 className="mb-4 text-[18px] font-bold text-[#18120f]">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((action) => {
          const Icon = iconMap[action.key] || FileText;
          const isDisabled = !action.enabled || !action.route;

          return (
            <button
              key={action.key || action.label}
              onClick={() => {
                if (!isDisabled) {
                  navigate(action.route);
                }
              }}
              className={`flex items-center justify-center gap-2.5 rounded-[10px] border px-4 py-3.5 text-[14px] font-bold transition ${
                isDisabled
                  ? "cursor-not-allowed border-[#e8dfd8] bg-[#f4efeb] text-[#b3a79d] opacity-70"
                  : "cursor-pointer border-[#ddd6cf] bg-[#faf8f6] text-[#18120f] hover:border-[#d96834] hover:bg-white"
              }`}
              disabled={isDisabled}
              type="button"
              title={action.requiredPermission || ""}
            >
              <Icon size={16} className={isDisabled ? "text-[#b3a79d]" : "text-[#cf6432]"} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
