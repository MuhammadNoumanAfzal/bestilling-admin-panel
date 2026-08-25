import { useEffect, useMemo, useState } from "react";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import {
  getAdminSupportSummaryRequest,
  getAdminSupportTicketsRequest,
  getSupportFilterOptionsRequest,
} from "../api/supportApi.js";
import SupportOverviewCard from "../components/SupportOverviewCard.jsx";
import SupportTicketsTable from "../components/SupportTicketsTable.jsx";
import SupportToolbar from "../components/SupportToolbar.jsx";

const DEFAULT_PAGE_SIZE = 10;

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

    async function loadSupportData() {
      setIsLoading(true);
      setLoadError("");

      try {
        const dateFilters = buildDateFilters(timeframe, customStart, customEnd);
        const [ticketResult, summaryResult] = await Promise.all([
          getAdminSupportTicketsRequest({
            search: searchTerm.trim() || null,
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
  }, [currentPage, customEnd, customStart, searchTerm, statusFilter, timeframe, userFilter]);

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), pageInfo.totalPages || 1);
    setCurrentPage(safePage);
  }

  function handleCustomDateChange(start, end) {
    setCustomStart(start);
    setCustomEnd(end);
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-start sm:justify-end">
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
          <SupportOverviewCard key={item.id} {...item} />
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
            {loadError}
          </div>
        ) : null}

        {isLoading ? (
          <div className="border-t border-[#eee4dd] px-4 py-12 text-center text-[15px] font-medium text-[#6f645d]">
            Loading support tickets...
          </div>
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
