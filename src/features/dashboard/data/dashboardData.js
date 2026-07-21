const MS_PER_DAY = 24 * 60 * 60 * 1000;
const REFERENCE_DATE = new Date("2026-07-21T12:00:00Z");

function createDate(daysAgo) {
  return new Date(REFERENCE_DATE.getTime() - daysAgo * MS_PER_DAY);
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatSubmittedDate(date) {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("en-GB", {
    month: "long",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year} 12:30 PM`;
}

const dashboardSnapshots = {
  "Last 7 days": {
    stats: [
      {
        id: "revenue",
        title: "Total Revenue",
        value: "NOK 248,560",
        note: "Compared to NOK 218K previous period",
        accent: "orange",
      },
      {
        id: "orders",
        title: "Total Orders",
        value: "4,825",
        note: "+12.3% versus previous period",
        accent: "orange",
      },
      {
        id: "vendors",
        title: "Active Vendors",
        value: "128",
        note: "3 new vendors onboarded",
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
    ],
    vendorBreakdown: {
      active: 128,
      pending: 12,
      outOfStock: 8,
      topRated: 15,
    },
    topPerformingVendors: [
      {
        id: "tp-1",
        name: "The Pasta Place",
        rating: 4.9,
        avatar: "PP",
        avatarUrl:
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=120&q=80",
      },
      {
        id: "tp-2",
        name: "Healthy Greens",
        rating: 4.8,
        avatar: "HG",
        avatarUrl:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80",
      },
      {
        id: "tp-3",
        name: "Urban Tacos",
        rating: 4.9,
        avatar: "UT",
        avatarUrl:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=120&q=80",
      },
    ],
    chartData: [
      { label: "Mon", revenue: 12000, orders: 120 },
      { label: "Tue", revenue: 26000, orders: 240 },
      { label: "Wed", revenue: 20000, orders: 190 },
      { label: "Thu", revenue: 45000, orders: 420 },
      { label: "Fri", revenue: 38000, orders: 350 },
      { label: "Sat", revenue: 35000, orders: 310 },
      { label: "Sun", revenue: 25000, orders: 220 },
    ],
  },
  "Last Month": {
    stats: [
      {
        id: "revenue",
        title: "Total Revenue",
        value: "NOK 932,400",
        note: "+8.4% month over month",
        accent: "orange",
      },
      {
        id: "orders",
        title: "Total Orders",
        value: "8,960",
        note: "Daily average: 299 orders",
        accent: "orange",
      },
      {
        id: "vendors",
        title: "Active Vendors",
        value: "141",
        note: "11 newly active vendors",
        accent: "slate",
      },
      {
        id: "customers",
        title: "Total Customers",
        value: "10,850",
        note: "1,140 repeat customers",
        accent: "green",
      },
      {
        id: "approvals",
        title: "Pending Approvals",
        value: "19",
        note: "7 submitted this week",
        accent: "amber",
      },
      {
        id: "support",
        title: "Open Support",
        value: "26",
        note: "Average response time: 16m",
        accent: "orange",
      },
    ],
    vendorBreakdown: {
      active: 141,
      pending: 19,
      outOfStock: 10,
      topRated: 18,
    },
    topPerformingVendors: [
      {
        id: "tp-4",
        name: "Coastal Grill",
        rating: 4.9,
        avatar: "CG",
        avatarUrl: "",
      },
      {
        id: "tp-5",
        name: "Healthy Greens",
        rating: 4.8,
        avatar: "HG",
        avatarUrl:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80",
      },
      {
        id: "tp-6",
        name: "Nordic Platters",
        rating: 4.7,
        avatar: "NP",
        avatarUrl: "",
      },
    ],
    chartData: [
      { label: "Week 1", revenue: 140000, orders: 1300 },
      { label: "Week 2", revenue: 180000, orders: 1650 },
      { label: "Week 3", revenue: 210000, orders: 1900 },
      { label: "Week 4", revenue: 248560, orders: 2280 },
    ],
  },
  "Last 3 Months": {
    stats: [
      {
        id: "revenue",
        title: "Total Revenue",
        value: "NOK 1,486,200",
        note: "+15.2% quarter on quarter",
        accent: "orange",
      },
      {
        id: "orders",
        title: "Total Orders",
        value: "13,780",
        note: "Strong catering season growth",
        accent: "orange",
      },
      {
        id: "vendors",
        title: "Active Vendors",
        value: "152",
        note: "22 vendors expanded coverage",
        accent: "slate",
      },
      {
        id: "customers",
        title: "Total Customers",
        value: "13,260",
        note: "41% returning customers",
        accent: "green",
      },
      {
        id: "approvals",
        title: "Pending Approvals",
        value: "27",
        note: "Backlog reduced by 9",
        accent: "amber",
      },
      {
        id: "support",
        title: "Open Support",
        value: "31",
        note: "Average response time: 18m",
        accent: "orange",
      },
    ],
    vendorBreakdown: {
      active: 152,
      pending: 27,
      outOfStock: 14,
      topRated: 21,
    },
    topPerformingVendors: [
      {
        id: "tp-7",
        name: "Urban Tacos",
        rating: 4.9,
        avatar: "UT",
        avatarUrl:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=120&q=80",
      },
      {
        id: "tp-8",
        name: "The Pasta Place",
        rating: 4.9,
        avatar: "PP",
        avatarUrl:
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=120&q=80",
      },
      {
        id: "tp-9",
        name: "Sweet Serenity",
        rating: 4.8,
        avatar: "SS",
        avatarUrl: "",
      },
    ],
    chartData: [
      { label: "May", revenue: 98000, orders: 890 },
      { label: "Jun", revenue: 154000, orders: 1420 },
      { label: "Jul", revenue: 248560, orders: 2280 },
    ],
  },
  "Last 6 Months": {
    stats: [
      {
        id: "revenue",
        title: "Total Revenue",
        value: "NOK 2,368,000",
        note: "+22.1% over prior 6 months",
        accent: "orange",
      },
      {
        id: "orders",
        title: "Total Orders",
        value: "21,450",
        note: "1,190 average weekly orders",
        accent: "orange",
      },
      {
        id: "vendors",
        title: "Active Vendors",
        value: "167",
        note: "27 cities now covered",
        accent: "slate",
      },
      {
        id: "customers",
        title: "Total Customers",
        value: "18,240",
        note: "Corporate bookings up 19%",
        accent: "green",
      },
      {
        id: "approvals",
        title: "Pending Approvals",
        value: "34",
        note: "12 awaiting documents",
        accent: "amber",
      },
      {
        id: "support",
        title: "Open Support",
        value: "42",
        note: "Average response time: 19m",
        accent: "orange",
      },
    ],
    vendorBreakdown: {
      active: 167,
      pending: 34,
      outOfStock: 16,
      topRated: 24,
    },
    topPerformingVendors: [
      {
        id: "tp-10",
        name: "Nordic Platters",
        rating: 5.0,
        avatar: "NP",
        avatarUrl: "",
      },
      {
        id: "tp-11",
        name: "Coastal Grill",
        rating: 4.9,
        avatar: "CG",
        avatarUrl: "",
      },
      {
        id: "tp-12",
        name: "Healthy Greens",
        rating: 4.8,
        avatar: "HG",
        avatarUrl:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80",
      },
    ],
    chartData: [
      { label: "Feb", revenue: 75000, orders: 680 },
      { label: "Mar", revenue: 110000, orders: 990 },
      { label: "Apr", revenue: 95000, orders: 870 },
      { label: "May", revenue: 125000, orders: 1120 },
      { label: "Jun", revenue: 180000, orders: 1650 },
      { label: "Jul", revenue: 248560, orders: 2280 },
    ],
  },
  "This Year": {
    stats: [
      {
        id: "revenue",
        title: "Total Revenue",
        value: "NOK 4,920,000",
        note: "Annual run rate remains ahead of target",
        accent: "orange",
      },
      {
        id: "orders",
        title: "Total Orders",
        value: "38,700",
        note: "Peak season demand in Q4",
        accent: "orange",
      },
      {
        id: "vendors",
        title: "Active Vendors",
        value: "198",
        note: "46 net new active vendors",
        accent: "slate",
      },
      {
        id: "customers",
        title: "Total Customers",
        value: "31,400",
        note: "Enterprise accounts increased 28%",
        accent: "green",
      },
      {
        id: "approvals",
        title: "Pending Approvals",
        value: "41",
        note: "Majority from Oslo and Bergen",
        accent: "amber",
      },
      {
        id: "support",
        title: "Open Support",
        value: "57",
        note: "Average response time: 21m",
        accent: "orange",
      },
    ],
    vendorBreakdown: {
      active: 198,
      pending: 41,
      outOfStock: 21,
      topRated: 31,
    },
    topPerformingVendors: [
      {
        id: "tp-13",
        name: "Aurora Kitchen",
        rating: 5.0,
        avatar: "AK",
        avatarUrl: "",
      },
      {
        id: "tp-14",
        name: "The Pasta Place",
        rating: 4.9,
        avatar: "PP",
        avatarUrl:
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=120&q=80",
      },
      {
        id: "tp-15",
        name: "Urban Tacos",
        rating: 4.9,
        avatar: "UT",
        avatarUrl:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=120&q=80",
      },
    ],
    chartData: [
      { label: "Q1", revenue: 320000, orders: 2900 },
      { label: "Q2", revenue: 480000, orders: 4300 },
      { label: "Q3", revenue: 650000, orders: 5800 },
      { label: "Q4", revenue: 840000, orders: 7500 },
    ],
  },
};

const allApprovals = [
  {
    id: "app-1",
    vendorName: "Gourmet Bites",
    type: "Full Service",
    location: "Oslo",
    submittedAt: toIsoDate(createDate(2)),
    status: "Pending",
    avatar: "GB",
    avatarUrl: "",
  },
  {
    id: "app-2",
    vendorName: "The Pasta Place",
    type: "Drop-off",
    location: "Bergen",
    submittedAt: toIsoDate(createDate(5)),
    status: "Pending",
    avatar: "PP",
    avatarUrl:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "app-3",
    vendorName: "Urban Tacos",
    type: "Food Truck",
    location: "Trondheim",
    submittedAt: toIsoDate(createDate(12)),
    status: "Approved",
    avatar: "UT",
    avatarUrl:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "app-4",
    vendorName: "Sweet Serenity",
    type: "Dessert Shop",
    location: "Stavanger",
    submittedAt: toIsoDate(createDate(18)),
    status: "Reviewing",
    avatar: "SS",
    avatarUrl: "",
  },
  {
    id: "app-5",
    vendorName: "Coastal Grill",
    type: "Full Service",
    location: "Sandnes",
    submittedAt: toIsoDate(createDate(28)),
    status: "Rejected",
    avatar: "CG",
    avatarUrl: "",
  },
  {
    id: "app-6",
    vendorName: "Nordic Platters",
    type: "Corporate Catering",
    location: "Oslo",
    submittedAt: toIsoDate(createDate(45)),
    status: "Pending",
    avatar: "NP",
    avatarUrl: "",
  },
  {
    id: "app-7",
    vendorName: "Healthy Greens",
    type: "Drop-off",
    location: "Bergen",
    submittedAt: toIsoDate(createDate(74)),
    status: "Approved",
    avatar: "HG",
    avatarUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "app-8",
    vendorName: "Fjord Feast",
    type: "Full Service",
    location: "Alesund",
    submittedAt: toIsoDate(createDate(112)),
    status: "Reviewing",
    avatar: "FF",
    avatarUrl: "",
  },
  {
    id: "app-9",
    vendorName: "Arctic Meals",
    type: "Meal Prep",
    location: "Tromso",
    submittedAt: toIsoDate(createDate(150)),
    status: "Pending",
    avatar: "AM",
    avatarUrl: "",
  },
  {
    id: "app-10",
    vendorName: "Aurora Kitchen",
    type: "Premium Catering",
    location: "Oslo",
    submittedAt: toIsoDate(createDate(210)),
    status: "Approved",
    avatar: "AK",
    avatarUrl: "",
  },
  {
    id: "app-11",
    vendorName: "Lunch Loft",
    type: "Office Catering",
    location: "Drammen",
    submittedAt: toIsoDate(createDate(268)),
    status: "Rejected",
    avatar: "LL",
    avatarUrl: "",
  },
  {
    id: "app-12",
    vendorName: "Harvest Table",
    type: "Seasonal Catering",
    location: "Kristiansand",
    submittedAt: toIsoDate(createDate(330)),
    status: "Pending",
    avatar: "HT",
    avatarUrl: "",
  },
];

export const dashboardFilterOptions = [
  "Last 7 days",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "This Year",
  "Custom Date",
  "Clear Filter",
];

export function getDateRangeForFilter(selectedFilter, customStart, customEnd) {
  if (selectedFilter === "Custom Date" && customStart && customEnd) {
    const start = new Date(`${customStart}T00:00:00Z`);
    const end = new Date(`${customEnd}T23:59:59Z`);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end) {
      return { start, end };
    }
  }

  const end = new Date(REFERENCE_DATE);
  const start = new Date(REFERENCE_DATE);

  switch (selectedFilter) {
    case "Last Month":
      start.setUTCDate(start.getUTCDate() - 30);
      break;
    case "Last 3 Months":
      start.setUTCDate(start.getUTCDate() - 90);
      break;
    case "Last 6 Months":
      start.setUTCDate(start.getUTCDate() - 180);
      break;
    case "This Year":
      start.setUTCMonth(0, 1);
      start.setUTCHours(0, 0, 0, 0);
      break;
    case "Last 7 days":
    default:
      start.setUTCDate(start.getUTCDate() - 7);
      break;
  }

  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
}

function getBaseSnapshot(selectedFilter) {
  return dashboardSnapshots[selectedFilter] || dashboardSnapshots["Last 7 days"];
}

function buildCustomChartData(days) {
  const bucketCount = Math.min(6, Math.max(3, Math.ceil(days / 5)));

  return Array.from({ length: bucketCount }, (_, index) => {
    const revenue = 26000 + days * 850 + index * 14000;
    const orders = 180 + days * 8 + index * 95;

    return {
      label: `P${index + 1}`,
      revenue,
      orders,
    };
  });
}

function buildCustomStats(days, approvalsCount) {
  const revenue = 42000 + days * 6200;
  const orders = 320 + days * 115;
  const activeVendors = 48 + Math.round(days * 1.1);
  const customers = 900 + days * 180;
  const support = Math.max(6, Math.round(days / 3));

  return [
    {
      id: "revenue",
      title: "Total Revenue",
      value: `NOK ${revenue.toLocaleString()}`,
      note: `${days}-day custom period`,
      accent: "orange",
    },
    {
      id: "orders",
      title: "Total Orders",
      value: orders.toLocaleString(),
      note: `Average ${Math.max(1, Math.round(orders / Math.max(days, 1)))} per day`,
      accent: "orange",
    },
    {
      id: "vendors",
      title: "Active Vendors",
      value: activeVendors.toLocaleString(),
      note: "Based on selected custom range",
      accent: "slate",
    },
    {
      id: "customers",
      title: "Total Customers",
      value: customers.toLocaleString(),
      note: "Includes repeat customers",
      accent: "green",
    },
    {
      id: "approvals",
      title: "Pending Approvals",
      value: approvalsCount.toLocaleString(),
      note: "Filtered by submitted date",
      accent: "amber",
    },
    {
      id: "support",
      title: "Open Support",
      value: support.toLocaleString(),
      note: "Estimated from selected window",
      accent: "orange",
    },
  ];
}

function buildCustomVendorBreakdown(days, approvalsCount) {
  return {
    active: 48 + Math.round(days * 1.1),
    pending: approvalsCount,
    outOfStock: Math.max(2, Math.round(days / 9)),
    topRated: Math.max(4, Math.round(days / 6)),
  };
}

function buildCustomTopVendors(days) {
  if (days <= 14) {
    return dashboardSnapshots["Last 7 days"].topPerformingVendors;
  }
  if (days <= 45) {
    return dashboardSnapshots["Last Month"].topPerformingVendors;
  }
  if (days <= 120) {
    return dashboardSnapshots["Last 3 Months"].topPerformingVendors;
  }
  if (days <= 220) {
    return dashboardSnapshots["Last 6 Months"].topPerformingVendors;
  }
  return dashboardSnapshots["This Year"].topPerformingVendors;
}

export function getDashboardSnapshot(selectedFilter, customStart, customEnd) {
  const range = getDateRangeForFilter(selectedFilter, customStart, customEnd);

  const approvals = allApprovals
    .filter((approval) => {
      const submittedDate = new Date(`${approval.submittedAt}T12:30:00Z`);
      return submittedDate >= range.start && submittedDate <= range.end;
    })
    .sort(
      (left, right) =>
        new Date(`${right.submittedAt}T12:30:00Z`) -
        new Date(`${left.submittedAt}T12:30:00Z`)
    )
    .map((approval) => ({
      ...approval,
      submitted: formatSubmittedDate(new Date(`${approval.submittedAt}T12:30:00Z`)),
    }));

  if (selectedFilter !== "Custom Date") {
    const snapshot = getBaseSnapshot(selectedFilter);
    return {
      ...snapshot,
      approvals,
    };
  }

  const diffMs = range.end.getTime() - range.start.getTime();
  const days = Math.max(1, Math.ceil(diffMs / MS_PER_DAY));

  return {
    stats: buildCustomStats(days, approvals.length),
    vendorBreakdown: buildCustomVendorBreakdown(days, approvals.length),
    topPerformingVendors: buildCustomTopVendors(days),
    chartData: buildCustomChartData(days),
    approvals,
  };
}
