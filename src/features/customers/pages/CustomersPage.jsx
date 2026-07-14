import { useMemo, useState } from "react";

import CustomerOverviewCard from "../components/CustomerOverviewCard.jsx";
import CustomersTable from "../components/CustomersTable.jsx";
import CustomersToolbar from "../components/CustomersToolbar.jsx";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";

import { customerRows, customersSummary, customersPagination } from "../data/customersData.js";

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
      const now = new Date();
      result = result.filter((row) => {
        const joinDate = new Date(row.joinDateValue);
        const limitDate = new Date();
        if (timeframeFilter === "7days") {
          limitDate.setDate(now.getDate() - 7);
          return joinDate >= limitDate;
        } else if (timeframeFilter === "month") {
          limitDate.setMonth(now.getMonth() - 1);
          return joinDate >= limitDate;
        } else if (timeframeFilter === "year") {
          return joinDate.getFullYear() === 2026;
        }
        return true;
      });
    }

    // 5. Header Timeframe filter dropdown
    if (timeframe) {
      if (timeframe === "Custom Date" && customStart && customEnd) {
        const start = new Date(customStart);
        const end = new Date(customEnd);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        result = result.filter((row) => {
          const joinDate = new Date(row.joinDateValue);
          joinDate.setHours(0, 0, 0, 0);
          return joinDate >= start && joinDate <= end;
        });
      } else if (timeframe !== "Custom Date" && timeframe !== "Clear Filter") {
        const limitDate = new Date();
        limitDate.setHours(0, 0, 0, 0);

        if (timeframe === "Last 7 days") {
          limitDate.setDate(limitDate.getDate() - 7);
        } else if (timeframe === "Last Month") {
          limitDate.setMonth(limitDate.getMonth() - 1);
        } else if (timeframe === "This Year") {
          limitDate.setFullYear(2026, 0, 1);
        }

        result = result.filter((row) => {
          const joinDate = new Date(row.joinDateValue);
          joinDate.setHours(0, 0, 0, 0);
          return joinDate >= limitDate;
        });
      }
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
    setCurrentPage(1);
  };

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
        {customersSummary.map((item) => (
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
