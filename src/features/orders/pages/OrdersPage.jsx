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
  initialOrders,
} from "../data/ordersData.js";

const iconMap = {
  total: ShoppingBag,
  new: PlusCircle,
  pending: Clock,
  delivery: Truck,
  delivered: CheckCircle,
  canceled: XCircle,
};

function parseOrderDate(dateTime) {
  const [day, month, year] = String(dateTime || "").split(" ");
  if (!day || !month || !year) {
    return new Date(Number.NaN);
  }

  return new Date(`${month} ${day}, ${year}`);
}

function getDateRange(timeframe, customStart, customEnd) {
  const today = new Date("2026-07-21T12:00:00");
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  if (timeframe === "Custom Date" && customStart && customEnd) {
    const start = new Date(`${customStart}T00:00:00`);
    const customEndDate = new Date(`${customEnd}T23:59:59`);

    if (
      !Number.isNaN(start.getTime()) &&
      !Number.isNaN(customEndDate.getTime()) &&
      start <= customEndDate
    ) {
      return { start, end: customEndDate };
    }
  }

  const start = new Date(today);

  switch (timeframe) {
    case "Last Month":
      start.setDate(start.getDate() - 30);
      break;
    case "Last 3 Months":
      start.setDate(start.getDate() - 90);
      break;
    case "Last 6 Months":
      start.setDate(start.getDate() - 180);
      break;
    case "This Year":
      start.setMonth(0, 1);
      break;
    case "Last 7 days":
    default:
      start.setDate(start.getDate() - 7);
      break;
  }

  start.setHours(0, 0, 0, 0);

  return { start, end };
}

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

  const vendors = useMemo(() => {
    const set = new Set(initialOrders.map((o) => o.vendor));
    return Array.from(set);
  }, []);

  const paymentStatuses = useMemo(() => {
    const set = new Set(initialOrders.map((o) => o.paymentStatus));
    return Array.from(set);
  }, []);

  const filteredOrders = useMemo(() => {
    const { start, end } = getDateRange(timeframe, customStart, customEnd);

    return initialOrders.filter((order) => {
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const matches =
          order.id.toLowerCase().includes(s) ||
          order.customer.toLowerCase().includes(s) ||
          order.customerEmail.toLowerCase().includes(s) ||
          order.vendor.toLowerCase().includes(s);
        if (!matches) return false;
      }

      if (vendorFilter && order.vendor !== vendorFilter) return false;

      if (statusFilter && order.status !== statusFilter) return false;

      if (paymentFilter && order.paymentStatus !== paymentFilter) return false;

      const orderDate = parseOrderDate(order.dateTime);
      if (Number.isNaN(orderDate.getTime()) || orderDate < start || orderDate > end) {
        return false;
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

  const paginatedOrders = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIdx, startIdx + pageSize);
  }, [filteredOrders, currentPage]);

  const orderStats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + Number(order.amountValue || 0),
      0,
    );

    return [
      {
        id: "total",
        title: "Total Orders",
        value: filteredOrders.length.toLocaleString(),
      },
      {
        id: "new",
        title: "Paid Orders",
        value: filteredOrders
          .filter((order) => order.paymentStatus === "Paid")
          .length.toLocaleString(),
      },
      {
        id: "pending",
        title: "Pending",
        value: filteredOrders
          .filter((order) => order.status === "Pending")
          .length.toLocaleString(),
      },
      {
        id: "delivery",
        title: "Refund / Review",
        value: filteredOrders
          .filter((order) => order.paymentStatus !== "Paid")
          .length.toLocaleString(),
      },
      {
        id: "delivered",
        title: "Delivered",
        value: filteredOrders
          .filter((order) => order.status === "Delivered")
          .length.toLocaleString(),
      },
      {
        id: "canceled",
        title: "Revenue",
        value: `NOK ${totalRevenue.toLocaleString()}`,
      },
    ];
  }, [filteredOrders]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#18120f] sm:text-[40px]">
            Orders Management
          </h1>
          <p className="text-[15px] leading-6 text-[#6f645d] sm:text-[18px] sm:leading-7">
            Manage and track all orders status.
          </p>
        </div>

        <div className="w-full md:w-auto md:max-w-full [&>*]:w-full md:[&>*]:w-auto">
          <DateFilterDropdown
            selectedFilter={timeframe}
            onChangeFilter={handleTimeframeChange}
            startDate={customStart}
            endDate={customEnd}
            onCustomDateChange={handleCustomDateChange}
          />
        </div>
      </section>

      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {orderStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            accent={stat.accent}
            icon={iconMap[stat.id]}
          />
        ))}
      </section>

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

        <div className="p-3 sm:p-4">
          <OrdersTable
            orders={paginatedOrders}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredOrders.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <TopCateringCategoriesChart />
        </div>
      </section>
    </div>
  );
}
