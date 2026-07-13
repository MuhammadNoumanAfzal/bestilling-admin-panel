import { useEffect, useMemo } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ArrowRight,
  Bell,
  Box,
  FileText,
  LayoutDashboard,
  LogOut,
  LifeBuoy,
  Search,
  ReceiptText,
  Settings,
  Truck,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth.js";

const navigation = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Vendors", to: "/vendors", icon: UsersRound },
  { label: "Orders", to: "/orders", icon: Box },
  { label: "Customers", to: "/customers", icon: UsersRound },
  { label: "Payouts", to: "/payouts", icon: ReceiptText },
  { label: "Delivery", to: "/delivery", icon: Truck },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "Support", to: "/support", icon: LifeBuoy },
  { label: "Settings", to: "/settings", icon: Settings },
];

const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "A clean overview of admin activity, vendor movement, and platform health.",
  },
  "/vendors": {
    title: "Vendors",
    subtitle: "Track onboarding, approvals, and store readiness in one place.",
  },
  "/orders": {
    title: "Orders",
    subtitle: "Monitor order flow, exceptions, and service level performance.",
  },
  "/customers": {
    title: "Customers",
    subtitle: "Understand account volume, activity, and retention patterns.",
  },
  "/payouts": {
    title: "Payouts",
    subtitle: "Review settlement batches, release timing, and payment states.",
  },
  "/delivery": {
    title: "Delivery",
    subtitle: "Manage delivery zones, timings, and service coverage.",
  },
  "/reports": {
    title: "Reports",
    subtitle: "Summaries, exports, and operational visibility for the team.",
  },
  "/support": {
    title: "Support",
    subtitle: "Handle tickets, escalations, and operational follow-up.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Update platform defaults, permissions, and admin preferences.",
  },
};

function NavItem({ icon: Icon, label, to }) {
  return (
    <NavLink
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-[8px] px-3 py-2 text-[13px] font-semibold transition",
          isActive
            ? "bg-[#f6eee8] text-[#3a261d] shadow-[0_8px_20px_rgba(32,20,15,0.12)]"
            : "text-white/84 hover:bg-white/8 hover:text-white",
        ].join(" ")
      }
      to={to}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] bg-white/10 text-white transition group-hover:bg-white/14">
        <Icon size={14} />
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const meta = useMemo(() => pageMeta[location.pathname] || pageMeta["/dashboard"], [location.pathname]);

  useEffect(() => {
    document.title = `${meta.title} | Bestilling Admin`;
  }, [meta.title]);

  async function handleLogout() {
    const result = await Swal.fire({
      title: "Log out?",
      text: "This will clear the local admin session.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Stay signed in",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
    });

    if (!result.isConfirmed) {
      return;
    }

    await logout();
    await Swal.fire({
      icon: "success",
      title: "Signed out",
      text: "The local session has been cleared.",
      confirmButtonColor: "#d96834",
    });
    navigate("/auth/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#efeeec] text-[#201813] lg:pl-[252px]">
        <aside className="fixed inset-y-0 left-0 hidden w-[252px] bg-[linear-gradient(180deg,#cf6432_0%,#ca5e2e_100%)] px-3 py-3 text-white lg:flex lg:flex-col">
          <div className="absolute inset-0 soft-grid opacity-[0.1]" />
          <div className="relative z-[1] flex items-center gap-3 rounded-[16px] border border-white/16 bg-[rgba(94,55,35,0.24)] px-4 py-3">
            <img className="h-10 w-auto max-w-[170px]" src="/logo2.webp" alt="Bestilling Admin" />
          </div>

          <div className="relative z-[1] mt-4 flex-1 overflow-auto pr-1 hide-scrollbar">
            <nav className="space-y-1.5">
              {navigation.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </nav>
          </div>

          <div className="relative z-[1] mt-4 rounded-[20px] border border-white/14 bg-[rgba(255,255,255,0.12)] p-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#d96834]">
                AN
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-white">{user?.name || "Admin User"}</p>
                <p className="truncate text-[11px] text-white/72">{user?.email || "admin@bestilling.no"}</p>
              </div>
            </div>
            <button
              className="mt-3 inline-flex w-full items-center justify-between rounded-[14px] bg-white px-4 py-2.5 text-[12px] font-bold text-[#d96834] transition hover:translate-y-[-1px]"
              onClick={handleLogout}
              type="button"
            >
              <span className="inline-flex items-center gap-2">
                <LogOut size={14} />
                Logout
              </span>
              <ArrowRight size={14} />
            </button>
          </div>
        </aside>

        <div className="min-h-screen bg-[#efeeec]">
          <header className="sticky top-0 z-20 border-b border-[#dfd7cf] bg-[#f6f5f2]">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.28em] text-[#9d7d68] lg:hidden">
                  <img className="h-7 w-auto" src="/logo2.webp" alt="Bestilling Admin" />
                </div>
                <h1 className="mt-0.5 text-[18px] font-extrabold leading-none text-[#1e1712]">
                  {meta.title}
                </h1>
                <p className="mt-1 max-w-2xl text-[11px] leading-4 text-[#6f655e]">
                  {meta.subtitle}
                </p>
              </div>

              <div className="hidden items-center gap-3 xl:flex">
                <label className="relative">
                <input
                  className="h-8 w-[240px] rounded-full border border-[#e3ddd7] bg-white px-4 pl-10 text-[11px] text-[#231913] outline-none transition placeholder:text-[#b0a59a] focus:border-[#d96834] focus:shadow-[0_0_0_3px_rgba(217,104,52,0.12)]"
                  placeholder="Search vendors, orders, or reports"
                  type="search"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a69486]">
                  <Search size={14} />
                </span>
              </label>

              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e3ddd7] bg-white text-[#2f241c]"
                type="button"
              >
                <Bell size={14} />
              </button>

                <img className="h-9 w-auto max-w-[160px]" src="/logo2.webp" alt="Bestilling Admin" />
              </div>
            </div>
          </header>

          <main className="px-4 py-3 pb-24 sm:px-6 lg:px-6 lg:py-3 lg:pb-8">
            <Outlet />
          </main>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/50 bg-white/90 px-2 py-2 shadow-[0_-12px_30px_rgba(53,34,20,0.1)] backdrop-blur-xl lg:hidden">
          <div className="hide-scrollbar flex items-stretch gap-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    [
                      "flex min-w-[80px] flex-1 flex-col items-center justify-center gap-1 rounded-[16px] px-3 py-2 text-[10px] font-semibold transition",
                      isActive
                        ? "bg-[#d96834] text-white shadow-[0_12px_26px_rgba(185,79,33,0.25)]"
                        : "text-[#6f655e] hover:bg-[#faf4ee]",
                    ].join(" ")
                  }
                  to={item.to}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
    </div>
  );
}
