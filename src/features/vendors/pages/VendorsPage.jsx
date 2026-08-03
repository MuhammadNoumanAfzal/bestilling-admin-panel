import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Users, Wifi, Clock, AlertTriangle, CircleAlert, DollarSign } from "lucide-react";
import StatCard from "../../dashboard/components/StatCard.jsx";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";
import {
  getAdminVendorsRequest,
  updateVendorStatusRequest,
} from "../api/vendorsApi.js";
import RecentVendorRequestsCard from "../components/RecentVendorRequestsCard.jsx";
import TopPerformingVendorsCard from "../components/TopPerformingVendorsCard.jsx";
import VendorsTable from "../components/VendorsTable.jsx";
import VendorsToolbar from "../components/VendorsToolbar.jsx";
import VendorStatusOverviewCard from "../components/VendorStatusOverviewCard.jsx";

const PAGE_SIZE = 10;

const iconMap = {
  total: Users,
  active: Wifi,
  pending: Clock,
  suspended: AlertTriangle,
  revenue: DollarSign,
};

function getTabStatusFilter(tab) {
  switch (tab) {
    case "Pending Approval":
      return "PENDING_APPROVAL";
    case "Active":
      return "ACTIVE";
    case "Suspended":
      return "SUSPENDED";
    case "Rejected":
      return "REJECTED";
    case "Deactivated":
      return "DEACTIVATED";
    default:
      return null;
  }
}

function getDisplayStatusFilter(value) {
  switch (`${value ?? ""}`.trim().toUpperCase()) {
    case "PENDING APPROVAL":
      return "PENDING_APPROVAL";
    case "SUSPENDED":
      return "SUSPENDED";
    case "REJECTED":
      return "REJECTED";
    case "DEACTIVATED":
      return "DEACTIVATED";
    default:
      return "ACTIVE";
  }
}

export default function VendorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "All");
  const [currentPage, setCurrentPage] = useState(1);
  const [timeframe, setTimeframe] = useState("This Year");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [stats, setStats] = useState([]);
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });
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
    () => getDateRangeForFilter(timeframe, customStart, customEnd),
    [customEnd, customStart, timeframe],
  );

  const normalizedFilters = useMemo(
    () => ({
      search: searchTerm,
      vendorId: vendorFilter || null,
      city: cityFilter || null,
      minRating: ratingFilter ? Number(ratingFilter) : null,
      status: activeTab !== "All" && activeTab !== "Top Performing"
        ? getTabStatusFilter(activeTab)
        : null,
      joinedFrom: dateRange?.start || null,
      joinedTo: dateRange?.end || null,
      page: currentPage,
      pageSize: PAGE_SIZE,
      sortBy: activeTab === "Top Performing" ? "REVENUE" : "JOINED_AT",
      sortOrder: "DESC",
    }),
    [activeTab, cityFilter, currentPage, dateRange, ratingFilter, searchTerm, vendorFilter],
  );

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
        const response = await getAdminVendorsRequest(normalizedFilters);

        if (!isMounted) {
          return;
        }

        setRows(response.rows);
        setStats(response.stats);
        setPageInfo(response.pageInfo);
        setFilterOptions(response.filterOptions);
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
  }, [normalizedFilters]);

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
    setTimeframe("This Year");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  }

  async function handleToggleStatus(row) {
    const isReactivating = row.status === "Suspended" || row.status === "Deactivated";
    const targetStatus = isReactivating ? "ACTIVE" : "SUSPENDED";

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
      const result = await updateVendorStatusRequest(row.id, targetStatus, reasonResult.value || "");

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
          timeframeFilter=""
          onTimeframeFilterChange={() => {}}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onResetFilters={handleResetFilters}
          vendors={filterOptions.vendors.map((vendor) => vendor.name)}
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
              vendors={rows}
            />
          )}
        </div>
      </section>

      <section className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <TopPerformingVendorsCard vendors={sidePanels.topPerformers} />
        <RecentVendorRequestsCard vendors={sidePanels.recentRequests} />
        <VendorStatusOverviewCard breakdown={sidePanels.statusBreakdown} vendors={rows} />
      </section>
    </div>
  );
}
