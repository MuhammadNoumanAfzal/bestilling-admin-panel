import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  exportAdminReportRequest,
  getAdminReportsSnapshotRequest,
} from "../api/reportsApi.js";
import CategoryPerformanceCard from "../components/CategoryPerformanceCard.jsx";
import CustomerAnalyticsCard from "../components/CustomerAnalyticsCard.jsx";
import OperationalHealthCard from "../components/OperationalHealthCard.jsx";
import OrderAnalyticsCard from "../components/OrderAnalyticsCard.jsx";
import ReportsHeader from "../components/ReportsHeader.jsx";
import ReportsStatCard from "../components/ReportsStatCard.jsx";
import RevenueAnalyticsCard from "../components/RevenueAnalyticsCard.jsx";
import VendorPerformanceCard from "../components/VendorPerformanceCard.jsx";
import { reportFilterOptions } from "../data/reportsData.js";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function buildReportsFilters(filterLabel, customStartDate, customEndDate) {
  const hasCustomDate = filterLabel === "Custom Date" && customStartDate && customEndDate;
  const isClearFilter = filterLabel === "Clear Filter";

  if (hasCustomDate) {
    return {
      dateFrom: new Date(`${customStartDate}T00:00:00`).toISOString(),
      dateTo: new Date(`${customEndDate}T23:59:59`).toISOString(),
      preset: null,
      timezone: getTimezone(),
      filterLabel,
    };
  }

  if (isClearFilter) {
    return {
      dateFrom: null,
      dateTo: null,
      preset: null,
      timezone: getTimezone(),
      filterLabel: "Last 7 days",
    };
  }

  const dateRange = getDateRangeForFilter(filterLabel, customStartDate, customEndDate);

  return {
    dateFrom: dateRange?.start ? dateRange.start.toISOString() : null,
    dateTo: dateRange?.end ? dateRange.end.toISOString() : null,
    preset: null,
    timezone: getTimezone(),
    filterLabel,
  };
}

