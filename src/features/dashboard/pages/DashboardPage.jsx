import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  DollarSign,
  Calendar,
  Store,
  Users,
  Clock,
  Headphones,
} from "lucide-react";

import StatCard from "../components/StatCard.jsx";
import RevenueAnalyticsChart from "../components/RevenueAnalyticsChart.jsx";
import VendorBreakdownCard from "../components/VendorBreakdownCard.jsx";
import TopPerformingVendors from "../components/TopPerformingVendors.jsx";
import PendingVendorApprovalsTable from "../components/PendingVendorApprovalsTable.jsx";
import QuickActionsGrid from "../components/QuickActionsGrid.jsx";
import DateFilterDropdown from "../components/DateFilterDropdown.jsx";
import { getDateRangeForFilter } from "../data/dashboardData.js";
import {
  getAdminDashboardOverviewRequest,
  updateVendorApprovalStatusRequest,
} from "../api/dashboardApi.js";
import {
  approveVendorApplicationRequest,
  rejectVendorApplicationRequest,
} from "../../vendors/api/vendorsApi.js";

const statIcons = {
  REVENUE: DollarSign,
  ORDERS: Calendar,
  ACTIVE_VENDORS: Store,
  CUSTOMERS: Users,
  PENDING_APPROVALS: Clock,
  OPEN_SUPPORT: Headphones,
};

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("Last 7 days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    chart: { metricOptions: ["REVENUE", "ORDERS"], defaultMetric: "REVENUE", points: [] },
    vendorBreakdown: { active: 0, pending: 0, outOfStock: 0, topRated: 0 },
    topPerformingVendors: [],
    approvals: [],
    quickActions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [approvalActionId, setApprovalActionId] = useState("");

  const dateRange = useMemo(
    () => getDateRangeForFilter(timeframe, customStart, customEnd),
    [customEnd, customStart, timeframe],
  );

  const dashboardFilters = useMemo(
    () => ({
      dateRange: dateRange
        ? {
            startDate: dateRange.start.toISOString(),
            endDate: dateRange.end.toISOString(),
          }
        : null,
      timezone: "Europe/Oslo",
    }),
    [dateRange],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await getAdminDashboardOverviewRequest(dashboardFilters);

        if (!isMounted) {
          return;
        }

        setDashboardData(response);
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [dashboardFilters]);

  function handleCustomDateChange(start, end) {
    setCustomStart(start);
    setCustomEnd(end);
  }

  async function handleUpdateStatus(approval, nextStatus) {
    let rejectionReason = "";

    if (nextStatus === "REJECTED") {
      const rejectionPrompt = await Swal.fire({
        title: "Reject vendor application",
        input: "textarea",
        inputLabel: "Reason",
        inputPlaceholder: "Explain why this vendor is being rejected",
        showCancelButton: true,
        confirmButtonText: "Reject",
        confirmButtonColor: "#d83f3f",
        cancelButtonColor: "#c8b9aa",
        inputValidator: (value) => (!value ? "A rejection reason is required." : undefined),
      });

      if (!rejectionPrompt.isConfirmed) {
        return;
      }

      rejectionReason = rejectionPrompt.value || "";
    }

    try {
      setApprovalActionId(approval.id);

      let response;
      if (nextStatus === "APPROVED") {
        response = await approveVendorApplicationRequest(approval.id, {});
      } else if (nextStatus === "REJECTED") {
        response = await rejectVendorApplicationRequest(approval.id, {
          reason: rejectionReason,
          note: rejectionReason,
        });
      } else {
        response = await updateVendorApprovalStatusRequest({
          approvalId: approval.id,
          status: String(nextStatus || "").trim().toUpperCase(),
        });
      }

      setDashboardData((current) => ({
        ...current,
        approvals: current.approvals.map((item) =>
          item.id === approval.id
            ? {
                ...item,
                status:
                  nextStatus === "APPROVED"
                    ? "Approved"
                    : nextStatus === "REJECTED"
                      ? "Rejected"
                      : response.approval.status,
                rawStatus:
                  nextStatus === "APPROVED"
                    ? "APPROVED"
                    : nextStatus === "REJECTED"
                      ? "REJECTED"
                      : response.approval.rawStatus,
                canApprove:
                  nextStatus === "APPROVED" || nextStatus === "REJECTED"
                    ? false
                    : response.approval.rawStatus === "PENDING" || response.approval.rawStatus === "REVIEWING",
                canReject:
                  nextStatus === "APPROVED" || nextStatus === "REJECTED"
                    ? false
                    : response.approval.rawStatus === "PENDING" || response.approval.rawStatus === "REVIEWING",
                canMarkReviewing:
                  nextStatus === "APPROVED" || nextStatus === "REJECTED"
                    ? false
                    : response.approval.rawStatus === "PENDING",
                canMarkPending:
                  nextStatus === "APPROVED" || nextStatus === "REJECTED"
                    ? false
                    : response.approval.rawStatus === "REVIEWING",
              }
            : item,
        ),
      }));

      await Swal.fire({
        icon: "success",
        title: "Approval updated",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: error instanceof Error ? error.message : "Unable to update approval status.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setApprovalActionId("");
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">
            Dashboard Overview
          </h1>
          <p className="text-[18px] leading-7 text-[#6f645d]">
            Monitor platform performance, financials, and daily catering operations.
          </p>
        </div>

        <DateFilterDropdown
          selectedFilter={timeframe}
          onChangeFilter={setTimeframe}
          startDate={customStart}
          endDate={customEnd}
          onCustomDateChange={handleCustomDateChange}
        />
      </section>

      {loadError ? (
        <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-8 text-center text-[15px] font-medium text-[#9f4d33]">
          {loadError}
        </div>
      ) : null}

      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {dashboardData.stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            note={stat.note}
            trend={stat.trend}
            icon={statIcons[stat.id]}
          />
        ))}
      </section>

      <section className="grid items-stretch gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RevenueAnalyticsChart
            chart={dashboardData.chart}
            isLoading={isLoading}
            timeframe={timeframe}
          />
        </div>
        <div className="flex h-full flex-col gap-4 lg:col-span-4">
          <VendorBreakdownCard breakdown={dashboardData.vendorBreakdown} />
          <TopPerformingVendors vendors={dashboardData.topPerformingVendors} />
        </div>
      </section>

      <section>
        <PendingVendorApprovalsTable
          approvalActionId={approvalActionId}
          approvals={dashboardData.approvals}
          onUpdateStatus={handleUpdateStatus}
        />
      </section>

      <section>
        <QuickActionsGrid actions={dashboardData.quickActions} />
      </section>
    </div>
  );
}
