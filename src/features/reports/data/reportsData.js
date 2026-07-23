export const reportsSummary = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "NOK1,284,500",
    icon: "wallet",
    accent: "soft",
  },
  {
    id: "orders",
    label: "Total Orders",
    value: "4,820",
    icon: "orders",
    accent: "warm",
  },
  {
    id: "vendors",
    label: "Active Vendors",
    value: "156",
    icon: "store",
    accent: "neutral",
  },
  {
    id: "customers",
    label: "Active Customers",
    value: "12,402",
    icon: "users",
    accent: "soft",
  },
  {
    id: "approvals",
    label: "Pending Approvals",
    value: "NOK192,675",
    icon: "clock",
    accent: "warm",
  },
  {
    id: "aov",
    label: "Average Order Value",
    value: "NOK266.50",
    icon: "receipt",
    accent: "neutral",
  },
];

export const reportFilterOptions = [
  "Last 7 days",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "This Year",
  "Custom Date",
  "Clear Filter",
];

export const revenueAnalytics = {
  title: "Revenue Analytics",
  subtitle: "Track financial growth trends over time",
  filterLabel: "Last 7 days",
  valuePrefix: "$",
  scale: [0, 2500, 5000, 7500, 10000],
  bars: [
    { label: "Mon", value: 3200 },
    { label: "Tue", value: 6200 },
    { label: "Wed", value: 5000 },
    { label: "Thu", value: 10300 },
    { label: "Fri", value: 8900 },
    { label: "Sat", value: 8400 },
    { label: "Sun", value: 6300 },
  ],
};

export const orderAnalytics = {
  title: "Order Analytics",
  subtitle: "Monthly order distribution",
  scale: [0, 65, 130, 195, 260],
  bars: [
    { label: "Apr", value: 80 },
    { label: "May", value: 170 },
    { label: "Jun", value: 225 },
    { label: "Jul", value: 110 },
    { label: "Aug", value: 260 },
    { label: "Sep", value: 245 },
  ],
};

export const topVendors = [
  {
    id: "vendor-1",
    name: "Royal Nordic Kitchen",
    region: "Oslo",
    revenue: "NOK248,934",
    orders: 112,
    avatar: "RK",
    avatarUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "vendor-2",
    name: "Fjord Bites",
    region: "Bergen",
    revenue: "NOK32,100",
    orders: 44,
    avatar: "FB",
    avatarUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "vendor-3",
    name: "Oslo Event Deli",
    region: "Oslo",
    revenue: "NOK28,400",
    orders: 37,
    avatar: "OD",
    avatarUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "vendor-4",
    name: "Veggie Bloom",
    region: "Trondheim",
    revenue: "NOK19,800",
    orders: 28,
    avatar: "VB",
    avatarUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=120&q=80",
  },
];

export const vendorRegistration = {
  count: 24,
  note: "+6 from last week",
};

export const customerAnalyticsStats = [
  {
    id: "new-customers",
    label: "New Customers",
    value: "1,420",
    note: "+12% vs last month",
  },
  {
    id: "returning-customers",
    label: "Returning Customers",
    value: "3,382",
    note: "64% of total mix",
  },
  {
    id: "customer-growth",
    label: "Customer Growth",
    value: "2.4x",
    note: "YoY expansion",
  },
  {
    id: "spend",
    label: "Avg Spending",
    value: "NOK428.50",
    note: "per retained user",
  },
];

export const customerSatisfaction = {
  score: "92.8%",
  note: "Based on 1,026 completed meal ratings",
};

export const categoryPerformance = [
  {
    id: "wedding",
    label: "Wedding Catering",
    value: 45,
    color: "#ff8a1f",
  },
  {
    id: "corporate",
    label: "Corporate Catering",
    value: 28,
    color: "#1f7aec",
  },
  {
    id: "private-events",
    label: "Private Events",
    value: 15,
    color: "#6e39d9",
  },
  {
    id: "birthday",
    label: "Birthday Catering",
    value: 12,
    color: "#61d84b",
  },
];

export const operationalHealth = [
  {
    id: "completed-orders",
    label: "Completed Orders",
    value: "4,210",
  },
  {
    id: "cancelled-orders",
    label: "Cancelled Orders",
    value: "142",
  },
  {
    id: "delivery-time",
    label: "Avg Delivery Time",
    value: "42 min",
  },
  {
    id: "support",
    label: "Support Tickets",
    value: "12 Open",
  },
  {
    id: "approval-rate",
    label: "Approval Rate",
    value: "98.5%",
  },
];