function triggerReportDownload(exportUrl, fileName) {
  const anchor = document.createElement("a");
  anchor.href = exportUrl;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";

  if (fileName) {
    anchor.download = fileName;
  }

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export default function ReportsPage() {
  const [selectedFilter, setSelectedFilter] = useState("Last 7 days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [reportSnapshot, setReportSnapshot] = useState({
    fallbackMeta: { isFallback: false, reason: "", filterLabel: "Last 7 days" },
    summary: [],
    revenueAnalytics: { title: "", subtitle: "", scale: [0, 1], bars: [], filterLabel: "Last 7 days" },
    orderAnalytics: { title: "", subtitle: "", scale: [0, 1], bars: [] },
    vendorPerformance: { registration: { count: 0, note: "" }, vendors: [] },
    customerAnalytics: { stats: [], satisfaction: { score: "0%", note: "" } },
    categoryPerformance: [],
    operationalHealth: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [loadError, setLoadError] = useState("");

  const snapshotFilters = useMemo(
    () => buildReportsFilters(selectedFilter, customStartDate, customEndDate),
    [customEndDate, customStartDate, selectedFilter],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadReportsSnapshot() {
      setIsLoading(true);
      setLoadError("");

      try {
        const snapshot = await getAdminReportsSnapshotRequest(snapshotFilters);

        if (isMounted) {
          setReportSnapshot(snapshot);
        }
      } catch (error) {
        if (isMounted) {
          setReportSnapshot((current) => ({
            ...current,
            revenueAnalytics: {
              ...current.revenueAnalytics,
              filterLabel: snapshotFilters.filterLabel || selectedFilter,
            },
          }));
          setLoadError(error instanceof Error ? error.message : "Unable to load reports snapshot.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReportsSnapshot();

    return () => {
      isMounted = false;
    };
  }, [snapshotFilters]);

  async function handleExport() {
    const { value: exportConfig } = await Swal.fire({
      html: `
        <div class="text-left">
          <div class="rounded-[28px] border border-[#f0ddd2] bg-[linear-gradient(135deg,#fff8f3_0%,#ffffff_52%,#fff4ea_100%)] p-5 shadow-[0_22px_50px_rgba(71,41,16,0.10)] sm:p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c96b3b]">Report Export</p>
                <h2 class="mt-2 text-[28px] font-bold tracking-[-0.03em] text-[#2b1d16]">Export admin report</h2>
                <p class="mt-2 max-w-[440px] text-[14px] leading-6 text-[#6a574d]">
                  Choose a file format and the sections you want to include in this export.
                </p>
              </div>
              <div class="hidden h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#fff1e7] text-[#cf6e38] sm:flex">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3v10m0 0 4-4m-4 4-4-4M5 15v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <div class="mt-6 grid gap-5">
              <label class="block">
                <span class="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#9e7761]">Format</span>
                <div class="rounded-[18px] border border-[#ead7cb] bg-white px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <select id="report-export-format" class="w-full border-0 bg-transparent text-[16px] font-semibold text-[#2b1d16] outline-none">
                    <option value="PDF" selected>PDF document</option>
                    <option value="CSV">CSV spreadsheet</option>
                    <option value="XLSX">Excel workbook</option>
                  </select>
                </div>
              </label>

              <div>
                <span class="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#9e7761]">Sections</span>
                <div class="grid gap-3 sm:grid-cols-2">
                  <label class="flex items-start gap-3 rounded-[18px] border border-[#ecdacf] bg-white px-4 py-3 transition hover:border-[#dfb49a] hover:bg-[#fffaf6]">
                    <input id="section-summary" type="checkbox" value="SUMMARY" checked class="mt-1 h-4 w-4 rounded border-[#d8c1b0] text-[#cf6e38] focus:ring-[#cf6e38]" />
                    <span>
                      <span class="block text-[15px] font-semibold text-[#251913]">Summary</span>
                      <span class="mt-1 block text-[12px] text-[#79685f]">Top-line KPIs and platform totals.</span>
                    </span>
                  </label>
                  <label class="flex items-start gap-3 rounded-[18px] border border-[#ecdacf] bg-white px-4 py-3 transition hover:border-[#dfb49a] hover:bg-[#fffaf6]">
                    <input id="section-revenue" type="checkbox" value="REVENUE" checked class="mt-1 h-4 w-4 rounded border-[#d8c1b0] text-[#cf6e38] focus:ring-[#cf6e38]" />
                    <span>
                      <span class="block text-[15px] font-semibold text-[#251913]">Revenue</span>
                      <span class="mt-1 block text-[12px] text-[#79685f]">Gross earnings and revenue trends.</span>
                    </span>
                  </label>
                  <label class="flex items-start gap-3 rounded-[18px] border border-[#ecdacf] bg-white px-4 py-3 transition hover:border-[#dfb49a] hover:bg-[#fffaf6]">
                    <input id="section-orders" type="checkbox" value="ORDERS" checked class="mt-1 h-4 w-4 rounded border-[#d8c1b0] text-[#cf6e38] focus:ring-[#cf6e38]" />
                    <span>
                      <span class="block text-[15px] font-semibold text-[#251913]">Orders</span>
                      <span class="mt-1 block text-[12px] text-[#79685f]">Volume, scheduling, and order flow.</span>
                    </span>
                  </label>
                  <label class="flex items-start gap-3 rounded-[18px] border border-[#ecdacf] bg-white px-4 py-3 transition hover:border-[#dfb49a] hover:bg-[#fffaf6]">
                    <input id="section-vendors" type="checkbox" value="VENDORS" checked class="mt-1 h-4 w-4 rounded border-[#d8c1b0] text-[#cf6e38] focus:ring-[#cf6e38]" />
                    <span>
                      <span class="block text-[15px] font-semibold text-[#251913]">Vendors</span>
                      <span class="mt-1 block text-[12px] text-[#79685f]">Top performers and registrations.</span>
                    </span>
                  </label>
                  <label class="flex items-start gap-3 rounded-[18px] border border-[#ecdacf] bg-white px-4 py-3 transition hover:border-[#dfb49a] hover:bg-[#fffaf6]">
                    <input id="section-customers" type="checkbox" value="CUSTOMERS" checked class="mt-1 h-4 w-4 rounded border-[#d8c1b0] text-[#cf6e38] focus:ring-[#cf6e38]" />
                    <span>
                      <span class="block text-[15px] font-semibold text-[#251913]">Customers</span>
                      <span class="mt-1 block text-[12px] text-[#79685f]">Acquisition, retention, and satisfaction.</span>
                    </span>
                  </label>
                  <label class="flex items-start gap-3 rounded-[18px] border border-[#ecdacf] bg-white px-4 py-3 transition hover:border-[#dfb49a] hover:bg-[#fffaf6]">
                    <input id="section-category" type="checkbox" value="CATEGORY" checked class="mt-1 h-4 w-4 rounded border-[#d8c1b0] text-[#cf6e38] focus:ring-[#cf6e38]" />
                    <span>
                      <span class="block text-[15px] font-semibold text-[#251913]">Category</span>
                      <span class="mt-1 block text-[12px] text-[#79685f]">Category share and product mix.</span>
                    </span>
                  </label>
                  <label class="flex items-start gap-3 rounded-[18px] border border-[#ecdacf] bg-white px-4 py-3 transition hover:border-[#dfb49a] hover:bg-[#fffaf6] sm:col-span-2">
                    <input id="section-operations" type="checkbox" value="OPERATIONS" checked class="mt-1 h-4 w-4 rounded border-[#d8c1b0] text-[#cf6e38] focus:ring-[#cf6e38]" />
                    <span>
                      <span class="block text-[15px] font-semibold text-[#251913]">Operations</span>
                      <span class="mt-1 block text-[12px] text-[#79685f]">SLA, delivery, support, and operational health.</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Export",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-[30px] !p-3 sm:!p-4",
        htmlContainer: "!m-0 !overflow-visible !p-0",
        actions: "!mt-5 flex w-full justify-end gap-3 !px-3 !pb-3 sm:!px-4 sm:!pb-4",
        confirmButton:
          "!m-0 inline-flex h-12 items-center justify-center rounded-[16px] bg-[#cf6e38] px-6 text-[14px] font-semibold text-white shadow-[0_18px_36px_rgba(207,110,56,0.24)] transition hover:bg-[#bc612f]",
        cancelButton:
          "!m-0 inline-flex h-12 items-center justify-center rounded-[16px] border border-[#e7d5c8] bg-white px-6 text-[14px] font-semibold text-[#6d5b4e] transition hover:bg-[#faf4ee]",
      },
      focusConfirm: false,
      preConfirm: () => {
        const formatElement = document.getElementById("report-export-format");
        const format = formatElement?.value || "";
        const sections = Array.from(
          document.querySelectorAll('input[id^="section-"]:checked'),
        ).map((element) => element.value);

        if (!format) {
          Swal.showValidationMessage("Please choose an export format.");
          return null;
        }

        if (!sections.length) {
          Swal.showValidationMessage("Please select at least one report section.");
          return null;
        }

        return { format, sections };
      },
    });

    if (!exportConfig) {
      return;
    }

    setIsExporting(true);

    try {
      const result = await exportAdminReportRequest({
        dateFrom: snapshotFilters.dateFrom,
        dateTo: snapshotFilters.dateTo,
        timezone: snapshotFilters.timezone,
        format: exportConfig.format,
        sections: exportConfig.sections,
      });

      triggerReportDownload(result.exportUrl, result.fileName);

      await Swal.fire({
        icon: "success",
        title: "Report export ready",
        text: result.fileName ? `${result.fileName} is ready to download.` : result.message || "The export file is ready.",
        confirmButtonColor: "#d96834",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to export report",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#d96834",
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <ReportsHeader
        endDate={customEndDate}
        exportLabel="Export Report"
        filterLabel={selectedFilter}
        filterOptions={reportFilterOptions}
        isExporting={isExporting}
        onChangeFilter={setSelectedFilter}
        onCustomDateChange={(startDate, endDate) => {
          setCustomStartDate(startDate);
          setCustomEndDate(endDate);
        }}
        onExport={handleExport}
        startDate={customStartDate}
      />

      {loadError ? (
        <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-10 text-center text-[15px] font-medium text-[#9f4d33]">
          {loadError}
        </div>
      ) : null}

      {!loadError && reportSnapshot.fallbackMeta?.isFallback ? (
        <div className="rounded-[16px] border border-[#f1d8cd] bg-[#fff6f1] px-5 py-4 text-[13px] font-medium text-[#9f4d33]">
          {`Detailed report sections for ${reportSnapshot.fallbackMeta.filterLabel} are not loading because the backend reports snapshot is failing. The summary cards above are still coming from live Orders, Vendors, and Customers data.`}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[16px] border border-[#ece4de] bg-white px-5 py-12 text-center text-[15px] font-medium text-[#6f645d]">
          Loading reports snapshot...
        </div>
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {reportSnapshot.summary.map((item) => (
              <ReportsStatCard key={item.id} {...item} />
            ))}
          </section>

          <section className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
            <RevenueAnalyticsCard analytics={reportSnapshot.revenueAnalytics} />
            <OrderAnalyticsCard analytics={reportSnapshot.orderAnalytics} />
          </section>

          <section className="grid items-stretch gap-4 xl:grid-cols-2">
            <VendorPerformanceCard
              registration={reportSnapshot.vendorPerformance.registration}
              vendors={reportSnapshot.vendorPerformance.vendors}
            />
            <CustomerAnalyticsCard
              satisfaction={reportSnapshot.customerAnalytics.satisfaction}
              stats={reportSnapshot.customerAnalytics.stats}
            />
          </section>

          <section className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(190px,0.82fr)]">
            <CategoryPerformanceCard categories={reportSnapshot.categoryPerformance} />
            <OperationalHealthCard items={reportSnapshot.operationalHealth} />
          </section>
        </>
      )}
    </div>
  );
}
