import { useState, useMemo } from "react";
import { Users, Wifi, Clock, AlertTriangle, CircleAlert, DollarSign } from "lucide-react";

import StatCard from "../../dashboard/components/StatCard.jsx";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";
import VendorsToolbar from "../components/VendorsToolbar.jsx";
import VendorsTable from "../components/VendorsTable.jsx";
import TopPerformingVendorsCard from "../components/TopPerformingVendorsCard.jsx";
import RecentVendorRequestsCard from "../components/RecentVendorRequestsCard.jsx";
import VendorStatusOverviewCard from "../components/VendorStatusOverviewCard.jsx";

import { initialVendors } from "../data/vendorsData.js";

const iconMap = {
  total: Users,
  active: Wifi,
  pending: Clock,
  suspended: AlertTriangle,
  revenue: DollarSign,
};

function getJoinedRangeForInlineFilter(filterValue) {
  switch (filterValue) {
    case "7days":
      return getDateRangeForFilter("Last 7 days");
    case "month":
      return getDateRangeForFilter("Last Month");
    case "year":
      return getDateRangeForFilter("This Year");
    default:
      return null;
  }
}

function formatCompactRevenue(value) {
  if (value >= 1000000) {
    return `NOK ${(value / 1000000).toFixed(2)}M`;
  }

  return `NOK ${value.toLocaleString()}`;
}

