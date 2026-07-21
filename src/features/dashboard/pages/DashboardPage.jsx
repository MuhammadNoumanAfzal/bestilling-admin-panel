import { useMemo, useState } from "react";
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

import {
  getDashboardSnapshot,
} from "../data/dashboardData.js";

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("Last 7 days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [approvalOverrides, setApprovalOverrides] = useState({});

  // Map stat IDs to their respective Lucide icons
  const statIcons = {
    revenue: DollarSign,
    orders: Calendar,
    vendors: Store,
    customers: Users,
    approvals: Clock,
    support: Headphones,
  };

  const dashboardSnapshot = useMemo(
    () => getDashboardSnapshot(timeframe, customStart, customEnd),
    [timeframe, customStart, customEnd]
  );

  const approvals = useMemo(
    () =>
      dashboardSnapshot.approvals.map((approval) =>
        approvalOverrides[approval.id]
          ? { ...approval, status: approvalOverrides[approval.id] }
          : approval
      ),
    [approvalOverrides, dashboardSnapshot.approvals]
  );

  // Handle status update of inline vendor approvals
  const handleUpdateStatus = (id, newStatus) => {
    setApprovalOverrides((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleCustomDateChange = (start, end) => {
    setCustomStart(start);
    setCustomEnd(end);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Subtitle */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">
            Dashboard Overview
          </h1>
          <p className="text-[18px] leading-7 text-[#6f645d]">
            Monitor platform performance, financials, and daily catering operations.
          </p>
        </div>

        <div>
          <DateFilterDropdown
            selectedFilter={timeframe}
            onChangeFilter={setTimeframe}
            startDate={customStart}
            endDate={customEnd}
            onCustomDateChange={handleCustomDateChange}
          />
        </div>
      </section>

      {/* 6 Grid Stats Overview */}
      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {dashboardSnapshot.stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            note={stat.note}
            accent={stat.accent}
            icon={statIcons[stat.id]}
          />
        ))}
      </section>

      {/* Two Column Grid: Chart & Side Panel */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RevenueAnalyticsChart
            timeframe={timeframe}
            chartData={dashboardSnapshot.chartData}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          <VendorBreakdownCard breakdown={dashboardSnapshot.vendorBreakdown} />
          <TopPerformingVendors vendors={dashboardSnapshot.topPerformingVendors} />
        </div>
      </section>

      {/* Pending Vendor Approvals Table */}
      <section>
        <PendingVendorApprovalsTable
          approvals={approvals}
          onUpdateStatus={handleUpdateStatus}
        />
      </section>

      {/* Quick Actions */}
      <section>
        <QuickActionsGrid />
      </section>
    </div>
  );
}
