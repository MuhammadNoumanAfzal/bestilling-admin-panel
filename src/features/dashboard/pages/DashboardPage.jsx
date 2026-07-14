import { useState } from "react";
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

import {
  dashboardStats,
  initialPendingApprovals,
} from "../data/dashboardData.js";

export default function DashboardPage() {
  const [approvals, setApprovals] = useState(initialPendingApprovals);
  const [timeframe, setTimeframe] = useState("Last 7 days");

  // Map stat IDs to their respective Lucide icons
  const statIcons = {
    revenue: DollarSign,
    orders: Calendar,
    vendors: Store,
    customers: Users,
    approvals: Clock,
    support: Headphones,
  };

  // Handle status update of inline vendor approvals
  const handleUpdateStatus = (id, newStatus) => {
    setApprovals((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
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
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-[8px] border border-[#d8ccc2] bg-white px-4 py-2 text-[13px] font-semibold text-[#4d423b] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)] cursor-pointer"
          >
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last Month">Last Month</option>
          </select>
        </div>
      </section>

      {/* 6 Grid Stats Overview */}
      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {dashboardStats.map((stat) => (
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
          <RevenueAnalyticsChart />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          <VendorBreakdownCard />
          <TopPerformingVendors />
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