const reportSnapshots = {
  "Last 7 days": {
    summary: reportsSummary,
    revenueAnalytics,
    orderAnalytics,
  },
  "Last Month": {
    summary: [
      { ...reportsSummary[0], value: "NOK1,402,240" },
      { ...reportsSummary[1], value: "5,184" },
      { ...reportsSummary[2], value: "161" },
      { ...reportsSummary[3], value: "12,860" },
      { ...reportsSummary[4], value: "NOK214,880" },
      { ...reportsSummary[5], value: "NOK270.50" },
    ],
    revenueAnalytics: {
      ...revenueAnalytics,
      bars: [
        { label: "W1", value: 5800 },
        { label: "W2", value: 7200 },
        { label: "W3", value: 8800 },
        { label: "W4", value: 7600 },
      ],
    },
    orderAnalytics: {
      ...orderAnalytics,
      bars: [
        { label: "W1", value: 148 },
        { label: "W2", value: 176 },
        { label: "W3", value: 232 },
        { label: "W4", value: 214 },
      ],
    },
  },
  "Last 3 Months": {
    summary: [
      { ...reportsSummary[0], value: "NOK4,186,500" },
      { ...reportsSummary[1], value: "14,220" },
      { ...reportsSummary[2], value: "168" },
      { ...reportsSummary[3], value: "14,982" },
      { ...reportsSummary[4], value: "NOK328,140" },
      { ...reportsSummary[5], value: "NOK294.40" },
    ],
    revenueAnalytics: {
      ...revenueAnalytics,
      bars: [
        { label: "Apr", value: 7100 },
        { label: "May", value: 8600 },
        { label: "Jun", value: 9800 },
      ],
    },
    orderAnalytics: {
      ...orderAnalytics,
      bars: [
        { label: "Apr", value: 176 },
        { label: "May", value: 228 },
        { label: "Jun", value: 248 },
      ],
    },
  },
  "Last 6 Months": {
    summary: [
      { ...reportsSummary[0], value: "NOK8,294,100" },
      { ...reportsSummary[1], value: "28,930" },
      { ...reportsSummary[2], value: "172" },
      { ...reportsSummary[3], value: "17,408" },
      { ...reportsSummary[4], value: "NOK624,540" },
      { ...reportsSummary[5], value: "NOK286.70" },
    ],
    revenueAnalytics: {
      ...revenueAnalytics,
      bars: [
        { label: "Jan", value: 6400 },
        { label: "Feb", value: 7020 },
        { label: "Mar", value: 8110 },
        { label: "Apr", value: 8740 },
        { label: "May", value: 9260 },
        { label: "Jun", value: 9940 },
      ],
    },
    orderAnalytics: {
      ...orderAnalytics,
      bars: [
        { label: "Jan", value: 152 },
        { label: "Feb", value: 168 },
        { label: "Mar", value: 190 },
        { label: "Apr", value: 214 },
        { label: "May", value: 238 },
        { label: "Jun", value: 252 },
      ],
    },
  },
  "This Year": {
    summary: [
      { ...reportsSummary[0], value: "NOK16,984,320" },
      { ...reportsSummary[1], value: "56,482" },
      { ...reportsSummary[2], value: "184" },
      { ...reportsSummary[3], value: "24,106" },
      { ...reportsSummary[4], value: "NOK1,242,850" },
      { ...reportsSummary[5], value: "NOK300.70" },
    ],
    revenueAnalytics: {
      ...revenueAnalytics,
      bars: [
        { label: "Jan", value: 6200 },
        { label: "Feb", value: 7150 },
        { label: "Mar", value: 7680 },
        { label: "Apr", value: 8460 },
        { label: "May", value: 9340 },
        { label: "Jun", value: 9860 },
        { label: "Jul", value: 10300 },
      ],
    },
    orderAnalytics: {
      ...orderAnalytics,
      bars: [
        { label: "Jan", value: 136 },
        { label: "Feb", value: 150 },
        { label: "Mar", value: 184 },
        { label: "Apr", value: 208 },
        { label: "May", value: 224 },
        { label: "Jun", value: 246 },
        { label: "Jul", value: 260 },
      ],
    },
  },
};

function getCustomDateSnapshot(startDate, endDate) {
  if (!startDate || !endDate) {
    return reportSnapshots["Last 7 days"];
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const diffInDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
  const growthFactor = Math.min(Math.max(diffInDays / 7, 0.75), 8);

  return {
    summary: [
      { ...reportsSummary[0], value: `NOK${Math.round(1284500 * growthFactor).toLocaleString("en-US")}` },
      { ...reportsSummary[1], value: Math.round(4820 * growthFactor).toLocaleString("en-US") },
      { ...reportsSummary[2], value: String(Math.min(220, Math.round(156 + diffInDays / 3))) },
      { ...reportsSummary[3], value: Math.round(12402 * (0.85 + growthFactor / 4)).toLocaleString("en-US") },
      { ...reportsSummary[4], value: `NOK${Math.round(192675 * growthFactor).toLocaleString("en-US")}` },
      { ...reportsSummary[5], value: `NOK${(266.5 + growthFactor * 8).toFixed(2)}` },
    ],
    revenueAnalytics: {
      ...revenueAnalytics,
      filterLabel: "Custom Date",
      bars: revenueAnalytics.bars.map((bar, index) => ({
        label: bar.label,
        value: Math.round(bar.value * (0.8 + growthFactor * (0.12 + index * 0.015))),
      })),
    },
    orderAnalytics: {
      ...orderAnalytics,
      bars: orderAnalytics.bars.map((bar, index) => ({
        label: bar.label,
        value: Math.min(260, Math.round(bar.value * (0.82 + growthFactor * (0.08 + index * 0.01)))),
      })),
    },
  };
}

export function getReportSnapshot(filterLabel, startDate = "", endDate = "") {
  if (filterLabel === "Custom Date") {
    return getCustomDateSnapshot(startDate, endDate);
  }

  return reportSnapshots[filterLabel] || reportSnapshots["Last 7 days"];
}
