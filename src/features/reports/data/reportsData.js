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

export const reportFilterOptions = ["Last 7 days", "Last 14 days", "Last 30 days"];

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
