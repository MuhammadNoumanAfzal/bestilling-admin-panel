import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  ShoppingBag,
  CircleDollarSign,
  Clock3,
  AlertCircle,
  CheckCircle2,
  Download,
} from "lucide-react";

import StatCard from "../../dashboard/components/StatCard.jsx";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";
import OrdersToolbar from "../components/OrdersToolbar.jsx";
import OrdersTable from "../components/OrdersTable.jsx";
import TopCateringCategoriesChart from "../components/TopCateringCategoriesChart.jsx";
import {
  exportAdminOrdersRequest,
  getAdminOrderCategoryBreakdownRequest,
  getAdminOrdersRequest,
} from "../api/ordersApi.js";

const PAGE_SIZE = 10;

const iconMap = {
  total: ShoppingBag,
  paid: CircleDollarSign,
  pending: Clock3,
  review: AlertCircle,
  delivered: CheckCircle2,
  revenue: CircleDollarSign,
};

const presetByFilter = {
  "Last 7 days": "LAST_7_DAYS",
  "Last Month": "LAST_MONTH",
  "Last 3 Months": "LAST_3_MONTHS",
  "Last 6 Months": "LAST_6_MONTHS",
  "This Year": "THIS_YEAR",
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [timeframe, setTimeframe] = useState("Last 7 days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [summaryCards, setSummaryCards] = useState([]);
  const [rows, setRows] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [filterOptions, setFilterOptions] = useState({
    vendors: [],
    statuses: [],
    paymentStatuses: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [loadError, setLoadError] = useState("");

  const dateRange = useMemo(
    () => getDateRangeForFilter(timeframe, customStart, customEnd),
    [customEnd, customStart, timeframe],
  );

  const normalizedFilters = useMemo(
    () => ({
      search: searchTerm,
      vendorId: vendorFilter || null,
      status: statusFilter
        ? statusFilter.replace(/\s+/g, "_").toUpperCase()
        : null,
      paymentStatus: paymentFilter
        ? paymentFilter.replace(/\s+/g, "_").toUpperCase()
        : null,
      dateFrom: dateRange?.start || null,
      dateTo: dateRange?.end || null,
      page: currentPage,
      limit: PAGE_SIZE,
      sortField: "PLACED_AT",
      sortDirection: "DESC",
    }),
    [currentPage, dateRange, paymentFilter, searchTerm, statusFilter, vendorFilter],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      setIsLoading(true);
      setLoadError("");

      try {
        const [ordersResponse, categoryResponse] = await Promise.all([
          getAdminOrdersRequest(normalizedFilters),
          getAdminOrderCategoryBreakdownRequest(normalizedFilters),
        ]);

        if (!isMounted) {
          return;
        }

        setRows(ordersResponse.rows);
        setSummaryCards(ordersResponse.summaryCards);
        setPageInfo(ordersResponse.pageInfo);
        setFilterOptions({
          vendors: ordersResponse.filterOptions.vendors,
          statuses: ordersResponse.filterOptions.statuses,
          paymentStatuses: ordersResponse.filterOptions.paymentStatuses,
        });
        setCategoryItems(categoryResponse);
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load orders.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [normalizedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, vendorFilter, statusFilter, paymentFilter, timeframe, customStart, customEnd]);

  function handleCustomDateChange(start, end) {
    setCustomStart(start);
    setCustomEnd(end);
    setCurrentPage(1);
  }

  function handleResetFilters() {
    setSearchTerm("");
    setVendorFilter("");
    setStatusFilter("");
    setPaymentFilter("");
    setTimeframe("Last 7 days");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  }

  async function handleExport() {
    try {
      setIsExporting(true);
      const result = await exportAdminOrdersRequest({
        dateFrom: dateRange?.start?.toISOString() || null,
        dateTo: dateRange?.end?.toISOString() || null,
        preset: presetByFilter[timeframe] || null,
        format: "CSV",
        sections: ["SUMMARY", "ORDERS", "PAYMENTS"],
      });

      window.open(result.fileUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Export failed",
        text: error instanceof Error ? error.message : "Unable to export orders.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#cf6e38] px-4 text-[14px] font-semibold text-white transition hover:bg-[#b95c29] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isExporting}
          onClick={handleExport}
          type="button"
        >
          <Download size={16} />
          {isExporting ? "Exporting..." : "Export Orders"}
        </button>

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

      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {summaryCards.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={iconMap[stat.id] || ShoppingBag}
          />
        ))}
      </section>

      <section className="overflow-hidden rounded-[16px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
        <OrdersToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          vendorFilter={vendorFilter}
          onVendorFilterChange={setVendorFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          paymentFilter={paymentFilter}
          onPaymentFilterChange={setPaymentFilter}
          onResetFilters={handleResetFilters}
          vendors={filterOptions.vendors}
          statuses={filterOptions.statuses}
          paymentStatuses={filterOptions.paymentStatuses}
        />

        {isLoading ? (
          <div className="px-5 py-12 text-center text-[15px] font-medium text-[#6f645d]">
            Loading orders...
          </div>
        ) : (
          <div className="p-3 sm:p-4">
            <OrdersTable
              orders={rows}
              currentPage={pageInfo.page}
              pageSize={pageInfo.pageSize}
              totalItems={pageInfo.totalItems}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </section>

      <section className="grid gap-6">
        <TopCateringCategoriesChart items={categoryItems} isLoading={isLoading} />
      </section>
    </div>
  );
}
