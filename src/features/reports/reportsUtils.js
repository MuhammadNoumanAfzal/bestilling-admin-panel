export const reportFilterOptions = [
  "Last 7 days",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "This Year",
  "Custom Date",
  "Clear Filter",
];

export const exportSectionOptions = ["SUMMARY", "REVENUE", "ORDERS", "VENDORS", "CUSTOMERS", "CATEGORY", "OPERATIONS"];

function getNumberValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function createChartScale(scale, bars) {
  if (Array.isArray(scale) && scale.length) {
    return scale.map((item) => getNumberValue(item));
  }

  const maxValue = Math.max(...bars.map((item) => getNumberValue(item.value)), 0);
  const step = maxValue > 0 ? Math.ceil(maxValue / 4) : 1;
  return [0, step, step * 2, step * 3, step * 4];
}

function getVendorInitials(name) {
  return String(name || "")
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() || "")
    .join("");
}

function normalizeMoney(value) {
  return value?.formatted || `${value?.currency || ""}${value?.amount ?? 0}`;
}

function normalizeChart(analytics, options = {}) {
  const bars = (analytics?.bars || []).map((item) => ({
    label: item?.label || "",
    value: getNumberValue(item?.value),
  }));

  return {
    title: analytics?.title || options.defaultTitle || "",
    subtitle: analytics?.subtitle || options.defaultSubtitle || "",
    scale: createChartScale(analytics?.scale, bars),
    bars,
    valuePrefix: options.showCurrency ? `${analytics?.currency || ""} ` : "",
  };
}

export function buildReportsSnapshotViewModel(snapshot, filterLabel) {
  return {
    summary: [
      {
        id: "revenue",
        label: "Total Revenue",
        value: normalizeMoney(snapshot?.summary?.totalRevenue),
        icon: "wallet",
        accent: "soft",
      },
      {
        id: "orders",
        label: "Total Orders",
        value: String(snapshot?.summary?.totalOrders ?? 0),
        icon: "orders",
        accent: "warm",
      },
      {
        id: "vendors",
        label: "Active Vendors",
        value: String(snapshot?.summary?.activeVendors ?? 0),
        icon: "store",
        accent: "neutral",
      },
      {
        id: "customers",
        label: "Active Customers",
        value: String(snapshot?.summary?.activeCustomers ?? 0),
        icon: "users",
        accent: "soft",
      },
      {
        id: "approvals",
        label: "Pending Approvals",
        value: String(snapshot?.summary?.pendingApprovals ?? 0),
        icon: "clock",
        accent: "warm",
      },
      {
        id: "aov",
        label: "Average Order Value",
        value: normalizeMoney(snapshot?.summary?.averageOrderValue),
        icon: "receipt",
        accent: "neutral",
      },
    ],
    revenueAnalytics: {
      ...normalizeChart(snapshot?.revenueAnalytics, {
        defaultTitle: "Revenue Analytics",
        defaultSubtitle: "Track financial growth trends over time",
        showCurrency: false,
      }),
      filterLabel,
    },
    orderAnalytics: normalizeChart(snapshot?.orderAnalytics, {
      defaultTitle: "Order Analytics",
      defaultSubtitle: "Order volume across the selected period",
    }),
    vendorPerformance: buildVendorPerformanceViewModel(snapshot?.vendorPerformance),
    customerAnalytics: {
      stats: (snapshot?.customerAnalytics?.stats || []).map((item) => ({
        id: item?.id || item?.label || Math.random().toString(36).slice(2),
        label: item?.label || "",
        value: String(item?.value ?? ""),
        note: item?.note || "",
      })),
      satisfaction: {
        score: typeof snapshot?.customerAnalytics?.satisfaction?.score === "number"
          ? `${snapshot.customerAnalytics.satisfaction.score}%`
          : String(snapshot?.customerAnalytics?.satisfaction?.score || "0%"),
        note: snapshot?.customerAnalytics?.satisfaction?.note || "No customer satisfaction note.",
      },
    },
    categoryPerformance: (snapshot?.categoryPerformance || []).map((item) => ({
      id: item?.id || "",
      label: item?.label || "",
      value: getNumberValue(item?.value),
      color: item?.color || "#d46a37",
    })),
    operationalHealth: (snapshot?.operationalHealth || []).map((item) => ({
      id: item?.id || "",
      label: item?.label || "",
      value: String(item?.value ?? ""),
    })),
  };
}

export function buildVendorPerformanceViewModel(vendorPerformance) {
  return {
    registration: {
      count: vendorPerformance?.registration?.count ?? 0,
      note: vendorPerformance?.registration?.note || "No recent registration note.",
    },
    vendors: (vendorPerformance?.topVendors || []).map((vendor) => ({
      id: vendor?.id || "",
      name: vendor?.name || "Unknown vendor",
      region: vendor?.region || "Unknown region",
      revenue: normalizeMoney(vendor?.revenue),
      orders: vendor?.orders ?? 0,
      avatar: getVendorInitials(vendor?.name),
      avatarUrl: vendor?.avatarUrl || "",
    })),
  };
}