export default function VendorsPage() {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [timeframeFilter, setTimeframeFilter] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Header date range dropdown (for overall timeframe overview)
  const [timeframe, setTimeframe] = useState("Last 7 days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const handleCustomDateChange = (start, end) => {
    setCustomStart(start);
    setCustomEnd(end);
    setCurrentPage(1);
  };

  // Unique vendor names
  const vendorNames = useMemo(() => {
    const set = new Set(initialVendors.map((v) => v.name));
    return Array.from(set);
  }, []);

  // Unique cities from base list
  const cities = useMemo(() => {
    const set = new Set(initialVendors.map((v) => v.city));
    return Array.from(set);
  }, []);

  // Filtered/sorted list calculation
  const processedVendors = useMemo(() => {
    let result = [...initialVendors];

    // 1. Search Query filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.businessType.toLowerCase().includes(q)
      );
    }

    // 2. Vendor Name filter
    if (vendorFilter) {
      result = result.filter((v) => v.name === vendorFilter);
    }

    // 3. City Dropdown filter
    if (cityFilter) {
      result = result.filter((v) => v.city === cityFilter);
    }

    // 4. Rating Dropdown filter
    if (ratingFilter) {
      const threshold = parseFloat(ratingFilter);
      result = result.filter((v) => v.rating >= threshold);
    }

    // 5. Joined Date timeframe filter
    if (timeframeFilter) {
      const joinedRange = getJoinedRangeForInlineFilter(timeframeFilter);
      result = result.filter((v) => {
        const joinDate = new Date(v.joinDateValue);
        if (joinedRange) {
          return joinDate >= joinedRange.start && joinDate <= joinedRange.end;
        }
        return true;
      });
    }

    // 6. Header timeframe filter
    if (timeframe) {
      const headerRange = getDateRangeForFilter(timeframe, customStart, customEnd);
      result = result.filter((v) => {
        const joinDate = new Date(v.joinDateValue);
        return joinDate >= headerRange.start && joinDate <= headerRange.end;
      });
    }

    // 7. Tab selection filter
    if (activeTab !== "All") {
      if (activeTab === "Top Performing") {
        // Sort by revenue descending
        result.sort((a, b) => b.revenueValue - a.revenueValue);
      } else {
        // Filter by status match
        result = result.filter((v) => v.status === activeTab);
      }
    }

    return result;
  }, [
    activeTab,
    cityFilter,
    customEnd,
    customStart,
    ratingFilter,
    searchTerm,
    timeframe,
    timeframeFilter,
    vendorFilter,
  ]);

  const topVendors = useMemo(
    () => [...processedVendors].sort((left, right) => right.revenueValue - left.revenueValue).slice(0, 5),
    [processedVendors],
  );

  const recentVendorRequests = useMemo(
    () =>
      processedVendors
        .filter((vendor) => vendor.status === "Pending Approval")
        .sort((left, right) => new Date(right.joinDateValue) - new Date(left.joinDateValue))
        .slice(0, 5),
    [processedVendors],
  );

  // Paginated list
  const paginatedVendors = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return processedVendors.slice(startIdx, startIdx + pageSize);
  }, [processedVendors, currentPage]);

  const vendorStats = useMemo(() => {
    const totalRevenue = processedVendors.reduce(
      (sum, vendor) => sum + Number(vendor.revenueValue || 0),
      0,
    );

    return [
      {
        id: "total",
        title: "Total Vendor",
        value: processedVendors.length.toLocaleString(),
      },
      {
        id: "active",
        title: "Active Vendor",
        value: processedVendors
          .filter((vendor) => vendor.status === "Active")
          .length.toLocaleString(),
      },
      {
        id: "pending",
        title: "Pending Approval",
        value: processedVendors
          .filter((vendor) => vendor.status === "Pending Approval")
          .length.toLocaleString(),
      },
      {
        id: "suspended",
        title: "Suspended",
        value: processedVendors
          .filter((vendor) => vendor.status === "Suspended")
          .length.toLocaleString(),
      },
      {
        id: "revenue",
        title: "Total Vendor Revenue",
        value: formatCompactRevenue(totalRevenue),
      },
    ];
  }, [processedVendors]);

  // Reset pagination when filter parameters change
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleVendorFilterChange = (val) => {
    setVendorFilter(val);
    setCurrentPage(1);
  };

  const handleCityChange = (val) => {
    setCityFilter(val);
    setCurrentPage(1);
  };

  const handleRatingChange = (val) => {
    setRatingFilter(val);
    setCurrentPage(1);
  };

  const handleTimeframeFilterChange = (val) => {
    setTimeframeFilter(val);
    setCurrentPage(1);
  };

  const handleTabChange = (val) => {
    setActiveTab(val);
    setCurrentPage(1);
  };

  const handleHeaderFilterChange = (value) => {
    setTimeframe(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setVendorFilter("");
    setCityFilter("");
    setRatingFilter("");
    setTimeframeFilter("");
    setActiveTab("All");
    setTimeframe("Last 7 days");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">
            Vendor Management
          </h1>
          <p className="text-[18px] leading-7 text-[#6f645d]">
            Manage and track all vendors activity.
          </p>
        </div>

        <div>
          <DateFilterDropdown
            selectedFilter={timeframe}
            onChangeFilter={handleHeaderFilterChange}
            startDate={customStart}
            endDate={customEnd}
            onCustomDateChange={handleCustomDateChange}
          />
        </div>
      </section>

      {/* 5 Cards Stats Row */}
      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {vendorStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={iconMap[stat.id] || CircleAlert}
          />
        ))}
      </section>

      {/* Vendors Table and Filter Card wrapper */}
      <section className="rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)] overflow-hidden">
        <VendorsToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          vendorFilter={vendorFilter}
          onVendorFilterChange={handleVendorFilterChange}
          cityFilter={cityFilter}
          onCityFilterChange={handleCityChange}
          ratingFilter={ratingFilter}
          onRatingFilterChange={handleRatingChange}
          timeframeFilter={timeframeFilter}
          onTimeframeFilterChange={handleTimeframeFilterChange}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onResetFilters={handleResetFilters}
          vendors={vendorNames}
          cities={cities}
        />

        <div className="px-4 pb-4">
          <VendorsTable
            vendors={paginatedVendors}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={processedVendors.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* 3 Columns Footer grid */}
      <section className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <TopPerformingVendorsCard vendors={topVendors} />
        <RecentVendorRequestsCard vendors={recentVendorRequests} />
        <VendorStatusOverviewCard vendors={processedVendors} />
      </section>
    </div>
  );
}
