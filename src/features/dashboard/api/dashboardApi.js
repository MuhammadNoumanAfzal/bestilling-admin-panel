import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADMIN_DASHBOARD_OVERVIEW_QUERY,
  ADMIN_VENDOR_STATUS_QUERY,
  ADMIN_UPDATE_VENDOR_APPROVAL_STATUS_MUTATION,
} from "./dashboardQueries.js";

const INACTIVE_VENDOR_STATUSES = new Set(["SUSPENDED", "DEACTIVATED", "DELETED"]);

function toInitials(value) {
  return `${value ?? ""}`
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function normalizeTrend(trend) {
  if (!trend) {
    return null;
  }

  return {
    direction: `${trend.direction ?? ""}`.trim().toUpperCase() || "NEUTRAL",
    percentage: Number(trend.percentage ?? 0),
    label: trend.label || "",
  };
}

function normalizeApprovalStatus(value) {
  const normalized = `${value ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "REVIEWING":
      return "Reviewing";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    default:
      return "Pending";
  }
}

function normalizeQuickActionRoute(route) {
  const rawRoute = `${route ?? ""}`.trim();
  if (!rawRoute) {
    return "";
  }

  const stripped = rawRoute.replace(/^\/admin/i, "") || rawRoute;

  switch (stripped) {
    case "/payouts":
      return "/payments";
    default:
      return stripped.startsWith("/") ? stripped : `/${stripped}`;
  }
}

function buildOverviewInput(filters) {
  if (!filters?.dateRange?.startDate || !filters?.dateRange?.endDate) {
    return {};
  }

  return {
    dateRange: {
      startDate: filters.dateRange.startDate,
      endDate: filters.dateRange.endDate,
    },
    timezone: filters.timezone || "Europe/Oslo",
  };
}

async function excludeInactiveTopVendors(vendors) {
  const statusChecks = await Promise.all(
    vendors.map(async (vendor) => {
      if (!vendor?.id) {
        return true;
      }

      try {
        const data = await executeProtectedGraphqlRequest(ADMIN_VENDOR_STATUS_QUERY, {
          id: vendor.id,
        });
        const status = `${data?.adminVendor?.status ?? ""}`.trim().toUpperCase();

        return !INACTIVE_VENDOR_STATUSES.has(status);
      } catch {
        // Leave the vendor visible if its status cannot be verified.
        return true;
      }
    }),
  );

  return vendors.filter((_, index) => statusChecks[index]);
}

export async function getAdminDashboardOverviewRequest(filters) {
  const data = await executeProtectedGraphqlRequest(ADMIN_DASHBOARD_OVERVIEW_QUERY, {
    input: buildOverviewInput(filters),
  });

  const overview = data?.adminDashboardOverview;
  if (!overview) {
    throw new Error("Unable to load dashboard overview.");
  }

  const topPerformingVendors = await excludeInactiveTopVendors(
    Array.isArray(overview?.topPerformingVendors) ? overview.topPerformingVendors : [],
  );

  return {
    stats: Array.isArray(overview.stats)
      ? overview.stats.map((item) => ({
          id: `${item?.id ?? ""}`.trim().toUpperCase(),
          title: item?.title || "Metric",
          value: item?.value || "0",
          rawValue: Number(item?.rawValue ?? 0),
          currency: item?.currency || "",
          note: item?.note || "",
          trend: normalizeTrend(item?.trend),
        }))
      : [],
    chart: {
      metricOptions: Array.isArray(overview?.chart?.metricOptions)
        ? overview.chart.metricOptions
        : ["REVENUE", "ORDERS"],
      defaultMetric: `${overview?.chart?.defaultMetric ?? "REVENUE"}`.trim().toUpperCase(),
      points: Array.isArray(overview?.chart?.points)
        ? overview.chart.points.map((point) => ({
            label: point?.label || "",
            startDate: point?.startDate || "",
            endDate: point?.endDate || "",
            revenue: Number(point?.revenue ?? 0),
            orders: Number(point?.orders ?? 0),
          }))
        : [],
    },
    vendorBreakdown: {
      active: Number(overview?.vendorBreakdown?.active ?? 0),
      pending: Number(overview?.vendorBreakdown?.pending ?? 0),
      outOfStock: Number(overview?.vendorBreakdown?.outOfStock ?? 0),
      topRated: Number(overview?.vendorBreakdown?.topRated ?? 0),
    },
    topPerformingVendors: topPerformingVendors.map((vendor) => ({
      id: vendor?.id || "",
      name: vendor?.name || "Unknown vendor",
      rating: Number(vendor?.rating ?? 0),
      avatar: toInitials(vendor?.name),
      avatarUrl: vendor?.avatarUrl || "",
      totalOrders: Number(vendor?.totalOrders ?? 0),
      totalRevenue: Number(vendor?.totalRevenue ?? 0),
      completionRate: Number(vendor?.completionRate ?? 0),
    })),
    approvals: Array.isArray(overview?.approvals)
      ? overview.approvals.map((approval) => ({
          id: approval?.id || "",
          vendorId: approval?.vendorId || "",
          vendorName: approval?.vendorName || "Unknown vendor",
          avatarUrl: approval?.avatarUrl || "",
          avatar: approval?.avatarInitials || toInitials(approval?.vendorName),
          type: approval?.type || "Vendor",
          location: approval?.location || "Unknown",
          submittedAt: approval?.submittedAt || "",
          submitted: approval?.submittedLabel || "Not available",
          status: normalizeApprovalStatus(approval?.status),
          rawStatus: `${approval?.status ?? ""}`.trim().toUpperCase(),
          priority: approval?.priority || "Normal",
          canApprove: Boolean(approval?.canApprove),
          canReject: Boolean(approval?.canReject),
          canMarkReviewing: Boolean(approval?.canMarkReviewing),
          canMarkPending: Boolean(approval?.canMarkPending),
        }))
      : [],
    quickActions: Array.isArray(overview?.quickActions)
      ? overview.quickActions.map((action) => ({
          key: action?.key || "",
          label: action?.label || "Action",
          route: normalizeQuickActionRoute(action?.route),
          enabled: Boolean(action?.enabled),
          requiredPermission: action?.requiredPermission || "",
        }))
      : [],
  };
}

export async function updateVendorApprovalStatusRequest(input) {
  const data = await executeProtectedGraphqlRequest(ADMIN_UPDATE_VENDOR_APPROVAL_STATUS_MUTATION, {
    input,
  });

  const result = data?.adminUpdateVendorApprovalStatus;
  if (!result?.success || !result?.approval?.id) {
    throw new Error(result?.message || "Unable to update vendor approval status.");
  }

  return {
    message: result.message || "Approval updated successfully.",
    approval: {
      id: result.approval.id,
      status: normalizeApprovalStatus(result.approval.status),
      rawStatus: `${result.approval.status ?? ""}`.trim().toUpperCase(),
      updatedAt: result.approval.updatedAt || "",
    },
  };
}
