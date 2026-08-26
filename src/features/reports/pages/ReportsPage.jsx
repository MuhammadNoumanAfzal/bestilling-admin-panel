import { useEffect, useMemo, useState } from "react";
import { getAdminReportsSnapshotRequest } from "../api/reportsApi.js";
import CategoryPerformanceCard from "../components/CategoryPerformanceCard.jsx";
import CustomerAnalyticsCard from "../components/CustomerAnalyticsCard.jsx";
import OperationalHealthCard from "../components/OperationalHealthCard.jsx";
import OrderAnalyticsCard from "../components/OrderAnalyticsCard.jsx";
import ReportsHeader from "../components/ReportsHeader.jsx";
import ReportsStatCard from "../components/ReportsStatCard.jsx";
import RevenueAnalyticsCard from "../components/RevenueAnalyticsCard.jsx";
import VendorPerformanceCard from "../components/VendorPerformanceCard.jsx";
import { reportFilterOptions } from "../data/reportsData.js";
import { createEmptyReportsSnapshot } from "../reportsUtils.js";
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
  const [reportSnapshot, setReportSnapshot] = useState(() =>
    createEmptyReportsSnapshot("Last 7 days"),
  );
  const [isLoading, setIsLoading] = useState(true);
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
          setReportSnapshot(
            createEmptyReportsSnapshot(snapshotFilters.filterLabel || selectedFilter),
          );
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

  return (
    <div className="space-y-4">
      <ReportsHeader
        endDate={customEndDate}
        filterLabel={selectedFilter}
        filterOptions={reportFilterOptions}
        onChangeFilter={setSelectedFilter}
        onCustomDateChange={(startDate, endDate) => {
          setCustomStartDate(startDate);
          setCustomEndDate(endDate);
        }}
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
          {reportSnapshot.summary.length ? (
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              {reportSnapshot.summary.map((item) => (
                <ReportsStatCard key={item.id} {...item} />
              ))}
            </section>
          ) : (
            <section className="rounded-[16px] border border-dashed border-[#e3d7cf] bg-[#fffdfa] px-5 py-8 text-center text-[14px] font-medium text-[#7a6d66]">
              No report summary data is available for the selected period.
            </section>
          )}

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
