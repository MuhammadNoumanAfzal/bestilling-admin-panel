import { useEffect, useMemo } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Bell,
  Grid2x2,
  LogOut,
  LifeBuoy,
  Settings as SettingsIcon,
  Search,
  Truck,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth.js";

const navigation = [
  { label: "Dashboard", to: "/dashboard", icon: Grid2x2 },
  { label: "Delivery", to: "/delivery", icon: Truck },
  { label: "Supports", to: "/support", icon: LifeBuoy },
  { label: "Notification", to: "/notifications", icon: Bell },
  { label: "Settings", to: "/settings", icon: SettingsIcon },
];

const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
    subtitle:
      "A clean overview of admin activity, vendor movement, and platform health.",
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
  "/notifications": {
    title: "Notifications",
    subtitle: "Review platform alerts, announcements, and admin visibility.",
  },
  "/notifications/create": {
    title: "Create Notification",
    subtitle: "Draft, target, and schedule a new platform notification.",
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
            ? "bg-[#fff3ec] text-[#c75f2e]"
            : "text-white hover:bg-white/8",
        ].join(" ")
      }
      to={to}
    >
      <span
        className={[
          "inline-flex h-5 w-5 items-center justify-center rounded-[6px] transition",
          "group-hover:text-white",
        ].join(" ")}
      >
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
  const meta = useMemo(() => {
    if (location.pathname.startsWith("/support/")) {
      return {
        title: "Support Details",
        subtitle:
          "Review the ticket conversation, user profile, and next actions.",
      };
    }

    if (location.pathname.startsWith("/delivery/")) {
      return {
        title: "Delivery Area Details",
        subtitle:
          "Manage postal coverage, service controls, and local configuration.",
      };
    }

    if (location.pathname.startsWith("/payouts/commission-settings")) {
      return {
        title: "Commission Settings",
        subtitle: "Manage platform commission rates for all vendors.",
      };
    }

    if (
      location.pathname.startsWith("/payouts/") &&
      location.pathname !== "/payouts/commission-settings"
    ) {
      return {
        title: "Payment Details",
        subtitle: "Track customer payment and vendor payout for this order.",
      };
    }

    if (
      location.pathname.startsWith("/orders/") &&
      location.pathname !== "/orders"
    ) {
      return {
        title: "Order Details",
        subtitle:
          "Review order details, items invoice, customer & vendor profiles.",
      };
    }

    if (
      location.pathname.startsWith("/customers/") &&
      location.pathname !== "/customers"
    ) {
      return {
        title: "Customer Details",
        subtitle:
          "Review the customer profile, order history, ratings, and active interactions.",
      };
    }

    return pageMeta[location.pathname] || pageMeta["/dashboard"];
  }, [location.pathname]);
  const initials = useMemo(() => {
    const source = user?.name?.trim() || "Admin User";
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  }, [user?.name]);

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
    <div className="min-h-screen bg-[#211f1f] text-[#201813]">
      <div className="mx-auto min-h-screen max-w-[1440px] bg-[#f4f1ee] lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden bg-[linear-gradient(180deg,#cb6432_0%,#c55b2d_100%)] text-white lg:flex lg:flex-col">
          <div className="flex h-[84px] items-center justify-center border-b border-white/12 px-4">
            <img
              className="h-10 w-auto max-w-[84px]"
              src="/logo.png"
              alt="Bestilling Admin"
            />
          </div>

          <div className="flex-1 overflow-auto px-3 py-6 hide-scrollbar">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </nav>
          </div>

          <div className="px-3 pb-4">
            <button
              className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-white/8"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <div className="min-h-screen bg-[#f7f5f3]">
          <header className="border-b border-[#ebe4de] bg-white">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-5">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex items-center gap-2 lg:hidden">
                  <img
                    className="h-8 w-auto max-w-[72px]"
                    src="/logo2.webp"
                    alt="Bestilling Admin"
                  />
                </div>
                <label className="relative w-full max-w-[460px]">
                  <input
                    className="h-10 w-full rounded-full bg-[#f1f4f8] px-4 pl-10 text-[11px] text-[#231913] outline-none transition placeholder:text-[#a9afba] focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
                    placeholder="Search platform resources, orders, or vendors..."
                    type="search"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adb3bd]">
                    <Search size={14} />
                  </span>
                </label>
              </div>

              <div className="flex items-center self-stretch border-l border-[#ebe4de] pl-3">
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2f241c] transition hover:bg-[#f5f1ed]"
                  type="button"
                >
                  <Bell size={16} />
                </button>
              </div>

              <div className="hidden items-center gap-3 rounded-[14px] bg-white pl-3 sm:flex">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0e7] text-[#d16737]">
                  <UserRound size={18} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-[#1f1711]">
                    {user?.name || "Raja Haider"}
                  </p>
                  <p className="truncate text-[11px] text-[#7f746d]">Admin</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-[14px] bg-white sm:hidden">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0e7] text-[#d16737]">
                  {initials}
                </span>
              </div>
            </div>
          </header>

          <main className="px-4 py-5 pb-24 sm:px-6 lg:px-5 lg:py-5 lg:pb-8">
            <Outlet />
          </main>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/50 bg-white/92 px-2 py-2 shadow-[0_-12px_30px_rgba(53,34,20,0.1)] backdrop-blur-xl lg:hidden">
          <div className="hide-scrollbar flex items-stretch gap-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    [
                      "flex min-w-[84px] flex-1 flex-col items-center justify-center gap-1 rounded-[16px] px-3 py-2 text-[10px] font-semibold transition",
                      isActive
                        ? "bg-[#d96834] text-white"
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
    </div>
  );
}
