import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  exportAdminReportRequest,
  getAdminReportsSnapshotRequest,
  getAdminReportsVendorPerformanceRequest,
} from "../api/reportsApi.js";
import CategoryPerformanceCard from "../components/CategoryPerformanceCard.jsx";
import CustomerAnalyticsCard from "../components/CustomerAnalyticsCard.jsx";
import OperationalHealthCard from "../components/OperationalHealthCard.jsx";
import OrderAnalyticsCard from "../components/OrderAnalyticsCard.jsx";
import ReportsHeader from "../components/ReportsHeader.jsx";
import ReportsStatCard from "../components/ReportsStatCard.jsx";
import RevenueAnalyticsCard from "../components/RevenueAnalyticsCard.jsx";
import VendorPerformanceCard from "../components/VendorPerformanceCard.jsx";
import { reportFilterOptions, reportPresetMap } from "../data/reportsData.js";

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function buildReportsFilters(filterLabel, customStartDate, customEndDate) {
  const preset = reportPresetMap[filterLabel] || null;
  const hasCustomDate = filterLabel === "Custom Date" && customStartDate && customEndDate;

  return {
    dateFrom: hasCustomDate ? new Date(`${customStartDate}T00:00:00`).toISOString() : null,
    dateTo: hasCustomDate ? new Date(`${customEndDate}T23:59:59`).toISOString() : null,
    preset: hasCustomDate ? null : preset,
    timezone: getTimezone(),
    filterLabel,
  };
}

export default function ReportsPage() {
  const [selectedFilter, setSelectedFilter] = useState("Last 7 days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [reportSnapshot, setReportSnapshot] = useState({
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
  const [vendorLoadWarning, setVendorLoadWarning] = useState("");

  const snapshotFilters = useMemo(
    () => buildReportsFilters(selectedFilter, customStartDate, customEndDate),
    [customEndDate, customStartDate, selectedFilter],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadReportsSnapshot() {
      setIsLoading(true);
      setLoadError("");
      setVendorLoadWarning("");

      try {
        const [coreSnapshotResult, vendorSnapshotResult] = await Promise.allSettled([
          getAdminReportsSnapshotRequest(snapshotFilters),
          getAdminReportsVendorPerformanceRequest(snapshotFilters),
        ]);

        if (coreSnapshotResult.status !== "fulfilled") {
          throw coreSnapshotResult.reason;
        }

        if (isMounted) {
          setReportSnapshot({
            ...coreSnapshotResult.value,
            vendorPerformance:
              vendorSnapshotResult.status === "fulfilled"
                ? vendorSnapshotResult.value
                : {
                    registration: { count: 0, note: "Vendor performance is temporarily unavailable." },
                    vendors: [],
                  },
          });

          if (vendorSnapshotResult.status === "rejected") {
            setVendorLoadWarning(
              vendorSnapshotResult.reason instanceof Error
                ? vendorSnapshotResult.reason.message
                : "Vendor performance is temporarily unavailable.",
            );
          }
        }
      } catch (error) {
        if (isMounted) {
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
    const { value: format } = await Swal.fire({
      title: "Export admin report",
      text: "Choose the file format for this report export.",
      input: "select",
      inputOptions: {
        PDF: "PDF",
        CSV: "CSV",
        XLSX: "XLSX",
      },
      inputValue: "PDF",
      showCancelButton: true,
      confirmButtonText: "Export",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
      inputValidator: (value) => (!value ? "Please choose an export format." : undefined),
    });

    if (!format) {
      return;
    }

    setIsExporting(true);

    try {
      const result = await exportAdminReportRequest({
        dateFrom: snapshotFilters.dateFrom,
        dateTo: snapshotFilters.dateTo,
        preset: snapshotFilters.preset,
        format,
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
              warning={vendorLoadWarning}
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
