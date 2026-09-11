import { pt, usePayoutLanguage, payoutError, payoutDialog, payoutHtml } from "../payoutTranslation.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import { getAdminCommissionSettingsRequest } from "../api/commissionApi.js";
import {
  approveInvoicePaymentRequest,
  applyCommissionDisplayFallbackToPaymentList,
  getAdminPaymentDetailRequest,
  getAdminPaymentsRequest,
  markCustomerPaymentReceivedRequest,
  markVendorPayoutPaidRequest,
  releaseVendorPayoutRequest,
} from "../api/paymentsApi.js";
import CommissionBreakdownCard from "../components/CommissionBreakdownCard.jsx";
import PayoutOverviewCard from "../components/PayoutOverviewCard.jsx";
import PayoutsTable from "../components/PayoutsTable.jsx";
import PayoutToolbar from "../components/PayoutToolbar.jsx";
import AdminLoadingState from "../../shared/components/AdminLoadingState.jsx";

const PAGE_SIZE = 10;
const PAYMENT_CACHE_TTL_MS = 30_000;
const DEFAULT_TIMEFRAME = "All time";
const paymentListCache = new Map();
const STATIC_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "RELEASED", label: "Released" },
  { value: "CANCELED", label: "Canceled" },
];

function mapPaymentStatusFilter(value) {
  switch (`${value ?? ""}`.trim().toUpperCase()) {
    case "PAID":
      return { value: "PAID", label: "Paid" };
    case "RELEASED":
      return { value: "RELEASED", label: "Released" };
    case "CANCELLED":
    case "CANCELED":
      return { value: "CANCELED", label: "Canceled" };
    default:
      return { value: "PENDING", label: "Pending" };
  }
}

function readPaymentCache(cacheKey) {
  const entry = paymentListCache.get(cacheKey);
  return entry && Date.now() - entry.savedAt < PAYMENT_CACHE_TTL_MS ? entry.data : null;
}

function writePaymentCache(cacheKey, data) {
  paymentListCache.set(cacheKey, { data, savedAt: Date.now() });
}

