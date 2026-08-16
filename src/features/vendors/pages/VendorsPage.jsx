import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Users, Wifi, Clock, AlertTriangle, CircleAlert, DollarSign } from "lucide-react";
import StatCard from "../../dashboard/components/StatCard.jsx";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";
import {
  deactivateVendorRequest,
  getAdminVendorsRequest,
  updateVendorStatusRequest,
} from "../api/vendorsApi.js";
import RecentVendorRequestsCard from "../components/RecentVendorRequestsCard.jsx";
import TopPerformingVendorsCard from "../components/TopPerformingVendorsCard.jsx";
import VendorsTable from "../components/VendorsTable.jsx";
import VendorsToolbar from "../components/VendorsToolbar.jsx";
import VendorStatusOverviewCard from "../components/VendorStatusOverviewCard.jsx";

const PAGE_SIZE = 10;
const FETCH_PAGE_SIZE = 100;

const iconMap = {
  total: Users,
  active: Wifi,
  pending: Clock,
  suspended: AlertTriangle,
  revenue: DollarSign,
};

const ALL_DATES_FILTER = "All Dates";

function matchesTab(row, tab) {
  if (tab === "All") {
    return true;
  }

  if (tab === "Top Performing") {
    return true;
  }

  return row.status === tab;
}

function sortRows(rows, activeTab) {
  const items = [...rows];

  if (activeTab === "Top Performing") {
    return items.sort((left, right) => right.revenueValue - left.revenueValue);
  }

  return items.sort((left, right) => {
    const leftTime = new Date(left.joinDateValue || 0).getTime();
    const rightTime = new Date(right.joinDateValue || 0).getTime();
    return rightTime - leftTime;
  });
}

function withinDateRange(value, dateRange) {
  if (!dateRange?.start && !dateRange?.end) {
    return true;
  }

  const timestamp = new Date(value || "").getTime();
  if (Number.isNaN(timestamp)) {
    return false;
  }

  const start = dateRange?.start ? new Date(dateRange.start).getTime() : null;
  const end = dateRange?.end ? new Date(dateRange.end).getTime() : null;

  if (start != null && timestamp < start) {
    return false;
  }

  if (end != null && timestamp > end) {
    return false;
  }

  return true;
}

function buildFilterOptions(rows) {
  return {
    vendors: rows
      .map((row) => ({ id: row.id, name: row.name }))
      .sort((left, right) => left.name.localeCompare(right.name)),
    cities: [...new Set(rows.map((row) => row.city).filter(Boolean))].sort((left, right) =>
      left.localeCompare(right),
    ),
    statuses: [...new Set(rows.map((row) => row.status).filter(Boolean))],
  };
}

async function getAllAdminVendors(baseFilters) {
  const firstPage = await getAdminVendorsRequest({
    ...baseFilters,
    page: 1,
    pageSize: FETCH_PAGE_SIZE,
  });

  const totalPages = Math.max(1, Number(firstPage.pageInfo?.totalPages ?? 1));
  if (totalPages === 1) {
    return firstPage;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getAdminVendorsRequest({
        ...baseFilters,
        page: index + 2,
        pageSize: FETCH_PAGE_SIZE,
      }),
    ),
  );

  return {
    ...firstPage,
    rows: [firstPage.rows, ...remainingPages.map((page) => page.rows)].flat(),
  };
}

