import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import { blockCustomerRequest, getAdminCustomersRequest, unblockCustomerRequest } from "../api/customersApi.js";
import CustomerOverviewCard from "../components/CustomerOverviewCard.jsx";
import CustomersTable from "../components/CustomersTable.jsx";
import CustomersToolbar from "../components/CustomersToolbar.jsx";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";
import AdminLoadingState from "../../shared/components/AdminLoadingState.jsx";

const PAGE_SIZE = 10;
const ALL_DATES_FILTER = "All Dates";
const CUSTOMER_CACHE_TTL_MS = 60_000;
const customerListCache = new Map();

function toDisplayStatus(status) {
  switch (`${status ?? ""}`.trim().toUpperCase()) {
    case "BLOCKED":
      return "Blocked";
    case "DEACTIVATED":
      return "Deactivated";
    case "INACTIVE":
      return "Inactive";
    default:
      return "Active";
  }
}

function toApiStatus(status) {
  switch (`${status ?? ""}`.trim().toUpperCase()) {
    case "BLOCKED":
      return "BLOCKED";
    case "DEACTIVATED":
      return "DEACTIVATED";
    case "INACTIVE":
      return "INACTIVE";
    default:
      return "ACTIVE";
  }
}

function filterCustomerRows(rows, { search, status, city, dateRange }) {
  const normalizedSearch = `${search ?? ""}`.trim().toLowerCase();
  const normalizedCity = `${city ?? ""}`.trim().toLowerCase();
  const expectedStatus = status ? toDisplayStatus(status) : "";
  const startTime = dateRange?.start ? new Date(dateRange.start).getTime() : null;
  const endTime = dateRange?.end ? new Date(dateRange.end).getTime() : null;

  return (rows || []).filter((row) => {
    if (expectedStatus && row.status !== expectedStatus) {
      return false;
    }

    if (normalizedSearch) {
      const searchable = [row.id, row.name, row.fullName, row.email, row.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchable.includes(normalizedSearch)) {
        return false;
      }
    }

    if (normalizedCity && !`${row.city ?? ""}`.toLowerCase().includes(normalizedCity)) {
      return false;
    }

    if (startTime != null || endTime != null) {
      const joinedAt = new Date(row.joinDateValue || "").getTime();
      if (Number.isNaN(joinedAt) || (startTime != null && joinedAt < startTime) || (endTime != null && joinedAt > endTime)) {
        return false;
      }
    }

    return true;
  });
}

function readCustomerCache(cacheKey) {
  const entry = customerListCache.get(cacheKey);
  return entry && Date.now() - entry.savedAt < CUSTOMER_CACHE_TTL_MS ? entry.data : null;
}

function writeCustomerCache(cacheKey, data) {
  customerListCache.set(cacheKey, { data, savedAt: Date.now() });
}

