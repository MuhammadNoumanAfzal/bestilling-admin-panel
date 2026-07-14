import { useState, useMemo } from "react";
import {
  ShoppingBag,
  PlusCircle,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

import StatCard from "../../dashboard/components/StatCard.jsx";
import OrdersToolbar from "../components/OrdersToolbar.jsx";
import OrdersTable from "../components/OrdersTable.jsx";
import TopCateringCategoriesChart from "../components/TopCateringCategoriesChart.jsx";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";

import {
  ordersStats,
  initialOrders,
} from "../data/ordersData.js";

// Map metrics to Lucide Icons
const iconMap = {
  total: ShoppingBag,
  new: PlusCircle,
  pending: Clock,
  delivery: Truck,
  delivered: CheckCircle,
  canceled: XCircle,
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [timeframe, setTimeframe] = useState("Last 7 days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setVendorFilter("");
    setStatusFilter("");
    setPaymentFilter("");
    setTimeframe("Last 7 days");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  };

  // Safe handlers that also reset pagination
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleVendorFilterChange = (val) => {
    setVendorFilter(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handlePaymentFilterChange = (val) => {
    setPaymentFilter(val);
    setCurrentPage(1);
  };

  const handleTimeframeChange = (val) => {
    setTimeframe(val);
    setCurrentPage(1);
  };

  const handleCustomDateChange = (start, end) => {
    setCustomStart(start);
    setCustomEnd(end);
    setCurrentPage(1);
  };

  // Extract unique filters from base dataset
  const vendors = useMemo(() => {
    const set = new Set(initialOrders.map((o) => o.vendor));
    return Array.from(set);
  }, []);

  const paymentStatuses = useMemo(() => {
    const set = new Set(initialOrders.map((o) => o.paymentStatus));
    return Array.from(set);
  }, []);

  // Filter logic
  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      // Search check
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const matches =
          order.id.toLowerCase().includes(s) ||
          order.customer.toLowerCase().includes(s) ||
          order.customerEmail.toLowerCase().includes(s) ||
          order.vendor.toLowerCase().includes(s);
        if (!matches) return false;
      }

      // Vendor check
      if (vendorFilter && order.vendor !== vendorFilter) return false;

      // Status check
      if (statusFilter && order.status !== statusFilter) return false;

      // Payment Status check
      if (paymentFilter && order.paymentStatus !== paymentFilter) return false;

      // Date Range check
      if (timeframe && timeframe !== "Clear Filter") {
        if (timeframe === "Custom Date" && customStart && customEnd) {
          const orderDate = new Date(order.dateTime.split(" ").slice(0, 3).join(" "));
          const start = new Date(customStart);
          const end = new Date(customEnd);
          orderDate.setHours(0, 0, 0, 0);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          if (orderDate < start || orderDate > end) return false;
        } else if (timeframe !== "Custom Date") {
          const orderDate = new Date(order.dateTime.split(" ").slice(0, 3).join(" "));
          orderDate.setHours(0, 0, 0, 0);
          const limitDate = new Date();
          limitDate.setHours(0, 0, 0, 0);

          if (timeframe === "Last 7 days") {
            limitDate.setDate(limitDate.getDate() - 7);
          } else if (timeframe === "Last Month") {
            limitDate.setMonth(limitDate.getMonth() - 1);
          } else if (timeframe === "Last 3 Months") {
            limitDate.setMonth(limitDate.getMonth() - 3);
          } else if (timeframe === "Last 6 Months") {
            limitDate.setMonth(limitDate.getMonth() - 6);
          } else if (timeframe === "This Year") {
            limitDate.setFullYear(2026, 0, 1);
          }
          if (orderDate < limitDate) return false;
        }
      }

      return true;
    });
  }, [
    searchTerm,
    vendorFilter,
    statusFilter,
    paymentFilter,
    timeframe,
    customStart,
    customEnd,
  ]);

  // Pagination slice
  const paginatedOrders = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIdx, startIdx + pageSize);
  }, [filteredOrders, currentPage]);

  return (
    <div className="space-y-6">
      {/* Top Header & Subtitle */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">
            Orders Management
          </h1>
          <p className="text-[18px] leading-7 text-[#6f645d]">
            Manage and track all orders status.
          </p>
        </div>

        <div>
          <DateFilterDropdown
            selectedFilter={timeframe}
            onChangeFilter={handleTimeframeChange}
            startDate={customStart}
            endDate={customEnd}
            onCustomDateChange={handleCustomDateChange}
          />
        </div>
      </section>

      {/* 6 Grid Stats Overview */}
      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {ordersStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            accent={stat.accent}
            icon={iconMap[stat.id]}
          />
        ))}
      </section>

      {/* Toolbar and Orders Table Card */}
      <section className="rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
        <OrdersToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          vendorFilter={vendorFilter}
          onVendorFilterChange={handleVendorFilterChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          paymentFilter={paymentFilter}
          onPaymentFilterChange={handlePaymentFilterChange}
          timeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
          customStart={customStart}
          customEnd={customEnd}
          onCustomDateChange={handleCustomDateChange}
          onResetFilters={handleResetFilters}
          vendors={vendors}
          statuses={["Delivered", "Pending", "Canceled"]}
          paymentStatuses={paymentStatuses}
        />

        <div className="p-4">
          <OrdersTable
            orders={paginatedOrders}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredOrders.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* Top Catering Categories */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <TopCateringCategoriesChart />
        </div>
      </section>
    </div>
  );
}
