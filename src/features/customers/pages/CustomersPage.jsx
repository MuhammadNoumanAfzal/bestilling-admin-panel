import { useMemo, useState } from "react";

import CustomerOverviewCard from "../components/CustomerOverviewCard.jsx";
import CustomersTable from "../components/CustomersTable.jsx";
import CustomersToolbar from "../components/CustomersToolbar.jsx";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";

import { customerRows, customersPagination } from "../data/customersData.js";

function formatCompactCurrency(value) {
  if (value >= 1000000) {
    return `NOK ${(value / 1000000).toFixed(2)}M`;
  }

  return `NOK ${value.toLocaleString()}`;
}

export default function CustomersPage() {
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [timeframeFilter, setTimeframeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = customersPagination.pageSize;

  // Header Date Filter Dropdown
  const [timeframe, setTimeframe] = useState("Last 7 days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const handleCustomDateChange = (start, end) => {
    setCustomStart(start);
    setCustomEnd(end);
    setCurrentPage(1);
  };

  // Extract unique cities
  const citiesList = useMemo(() => {
    const set = new Set(customerRows.map((c) => c.city));
    return Array.from(set);
  }, []);

  // Filter logic
  const filteredRows = useMemo(() => {
    let result = [...customerRows];

    // 1. Search Query filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (row) =>
          row.id.toLowerCase().includes(q) ||
          row.name.toLowerCase().includes(q) ||
          row.phone.toLowerCase().includes(q) ||
          row.email.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (statusFilter) {
      result = result.filter((row) => row.status === statusFilter);
    }

    // 3. City filter
    if (cityFilter) {
      result = result.filter((row) => row.city === cityFilter);
    }

    // 4. Registration Date timeframe filter
    if (timeframeFilter) {
      const inlineFilterLabel =
        timeframeFilter === "7days"
          ? "Last 7 days"
          : timeframeFilter === "month"
            ? "Last Month"
            : timeframeFilter === "year"
              ? "This Year"
              : "";
      const inlineRange = inlineFilterLabel ? getDateRangeForFilter(inlineFilterLabel) : null;

      result = result.filter((row) => {
        const joinDate = new Date(row.joinDateValue);
        if (inlineRange) {
          return joinDate >= inlineRange.start && joinDate <= inlineRange.end;
        }
        return true;
      });
    }

    // 5. Header Timeframe filter dropdown
    if (timeframe) {
      const headerRange = getDateRangeForFilter(timeframe, customStart, customEnd);
      result = result.filter((row) => {
        const joinDate = new Date(row.joinDateValue);
        return joinDate >= headerRange.start && joinDate <= headerRange.end;
      });
    }

    return result;
  }, [searchTerm, statusFilter, cityFilter, timeframeFilter, timeframe, customStart, customEnd]);

  // Paginated Rows
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, currentPage, pageSize]);

  // Handler resets
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleCityChange = (val) => {
    setCityFilter(val);
    setCurrentPage(1);
  };

  const handleTimeframeFilterChange = (val) => {
    setTimeframeFilter(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCityFilter("");
    setTimeframeFilter("");
    setTimeframe("Last 7 days");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  };

  const customerSummary = useMemo(() => {
    const totalOrders = filteredRows.reduce((sum, row) => sum + Number(row.totalOrders || 0), 0);
    const totalSpending = filteredRows.reduce((sum, row) => sum + Number(row.amountValue || 0), 0);
    const activeCustomers = filteredRows.filter((row) => row.status === "Active").length;
    const now = new Date("2026-07-21T12:00:00");
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = filteredRows.filter(
      (row) => new Date(row.joinDateValue) >= monthStart,
    ).length;

    return [
      {
        id: "total",
        label: "Total Customers",
        value: filteredRows.length.toLocaleString(),
        accent: "soft",
      },
      {
        id: "active",
        label: "Active Customers",
        value: activeCustomers.toLocaleString(),
        accent: "warm",
      },
      {
        id: "new",
        label: "New This Month",
        value: newThisMonth.toLocaleString(),
        accent: "neutral",
      },
      {
        id: "orders",
        label: "Total Orders",
        value: totalOrders.toLocaleString(),
        accent: "strong",
      },
      {
        id: "average",
        label: "Avg. Order Value",
        value: filteredRows.length
          ? `NOK ${Math.round(totalSpending / filteredRows.length).toLocaleString()}`
          : "NOK 0",
        accent: "soft",
      },
      {
        id: "spending",
        label: "Total Spending",
        value: formatCompactCurrency(totalSpending),
        accent: "warm",
      },
    ];
  }, [filteredRows]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Customers</h1>
          <p className="text-[18px] leading-7 text-[#6f645d]">
            Manage customer accounts, orders, and support activity.
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

      {/* 6 Cards Stats Row */}
      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {customerSummary.map((item) => (
          <CustomerOverviewCard key={item.id} {...item} />
        ))}
      </section>

      {/* Table & Toolbar Container */}
      <section className="overflow-hidden rounded-[16px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
        <CustomersToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusChange}
          cityFilter={cityFilter}
          onCityFilterChange={handleCityChange}
          timeframeFilter={timeframeFilter}
          onTimeframeFilterChange={handleTimeframeFilterChange}
          cities={citiesList}
          onResetFilters={handleResetFilters}
        />
        <CustomersTable
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          rows={paginatedRows}
          totalItems={filteredRows.length}
        />
      </section>
    </div>
  );
}
