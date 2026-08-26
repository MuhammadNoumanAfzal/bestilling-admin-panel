import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Bell,
  ChevronRight,
  FileText,
  Grid2x2,
  HandCoins,
  Home,
  LifeBuoy,
  LogOut,
  Menu,
  Search,
  Settings as SettingsIcon,
  SlidersHorizontal,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { executeProtectedGraphqlRequest } from "../api/protectedGraphqlClient.js";
import { getAdminDisplayName, getAdminRoleLabel } from "../../features/auth/authConfig.js";
import {
  getMyNotificationsRequest,
  getMyNotificationUnreadCountRequest,
  resolveAdminNotificationTarget,
} from "../../features/notifications/api/notificationsApi.js";
import { useAuth } from "../../features/auth/hooks/useAuth.js";

const GLOBAL_ORDER_SEARCH_QUERY = `
  query AdminLayoutOrderSearch($search: String, $page: Int!, $pageSize: Int!) {
    adminOrders(
      input: {
        search: $search
        page: $page
        limit: $pageSize
        sortField: PLACED_AT
        sortDirection: DESC
      }
    ) {
      items {
        id
        orderNumber
        status
        customer {
          fullName
        }
        vendor {
          businessName
        }
      }
    }
  }
`;

const GLOBAL_CUSTOMER_SEARCH_QUERY = `
  query AdminLayoutCustomerSearch(
    $search: String
    $page: Int!
    $pageSize: Int!
  ) {
    adminCustomers(
      search: $search
      page: $page
      pageSize: $pageSize
      sortBy: "JOINED_AT"
      sortOrder: "DESC"
    ) {
      items {
        id
        fullName
        email
        city
      }
    }
  }
`;

const GLOBAL_VENDOR_SEARCH_QUERY = `
  query AdminLayoutVendorSearch(
    $search: String
    $page: Int!
    $pageSize: Int!
  ) {
    adminVendors(
      filters: {
        search: $search
      }
      pagination: {
        page: $page
        pageSize: $pageSize
      }
      sort: {
        field: JOINED_AT
        order: DESC
      }
    ) {
      items {
        id
        name
        businessType
        city
      }
    }
  }
`;

const navigation = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: Grid2x2,
    description: "Overview of platform health, approvals, and activity.",
    keywords: ["overview", "home", "analytics", "stats"],
    matchPaths: ["/dashboard"],
  },
  {
    label: "Vendors",
    to: "/vendors",
    icon: Store,
    description: "Manage onboarding, approvals, and vendor operations.",
    keywords: ["stores", "restaurants", "applications", "onboarding"],
    matchPaths: ["/vendors", "/Vendors"],
  },
  {
    label: "Orders",
    to: "/orders",
    icon: ShoppingBag,
    description: "Monitor order flow, exceptions, and details.",
    keywords: ["purchases", "deliveries", "fulfillment"],
    matchPaths: ["/orders"],
  },
  {
    label: "Customers",
    to: "/customers",
    icon: Users,
    description: "Review customer activity, history, and retention.",
    keywords: ["users", "accounts", "buyers"],
    matchPaths: ["/customers"],
  },
  {
    label: "Payments",
    to: "/payouts",
    icon: Wallet,
    description: "Track payouts, settlements, and payment details.",
    keywords: ["payouts", "finance", "billing", "money"],
    matchPaths: ["/payouts"],
  },
  {
    label: "Commission",
    to: "/payouts/commission-settings",
    icon: HandCoins,
    description: "Configure platform commission rates.",
    keywords: ["rates", "fees", "percentages"],
    matchPaths: ["/payouts/commission-settings"],
  },
  {
    label: "Delivery",
    to: "/delivery",
    icon: Truck,
    description: "Manage delivery zones and coverage.",
    keywords: ["areas", "postal", "shipping", "coverage"],
    matchPaths: ["/delivery"],
  },
  {
    label: "Reports",
    to: "/reports",
    icon: FileText,
    description: "Review performance, analytics, and exports.",
    keywords: ["insights", "exports", "performance"],
    matchPaths: ["/reports"],
  },
  {
    label: "Support",
    to: "/support",
    icon: LifeBuoy,
    description: "Handle support tickets and escalations.",
    keywords: ["tickets", "help", "issues", "complaints"],
    matchPaths: ["/support"],
  },
  {
    label: "Notifications",
    to: "/notifications",
    icon: Bell,
    description: "Manage announcements and platform alerts.",
    keywords: ["alerts", "messages", "broadcasts"],
    matchPaths: ["/notifications"],
  },
  {
    label: "Home Curation",
    to: "/home-curation",
    icon: Home,
    description: "Curate homepage popular vendors, featured vendors, and products.",
    keywords: ["homepage", "featured", "popular", "products", "vendors"],
    matchPaths: ["/home-curation"],
  },
  {
    label: "Vendor Settings",
    to: "/vendors/settings",
    icon: SlidersHorizontal,
    description: "Control vendor-side categories, food types, occasions, and allergens.",
    keywords: ["taxonomy", "menu settings", "vendor setup", "allergens", "occasions"],
    matchPaths: ["/vendors/settings"],
  },
  {
    label: "Settings",
    to: "/settings",
    icon: SettingsIcon,
    description: "Update profile, preferences, and platform defaults.",
    keywords: ["preferences", "profile", "configuration"],
    matchPaths: ["/settings"],
  },
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
  "/home-curation": {
    title: "Home Curation",
    subtitle: "Manage homepage featured shelves for the client experience.",
  },
  "/vendors/settings": {
    title: "Vendor Settings",
    subtitle: "Manage the shared taxonomies that appear in the vendor menu builder.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Update platform defaults, permissions, and admin preferences.",
  },
};

