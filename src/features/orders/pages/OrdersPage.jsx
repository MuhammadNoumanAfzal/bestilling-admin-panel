import { ot, useOrderLanguage, orderError, orderMessage } from "../orderTranslation.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ShoppingBag,
  CircleDollarSign,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import StatCard from "../../dashboard/components/StatCard.jsx";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";
import OrdersToolbar from "../components/OrdersToolbar.jsx";
import OrdersTable from "../components/OrdersTable.jsx";
import TopCateringCategoriesChart from "../components/TopCateringCategoriesChart.jsx";
import AdminLoadingState from "../../shared/components/AdminLoadingState.jsx";
import {
  getAdminOrderInvoiceRequest,
  getAdminOrderCategoryBreakdownRequest,
  getAdminOrdersRequest,
  updateOrderPaymentStatusRequest,
} from "../api/ordersApi.js";

const PAGE_SIZE = 10;
const ORDER_CACHE_TTL_MS = 30_000;
const DEFAULT_TIMEFRAME = "All time";
const orderListCache = new Map();

const iconMap = {
  total: ShoppingBag,
  paid: CircleDollarSign,
  pending: Clock3,
  delivered: CheckCircle2,
  revenue: CircleDollarSign,
};

function readOrderCache(cacheKey) {
  const entry = orderListCache.get(cacheKey);
  return entry && Date.now() - entry.savedAt < ORDER_CACHE_TTL_MS ? entry.data : null;
}

function writeOrderCache(cacheKey, data) {
  orderListCache.set(cacheKey, { data, savedAt: Date.now() });
}

function uniqueTextOptions(options) {
  return [...new Set((options || []).map((option) => `${option ?? ""}`.trim()).filter(Boolean))];
}

