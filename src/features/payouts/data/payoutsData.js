export const payoutsSummary = [
  {
    id: "total",
    label: "Total Revenue",
    value: "NOK 124,592",
    accent: "soft",
  },
  {
    id: "commission",
    label: "Platform Commission",
    value: "NOK 12,459.20",
    accent: "warm",
  },
  {
    id: "pending",
    label: "Pending Payouts",
    value: "NOK 4,210.50",
    accent: "neutral",
  },
  {
    id: "completed",
    label: "Completed Payouts",
    value: "NOK 107,922.30",
    accent: "strong",
  },
];

export const payoutsRows = [
  {
    id: "#GCO0349",
    customer: "Alexander Wright",
    customerEmail: "alexander03@gmail.com",
    customerAvatar: "AW",
    vendor: "Grill Bar",
    vendorCity: "Oslo",
    vendorAvatar: "GB",
    orderAmount: "NOK 450.00",
    orderStatus: "Delivered",
    platformCommission: "-NOK 45.00",
    orderPayment: "Paid",
    vendorAmount: "NOK 405.00",
    payoutStatus: "Paid",
    date: "Oct 24, 2023",
  },
  {
    id: "#GC32423",
    customer: "Tom Holland",
    customerEmail: "alexander03@gmail.com",
    customerAvatar: "TH",
    vendor: "Chop Chop",
    vendorCity: "Bergen",
    vendorAvatar: "CC",
    orderAmount: "NOK 125.50",
    orderStatus: "Delivered",
    platformCommission: "-NOK 12.55",
    orderPayment: "Paid",
    vendorAmount: "NOK 405.00",
    payoutStatus: "Paid",
    date: "Oct 24, 2023",
  },
  {
    id: "#GCH43y3",
    customer: "Sidney Sweeney",
    customerEmail: "alexander03@gmail.com",
    customerAvatar: "SS",
    vendor: "Flavor Hunt",
    vendorCity: "Trondheim",
    vendorAvatar: "FH",
    orderAmount: "NOK 890.00",
    orderStatus: "Canceled",
    platformCommission: "-NOK 89.00",
    orderPayment: "Canceled",
    vendorAmount: "NOK 405.00",
    payoutStatus: "Canceled",
    date: "Oct 24, 2023",
  },
  {
    id: "#GCO643",
    customer: "Uma North",
    customerEmail: "alexander03@gmail.com",
    customerAvatar: "UN",
    vendor: "12 AM Hunger",
    vendorCity: "Stavanger",
    vendorAvatar: "12",
    orderAmount: "NOK 320.00",
    orderStatus: "Delivered",
    platformCommission: "-NOK 32.00",
    orderPayment: "Paid",
    vendorAmount: "NOK 405.00",
    payoutStatus: "Pending",
    date: "Oct 24, 2023",
  },
  {
    id: "#GC3745y4",
    customer: "Nauman Khan",
    customerEmail: "alexander03@gmail.com",
    customerAvatar: "NK",
    vendor: "BBQ Taste",
    vendorCity: "Tromso",
    vendorAvatar: "BT",
    orderAmount: "NOK 155.00",
    orderStatus: "Canceled",
    platformCommission: "-NOK 15.50",
    orderPayment: "Canceled",
    vendorAmount: "NOK 405.00",
    payoutStatus: "Canceled",
    date: "Oct 24, 2023",
  },
  {
    id: "#GC3745y4b",
    customer: "Nauman Khan",
    customerEmail: "alexander03@gmail.com",
    customerAvatar: "NK",
    vendor: "BBQ Taste",
    vendorCity: "Tromso",
    vendorAvatar: "BT",
    orderAmount: "NOK 320.00",
    orderStatus: "Pending",
    platformCommission: "-NOK 32.00",
    orderPayment: "Pending",
    vendorAmount: "NOK 405.00",
    payoutStatus: "Pending",
    date: "Oct 24, 2023",
  },
];

export const payoutsCommissionByRegion = [
  { id: "oslo", label: "Oslo", value: "12%" },
  { id: "bergen", label: "Bergen", value: "10%" },
  { id: "tromso", label: "Tromso", value: "10%" },
];

export const payoutsTopVendors = [
  { id: "vendor-1", name: "Omar Had", share: "6%", avatar: "OH" },
  { id: "vendor-2", name: "Lia El Hunger", share: "10%", avatar: "LH" },
  { id: "vendor-3", name: "BBQ Taste", share: "8%", avatar: "BT" },
  { id: "vendor-4", name: "12 AM Hunger", share: "9%", avatar: "12" },
];

export const globalCommissionSettings = {
  currentRate: "12%",
  label: "Platform Default",
  description:
    "This commission is applied to all vendors unless an Area or Vendor-specific commission is configured. Changes here affect all transactions across the entire platform.",
};

export const vendorCommissionRows = [
  { id: "vendor-row-1", vendor: "Grill Bar", area: "Oslo", currentCommission: "12%", avatar: "GB" },
  { id: "vendor-row-2", vendor: "Chop Chop", area: "Bergen", currentCommission: "8%", avatar: "CC" },
  { id: "vendor-row-3", vendor: "Flavor Hunt", area: "Oslo", currentCommission: "10%", avatar: "FH" },
];

export const areaCommissionRows = [
  { id: "area-row-1", area: "Oslo", commissionRate: "12%", activeVendors: "11%", orderShare: "15%" },
  { id: "area-row-2", area: "Bergen", commissionRate: "8%", activeVendors: "8%", orderShare: "8%" },
  { id: "area-row-3", area: "Oslo", commissionRate: "10%", activeVendors: "10%", orderShare: "6%" },
  { id: "area-row-4", area: "Oslo", commissionRate: "10%", activeVendors: "10%", orderShare: "6%" },
];

export const payoutsPagination = {
  pageSize: 6,
};