export default function VendorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "All");
  const [currentPage, setCurrentPage] = useState(1);
  const [timeframe, setTimeframe] = useState(ALL_DATES_FILTER);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [stats, setStats] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    vendors: [],
    cities: [],
    statuses: [],
  });
  const [sidePanels, setSidePanels] = useState({
    topPerformers: [],
    recentRequests: [],
    statusBreakdown: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isUpdatingStatusId, setIsUpdatingStatusId] = useState("");

  const dateRange = useMemo(
    () => (timeframe === ALL_DATES_FILTER ? null : getDateRangeForFilter(timeframe, customStart, customEnd)),
    [customEnd, customStart, timeframe],
  );

  const filteredRows = useMemo(
    () =>
      sortRows(
        allRows.filter((row) => {
          const searchValue = searchTerm.trim().toLowerCase();
          const matchesSearch =
            !searchValue ||
            row.name.toLowerCase().includes(searchValue) ||
            row.businessType.toLowerCase().includes(searchValue) ||
            row.city.toLowerCase().includes(searchValue);

          const matchesVendor = !vendorFilter || row.id === vendorFilter;
          const matchesCity = !cityFilter || row.city === cityFilter;
          const matchesRating = !ratingFilter || row.ratingValue >= Number(ratingFilter);
          const matchesDate = withinDateRange(row.joinDateValue, dateRange);

          return (
            matchesSearch &&
            matchesVendor &&
            matchesCity &&
            matchesRating &&
            matchesDate &&
            matchesTab(row, activeTab)
          );
        }),
        activeTab,
      ),
    [activeTab, allRows, cityFilter, dateRange, ratingFilter, searchTerm, vendorFilter],
  );

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredRows.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredRows]);

  const pageInfo = useMemo(() => {
    const totalItems = filteredRows.length;
    return {
      page: currentPage,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / PAGE_SIZE)),
    };
  }, [currentPage, filteredRows.length]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if ((tabFromUrl || "All") !== activeTab) {
      setActiveTab(tabFromUrl || "All");
      setCurrentPage(1);
    }
  }, [activeTab, searchParams]);

  useEffect(() => {
    let isMounted = true;

    async function loadVendors() {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await getAllAdminVendors({
          search: null,
          vendorId: null,
          city: null,
          minRating: null,
          status: null,
          joinedFrom: null,
          joinedTo: null,
          sortBy: "JOINED_AT",
          sortOrder: "DESC",
        });

        if (!isMounted) {
          return;
        }
        setAllRows(response.rows);
        setStats(response.stats);
        setFilterOptions(buildFilterOptions(response.rows));
        setSidePanels(response.sidePanels);
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load vendors.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVendors();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, vendorFilter, cityFilter, ratingFilter, activeTab, timeframe, customStart, customEnd]);

  function handleCustomDateChange(start, end) {
    setCustomStart(start);
    setCustomEnd(end);
    setCurrentPage(1);
  }

  function handleTabChange(value) {
    setActiveTab(value);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      if (value === "All") {
        nextParams.delete("tab");
      } else {
        nextParams.set("tab", value);
      }
      return nextParams;
    });
    setCurrentPage(1);
  }

  function handleResetFilters() {
    setSearchTerm("");
    setVendorFilter("");
    setCityFilter("");
    setRatingFilter("");
    setActiveTab("All");
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.delete("tab");
      return nextParams;
    });
    setTimeframe(ALL_DATES_FILTER);
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  }

  async function handleToggleStatus(row) {
    const isReactivating = row.status === "Suspended" || row.status === "Deactivated";

    const reasonResult = await Swal.fire({
      title: isReactivating ? "Reactivate vendor?" : "Suspend vendor?",
      text: isReactivating
        ? `Restore ${row.name} to active marketplace status?`
        : `${row.name} will stop receiving new orders while suspended.`,
      input: "text",
      inputLabel: "Reason",
      inputPlaceholder: isReactivating ? "Issue resolved" : "Compliance issue",
      showCancelButton: true,
      confirmButtonText: isReactivating ? "Reactivate vendor" : "Suspend vendor",
      cancelButtonText: "Cancel",
      confirmButtonColor: isReactivating ? "#2b9e62" : "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    });

    if (!reasonResult.isConfirmed) {
      return;
    }

    try {
      setIsUpdatingStatusId(row.id);
      const result = isReactivating
        ? await updateVendorStatusRequest(row.id, "ACTIVE", reasonResult.value || "")
        : await deactivateVendorRequest(row.id, reasonResult.value || "");

      setAllRows((current) =>
        current.map((item) =>
          item.id === row.id
            ? {
                ...item,
                status: result.status,
                rawStatus: result.rawStatus,
              }
            : item,
        ),
      );

      await Swal.fire({
        icon: "success",
        title: isReactivating ? "Vendor reactivated" : "Vendor suspended",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: isReactivating ? "Unable to reactivate vendor" : "Unable to suspend vendor",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsUpdatingStatusId("");
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex justify-end">
        <DateFilterDropdown
          selectedFilter={timeframe}
          onChangeFilter={setTimeframe}
          startDate={customStart}
          endDate={customEnd}
          onCustomDateChange={handleCustomDateChange}
          clearFilterValue={ALL_DATES_FILTER}
        />
      </section>

      {loadError ? (
        <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-8 text-center text-[15px] font-medium text-[#9f4d33]">
          {loadError}
        </div>
      ) : null}

      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={iconMap[stat.id] || CircleAlert}
          />
        ))}
      </section>

      <section className="rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)] overflow-hidden">
        <VendorsToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          vendorFilter={vendorFilter}
          onVendorFilterChange={setVendorFilter}
          cityFilter={cityFilter}
          onCityFilterChange={setCityFilter}
          ratingFilter={ratingFilter}
          onRatingFilterChange={setRatingFilter}
          timeframeFilter={timeframe}
          onTimeframeFilterChange={setTimeframe}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onResetFilters={handleResetFilters}
          vendors={filterOptions.vendors}
          cities={filterOptions.cities}
        />

        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="px-5 py-12 text-center text-[15px] font-medium text-[#6f645d]">
              Loading vendors...
            </div>
          ) : (
            <VendorsTable
              currentPage={pageInfo.page}
              isUpdatingStatusId={isUpdatingStatusId}
              onPageChange={setCurrentPage}
              onToggleStatus={handleToggleStatus}
              pageSize={pageInfo.pageSize}
              totalItems={pageInfo.totalItems}
              vendors={paginatedRows}
            />
          )}
        </div>
      </section>

      <section className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <TopPerformingVendorsCard vendors={sidePanels.topPerformers} />
        <RecentVendorRequestsCard vendors={sidePanels.recentRequests} />
        <VendorStatusOverviewCard breakdown={sidePanels.statusBreakdown} vendors={filteredRows} />
      </section>
    </div>
  );
}
