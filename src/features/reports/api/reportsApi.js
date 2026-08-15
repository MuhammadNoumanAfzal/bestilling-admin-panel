import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import { getAdminCustomersRequest } from "../../customers/api/customersApi.js";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";
import { getAdminOrdersRequest } from "../../orders/api/ordersApi.js";
import { getAdminVendorsRequest } from "../../vendors/api/vendorsApi.js";
import {
  buildReportsSnapshotViewModel,
  exportSectionOptions,
} from "../reportsUtils.js";
import {
  ADMIN_REPORTS_SNAPSHOT_QUERY,
  EXPORT_ADMIN_REPORT_MUTATION,
} from "./reportsQueries.js";

function getReportsErrorMessage(result, fallbackMessage) {
  return result?.message || result?.errors?.find?.((item) => item?.message)?.message || fallbackMessage;
}

function isDecimalFloatError(error) {
  const message = `${error?.message ?? error ?? ""}`.toLowerCase();
  return (
    message.includes("decimal.decimal") &&
    message.includes("float") &&
    message.includes("unsupported operand type")
  );
}

function findCardValue(cards, title) {
  return cards.find((item) => item?.title === title || item?.label === title)?.value;
}

function buildOrderFilters(filters = {}) {
  if (filters?.dateFrom || filters?.dateTo) {
    return {
      dateFrom: filters.dateFrom || null,
      dateTo: filters.dateTo || null,
      page: 1,
      limit: 1,
    };
  }

  const filterLabel = filters?.filterLabel || "Last 7 days";
  if (filterLabel === "Clear Filter") {
    return {
      dateFrom: null,
      dateTo: null,
      page: 1,
      limit: 1,
    };
  }

  const dateRange = getDateRangeForFilter(filterLabel, "", "");
  return {
    dateFrom: dateRange?.start || null,
    dateTo: dateRange?.end || null,
    page: 1,
    limit: 1,
  };
}

async function getConsistentSummaryValues(filters = {}) {
  const [ordersResponse, vendorsResponse, customersResponse] = await Promise.all([
    getAdminOrdersRequest(buildOrderFilters(filters)),
    getAdminVendorsRequest({
      search: null,
      vendorId: null,
      city: null,
      minRating: null,
      status: null,
      joinedFrom: null,
      joinedTo: null,
      page: 1,
      pageSize: 1,
      sortBy: "JOINED_AT",
      sortOrder: "DESC",
    }),
    getAdminCustomersRequest({
      search: null,
      status: null,
      city: null,
      registeredFrom: null,
      registeredTo: null,
      page: 1,
      pageSize: 1,
      sortBy: "joinedAt",
      sortOrder: "DESC",
    }),
  ]);

  return {
    totalRevenue: findCardValue(ordersResponse.summaryCards, "Revenue") || null,
    totalOrders: findCardValue(ordersResponse.summaryCards, "Total Orders") || null,
    activeVendors: findCardValue(vendorsResponse.stats, "Active Vendor") || null,
    activeCustomers: findCardValue(customersResponse.summaryCards, "Active Customers") || null,
    pendingApprovals: findCardValue(vendorsResponse.stats, "Pending Approval") || null,
  };
}

function buildFallbackSnapshotViewModel(summaryValues, filterLabel) {
  return {
    summary: [
      {
        id: "revenue",
        label: "Total Revenue",
        value: summaryValues.totalRevenue || "NOK 0.00",
        icon: "wallet",
        accent: "soft",
      },
      {
        id: "orders",
        label: "Total Orders",
        value: summaryValues.totalOrders || "0",
        icon: "orders",
        accent: "warm",
      },
      {
        id: "vendors",
        label: "Active Vendors",
        value: summaryValues.activeVendors || "0",
        icon: "store",
        accent: "neutral",
      },
      {
        id: "customers",
        label: "Active Customers",
        value: summaryValues.activeCustomers || "0",
        icon: "users",
        accent: "soft",
      },
      {
        id: "approvals",
        label: "Pending Approvals",
        value: summaryValues.pendingApprovals || "0",
        icon: "clock",
        accent: "warm",
      },
      {
        id: "aov",
        label: "Average Order Value",
        value: "Unavailable",
        icon: "receipt",
        accent: "neutral",
      },
    ],
    revenueAnalytics: {
      title: "Gross Revenue",
      subtitle: "Report chart is temporarily unavailable for this filter.",
      scale: [0, 1],
      bars: [],
      valuePrefix: "",
      filterLabel,
    },
    orderAnalytics: {
      title: "Order Volume",
      subtitle: "Report chart is temporarily unavailable for this filter.",
      scale: [0, 1],
      bars: [],
    },
    vendorPerformance: {
      registration: {
        count: 0,
        note: "Vendor registration analytics are temporarily unavailable.",
      },
      vendors: [],
      warning: "Detailed vendor performance could not be loaded for this filter.",
    },
    customerAnalytics: {
      stats: [],
      satisfaction: {
        score: "0%",
        note: "Customer analytics are temporarily unavailable for this filter.",
      },
    },
    categoryPerformance: [],
    operationalHealth: [],
  };
}

export async function getAdminReportsSnapshotRequest(filters) {
  try {
    const data = await executeProtectedGraphqlRequest(ADMIN_REPORTS_SNAPSHOT_QUERY, filters);
    const snapshot = data?.adminReportsSnapshot;

    if (!snapshot) {
      throw new Error("Unable to load reports snapshot.");
    }

    const baseViewModel = buildReportsSnapshotViewModel(snapshot, filters?.filterLabel || "Last 7 days");
    const consistentSummary = await getConsistentSummaryValues(filters);

    return {
      ...baseViewModel,
      summary: baseViewModel.summary.map((item) => {
        switch (item.id) {
          case "revenue":
            return consistentSummary.totalRevenue ? { ...item, value: consistentSummary.totalRevenue } : item;
          case "orders":
            return consistentSummary.totalOrders ? { ...item, value: consistentSummary.totalOrders } : item;
          case "vendors":
            return consistentSummary.activeVendors ? { ...item, value: consistentSummary.activeVendors } : item;
          case "customers":
            return consistentSummary.activeCustomers ? { ...item, value: consistentSummary.activeCustomers } : item;
          case "approvals":
            return consistentSummary.pendingApprovals
              ? { ...item, value: consistentSummary.pendingApprovals }
              : item;
          default:
            return item;
        }
      }),
    };
  } catch (error) {
    if (!isDecimalFloatError(error)) {
      throw error;
    }

    const consistentSummary = await getConsistentSummaryValues(filters);
    return buildFallbackSnapshotViewModel(
      consistentSummary,
      filters?.filterLabel || "Last 7 days",
    );
  }
}

export async function exportAdminReportRequest(input) {
  const data = await executeProtectedGraphqlRequest(EXPORT_ADMIN_REPORT_MUTATION, {
    input: {
      dateFrom: input?.dateFrom || null,
      dateTo: input?.dateTo || null,
      preset: input?.preset || null,
      format: input?.format || "PDF",
      sections: input?.sections?.length ? input.sections : exportSectionOptions,
    },
  });

  const result = data?.exportAdminReport;
  if (!result?.success || !result?.exportUrl) {
    throw new Error(getReportsErrorMessage(result, "Unable to export report."));
  }

  return result;
}
