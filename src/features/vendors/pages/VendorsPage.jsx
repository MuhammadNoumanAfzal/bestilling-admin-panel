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
import TopPerformingVendorsCard from "../components/TopPerformingVendorsCard.jsx";
import VendorsTable from "../components/VendorsTable.jsx";
import VendorsToolbar from "../components/VendorsToolbar.jsx";
import VendorStatusOverviewCard from "../components/VendorStatusOverviewCard.jsx";
import AdminLoadingState from "../../shared/components/AdminLoadingState.jsx";

const PAGE_SIZE = 10;
const VENDOR_CACHE_TTL_MS = 60_000;
const vendorListCache = new Map();

const iconMap = {
  total: Users,
  active: Wifi,
  pending: Clock,
  suspended: AlertTriangle,
  revenue: DollarSign,
};

const ALL_DATES_FILTER = "All Dates";

function matchesTab(row, tab) {
  if (tab === "All" || tab === "Top Performing") {
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
    cities: [...new Set(rows.map((row) => row.city).filter(Boolean))].sort((left, right) =>
      left.localeCompare(right),
    ),
    statuses: [...new Set(rows.map((row) => row.status).filter(Boolean))],
  };
}

function readVendorCache(cacheKey) {
  const memoryEntry = vendorListCache.get(cacheKey);
  if (memoryEntry && Date.now() - memoryEntry.savedAt < VENDOR_CACHE_TTL_MS) {
    return memoryEntry.data;
  }

  try {
    const rawEntry = window.sessionStorage.getItem(`admin-vendors:${cacheKey}`);
    const sessionEntry = rawEntry ? JSON.parse(rawEntry) : null;
    if (sessionEntry && Date.now() - sessionEntry.savedAt < VENDOR_CACHE_TTL_MS) {
      vendorListCache.set(cacheKey, sessionEntry);
      return sessionEntry.data;
    }
  } catch {
    // Caching is an enhancement; the request remains the source of truth.
  }

  return null;
}

function writeVendorCache(cacheKey, data) {
  const entry = { data, savedAt: Date.now() };
  vendorListCache.set(cacheKey, entry);

  try {
    window.sessionStorage.setItem(`admin-vendors:${cacheKey}`, JSON.stringify(entry));
  } catch {
    // Ignore unavailable or full session storage.
  }
}

function clearVendorCache() {
  vendorListCache.clear();

  try {
    Object.keys(window.sessionStorage)
      .filter((key) => key.startsWith("admin-vendors:"))
      .forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // The in-memory cache has already been cleared.
  }
}