export default function PayoutsPage() {
  usePayoutLanguage();
  const navigate = useNavigate();
  const { setPageHeaderAction } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [paymentResult, setPaymentResult] = useState(null);
  const [commissionSettings, setCommissionSettings] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    statuses: STATIC_STATUS_OPTIONS,
    vendors: [],
  });
  const [commissionBreakdown, setCommissionBreakdown] = useState({
    globalLabel: "Platform Default Commission",
    globalRate: "0%",
    regions: [],
    vendors: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [activeActionKey, setActiveActionKey] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), 250);
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const dateRange = useMemo(
    () => getDateRangeForFilter(timeframe, customStart, customEnd),
    [customEnd, customStart, timeframe],
  );

  const normalizedFilters = useMemo(() => ({
    search: debouncedSearchTerm,
    status: statusFilter === "all" ? null : mapPaymentStatusFilter(statusFilter).value,
    vendorId: vendorFilter === "all" ? null : vendorFilter,
    dateFrom: dateRange?.start || null,
    dateTo: dateRange?.end || null,
    page: currentPage,
    pageSize: PAGE_SIZE,
    sortBy: "CREATED_AT", sortOrder: "DESC",
  }), [currentPage, dateRange, debouncedSearchTerm, statusFilter, vendorFilter]);
  const paymentCacheKey = useMemo(() => JSON.stringify(normalizedFilters), [normalizedFilters]);

  const displayResult = useMemo(() => {
    return applyCommissionDisplayFallbackToPaymentList(
      paymentResult || { rows: [], summaryCards: [], pageInfo: null },
      commissionSettings,
    );
  }, [paymentResult, commissionSettings]);
  const rows = displayResult.rows || [];
  const pageInfo = displayResult.pageInfo || {
    page: currentPage,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  const summaryCards = displayResult.summaryCards || [];

  useEffect(() => {
    let isMounted = true;
    const cachedResponse = readPaymentCache(paymentCacheKey);

    if (cachedResponse) {
      window.queueMicrotask(() => {
        if (!isMounted) return;
        setPaymentResult(cachedResponse);
        setFilterOptions({
          statuses: STATIC_STATUS_OPTIONS,
          vendors: cachedResponse.filterOptions.vendors.map((vendor) => ({
            value: vendor.id,
            label: vendor.name,
          })),
        });
        setIsLoading(false);
      });
    }

    let requestPending = false;
    async function loadPaymentsPage(silent = false) {
      if (requestPending) return;
      requestPending = true;
      if (!cachedResponse && !silent) {
        setIsLoading(true);
      }
      setLoadError("");

      try {
        const paymentsResponse = await getAdminPaymentsRequest(normalizedFilters);

        if (!isMounted) {
          return;
        }
        setPaymentResult(paymentsResponse);
        setFilterOptions({
          statuses: STATIC_STATUS_OPTIONS,
          vendors: paymentsResponse.filterOptions.vendors.map((vendor) => ({
            value: vendor.id,
            label: vendor.name,
          })),
        });
        writePaymentCache(paymentCacheKey, paymentsResponse);
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load payments.");
        }
      } finally {
        requestPending = false;
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPaymentsPage();

    const refresh = () => {
      if (document.visibilityState === "visible") void loadPaymentsPage(true);
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
  }, [normalizedFilters, paymentCacheKey, reloadKey]);

  useEffect(() => {
    let isMounted = true;

    async function loadCommissionSettings() {
      try {
        const commissionResponse = await getAdminCommissionSettingsRequest();

        if (isMounted) {
          setCommissionSettings(commissionResponse);
          setCommissionBreakdown({
            globalLabel: commissionResponse.globalSettings.label || "Platform Default Commission",
            globalRate: commissionResponse.globalSettings.currentRate || "0%",
            regions: commissionResponse.areaRows.map((row) => ({ id: row.id, label: row.area, value: row.commissionRate })),
            vendors: commissionResponse.vendorRows.map((row) => ({
              id: row.id,
              name: row.vendor,
              share: row.currentCommission,
              avatar: row.avatar,
              avatarUrl: row.avatarUrl,
            })),
          });
        }
      } catch {
        // Commission settings are supplemental and must not block payout records.
      }
    }

    void loadCommissionSettings();
    return () => { isMounted = false; };
  }, [reloadKey]);

  function handleResetFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setVendorFilter("all");
    setTimeframe(DEFAULT_TIMEFRAME);
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  }

  function handleCustomDateChange(start, end) {
    setCustomStart(start);
    setCustomEnd(end);
    setCurrentPage(1);
  }

  function handleTimeframeChange(value) {
    setTimeframe(value);
    setCurrentPage(1);
  }

  function refreshPaymentsPage() {
    paymentListCache.clear();
    setReloadKey((current) => current + 1);
  }

  async function handleQuickAction(row, action) {
    const actionKey = `${row.id}:${action}`;

    if (action === "markReceived" && row.customerPaymentStatus !== "Pending") {
      return;
    }

    if (action === "approveInvoice" && row.customerPaymentStatus !== "Reported") {
      return;
    }

    if (action === "markVendorPaid") {
      if (row.customerPaymentStatus !== "Paid") {
        await Swal.fire(payoutDialog({
          icon: "info",
          title: "Customer payment required",
          text: "Customer payment must be received before vendor payout can be completed.",
          confirmButtonColor: "#cf6e38",
        }));
        return;
      }
}

    try {
      setActiveActionKey(actionKey);

      if (action === "approveInvoice") {
        const prompt = await Swal.fire(payoutDialog({
          title: "Approve customer payment?",
          input: "textarea",
          inputLabel: "Verification note",
          inputPlaceholder: "Optional note for finance records",
          showCancelButton: true,
          confirmButtonText: "Approve payment",
          confirmButtonColor: "#cf6e38",
          cancelButtonColor: "#c8b9aa",
        }));

        if (!prompt.isConfirmed) {
          return;
        }

        const result = await approveInvoicePaymentRequest(row.invoiceId, {
          note: prompt.value || "",
        });

        await Swal.fire(payoutDialog({
          icon: "success",
          title: "Payment approved",
          text: payoutError(result.message, "Changes saved successfully."),
          confirmButtonColor: "#cf6e38",
        }));
        refreshPaymentsPage();
        return;
      }

      if (action === "markReceived") {
        const prompt = await Swal.fire(payoutDialog({
          title: "Mark customer payment received?",
          input: "textarea",
          inputLabel: "Internal note",
          inputPlaceholder: "Optional note for manual payment receipt",
          showCancelButton: true,
          confirmButtonText: "Mark received",
          confirmButtonColor: "#cf6e38",
          cancelButtonColor: "#c8b9aa",
        }));

        if (!prompt.isConfirmed) {
          return;
        }

        const result = await markCustomerPaymentReceivedRequest(row.invoiceId, {
          note: prompt.value || "",
        });

        await Swal.fire(payoutDialog({
          icon: "success",
          title: "Customer payment updated",
          text: payoutError(result.message, "Changes saved successfully."),
          confirmButtonColor: "#cf6e38",
        }));
        refreshPaymentsPage();
        return;
      }

      if (action === "markVendorPaid") {
        const paymentDate = new Date().toISOString().slice(0, 10);
        const prompt = await Swal.fire(payoutDialog({
          title: "Mark vendor payment received?",
          html: `
            <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
              <div>
                <label for="payout-reference" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">${payoutHtml("Payout reference")}</label>
                <input id="payout-reference" class="swal2-input" placeholder="${payoutHtml("Outbound bank transfer reference")}" style="margin:0;width:100%;" />
              </div>
              <div>
                <label for="payout-payment-date" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">${payoutHtml("Transfer date")}</label>
                <input id="payout-payment-date" type="date" class="swal2-input" value="${paymentDate}" style="margin:0;width:100%;" />
              </div>
              <div>
                <label for="payout-note" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">${payoutHtml("Internal note")}</label>
                <textarea id="payout-note" class="swal2-textarea" placeholder="${payoutHtml("Optional admin note")}" style="margin:0;width:100%;min-height:110px;"></textarea>
              </div>
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Mark received",
          confirmButtonColor: "#cf6e38",
          cancelButtonColor: "#c8b9aa",
          preConfirm: () => ({
            reference: document.getElementById("payout-reference")?.value?.trim() || "",
            paymentDate: document.getElementById("payout-payment-date")?.value || paymentDate,
            note: document.getElementById("payout-note")?.value?.trim() || "",
          }),
        }));

        if (!prompt.isConfirmed) {
          return;
        }

        let latest = await getAdminPaymentDetailRequest(row.id);
        if (latest.statuses.customerPaymentStatus !== "Paid") {
          throw new Error("Customer payment must be received before vendor payout can be completed.");
        }

        if (latest.statuses.vendorPayoutStatus !== "Released") {
          if (!latest.settlementId || !latest.vendor?.id) {
            throw new Error("The settlement is not ready for vendor payout yet.");
          }

          await releaseVendorPayoutRequest(
            { vendorId: latest.vendor.id, settlementIds: [latest.settlementId] },
            { note: prompt.value?.note || "Released while recording completed vendor transfer." },
          );
          latest = await getAdminPaymentDetailRequest(row.id);
        }

        if (!latest.payoutId) {
          throw new Error("The payout record is not available yet. Refresh and retry.");
        }

        const result = await markVendorPayoutPaidRequest(latest.payoutId, {
          ...prompt.value,
        });

        if (result.status !== "Paid") {
          throw new Error(
            "The payout remains released. The payment API must persist the payout as PAID before it can be confirmed.",
          );
        }

        const refreshedDetail = await getAdminPaymentDetailRequest(row.id);
        if (refreshedDetail.statuses.vendorPayoutStatus !== "Paid") {
          throw new Error(
            "The payout was not saved as paid. The vendor will continue to see it as released until the payment API returns PAID.",
          );
        }

        await Swal.fire(payoutDialog({
          icon: "success",
          title: "Vendor payout updated",
          text: payoutError(result.message, "Changes saved successfully."),
          confirmButtonColor: "#cf6e38",
        }));
        refreshPaymentsPage();
      }
    } catch (error) {
      await Swal.fire(payoutDialog({
        icon: "error",
        title: "Action failed",
        text: payoutError(error, "Unable to update payment."),
        confirmButtonColor: "#cf6e38",
      }));
    } finally {
      setActiveActionKey("");
    }
  }

  function handleSummaryCardClick(cardId) {
    switch (cardId) {
      case "total":
        handleResetFilters();
        break;
      case "commission":
        navigate("/payouts/commission-settings");
        break;
      case "pending":
        setStatusFilter("PENDING");
        setCurrentPage(1);
        break;
      case "completed":
        setStatusFilter("PAID");
        setCurrentPage(1);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    setPageHeaderAction(<DateFilterDropdown clearFilterValue={DEFAULT_TIMEFRAME} selectedFilter={timeframe} onChangeFilter={handleTimeframeChange} startDate={customStart} endDate={customEnd} onCustomDateChange={handleCustomDateChange} />);
    return () => setPageHeaderAction(null);
  }, [customEnd, customStart, setPageHeaderAction, timeframe]);

  return (
    <div className="space-y-5">
      <section className="flex justify-end lg:hidden">
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
          {payoutError(loadError)}
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <PayoutOverviewCard key={item.id} {...item} onClick={() => handleSummaryCardClick(item.id)} />
        ))}
      </section>

      <section className="space-y-4">
        <div className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
          <PayoutToolbar
            onResetFilters={handleResetFilters}
          onSearchChange={(value) => { setSearchTerm(value); setCurrentPage(1); }}
          onStatusFilterChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
          onVendorFilterChange={(value) => { setVendorFilter(value); setCurrentPage(1); }}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            statusOptions={filterOptions.statuses}
            vendorFilter={vendorFilter}
            vendorOptions={filterOptions.vendors}
          />
          {isLoading && rows.length === 0 ? (
            <AdminLoadingState
              title={pt("Loading payout records")}
              description={pt("Preparing settlements, vendor amounts, commission totals, and payout actions for this date range.")}
              rows={5}
              columns={8}
            />
          ) : (
            <PayoutsTable
              activeActionKey={activeActionKey}
              currentPage={pageInfo.page}
              onPageChange={setCurrentPage}
              onQuickAction={handleQuickAction}
              pageSize={pageInfo.pageSize}
              rows={rows}
              totalItems={pageInfo.totalItems}
            />
          )}
        </div>

        <CommissionBreakdownCard
          globalCommissionLabel={commissionBreakdown.globalLabel}
          globalCommissionRate={commissionBreakdown.globalRate}
          regions={commissionBreakdown.regions}
          vendors={commissionBreakdown.vendors}
        />
      </section>
    </div>
  );
}