function isNavItemActive(item, pathname) {
  if (item.to === "/vendors" && pathname.startsWith("/vendors/settings")) {
    return false;
  }

  if (item.to === "/payouts" && pathname.startsWith("/payouts/commission-settings")) {
    return false;
  }

  return item.matchPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function getCurrentMeta(pathname) {
  if (pathname.startsWith("/support/")) {
    return {
      title: "Support Details",
      subtitle: "Review the ticket conversation, user profile, and next actions.",
    };
  }

  if (pathname.startsWith("/delivery/")) {
    return {
      title: "Delivery Area Details",
      subtitle: "Manage postal coverage, service controls, and local configuration.",
    };
  }

  if (pathname.startsWith("/payouts/commission-settings")) {
    return {
      title: "Commission Settings",
      subtitle: "Manage platform commission rates for all vendors.",
    };
  }

  if (pathname.startsWith("/payouts/") && pathname !== "/payouts/commission-settings") {
    return {
      title: "Payment Details",
      subtitle: "Track customer payment and vendor payout for this order.",
    };
  }

  if (pathname.startsWith("/vendors/") && pathname.endsWith("/review")) {
    return {
      title: "Vendor Application Review",
      subtitle:
        "Review submitted documents, storefront details, and operational readiness before approval.",
    };
  }

  if (pathname.startsWith("/vendors/settings")) {
    return {
      title: "Vendor Settings",
      subtitle: "Manage categories, food types, occasions, and allergens for vendors.",
    };
  }

  if (pathname.startsWith("/home-curation")) {
    return {
      title: "Home Curation",
      subtitle: "Manage homepage featured shelves for popular vendors, featured vendors, and products.",
    };
  }

  if (pathname.startsWith("/vendors/") && pathname !== "/vendors") {
    return {
      title: "Vendor Details",
      subtitle: "Review menus, documents, financials, and vendor operations in one place.",
    };
  }

  if (pathname.startsWith("/orders/") && pathname !== "/orders") {
    return {
      title: "Order Details",
      subtitle: "Review order details, items invoice, customer & vendor profiles.",
    };
  }

  if (pathname.startsWith("/customers/") && pathname !== "/customers") {
    return {
      title: "Customer Details",
      subtitle: "Review the customer profile, order history, ratings, and active interactions.",
    };
  }

  return pageMeta[pathname] || pageMeta["/dashboard"];
}

function NavItem({ item, pathname, onNavigate }) {
  const Icon = item.icon;
  const active = isNavItemActive(item, pathname);

  return (
    <NavLink
      className={() =>
        [
          "group flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold transition",
          active ? "bg-[#fff3ec] text-[#c75f2e]" : "text-white hover:bg-white/8",
        ].join(" ")
      }
      onClick={onNavigate}
      to={item.to}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-[6px] transition">
        <Icon size={14} />
      </span>
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}

function SearchResults({ results, isLoading, onSelect, query }) {
  if (!query.trim()) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-40 overflow-hidden rounded-[18px] border border-[#e8dfd8] bg-white shadow-[0_24px_60px_rgba(45,28,16,0.14)]">
      {isLoading ? (
        <div className="px-4 py-5 text-[12px] text-[#8c7f75]">
          Searching orders, customers, and vendors...
        </div>
      ) : results.length ? (
        <div className="max-h-[320px] overflow-y-auto p-2">
          {results.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.to}
                className="flex w-full items-center gap-3 rounded-[12px] px-3 py-3 text-left transition hover:bg-[#faf4ee]"
                onClick={() => onSelect(item)}
                type="button"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff1e8] text-[#cf6e38]">
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-[#231913]">
                    {item.label}
                  </span>
                  <span className="block truncate text-[12px] text-[#7b6f66]">
                    {item.description}
                  </span>
                </span>
                <ChevronRight className="shrink-0 text-[#b4a79d]" size={16} />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-5 text-[12px] text-[#8c7f75]">
          No matching resources found for “{query.trim()}”.
        </div>
      )}
    </div>
  );
}

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0);
  const profileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const knownUnreadNotificationIdsRef = useRef(new Set());
  const hasPrimedNotificationsRef = useRef(false);
  const previousUnreadCountRef = useRef(0);
  const lastToastNotificationIdRef = useRef("");

  const meta = useMemo(() => getCurrentMeta(location.pathname), [location.pathname]);
  const initials = useMemo(() => {
    const source = getAdminDisplayName(user);
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  }, [user]);

  const filteredNavigation = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return navigation.filter((item) => {
      const haystack = [item.label, item.description, ...(item.keywords || [])]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [searchQuery]);

  const mergedSearchResults = useMemo(() => {
    const seenKeys = new Set();
    return [...globalSearchResults, ...filteredNavigation].filter((item) => {
      const key = `${item.to}|${item.label}`;
      if (seenKeys.has(key)) {
        return false;
      }
      seenKeys.add(key);
      return true;
    });
  }, [filteredNavigation, globalSearchResults]);

  const shouldShowSearchResults = isSearchFocused && searchQuery.trim().length > 0;

  async function showNotificationToast(notification) {
    if (!notification?.id || lastToastNotificationIdRef.current === notification.id) {
      return;
    }

    lastToastNotificationIdRef.current = notification.id;

    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: notification.type === "SUPPORT_REPLY" ? "info" : "success",
      title: notification.title || "New notification",
      text: notification.message || "You have a new unread notification.",
      showConfirmButton: true,
      confirmButtonText: "Open",
      timer: 6000,
      timerProgressBar: true,
      showCloseButton: true,
      didOpen: (toast) => {
        toast.addEventListener("click", () => {
          navigate(resolveAdminNotificationTarget(notification));
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(resolveAdminNotificationTarget(notification));
      }
    });
  }

  useEffect(() => {
    document.title = `${meta.title} | Bestilling Admin`;
  }, [meta.title]);

  useEffect(() => {
    let isCancelled = false;
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      setGlobalSearchResults([]);
      setIsSearching(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);

      try {
        const [ordersData, customersData, vendorsData] = await Promise.all([
          executeProtectedGraphqlRequest(GLOBAL_ORDER_SEARCH_QUERY, {
            search: normalizedQuery,
            page: 1,
            pageSize: 4,
          }).catch(() => null),
          executeProtectedGraphqlRequest(GLOBAL_CUSTOMER_SEARCH_QUERY, {
            search: normalizedQuery,
            page: 1,
            pageSize: 4,
          }).catch(() => null),
          executeProtectedGraphqlRequest(GLOBAL_VENDOR_SEARCH_QUERY, {
            search: normalizedQuery,
            page: 1,
            pageSize: 4,
          }).catch(() => null),
        ]);

        if (isCancelled) {
          return;
        }

        const orderResults = Array.isArray(ordersData?.adminOrders?.items)
          ? ordersData.adminOrders.items
              .filter((item) => item?.id)
              .map((item) => ({
                to: `/orders/${encodeURIComponent(item.id)}`,
                label: item.orderNumber || `Order ${item.id}`,
                description: [
                  "Order",
                  item.customer?.fullName ? `Customer: ${item.customer.fullName}` : "",
                  item.vendor?.businessName ? `Vendor: ${item.vendor.businessName}` : "",
                ]
                  .filter(Boolean)
                  .join(" • "),
                icon: ShoppingBag,
              }))
          : [];

        const customerResults = Array.isArray(customersData?.adminCustomers?.items)
          ? customersData.adminCustomers.items
              .filter((item) => item?.id)
              .map((item) => ({
                to: `/customers/${encodeURIComponent(item.id)}`,
                label: item.fullName || item.email || `Customer ${item.id}`,
                description: [
                  "Customer",
                  item.email || "",
                  item.city || "",
                ]
                  .filter(Boolean)
                  .join(" • "),
                icon: Users,
              }))
          : [];

        const vendorResults = Array.isArray(vendorsData?.adminVendors?.items)
          ? vendorsData.adminVendors.items
              .filter((item) => item?.id)
              .map((item) => ({
                to: `/vendors/${encodeURIComponent(item.id)}`,
                label: item.name || `Vendor ${item.id}`,
                description: [
                  "Vendor",
                  item.businessType || "",
                  item.city || "",
                ]
                  .filter(Boolean)
                  .join(" • "),
                icon: Store,
              }))
          : [];

        setGlobalSearchResults([...orderResults, ...customerResults, ...vendorResults]);
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  useEffect(() => {
    let isMounted = true;

    async function syncNotifications({ allowToast = false } = {}) {
      try {
        const [count, unreadResult] = await Promise.all([
          getMyNotificationUnreadCountRequest(),
          getMyNotificationsRequest({
            page: 1,
            pageSize: 5,
            status: "UNREAD",
            type: null,
          }),
        ]);

        if (!isMounted) {
          return;
        }

        setNotificationUnreadCount(count);

        const unreadItems = unreadResult.items || [];
        const latestIds = new Set(unreadItems.map((item) => item.id));
        const newUnreadItems = unreadItems.filter(
          (item) => !knownUnreadNotificationIdsRef.current.has(item.id),
        );
        const hasUnreadIncrease = count > previousUnreadCountRef.current;
        const latestNotification = newUnreadItems[0] || unreadItems[0] || null;

        if (allowToast && latestNotification) {
          const shouldShowPrimedToast =
            !hasPrimedNotificationsRef.current &&
            count > 0 &&
            location.pathname !== "/notifications";
          const shouldShowUpdateToast =
            hasPrimedNotificationsRef.current && (newUnreadItems.length > 0 || hasUnreadIncrease);

          if (shouldShowPrimedToast || shouldShowUpdateToast) {
            await showNotificationToast(latestNotification);
          }
        }

        knownUnreadNotificationIdsRef.current = latestIds;
        hasPrimedNotificationsRef.current = true;
        previousUnreadCountRef.current = count;
      } catch {
        if (isMounted) {
          setNotificationUnreadCount(0);
        }
      }
    }

    function handleNotificationsUpdated() {
      syncNotifications();
    }

    syncNotifications();
    window.addEventListener("admin-notifications-updated", handleNotificationsUpdated);
    const intervalId = window.setInterval(() => {
      syncNotifications({ allowToast: location.pathname !== "/notifications" });
    }, 15000);

    return () => {
      isMounted = false;
      window.removeEventListener("admin-notifications-updated", handleNotificationsUpdated);
      window.clearInterval(intervalId);
    };
  }, [location.pathname]);

  useEffect(() => {
    setIsMobileNavOpen(false);
    setIsProfileMenuOpen(false);
    setIsSearchFocused(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  function handleSearchSubmit(event) {
    event.preventDefault();

    if (!mergedSearchResults.length) {
      return;
    }

    const firstResult = mergedSearchResults[0];
    navigate(firstResult.to);
    setSearchQuery("");
    setGlobalSearchResults([]);
    setIsSearchFocused(false);
  }

  function handleSearchSelect(item) {
    navigate(item.to);
    setSearchQuery("");
    setGlobalSearchResults([]);
    setIsSearchFocused(false);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#211f1f] text-[#201813]">
      <div className="mx-auto min-h-screen max-w-[1440px] overflow-x-clip bg-[#f4f1ee] lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
        {isMobileNavOpen ? (
          <button
            aria-label="Close navigation overlay"
            className="fixed inset-0 z-40 bg-[#170f0a]/45 backdrop-blur-[2px] lg:hidden"
            onClick={() => setIsMobileNavOpen(false)}
            type="button"
          />
        ) : null}

        <aside
          className={[
            "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[linear-gradient(180deg,#cb6432_0%,#c55b2d_100%)] text-white transition duration-300 lg:static lg:w-auto lg:translate-x-0",
            isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex h-[84px] items-center justify-between border-b border-white/12 px-4">
            <img className="h-10 w-auto max-w-[92px]" src="/logo.png" alt="Bestilling Admin" />
              <button
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 lg:hidden"
                onClick={() => setIsMobileNavOpen(false)}
                type="button"
              >
              <X size={18} />
            </button>
          </div>

          <div className="border-b border-white/10 px-4 py-4 lg:hidden">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">Signed in as</p>
            <p className="mt-2 truncate text-[15px] font-bold text-white">{getAdminDisplayName(user)}</p>
            <p className="truncate text-[12px] text-white/75">{getAdminRoleLabel(user?.role)}</p>
          </div>

          <div className="flex-1 overflow-auto px-3 py-6 hide-scrollbar">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavItem
                  item={item}
                  key={item.to}
                  onNavigate={() => setIsMobileNavOpen(false)}
                  pathname={location.pathname}
                />
              ))}
            </nav>
          </div>

          <div className="px-3 pb-4">
            <button
              className="flex w-full cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/8"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <div className="min-h-screen overflow-x-hidden bg-[#f7f5f3]">
          <header className="sticky top-0 z-30 border-b border-[#ebe4de] bg-white/92 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-5">
              <button
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#2f241c] transition hover:bg-[#f5f1ed] lg:hidden"
                onClick={() => setIsMobileNavOpen(true)}
                type="button"
              >
                <Menu size={18} />
              </button>

              <div className="min-w-0 lg:hidden">
                <div className="min-w-0 lg:hidden">
                  <p className="truncate text-[22px] font-bold tracking-[-0.03em] text-[#1f1711] lg:hidden">
                    {meta.title}
                  </p>
                </div>
              </div>

              <form
                className="relative order-4 w-full lg:order-none lg:max-w-[520px] lg:flex-1"
                onSubmit={handleSearchSubmit}
                ref={searchRef}
              >
                <label className="relative block">
                  <input
                    className="h-11 w-full rounded-full border border-transparent bg-[#f1f4f8] px-4 pl-11 pr-4 text-[12px] text-[#231913] outline-none transition placeholder:text-[#a9afba] focus:border-[#ebddd1] focus:bg-white focus:shadow-[0_0_0_4px_rgba(206,105,56,0.11)]"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search orders, customers, vendors, IDs, or admin pages..."
                    type="search"
                    value={searchQuery}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adb3bd]">
                    <Search size={15} />
                  </span>
                </label>

                {shouldShowSearchResults ? (
                  <SearchResults
                    isLoading={isSearching}
                    onSelect={handleSearchSelect}
                    query={searchQuery}
                    results={mergedSearchResults}
                  />
                ) : null}
              </form>

              <div className="ml-auto flex items-center gap-2 border-l border-[#ebe4de] pl-3">
                <button
                  aria-label="Open notifications"
                  className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#2f241c] transition hover:bg-[#f5f1ed]"
                  onClick={() => navigate("/notifications")}
                  type="button"
                >
                  <Bell size={16} />
                  {notificationUnreadCount > 0 ? (
                    <span className="absolute right-1.5 top-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#cf6e38] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                      {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
                    </span>
                  ) : null}
                </button>
              </div>

              <div className="relative" ref={profileMenuRef}>
                <button
                  className="flex cursor-pointer items-center gap-3 rounded-[14px] bg-white pl-2 pr-2 py-1 transition hover:bg-[#faf6f2]"
                  onClick={() => setIsProfileMenuOpen((current) => !current)}
                  type="button"
                >
                  {user?.avatar?.url ? (
                    <img
                      alt={getAdminDisplayName(user)}
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.avatar.url}
                    />
                  ) : (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0e7] text-[#d16737]">
                      <span className="hidden sm:inline">
                        <UserRound size={18} />
                      </span>
                      <span className="text-[13px] font-bold sm:hidden">{initials}</span>
                    </span>
                  )}
                  <div className="hidden min-w-0 text-left sm:block">
                    <p className="truncate text-[12px] font-bold text-[#1f1711]">
                      {getAdminDisplayName(user)}
                    </p>
                    <p className="truncate text-[11px] text-[#7f746d]">
                      {getAdminRoleLabel(user?.role)}
                    </p>
                  </div>
                </button>

                {isProfileMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-40 w-[220px] overflow-hidden rounded-[18px] border border-[#e8dfd8] bg-white shadow-[0_24px_60px_rgba(45,28,16,0.14)]">
                    <div className="border-b border-[#f0e7e0] px-4 py-3">
                      <p className="truncate text-[13px] font-bold text-[#231913]">
                        {getAdminDisplayName(user)}
                      </p>
                      <p className="truncate text-[12px] text-[#7b6f66]">{user?.email || ""}</p>
                    </div>
                    <div className="p-2">
                      <button
                        className="flex w-full cursor-pointer items-center gap-3 rounded-[12px] px-3 py-3 text-left text-[13px] font-semibold text-[#2e241d] transition hover:bg-[#faf4ee]"
                        onClick={() => navigate("/settings")}
                        type="button"
                      >
                        <SettingsIcon size={15} />
                        <span>Account settings</span>
                      </button>
                      <button
                        className="flex w-full cursor-pointer items-center gap-3 rounded-[12px] px-3 py-3 text-left text-[13px] font-semibold text-[#b74f28] transition hover:bg-[#fff3ec]"
                        onClick={handleLogout}
                        type="button"
                      >
                        <LogOut size={15} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <main className="overflow-x-hidden px-3 py-4 pb-24 sm:px-6 lg:px-5 lg:py-5 lg:pb-8">
            <div className="mb-5 hidden lg:block">
              <h1 className="text-[34px] font-bold tracking-[-0.04em] text-[#18120f]">{meta.title}</h1>
              <p className="mt-1 text-[15px] leading-7 text-[#6f645d]">{meta.subtitle}</p>
            </div>
            <Outlet />
          </main>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/50 bg-white/92 px-2 py-2 shadow-[0_-12px_30px_rgba(53,34,20,0.1)] backdrop-blur-xl lg:hidden">
          <div className="hide-scrollbar flex items-stretch gap-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isNavItemActive(item, location.pathname);

              return (
                <NavLink
                  key={item.to}
                  className={() =>
                    [
                      "flex min-w-[84px] flex-1 flex-col items-center justify-center gap-1 rounded-[16px] px-3 py-2 text-[10px] font-semibold transition",
                      active ? "bg-[#d96834] text-white" : "text-[#6f655e] hover:bg-[#faf4ee]",
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
