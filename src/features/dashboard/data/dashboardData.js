export const dashboardStats = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "NOK 248,560",
    note: "Compared to NOK 218K last month",
    accent: "orange",
  },
  {
    id: "orders",
    title: "Total Orders",
    value: "4,825",
    note: "+12.3% week over week",
    accent: "orange",
  },
  {
    id: "vendors",
    title: "Active Vendors",
    value: "128",
    note: "3 new onboarded today",
    accent: "slate",
  },
  {
    id: "customers",
    title: "Total Customers",
    value: "8,420",
    note: "98% customer satisfaction",
    accent: "green",
  },
  {
    id: "approvals",
    title: "Pending Approvals",
    value: "12",
    note: "4 high-priority reviews",
    accent: "amber",
  },
  {
    id: "support",
    title: "Open Support",
    value: "18",
    note: "Average response time: 14m",
    accent: "orange",
  },
];

export const vendorBreakdown = {
  active: 128,
  pending: 12,
  outOfStock: 8,
  topRated: 15,
};

export const topPerformingVendors = [
  {
    id: "tp-1",
    name: "The Pasta Place",
    rating: 4.9,
    avatar: "PP",
    avatarUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "tp-2",
    name: "Healthy Greens",
    rating: 4.8,
    avatar: "HG",
    avatarUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "tp-3",
    name: "Urban Tacos",
    rating: 4.9,
    avatar: "UT",
    avatarUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=120&q=80",
  },
];

export const initialPendingApprovals = [
  {
    id: "app-1",
    vendorName: "Gourmet Bites",
    type: "Full Service",
    location: "Oslo",
    submitted: "20 April 2024 12:30 PM",
    status: "Pending",
    avatar: "GB",
    avatarUrl: "",
  },
  {
    id: "app-2",
    vendorName: "The Pasta Place",
    type: "Drop-off",
    location: "Bergen",
    submitted: "20 April 2024 12:30 PM",
    status: "Pending",
    avatar: "PP",
    avatarUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "app-3",
    vendorName: "Urban Tacos",
    type: "Food Truck",
    location: "Trondheim",
    submitted: "20 April 2024 12:30 PM",
    status: "Approved",
    avatar: "UT",
    avatarUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "app-4",
    vendorName: "Sweet Serenity",
    type: "Dessert Shop",
    location: "Stavanger",
    submitted: "20 April 2024 12:30 PM",
    status: "Reviewing",
    avatar: "SS",
    avatarUrl: "",
  },
  {
    id: "app-5",
    vendorName: "Coastal Grill",
    type: "Full Service",
    location: "Sandnes",
    submitted: "20 April 2024 12:30 PM",
    status: "Rejected",
    avatar: "CG",
    avatarUrl: "",
  },
];

export const chartAnalyticsData = {
  "Last 7 days": [
    { label: "Mon", revenue: 12000, orders: 120 },
    { label: "Tue", revenue: 26000, orders: 240 },
    { label: "Wed", revenue: 20000, orders: 190 },
    { label: "Thu", revenue: 45000, orders: 420 },
    { label: "Fri", revenue: 38000, orders: 350 },
    { label: "Sat", revenue: 35000, orders: 310 },
    { label: "Sun", revenue: 25000, orders: 220 },
  ],
  "Last Month": [
    { label: "Week 1", revenue: 140000, orders: 1300 },
    { label: "Week 2", revenue: 180000, orders: 1650 },
    { label: "Week 3", revenue: 210000, orders: 1900 },
    { label: "Week 4", revenue: 248560, orders: 2280 },
  ],
};
