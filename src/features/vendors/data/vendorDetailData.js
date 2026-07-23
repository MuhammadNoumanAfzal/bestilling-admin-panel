import { initialVendors } from "./vendorsData.js";

function formatCurrency(value) {
  return `NOK ${Number(value || 0).toLocaleString("en-US")}`;
}

function cleanVendorId(value) {
  return String(value || "").replace(/^#/, "");
}

function buildPublishedMenus(vendor) {
  return [
    {
      id: `${vendor.id}-menu-1`,
      title: "Oslo Working Banquet",
      category: "Wedding",
      price: "$35 per person",
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      status: "Active",
      badge: "Best Seller",
      description:
        "A hearty Nordic banquet spread with 3 starters, 2 mains, and a signature dessert selection.",
    },
    {
      id: `${vendor.id}-menu-2`,
      title: "Corporate Power Lunch",
      category: "Corporate",
      price: "$50 per person",
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      status: "Active",
      badge: "Popular",
      description:
        "Built for office events with premium proteins, salads, and easy setup for fast service.",
    },
    {
      id: `${vendor.id}-menu-3`,
      title: "Backyard Summer BBQ",
      category: "Private",
      price: "$230 per person",
      imageUrl:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
      status: "Draft",
      badge: "New",
      description:
        "Live grill menu with seasonal sides, sauces, and beverage pairing suggestions for outdoor gatherings.",
    },
    {
      id: `${vendor.id}-menu-4`,
      title: "Executive Tasting Set",
      category: "Corporate",
      price: "$90 per person",
      imageUrl:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
      status: "Active",
      badge: "Curated",
      description:
        "Smaller-format tasting menu designed for VIP client lunches and executive board sessions.",
    },
  ];
}

function buildRecentOrders(vendor) {
  return [
    {
      id: "#12549",
      customer: "Raja G abc",
      event: "Annual Dinner",
      guests: 45,
      deliveryDate: "20 April 2026",
      deliveryTime: "12:30 PM",
      status: "Delivered",
    },
    {
      id: "#12550",
      customer: "Nomi GOAT",
      event: "Annual Dinner",
      guests: 48,
      deliveryDate: "20 April 2026",
      deliveryTime: "12:30 PM",
      status: "Delivered",
    },
    {
      id: "#12551",
      customer: "ABCD efgh",
      event: "Annual Dinner",
      guests: 20,
      deliveryDate: "20 April 2026",
      deliveryTime: "12:30 PM",
      status: "Ready",
    },
    {
      id: "#12552",
      customer: "Comatozee",
      event: "Annual Dinner",
      guests: 50,
      deliveryDate: "20 April 2026",
      deliveryTime: "12:30 PM",
      status: "Accepted",
    },
    {
      id: "#12553",
      customer: "Raja G abc",
      event: "Birthday Party",
      guests: 30,
      deliveryDate: "20 April 2026",
      deliveryTime: "12:30 PM",
      status: "Out for delivery",
    },
    {
      id: "#12554",
      customer: "Talha anjum",
      event: "Office Party",
      guests: 10,
      deliveryDate: "20 April 2026",
      deliveryTime: "12:30 PM",
      status: "Reject",
    },
    {
      id: "#12555",
      customer: "Flint's Grill",
      event: "Family Dinner",
      guests: 15,
      deliveryDate: "20 April 2026",
      deliveryTime: "12:30 PM",
      status: "Accepted",
    },
    {
      id: "#12556",
      customer: "Sarah safari",
      event: "Annual Dinner",
      guests: 10,
      deliveryDate: "20 April 2026",
      deliveryTime: "12:30 PM",
      status: "Canceled",
    },
  ];
}

function buildReviewEntries() {
  return [
    {
      id: "review-1",
      name: "Alexander Wright",
      rating: 5,
      reviewId: "#ORD-8829",
      timeAgo: "5 hours ago",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      content:
        "Absolutely incredible service. The delivery was faster than expected and the quality of the packaging kept everything perfect.",
      highlighted: false,
    },
    {
      id: "review-2",
      name: "Sarah Jenkins",
      rating: 2,
      reviewId: "#ORD-8712",
      timeAgo: "5 hours ago",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      content:
        "The item arrived slightly damaged. I tried to reach out to support but have not heard back in 24 hours. The product itself seems okay, but the logistics need work.",
      highlighted: true,
    },
    {
      id: "review-3",
      name: "Marcus Thorne",
      rating: 4,
      reviewId: "#ORD-8655",
      timeAgo: "1 hour ago",
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
      content:
        "Great overall experience. The user interface was easy to navigate. Only giving 4 stars because I wish there were more color options for the limited edition series.",
      highlighted: false,
    },
  ];
}

function buildDocuments() {
  return [
    {
      id: "doc-1",
      title: "Business Registration",
      subtitle: "Uploaded on Oct 12, 2022",
      status: "Verified",
    },
    {
      id: "doc-2",
      title: "Food Safety License",
      subtitle: "Uploaded on Jan 05, 2024",
      status: "Verified",
    },
    {
      id: "doc-3",
      title: "VAT / Tax ID",
      subtitle: "Uploaded on Oct 12, 2022",
      status: "Verified",
    },
    {
      id: "doc-4",
      title: "Liability Insurance",
      subtitle: "Uploaded on Jan 13, 2024",
      status: "Pending",
    },
  ];
}

function buildVendorDetail(vendor) {
  const totalOrders = vendor.ordersCount * 4 + 4;
  const grossRevenue = vendor.revenueValue * 5 + 1662;
  const publishedMenus = buildPublishedMenus(vendor);
  const recentOrders = buildRecentOrders(vendor);
  const reviewEntries = buildReviewEntries();
  const totalReviews = 128;
  const averageRating = vendor.rating.toFixed(1);

  return {
    id: vendor.id,
    cleanId: cleanVendorId(vendor.id),
    name: `${vendor.name} Catering`,
    legalName: `${vendor.name} Catering Services LLC`,
    avatarUrl:
      vendor.avatarUrl ||
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=220&q=80",
    supportContactLabel: "Contact Vendor",
    manager: "Sara Jenkins (Owner)",
    joinedLabel: "Joined Oct 12, 2022",
    location: `${vendor.city}, Norway`,
    businessType: vendor.businessType,
    summaryStats: [
      { id: "orders", label: "Total Orders", value: totalOrders.toLocaleString() },
      { id: "revenue", label: "Gross Revenue", value: formatCurrency(grossRevenue) },
      { id: "rating", label: "Average Rating", value: averageRating },
      { id: "menus", label: "Total Menus", value: "24" },
      { id: "activeMenus", label: "Active Menus", value: "18" },
      { id: "response", label: "Response Rate", value: "98%" },
    ],
    overview: {
      contact: [
        { label: "Business Name", value: `${vendor.name} Catering Services LLC` },
        { label: "Email Address", value: `contact@${vendor.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com` },
        { label: "Phone Number", value: "+1 (512) 555-0192" },
        { label: "Primary Address", value: "824 Industrial Way, Ste 200, Austin, TX 78701" },
        { label: "Business Type", value: "Full Service Catering" },
      ],
      logistics: [
        { label: "Delivery Radius", value: "15 Miles" },
        { label: "Lead Time", value: "48 Hours" },
        { label: "Max Capacity", value: "500 Guests" },
        { label: "Delivery Zones", value: "4 Districts" },
      ],
    },
    menuTabs: [
      { label: "All (24)", value: "all", active: true },
      { label: "Active (18)", value: "active", active: false },
      { label: "Draft (6)", value: "draft", active: false },
    ],
    publishedMenus,
    recentOrders,
    financial: {
      chartTitle: "Revenue",
      chartSubtitle: "Monthly growth over the last 6 months",
      filterLabel: "Last 7 days",
      revenueSeries: [
        { label: "Jan", value: 3200 },
        { label: "Feb", value: 6200 },
        { label: "Mar", value: 5100 },
        { label: "Apr", value: 10400 },
        { label: "May", value: 9000 },
        { label: "Jun", value: 6400 },
      ],
      pendingPayout: "$4,850.00",
      payoutStatus: "Awaiting Admin Transfer",
      estimatedPayout: "Sep 09, 2025",
      lastPayout: "Sep 26, 2025",
      breakdown: [
        { label: "Gross Revenue", value: "$24,500.00", tone: "neutral" },
        { label: "Platform Commission", value: "- $2,450.00", tone: "negative" },
        { label: "VAT / Taxes", value: "- $490.00", tone: "negative" },
        { label: "Net Earnings", value: "$21,560.00", tone: "positive" },
      ],
    },
    reviewsSummary: {
      average: averageRating,
      totalReviews: "128 reviews",
      starBreakdown: [
        { stars: 5, percent: 74, count: 74 },
        { stars: 4, percent: 43, count: 43 },
        { stars: 3, percent: 12, count: 12 },
        { stars: 2, percent: 8, count: 8 },
        { stars: 1, percent: 3, count: 3 },
      ],
      statCards: [
        { label: "Total Reviews", value: "4.8", note: "Across all menus" },
        { label: "New Reviews", value: "25", note: "In last 30 days" },
        { label: "Response Rate", value: "98%", note: "To replies 3 of 15" },
      ],
      filterTabs: ["All", "5", "4", "3", "2", "1"],
      activeFilter: "All",
      periodFilter: "Last 30 days",
      reviewEntries,
    },
    documents: buildDocuments(),
    dangerZone: {
      suspendTitle: "Deactivate Vendor",
      suspendDescription:
        "Temporarily disable vendor listings and checkout functionality.",
      deleteTitle: "Permanent Deletion",
      deleteDescription:
        "Remove all records. This action is irreversible and requires secondary approval.",
    },
  };
}

export function getVendorDetail(vendorId) {
  const match =
    initialVendors.find(
      (vendor) => cleanVendorId(vendor.id) === cleanVendorId(vendorId) || vendor.id === vendorId,
    ) || initialVendors[0];

  return buildVendorDetail(match);
}
