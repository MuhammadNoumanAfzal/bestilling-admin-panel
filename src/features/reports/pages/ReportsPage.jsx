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
      title: "Export admin report",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <label style="display:flex;flex-direction:column;gap:6px;">
            <span style="font-size:12px;font-weight:700;color:#4a352b;">Format</span>
            <select id="report-export-format" class="swal2-select" style="display:flex;width:100%;margin:0;">
              <option value="PDF" selected>PDF</option>
              <option value="CSV">CSV</option>
              <option value="XLSX">XLSX</option>
            </select>
          </label>
          <label style="display:flex;flex-direction:column;gap:6px;">
            <span style="font-size:12px;font-weight:700;color:#4a352b;">Sections</span>
            <select id="report-export-sections" class="swal2-select" multiple style="display:flex;width:100%;min-height:180px;margin:0;">
              <option value="SUMMARY" selected>Summary</option>
              <option value="REVENUE" selected>Revenue</option>
              <option value="ORDERS" selected>Orders</option>
              <option value="VENDORS" selected>Vendors</option>
              <option value="CUSTOMERS" selected>Customers</option>
              <option value="CATEGORY" selected>Category</option>
              <option value="OPERATIONS" selected>Operations</option>
            </select>
          </label>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Export",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
      focusConfirm: false,
      preConfirm: () => {
        const formatElement = document.getElementById("report-export-format");
        const sectionsElement = document.getElementById("report-export-sections");
        const format = formatElement?.value || "";
        const sections = Array.from(sectionsElement?.selectedOptions || []).map(
          (option) => option.value,
        );

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
        preset: snapshotFilters.preset,
        format: exportConfig.format,
        sections: exportConfig.sections,
      });

      window.open(result.exportUrl, "_blank", "noopener,noreferrer");

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