function normalizeCityOptions(cities) {
  const seen = new Set();

  return (cities || []).filter((city) => {
    const value = `${city ?? ""}`.trim();
    const key = value.toLowerCase();

    if (!value || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  }).map((city) => `${city}`.trim());
}

export default function CustomersPage() {
  const navigate = useNavigate();
  const { setPageHeaderAction } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [timeframe, setTimeframe] = useState(ALL_DATES_FILTER);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [summaryCards, setSummaryCards] = useState([]);
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    statuses: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isUpdatingStatusId, setIsUpdatingStatusId] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), 250);
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const dateRange = useMemo(
    () => (timeframe === ALL_DATES_FILTER ? null : getDateRangeForFilter(timeframe, customStart, customEnd)),
    [customEnd, customStart, timeframe],
  );

  const normalizedFilters = useMemo(
    () => ({
      search: debouncedSearchTerm,
      status: statusFilter ? toApiStatus(statusFilter) : null,
      city: cityFilter || null,
      registeredFrom: dateRange?.start || null,
      registeredTo: dateRange?.end || null,
      page: currentPage,
      pageSize: PAGE_SIZE,
      sortBy: "joinedAt",
      sortOrder: "DESC",
    }),
    [cityFilter, currentPage, dateRange, debouncedSearchTerm, statusFilter],
  );
  const customerCacheKey = useMemo(() => JSON.stringify(normalizedFilters), [normalizedFilters]);

  function applyActiveFilters(response) {
    const filteredRows = filterCustomerRows(response.rows, {
      search: searchTerm,
      status: statusFilter,
      city: cityFilter,
      dateRange,
    });

    return {
      ...response,
      rows: filteredRows,
      pageInfo: {
        ...response.pageInfo,
        page: 1,
        totalItems: filteredRows.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  useEffect(() => {
    let isMounted = true;
    const cachedResponse = readCustomerCache(customerCacheKey);

    if (cachedResponse) {
      const filteredResponse = applyActiveFilters(cachedResponse);
      setRows(filteredResponse.rows);
      setSummaryCards(filteredResponse.summaryCards);
      setPageInfo(filteredResponse.pageInfo);
      setFilterOptions({
        cities: normalizeCityOptions(cachedResponse.filterOptions.cities),
        statuses: [...new Set(cachedResponse.filterOptions.statuses.map(toDisplayStatus).filter(Boolean))],
      });
      setIsLoading(false);
    }

    async function loadCustomers() {
      if (!cachedResponse) {
        setIsLoading(true);
      }
      setLoadError("");

      try {
        const response = await getAdminCustomersRequest(normalizedFilters);

        if (!isMounted) {
          return;
        }

        const filteredResponse = applyActiveFilters(response);
        setRows(filteredResponse.rows);
        setSummaryCards(filteredResponse.summaryCards);
        setPageInfo(filteredResponse.pageInfo);
        setFilterOptions({
          cities: normalizeCityOptions(response.filterOptions.cities),
          statuses: [...new Set(response.filterOptions.statuses.map(toDisplayStatus).filter(Boolean))],
        });
        writeCustomerCache(customerCacheKey, response);
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load customers.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCustomers();

    return () => {
      isMounted = false;
    };
  }, [customerCacheKey, normalizedFilters]);

  useEffect(() => {
    const cachedResponse = readCustomerCache(customerCacheKey);
    if (!cachedResponse) {
      return;
    }

    const filteredResponse = applyActiveFilters(cachedResponse);
    setRows(filteredResponse.rows);
    setPageInfo(filteredResponse.pageInfo);
  }, [cityFilter, customerCacheKey, dateRange, searchTerm, statusFilter]);

  function handleCustomDateChange(start, end) {
    setCustomStart(start);
    setCustomEnd(end);
    setCurrentPage(1);
  }

  function handleTimeframeChange(value) {
    setTimeframe(value);
    setCurrentPage(1);
  }

  function handleResetFilters() {
    setSearchTerm("");
    setStatusFilter("");
    setCityFilter("");
    setTimeframe(ALL_DATES_FILTER);
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  }

  function handleSummaryCardClick(cardId) {
    switch (cardId) {
      case "total":
        handleResetFilters();
        break;
      case "active":
        setStatusFilter("Active");
        setCurrentPage(1);
        break;
      case "new":
        setTimeframe("Last Month");
        setStatusFilter("");
        setCurrentPage(1);
        break;
      case "orders":
        navigate("/orders");
        break;
      case "average":
      case "spending":
        navigate("/reports");
        break;
      default:
        break;
    }
  }

  async function handleToggleStatus(row) {
    const isBlocked = row.status === "Blocked";

      const confirmation = await Swal.fire({
        icon: "warning",
        title: isBlocked ? "Unblock customer?" : "Block customer?",
        text: isBlocked
          ? `Restore access for ${row.name}?`
          : `Block ${row.name} from logging in and placing new orders?`,
        width: "min(32rem, calc(100vw - 2rem))",
        showCancelButton: true,
        confirmButtonText: isBlocked ? "Yes, unblock" : "Yes, block",
        cancelButtonText: "Cancel",
        confirmButtonColor: isBlocked ? "#2b9e62" : "#d83f3f",
        cancelButtonColor: "#c8b9aa",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    let reason = "";

    if (!isBlocked) {
      const result = await Swal.fire({
        title: "Block reason",
        input: "text",
        inputLabel: "Optional reason",
        inputPlaceholder: "Add a note for why this customer is being blocked",
        width: "min(32rem, calc(100vw - 2rem))",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d83f3f",
        cancelButtonColor: "#c8b9aa",
      });

      if (result.isDismissed) {
        return;
      }

      reason = result.value || "";
    }

    try {
      setIsUpdatingStatusId(row.id);
      const response = isBlocked
        ? await unblockCustomerRequest(row.id)
        : await blockCustomerRequest(row.id, reason);

      setRows((current) =>
        current.map((item) =>
          item.id === row.id
            ? {
                ...item,
                status: response.status,
                rawStatus: response.rawStatus,
              }
            : item,
        ),
      );
      customerListCache.clear();

      await Swal.fire({
        icon: "success",
        title: isBlocked ? "Customer unblocked" : "Customer blocked",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: isBlocked ? "Unable to unblock customer" : "Unable to block customer",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsUpdatingStatusId("");
    }
  }

  useEffect(() => {
    setPageHeaderAction(<DateFilterDropdown selectedFilter={timeframe} onChangeFilter={handleTimeframeChange} startDate={customStart} endDate={customEnd} onCustomDateChange={handleCustomDateChange} clearFilterValue={ALL_DATES_FILTER} />);
    return () => setPageHeaderAction(null);
  }, [customEnd, customStart, setPageHeaderAction, timeframe]);

  return (
    <div className="space-y-6">
      <section className="flex justify-end lg:hidden">
        <DateFilterDropdown
          selectedFilter={timeframe}
          onChangeFilter={handleTimeframeChange}
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

      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map((item) => (
          <CustomerOverviewCard key={item.id} {...item} onClick={() => handleSummaryCardClick(item.id)} />
        ))}
      </section>

      <section className="overflow-hidden rounded-[16px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
        <CustomersToolbar
          searchTerm={searchTerm}
          onSearchChange={(value) => { setSearchTerm(value); setCurrentPage(1); }}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
          cityFilter={cityFilter}
          onCityFilterChange={(value) => { setCityFilter(value); setCurrentPage(1); }}
          statuses={filterOptions.statuses}
          cities={filterOptions.cities}
          onResetFilters={handleResetFilters}
        />
        {isLoading && rows.length === 0 ? (
          <AdminLoadingState
            title="Loading customer records"
            description="Fetching account details, status filters, recent registrations, and customer activity."
            rows={5}
            columns={6}
          />
        ) : (
          <CustomersTable
            currentPage={pageInfo.page}
            isUpdatingStatusId={isUpdatingStatusId}
            onPageChange={setCurrentPage}
            onToggleStatus={handleToggleStatus}
            pageSize={pageInfo.pageSize}
            rows={rows}
            totalItems={pageInfo.totalItems}
          />
        )}
      </section>
    </div>
  );
}
