import { st, useSupportLanguage, supportError } from "../supportTranslation.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Inbox } from "lucide-react";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import {
  getAdminSupportSummaryRequest,
  getAdminSupportTicketsRequest,
  getSupportFilterOptionsRequest,
} from "../api/supportApi.js";
import SupportOverviewCard from "../components/SupportOverviewCard.jsx";
import SupportTicketsTable from "../components/SupportTicketsTable.jsx";
import SupportToolbar from "../components/SupportToolbar.jsx";
import AdminLoadingState from "../../shared/components/AdminLoadingState.jsx";

const DEFAULT_PAGE_SIZE = 10;
const SUPPORT_CACHE_TTL_MS = 30_000;
const supportPageCache = new Map();

function readSupportCache(cacheKey) {
  const entry = supportPageCache.get(cacheKey);
  return entry && Date.now() - entry.savedAt < SUPPORT_CACHE_TTL_MS ? entry.data : null;
}

function writeSupportCache(cacheKey, data) {
  supportPageCache.set(cacheKey, { data, savedAt: Date.now() });
}

function getDynamicDateRangeForFilter(selectedFilter, customStart, customEnd) {
  if (selectedFilter === "Custom Date" && customStart && customEnd) {
    const start = new Date(`${customStart}T00:00:00`);
    const end = new Date(`${customEnd}T23:59:59`);

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end) {
      return { start, end };
    }
  }

  const end = new Date();
  const start = new Date();

  switch (selectedFilter) {
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
      start.setHours(0, 0, 0, 0);
      break;
    case "Last 7 days":
    default:
      start.setDate(start.getDate() - 7);
      break;
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function buildDateFilters(timeframe, customStart, customEnd) {
  const { start, end } = getDynamicDateRangeForFilter(timeframe, customStart, customEnd);

  return {
    dateFrom: start.toISOString(),
    dateTo: end.toISOString(),
  };
}

export default function SupportPage() {
  useSupportLanguage();
  const { setPageHeaderAction } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState("Last 7 days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [summary, setSummary] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [filterOptions, setFilterOptions] = useState({
    statuses: [],
    userTypes: [],
    categories: [],
    priorities: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const hasLoadedTicketsRef = useRef(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), 250);
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const dateFilters = useMemo(
    () => buildDateFilters(timeframe, customStart, customEnd),
    [customEnd, customStart, timeframe],
  );
  const supportCacheKey = useMemo(
    () => JSON.stringify({
      search: debouncedSearchTerm.trim(),
      status: statusFilter,
      userType: userFilter,
      page: currentPage,
      ...dateFilters,
      refreshVersion,
    }),
    [currentPage, dateFilters, debouncedSearchTerm, refreshVersion, statusFilter, userFilter],
  );

  const supportSummary = useMemo(
    () => [
      {
        id: "total",
        label: "Total Tickets",
        value: summary.total.toLocaleString(),
        accent: "soft",
      },
      {
        id: "open",
        label: "Open Tickets",
        value: summary.open.toLocaleString(),
        accent: "warm",
      },
      {
        id: "progress",
        label: "In Progress",
        value: summary.inProgress.toLocaleString(),
        accent: "neutral",
      },
      {
        id: "resolved",
        label: "Resolved",
        value: summary.resolved.toLocaleString(),
        accent: "strong",
      },
    ],
    [summary],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, userFilter, timeframe, customStart, customEnd]);

  useEffect(() => {
    function handleSupportTicketsUpdated() {
      supportPageCache.clear();
      setRefreshVersion((version) => version + 1);
    }

    window.addEventListener("admin-support-tickets-updated", handleSupportTicketsUpdated);
    return () => window.removeEventListener("admin-support-tickets-updated", handleSupportTicketsUpdated);
  }, []);
  useEffect(() => {
    let isMounted = true;

    async function loadFilterOptions() {
      try {
        const result = await getSupportFilterOptionsRequest();
        if (isMounted) {
          setFilterOptions(result);
        }
      } catch {
        if (isMounted) {
          setFilterOptions({
            statuses: [],
            userTypes: [],
            categories: [],
            priorities: [],
          });
        }
      }
    }

    loadFilterOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const cachedResponse = readSupportCache(supportCacheKey);

    if (cachedResponse) {
      setRows(cachedResponse.ticketResult.items);
      setPageInfo(cachedResponse.ticketResult.pageInfo);
      setSummary(cachedResponse.summaryResult);
      hasLoadedTicketsRef.current = true;
      setIsLoading(false);
    } else if (!hasLoadedTicketsRef.current) {
      setIsLoading(true);
    }

    async function loadSupportData() {
      setLoadError("");

      try {
        const [ticketResult, summaryResult] = await Promise.all([
          getAdminSupportTicketsRequest({
            search: debouncedSearchTerm.trim() || null,
            status: statusFilter || null,
            userType: userFilter || null,
            page: currentPage,
            pageSize: DEFAULT_PAGE_SIZE,
            sortBy: "updatedAt",
            sortOrder: "DESC",
            ...dateFilters,
          }),
          getAdminSupportSummaryRequest({
            userType: userFilter || null,
            ...dateFilters,
          }),
        ]);

        if (!isMounted) {
          return;
        }

        setRows(ticketResult.items);
        setPageInfo(ticketResult.pageInfo);
        setSummary(summaryResult);
        writeSupportCache(supportCacheKey, { ticketResult, summaryResult });
        hasLoadedTicketsRef.current = true;
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setRows([]);
        setPageInfo({
          page: 1,
          pageSize: DEFAULT_PAGE_SIZE,
          totalItems: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        });
        setSummary({
          total: 0,
          open: 0,
          inProgress: 0,
          resolved: 0,
        });
        setLoadError(error instanceof Error ? error.message : "Unable to load support tickets.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSupportData();

    return () => {
      isMounted = false;
    };
  }, [dateFilters, debouncedSearchTerm, currentPage, refreshVersion, statusFilter, supportCacheKey, timeframe, userFilter]);

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), pageInfo.totalPages || 1);
    setCurrentPage(safePage);
  }

  function handleCustomDateChange(start, end) {
    setCustomStart(start);
    setCustomEnd(end);
  }

  function handleSummaryCardClick(cardId) {
    switch (cardId) {
      case "total":
        setStatusFilter("");
        setCurrentPage(1);
        break;
      case "open":
        setStatusFilter("OPEN");
        setCurrentPage(1);
        break;
      case "progress":
        setStatusFilter("IN_PROGRESS");
        setCurrentPage(1);
        break;
      case "resolved":
        setStatusFilter("RESOLVED");
        setCurrentPage(1);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    setPageHeaderAction(
      <div className="flex items-center gap-3">
        <DateFilterDropdown selectedFilter={timeframe} onChangeFilter={setTimeframe} startDate={customStart} endDate={customEnd} onCustomDateChange={handleCustomDateChange} />
        <Link
          to="/contact-responses"
          className="inline-flex h-[40px] items-center justify-center gap-2 rounded-[10px] border border-[#cf6e38] bg-[#cf6e38] px-4 text-[14px] font-bold text-white no-underline shadow-sm transition hover:bg-[#b85d2b] hover:border-[#b85d2b] active:scale-[0.98]"
        >
          <Inbox size={16} />
          <span>{st("Vis innboks", "Vis innboks")}</span>
        </Link>
      </div>
    );
    return () => setPageHeaderAction(null);
  }, [customEnd, customStart, setPageHeaderAction, timeframe]);

  return (
    <div className="space-y-5">
      <div className="flex justify-start sm:justify-end lg:hidden">
        <DateFilterDropdown
          selectedFilter={timeframe}
          onChangeFilter={setTimeframe}
          startDate={customStart}
          endDate={customEnd}
          onCustomDateChange={handleCustomDateChange}
        />
      </div>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {supportSummary.map((item) => (
          <SupportOverviewCard key={item.id} {...item} onClick={() => handleSummaryCardClick(item.id)} />
        ))}
      </section>

      <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
        <SupportToolbar
          onResetFilters={() => {
            setSearchTerm("");
            setStatusFilter("");
            setUserFilter("");
            setTimeframe("Last 7 days");
            setCustomStart("");
            setCustomEnd("");
          }}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onUserFilterChange={setUserFilter}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          statusOptions={filterOptions.statuses}
          userFilter={userFilter}
          userTypeOptions={filterOptions.userTypes}
        />

        {loadError ? (
          <div className="border-t border-[#eee4dd] px-4 py-10 text-center text-[15px] font-medium text-[#9f4d33]">
            {supportError(loadError)}
          </div>
        ) : null}

        {isLoading ? (
          <AdminLoadingState columns={5} title={st("Loading support tickets")} description={st("Retrieving customer conversations and their latest status.")} />
        ) : (
          <SupportTicketsTable
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageInfo={pageInfo}
            rows={rows}
          />
        )}
      </section>
    </div>
  );
}
