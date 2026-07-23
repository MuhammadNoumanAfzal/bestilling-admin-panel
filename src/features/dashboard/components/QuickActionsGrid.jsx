import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  ClipboardList,
  CircleDollarSign,
  LifeBuoy,
  FileText,
  Settings,
} from "lucide-react";

const disabledPaths = new Set(["/orders", "/payouts"]);

export default function QuickActionsGrid() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Approve Vendors",
      icon: UserCheck,
      path: "/vendors",
      color: "text-[#cf6432]",
    },
    {
      label: "View Orders",
      icon: ClipboardList,
      path: "/orders",
      color: "text-[#cf6432]",
    },
    {
      label: "Process Payouts",
      icon: CircleDollarSign,
      path: "/payouts",
      color: "text-[#cf6432]",
    },
    {
      label: "Review Tickets",
      icon: LifeBuoy,
      path: "/support",
      color: "text-[#cf6432]",
    },
    {
      label: "View Reports",
      icon: FileText,
      path: "/reports",
      color: "text-[#cf6432]",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
      color: "text-[#cf6432]",
    },
  ];

  return (
    <section className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] mt-5">
      <h2 className="text-[18px] font-bold text-[#18120f] mb-4">Quick Actions</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          const isDisabled = disabledPaths.has(act.path);
          return (
            <button
              key={act.label}
              onClick={() => {
                if (!isDisabled) {
                  navigate(act.path);
                }
              }}
              className={`flex items-center justify-center gap-2.5 rounded-[10px] border px-4 py-3.5 text-[14px] font-bold transition ${
                isDisabled
                  ? "cursor-not-allowed border-[#e8dfd8] bg-[#f4efeb] text-[#b3a79d] opacity-70"
                  : "cursor-pointer border-[#ddd6cf] bg-[#faf8f6] text-[#18120f] hover:border-[#d96834] hover:bg-white"
              }`}
              disabled={isDisabled}
              type="button"
            >
              <Icon size={16} className={isDisabled ? "text-[#b3a79d]" : act.color} />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
