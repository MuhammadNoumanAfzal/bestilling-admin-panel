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
import AdminLoadingState from "../../shared/components/AdminLoadingState.jsx";
import {
  cancelOrderRequest,
  exportAdminOrdersRequest,
  getAdminOrderInvoiceRequest,
  getAdminOrderCategoryBreakdownRequest,
  getAdminOrdersRequest,
  refundOrderRequest,
  updateOrderPaymentStatusRequest,
  updateOrderStatusRequest,
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
  const [activeActionOrderId, setActiveActionOrderId] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

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
  }, [normalizedFilters, reloadKey]);

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

  function refreshOrders() {
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
          icon: "success",
          title: "Payment updated",
          text: result.message || "Order payment marked as paid.",
          confirmButtonColor: "#cf6e38",
        });
        refreshOrders();
        return;
      }

      if (action === "markDelivered") {
        const result = await updateOrderStatusRequest({
          orderId: row.id,
          status: "DELIVERED",
        });
        await Swal.fire({
          icon: "success",
          title: "Order updated",
          text: result.message || "Order marked as delivered.",
          confirmButtonColor: "#cf6e38",
        });
        refreshOrders();
        return;
      }

      if (action === "cancel") {
        const confirmation = await Swal.fire({
          title: "Cancel this order?",
          input: "text",
          inputLabel: "Cancellation reason",
          inputPlaceholder: "Add a reason for the cancellation",
          showCancelButton: true,
          confirmButtonText: "Cancel order",
          confirmButtonColor: "#d83f3f",
          cancelButtonColor: "#c8b9aa",
        });

        if (!confirmation.isConfirmed) {
          return;
        }

        const result = await cancelOrderRequest({
          orderId: row.id,
          reason: confirmation.value || "",
        });
        await Swal.fire({
          icon: "success",
          title: "Order canceled",
          text: result.message || "Order canceled successfully.",
          confirmButtonColor: "#cf6e38",
        });
        refreshOrders();
        return;
      }

      if (action === "refund") {
        const refundModePrompt = await Swal.fire({
          title: "Refund order",
          input: "select",
          inputOptions: {
            FULL: "Full refund",
            PARTIAL: "Partial refund",
          },
          inputValue: "FULL",
          showCancelButton: true,
          confirmButtonText: "Continue",
          confirmButtonColor: "#cf6e38",
          cancelButtonColor: "#c8b9aa",
        });

        if (!refundModePrompt.isConfirmed) {
          return;
        }

        let partialAmount = "";
        if (refundModePrompt.value === "PARTIAL") {
          const amountPrompt = await Swal.fire({
            title: "Partial refund amount",
            input: "number",
            inputAttributes: {
              min: "0",
              step: "0.01",
            },
            showCancelButton: true,
            confirmButtonText: "Continue",
            confirmButtonColor: "#cf6e38",
            cancelButtonColor: "#c8b9aa",
          });

          if (!amountPrompt.isConfirmed) {
            return;
          }

          partialAmount = amountPrompt.value || "";
        }

        const reasonPrompt = await Swal.fire({
          title: "Refund reason",
          input: "text",
          inputPlaceholder: "Optional note for finance and support teams",
          showCancelButton: true,
          confirmButtonText: "Process refund",
          confirmButtonColor: "#cf6e38",
          cancelButtonColor: "#c8b9aa",
        });

        if (!reasonPrompt.isConfirmed) {
          return;
        }

        const result = await refundOrderRequest({
          orderId: row.id,
          mode: refundModePrompt.value,
          amount: partialAmount ? Number(partialAmount) : null,
          reason: reasonPrompt.value || "",
        });
        await Swal.fire({
          icon: "success",
          title: "Refund processed",
          text: result.message || "Order refunded successfully.",
          confirmButtonColor: "#cf6e38",
        });
        refreshOrders();
        return;
      }

      if (action === "downloadInvoice") {
        const invoice = await getAdminOrderInvoiceRequest(row.id);
        const targetUrl = invoice.pdfUrl || invoice.invoiceUrl;

        if (!targetUrl) {
          throw new Error("No invoice file is available for this order yet.");
        }

        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Action failed",
        text: error instanceof Error ? error.message : "Unable to update order.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setActiveActionOrderId("");
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
          <AdminLoadingState
            title="Loading order activity"
            description="Gathering customer, vendor, event, payment, and fulfillment records for the selected filters."
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
