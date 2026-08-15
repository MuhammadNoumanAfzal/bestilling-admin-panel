import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { blockCustomerRequest, getAdminCustomersRequest, unblockCustomerRequest } from "../api/customersApi.js";
import CustomerOverviewCard from "../components/CustomerOverviewCard.jsx";
import CustomersTable from "../components/CustomersTable.jsx";
import CustomersToolbar from "../components/CustomersToolbar.jsx";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";

const PAGE_SIZE = 10;
const ALL_DATES_FILTER = "All Dates";

function toDisplayStatus(status) {
  switch (`${status ?? ""}`.trim().toUpperCase()) {
    case "BLOCKED":
      return "Blocked";
    case "INACTIVE":
      return "Inactive";
    default:
      return "Active";
  }
}

export default function CustomersPage() {
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

  const dateRange = useMemo(
    () => (timeframe === ALL_DATES_FILTER ? null : getDateRangeForFilter(timeframe, customStart, customEnd)),
    [customEnd, customStart, timeframe],
  );

  const normalizedFilters = useMemo(
    () => ({
      search: searchTerm,
      status: statusFilter ? statusFilter.toUpperCase() : null,
      city: cityFilter || null,
      registeredFrom: dateRange?.start || null,
      registeredTo: dateRange?.end || null,
      page: currentPage,
      pageSize: PAGE_SIZE,
      sortBy: "joinedAt",
      sortOrder: "DESC",
    }),
    [cityFilter, currentPage, dateRange, searchTerm, statusFilter],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadCustomers() {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await getAdminCustomersRequest(normalizedFilters);

        if (!isMounted) {
          return;
        }

        setRows(response.rows);
        setSummaryCards(response.summaryCards);
        setPageInfo(response.pageInfo);
        setFilterOptions({
          cities: response.filterOptions.cities,
          statuses: response.filterOptions.statuses.map(toDisplayStatus),
        });
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
  }, [normalizedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, cityFilter, timeframe, customStart, customEnd]);

  function handleCustomDateChange(start, end) {
    setCustomStart(start);
    setCustomEnd(end);
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

  async function handleToggleStatus(row) {
    const isBlocked = row.status === "Blocked";

    const confirmation = await Swal.fire({
      icon: "warning",
      title: isBlocked ? "Unblock customer?" : "Block customer?",
      text: isBlocked
        ? `Restore access for ${row.name}?`
        : `Block ${row.name} from logging in and placing new orders?`,
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

      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map((item) => (
          <CustomerOverviewCard key={item.id} {...item} />
        ))}
      </section>

      <section className="overflow-hidden rounded-[16px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
        <CustomersToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          cityFilter={cityFilter}
          onCityFilterChange={setCityFilter}
          statuses={filterOptions.statuses}
          cities={filterOptions.cities}
          onResetFilters={handleResetFilters}
        />
        {isLoading ? (
          <div className="px-5 py-12 text-center text-[15px] font-medium text-[#6f645d]">
            Loading customers...
          </div>
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