export default function VendorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "All");
  const [currentPage, setCurrentPage] = useState(1);
  const [timeframe, setTimeframe] = useState(ALL_DATES_FILTER);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [stats, setStats] = useState([]);
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: PAGE_SIZE, totalItems: 0, totalPages: 1 });
  const [filterOptions, setFilterOptions] = useState({
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const dateRange = useMemo(
    () => (timeframe === ALL_DATES_FILTER ? null : getDateRangeForFilter(timeframe, customStart, customEnd)),
    [customEnd, customStart, timeframe],
  );

  const normalizedFilters = useMemo(
    () => ({
      search: debouncedSearchTerm,
      city: cityFilter || null,
      minRating: ratingFilter ? Number(ratingFilter) : null,
      // The API status enum differs from its display values, so the normalized UI filters below are reliable.
      status: null,
      joinedFrom: dateRange?.start || null,
      joinedTo: dateRange?.end || null,
      page: currentPage,
      pageSize: PAGE_SIZE,
      sortBy: "JOINED_AT",
      sortOrder: "DESC",
    }),
    [activeTab, cityFilter, currentPage, dateRange, debouncedSearchTerm, ratingFilter],
  );
  const vendorCacheKey = useMemo(
    () => JSON.stringify({ ...normalizedFilters, activeTab }),
    [activeTab, normalizedFilters],
  );

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "All";
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    const cachedResponse = readVendorCache(vendorCacheKey);

    if (cachedResponse) {
      setRows(cachedResponse.rows);
      setPageInfo(cachedResponse.pageInfo);
      setStats(cachedResponse.stats);
      setFilterOptions(cachedResponse.filterOptions);
      setSidePanels(cachedResponse.sidePanels);
      setIsLoading(false);
    }

    async function loadVendors() {
      if (!cachedResponse) {
        setIsLoading(true);
      }
      setLoadError("");

      try {
        const response = await getAdminVendorsRequest(normalizedFilters);

        if (!isMounted) {
          return;
        }
        const filteredRows = response.rows.filter((row) => matchesTab(row, activeTab));
        const visibleRows =
          activeTab === "Top Performing"
            ? filteredRows
                .filter((row) => row.status === "Active")
                .sort((left, right) => right.revenueValue - left.revenueValue)
            : filteredRows;
        const visiblePageInfo =
          activeTab !== "All"
            ? {
                ...response.pageInfo,
                totalItems: visibleRows.length,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false,
              }
            : response.pageInfo;

        setRows(visibleRows);
        setPageInfo(visiblePageInfo);
        setStats(response.stats);
        setFilterOptions(response.filterOptions);
        setSidePanels(response.sidePanels);
        writeVendorCache(vendorCacheKey, {
          ...response,
          rows: visibleRows,
          pageInfo: visiblePageInfo,
        });
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
  }, [activeTab, normalizedFilters, vendorCacheKey]);

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

  function handleStatCardClick(cardId) {
    switch (cardId) {
      case "total":
        handleTabChange("All");
        break;
      case "active":
        handleTabChange("Active");
        break;
      case "pending":
        handleTabChange("Pending Approval");
        break;
      case "suspended":
        handleTabChange("Suspended");
        break;
      case "revenue":
        handleTabChange("Top Performing");
        break;
      default:
        break;
    }
  }

  function handleResetFilters() {
    setSearchTerm("");
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

      setRows((current) =>
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
      clearVendorCache();

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
            onClick={() => handleStatCardClick(stat.id)}
          />
        ))}
      </section>

      <section className="rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)] overflow-hidden">
        <VendorsToolbar
          searchTerm={searchTerm}
          onSearchChange={(value) => { setSearchTerm(value); setCurrentPage(1); }}
          cityFilter={cityFilter}
          onCityFilterChange={(value) => { setCityFilter(value); setCurrentPage(1); }}
          ratingFilter={ratingFilter}
          onRatingFilterChange={(value) => { setRatingFilter(value); setCurrentPage(1); }}
          timeframeFilter={timeframe}
          onTimeframeFilterChange={(value) => { setTimeframe(value); setCurrentPage(1); }}
          customStart={customStart}
          customEnd={customEnd}
          onCustomDateChange={handleCustomDateChange}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onResetFilters={handleResetFilters}
          cities={filterOptions.cities}
        />

        <div className="px-4 pb-4">
          {isLoading && rows.length === 0 ? (
            <AdminLoadingState columns={6} title="Loading vendor records" description="Synchronizing vendor profiles, reviews, and approval status." />
          ) : (
            <VendorsTable
              currentPage={pageInfo.page}
              isUpdatingStatusId={isUpdatingStatusId}
              onPageChange={setCurrentPage}
              onToggleStatus={handleToggleStatus}
              pageSize={pageInfo.pageSize}
              totalItems={pageInfo.totalItems}
              vendors={rows}
            />
          )}
        </div>
      </section>

      <section className="grid gap-6 grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_360px]">
        <TopPerformingVendorsCard
          onViewAll={() => handleTabChange("Top Performing")}
          vendors={sidePanels.topPerformers}
        />
        <VendorStatusOverviewCard breakdown={sidePanels.statusBreakdown} vendors={rows} />
      </section>
    </div>
  );
}