function uniqueVendorOptions(vendors) {
  const seen = new Set();

  return (vendors || []).filter((vendor) => {
    const id = `${vendor?.id ?? ""}`.trim();
    if (!id || seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  });
}

export default function OrdersPage() {
  useOrderLanguage();
  const navigate = useNavigate();
  const { setPageHeaderAction } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);
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
  const [loadError, setLoadError] = useState("");
  const [activeActionOrderId, setActiveActionOrderId] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), 250);
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const dateRange = useMemo(
    () => getDateRangeForFilter(timeframe, customStart, customEnd),
    [customEnd, customStart, timeframe],
  );

  const normalizedFilters = useMemo(
    () => ({
      search: debouncedSearchTerm,
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
    [currentPage, dateRange, debouncedSearchTerm, paymentFilter, statusFilter, vendorFilter],
  );
  const orderCacheKey = useMemo(() => JSON.stringify(normalizedFilters), [normalizedFilters]);
  const categoryFilters = useMemo(
    () => ({
      vendorId: vendorFilter || null,
      dateFrom: dateRange?.start || null,
      dateTo: dateRange?.end || null,
    }),
    [dateRange, vendorFilter],
  );

  useEffect(() => {
    let isMounted = true;
    const cachedResponse = readOrderCache(orderCacheKey);

    if (cachedResponse) {
      window.queueMicrotask(() => {
        if (!isMounted) return;
        setRows(cachedResponse.rows);
        setSummaryCards(cachedResponse.summaryCards);
        setPageInfo(cachedResponse.pageInfo);
        setFilterOptions({
          vendors: uniqueVendorOptions(cachedResponse.filterOptions.vendors),
          statuses: uniqueTextOptions(cachedResponse.filterOptions.statuses),
          paymentStatuses: uniqueTextOptions(cachedResponse.filterOptions.paymentStatuses),
        });
        setIsLoading(false);
      });
    }

    let requestPending = false;
    async function loadOrders(silent = false) {
      if (requestPending) return;
      requestPending = true;
      if (!cachedResponse && !silent) {
        setRows([]);
        setIsLoading(true);
      }
      setLoadError("");

      try {
        const ordersResponse = await getAdminOrdersRequest(normalizedFilters);

        if (!isMounted) {
          return;
        }

        setRows(ordersResponse.rows);
        setSummaryCards(ordersResponse.summaryCards);
        setPageInfo(ordersResponse.pageInfo);
        setFilterOptions({
          vendors: uniqueVendorOptions(ordersResponse.filterOptions.vendors),
          statuses: uniqueTextOptions(ordersResponse.filterOptions.statuses),
          paymentStatuses: uniqueTextOptions(ordersResponse.filterOptions.paymentStatuses),
        });
        writeOrderCache(orderCacheKey, ordersResponse);
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load orders.");
        }
      } finally {
      requestPending = false;
      if (isMounted) {
        setIsLoading(false);
      }
      }
    }

    loadOrders();

    const refresh = () => {
      if (document.visibilityState === "visible") void loadOrders(true);
    };
    const refreshTimer = window.setInterval(refresh, 10000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      isMounted = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [normalizedFilters, orderCacheKey, reloadKey]);

  useEffect(() => {
    let isMounted = true;

    async function loadCategoryBreakdown() {
      try {
        const categoryResponse = await getAdminOrderCategoryBreakdownRequest(categoryFilters);

        if (isMounted) {
          setCategoryItems(categoryResponse);
        }
      } catch {
        if (isMounted) {
          setCategoryItems([]);
        }
      }
    }

    void loadCategoryBreakdown();
    return () => {
      isMounted = false;
    };
  }, [categoryFilters, reloadKey]);

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
    setVendorFilter("");
    setStatusFilter("");
    setPaymentFilter("");
    setTimeframe(DEFAULT_TIMEFRAME);
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  }

  function updateFilters(setter) {
    return (value) => {
      setter(value);
      setCurrentPage(1);
    };
  }

  function handleSummaryCardClick(cardId) {
    switch (cardId) {
      case "total":
        handleResetFilters();
        break;
      case "paid":
        setPaymentFilter("Paid");
        setStatusFilter("");
        setCurrentPage(1);
        break;
      case "pending":
        setStatusFilter("Pending");
        setPaymentFilter("");
        setCurrentPage(1);
        break;
      case "review":
        setStatusFilter("Refunded");
        setPaymentFilter("Refunded");
        setCurrentPage(1);
        break;
      case "delivered":
        setStatusFilter("Delivered");
        setPaymentFilter("");
        setCurrentPage(1);
        break;
      case "revenue":
        navigate("/reports");
        break;
      default:
        break;
    }
  }

  function refreshOrders() {
    orderListCache.clear();
    setReloadKey((current) => current + 1);
  }

  async function handleOrderRowAction(row, action) {
    try {
      setActiveActionOrderId(row.id);

      if (action === "markPaid") {
        const result = await updateOrderPaymentStatusRequest({
          orderId: row.id,
          paymentStatus: "PAID",
        });
        await Swal.fire({
          confirmButtonText: ot("OK"),
          icon: "success",
          title: ot("Payment updated"),
          text: orderMessage(result.message, "Order payment marked as paid."),
          confirmButtonColor: "#cf6e38",
        });
        refreshOrders();
        return;
      }

      if (action === "downloadInvoice") {
        const invoice = await getAdminOrderInvoiceRequest(row.id);
        const targetUrl = row.invoiceUrl || row.receiptUrl || invoice.pdfUrl || invoice.invoiceUrl;

        if (!targetUrl) {
          throw new Error("No invoice file is available for this order yet.");
        }

        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      await Swal.fire({
          confirmButtonText: ot("OK"),
        icon: "error",
        title: ot("Action failed"),
        text: orderError(error, "Unable to update order."),
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setActiveActionOrderId("");
    }
  }

  useEffect(() => {
    setPageHeaderAction(<DateFilterDropdown clearFilterValue={DEFAULT_TIMEFRAME} selectedFilter={timeframe} onChangeFilter={handleTimeframeChange} startDate={customStart} endDate={customEnd} onCustomDateChange={handleCustomDateChange} />);
    return () => setPageHeaderAction(null);
  }, [customEnd, customStart, setPageHeaderAction, timeframe]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:hidden">
        <DateFilterDropdown
          selectedFilter={timeframe}
          clearFilterValue={DEFAULT_TIMEFRAME}
          onChangeFilter={handleTimeframeChange}
          startDate={customStart}
          endDate={customEnd}
          onCustomDateChange={handleCustomDateChange}
        />
      </section>

      {loadError ? (
        <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-8 text-center text-[15px] font-medium text-[#9f4d33]">
          {orderError(loadError, "Unable to load orders.")}
        </div>
      ) : null}

      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
        {summaryCards.filter((stat) => stat.id !== "review").map((stat) => (
          <StatCard
            key={stat.id}
            title={ot(stat.title)}
            value={stat.value}
            icon={iconMap[stat.id] || ShoppingBag}
            onClick={() => handleSummaryCardClick(stat.id)}
          />
        ))}
      </section>

      <section className="overflow-hidden rounded-[16px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
        <OrdersToolbar
          searchTerm={searchTerm}
          onSearchChange={updateFilters(setSearchTerm)}
          vendorFilter={vendorFilter}
          onVendorFilterChange={updateFilters(setVendorFilter)}
          statusFilter={statusFilter}
          onStatusFilterChange={updateFilters(setStatusFilter)}
          paymentFilter={paymentFilter}
          onPaymentFilterChange={updateFilters(setPaymentFilter)}
          onResetFilters={handleResetFilters}
          vendors={filterOptions.vendors}
          statuses={filterOptions.statuses}
          paymentStatuses={filterOptions.paymentStatuses}
        />

        {isLoading && rows.length === 0 ? (
          <AdminLoadingState
            title={ot("Loading order activity")}
            description={ot("Gathering customer, vendor, event, payment, and fulfillment records for the selected filters.")}
            rows={5}
            columns={8}
          />
        ) : (
          <div className="p-3 sm:p-4">
            <OrdersTable
              activeActionOrderId={activeActionOrderId}
              orders={rows}
              currentPage={pageInfo.page}
              onOrderAction={handleOrderRowAction}
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
