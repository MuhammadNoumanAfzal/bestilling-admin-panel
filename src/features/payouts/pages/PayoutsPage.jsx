import { useEffect, useMemo, useState } from "react";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import { getAdminCommissionSettingsRequest } from "../api/commissionApi.js";
import { getAdminPaymentsRequest } from "../api/paymentsApi.js";
import CommissionBreakdownCard from "../components/CommissionBreakdownCard.jsx";
import PayoutOverviewCard from "../components/PayoutOverviewCard.jsx";
import PayoutsTable from "../components/PayoutsTable.jsx";
import PayoutToolbar from "../components/PayoutToolbar.jsx";

const PAGE_SIZE = 10;
const STATIC_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "RELEASED", label: "Released" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "CANCELED", label: "Canceled" },
];

function mapPaymentStatusFilter(value) {
  switch (`${value ?? ""}`.trim().toUpperCase()) {
    case "PAID":
      return { value: "PAID", label: "Paid" };
    case "SCHEDULED":
      return { value: "SCHEDULED", label: "Scheduled" };
    case "RELEASED":
      return { value: "RELEASED", label: "Released" };
    case "CANCELLED":
    case "CANCELED":
      return { value: "CANCELED", label: "Canceled" };
    default:
      return { value: "PENDING", label: "Pending" };
  }
}

export default function PayoutsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [timeframe, setTimeframe] = useState("Last 7 days");
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
    statuses: STATIC_STATUS_OPTIONS,
    vendors: [],
  });
  const [commissionBreakdown, setCommissionBreakdown] = useState({
    regions: [],
    vendors: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const dateRange = useMemo(
    () => getDateRangeForFilter(timeframe, customStart, customEnd),
    [customEnd, customStart, timeframe],
  );

  const normalizedFilters = useMemo(
    () => ({
      search: searchTerm,
      status: statusFilter === "all" ? "ALL" : statusFilter,
      vendorId: vendorFilter === "all" ? null : vendorFilter,
      dateFrom: dateRange?.start || null,
      dateTo: dateRange?.end || null,
      page: currentPage,
      pageSize: PAGE_SIZE,
      sortBy: "CREATED_AT",
      sortOrder: "DESC",
    }),
    [currentPage, dateRange, searchTerm, statusFilter, vendorFilter],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadPaymentsPage() {
      setIsLoading(true);
      setLoadError("");

      try {
        const [paymentsResponse, commissionResponse] = await Promise.all([
          getAdminPaymentsRequest(normalizedFilters),
          getAdminCommissionSettingsRequest(),
        ]);

        if (!isMounted) {
          return;
        }

        setRows(paymentsResponse.rows);
        setSummaryCards(paymentsResponse.summaryCards);
        setPageInfo(paymentsResponse.pageInfo);
        setFilterOptions({
          statuses: STATIC_STATUS_OPTIONS,
          vendors: paymentsResponse.filterOptions.vendors.map((vendor) => ({
            value: vendor.id,
            label: vendor.name,
          })),
        });
        setCommissionBreakdown({
          regions: commissionResponse.areaRows.map((row) => ({
            id: row.id,
            label: row.area,
            value: row.commissionRate,
          })),
          vendors: commissionResponse.vendorRows.map((row) => ({
            id: row.id,
            name: row.vendor,
            share: row.currentCommission,
            avatar: row.avatar,
            avatarUrl: row.avatarUrl,
          })),
        });
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load payments.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPaymentsPage();

    return () => {
      isMounted = false;
    };
  }, [normalizedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, vendorFilter, timeframe, customStart, customEnd]);

  function handleResetFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setVendorFilter("all");
    setTimeframe("Last 7 days");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  }

  function handleCustomDateChange(start, end) {
    setCustomStart(start);
    setCustomEnd(end);
    setCurrentPage(1);
  }

  return (
    <div className="space-y-5">
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

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <PayoutOverviewCard key={item.id} {...item} />
        ))}
      </section>

      <section className="space-y-4">
        <div className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
          <PayoutToolbar
            onResetFilters={handleResetFilters}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onVendorFilterChange={setVendorFilter}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            statusOptions={filterOptions.statuses}
            vendorFilter={vendorFilter}
            vendorOptions={filterOptions.vendors}
          />
          {isLoading ? (
            <div className="px-5 py-12 text-center text-[15px] font-medium text-[#6f645d]">
              Loading payments...
            </div>
          ) : (
            <PayoutsTable
              currentPage={pageInfo.page}
              onPageChange={setCurrentPage}
              pageSize={pageInfo.pageSize}
              rows={rows}
              totalItems={pageInfo.totalItems}
            />
          )}
        </div>

        <CommissionBreakdownCard regions={commissionBreakdown.regions} vendors={commissionBreakdown.vendors} />
      </section>
    </div>
  );
}
