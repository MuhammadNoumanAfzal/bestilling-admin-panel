import { useEffect, useMemo, useState } from "react";
import { getAdminReportsSnapshotRequest } from "../api/reportsApi.js";
import { getAdminOrdersRequest } from "../../orders/api/ordersApi.js";
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

const REPORT_ORDERS_PAGE_SIZE = 100;

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

function formatMoney(amount, currency = "NOK") {
  const normalizedAmount = Number(amount ?? 0);

  return `${currency} ${normalizedAmount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function differenceInDays(start, end) {
  if (!start || !end) {
    return 0;
  }

  const startValue = new Date(start).getTime();
  const endValue = new Date(end).getTime();
  if (Number.isNaN(startValue) || Number.isNaN(endValue)) {
    return 0;
  }

  return Math.max(1, Math.ceil((endValue - startValue) / (24 * 60 * 60 * 1000)));
}

function createDailyBuckets(startDate, endDate) {
  const buckets = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    const bucketStart = new Date(current);
    const bucketEnd = new Date(current);
    bucketEnd.setHours(23, 59, 59, 999);

    buckets.push({
      key: bucketStart.toISOString(),
      label: new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(bucketStart),
      start: bucketStart,
      end: bucketEnd,
      revenue: 0,
      orders: 0,
    });

    current.setDate(current.getDate() + 1);
  }

  return buckets;
}

function createWeeklyBuckets(startDate, endDate) {
  const buckets = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    const bucketStart = new Date(current);
    const bucketEnd = new Date(current);
    bucketEnd.setDate(bucketEnd.getDate() + 6);
    if (bucketEnd > end) {
      bucketEnd.setTime(end.getTime());
    }
    bucketEnd.setHours(23, 59, 59, 999);

    buckets.push({
      key: bucketStart.toISOString(),
      label: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(
        bucketStart,
      ),
      start: bucketStart,
      end: bucketEnd,
      revenue: 0,
      orders: 0,
    });

    current.setDate(current.getDate() + 7);
  }

  return buckets;
}

function createMonthlyBuckets(startDate, endDate) {
  const buckets = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    const bucketStart = new Date(current);
    const bucketEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    bucketEnd.setHours(23, 59, 59, 999);

    buckets.push({
      key: bucketStart.toISOString(),
      label: new Intl.DateTimeFormat("en-GB", { month: "short" }).format(bucketStart),
      start: bucketStart,
      end: bucketEnd > end ? end : bucketEnd,
      revenue: 0,
      orders: 0,
    });

    current.setMonth(current.getMonth() + 1, 1);
  }

  return buckets;
}

function buildOrderBuckets(rows, filters) {
  const fallbackEnd = filters?.dateTo ? new Date(filters.dateTo) : new Date();
  const fallbackStart = filters?.dateFrom
    ? new Date(filters.dateFrom)
    : new Date(fallbackEnd.getTime() - 6 * 24 * 60 * 60 * 1000);
  const totalDays = differenceInDays(fallbackStart, fallbackEnd);

  let buckets;
  if (totalDays <= 10) {
    buckets = createDailyBuckets(fallbackStart, fallbackEnd);
  } else if (totalDays <= 62) {
    buckets = createWeeklyBuckets(fallbackStart, fallbackEnd);
  } else {
    buckets = createMonthlyBuckets(fallbackStart, fallbackEnd);
  }

  rows.forEach((row) => {
    const placedAt = new Date(row?.placedAt || "");
    if (Number.isNaN(placedAt.getTime())) {
      return;
    }

    const targetBucket = buckets.find((bucket) => placedAt >= bucket.start && placedAt <= bucket.end);
    if (!targetBucket) {
      return;
    }

    targetBucket.revenue += Number(row?.amountValue ?? 0);
    targetBucket.orders += 1;
  });

  return buckets;
}

async function getAllOrdersForReports(filters) {
  const firstPage = await getAdminOrdersRequest({
    ...filters,
    page: 1,
    limit: REPORT_ORDERS_PAGE_SIZE,
  });

  const totalPages = Math.max(1, Number(firstPage.pageInfo?.totalPages ?? 1));
  if (totalPages === 1) {
    return firstPage;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getAdminOrdersRequest({
        ...filters,
        page: index + 2,
        limit: REPORT_ORDERS_PAGE_SIZE,
      }),
    ),
  );

  return {
    ...firstPage,
    rows: [firstPage.rows, ...remainingPages.map((page) => page.rows)].flat(),
  };
}

function mergeReportsWithOrderData(baseSnapshot, ordersResponse, filters) {
  const rows = Array.isArray(ordersResponse?.rows) ? ordersResponse.rows : [];
  const totalRevenue = rows.reduce((sum, row) => sum + Number(row?.amountValue ?? 0), 0);
  const totalOrders = rows.length;
  const vendorCount = new Set(
    rows.map((row) => row?.vendorId || row?.vendor).filter(Boolean),
  ).size;
  const customerCount = new Set(
    rows.map((row) => row?.customerId || row?.customer).filter(Boolean),
  ).size;
  const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const pendingApprovals =
    Number(baseSnapshot?.summary?.find?.((item) => item?.id === "approvals")?.value ?? 0) || 0;
  const bucketItems = buildOrderBuckets(rows, filters);
  const revenueBars = bucketItems.map((bucket) => ({
    label: bucket.label,
    value: Number(bucket.revenue.toFixed(2)),
  }));
  const orderBars = bucketItems.map((bucket) => ({
    label: bucket.label,
    value: bucket.orders,
  }));

  return {
    ...baseSnapshot,
    summary: [
      {
        id: "revenue",
        label: "Total Revenue",
        value: formatMoney(totalRevenue),
        icon: "wallet",
        accent: "soft",
      },
      {
        id: "orders",
        label: "Total Orders",
        value: String(totalOrders),
        icon: "orders",
        accent: "warm",
      },
      {
        id: "vendors",
        label: "Active Vendors",
        value: String(vendorCount),
        icon: "store",
        accent: "neutral",
      },
      {
        id: "customers",
        label: "Active Customers",
        value: String(customerCount),
        icon: "users",
        accent: "soft",
      },
      {
        id: "approvals",
        label: "Pending Approvals",
        value: String(pendingApprovals),
        icon: "clock",
        accent: "warm",
      },
      {
        id: "aov",
        label: "Average Order Value",
        value: formatMoney(averageOrderValue),
        icon: "receipt",
        accent: "neutral",
      },
    ],
    revenueAnalytics: {
      ...baseSnapshot.revenueAnalytics,
      title: "Gross Revenue",
      subtitle: "Gross invoice earnings across selected channel filters",
      bars: revenueBars,
      filterLabel: filters?.filterLabel || baseSnapshot.revenueAnalytics?.filterLabel,
      valuePrefix: "",
    },
    orderAnalytics: {
      ...baseSnapshot.orderAnalytics,
      title: "Order Volume",
      subtitle: "Completed and scheduled orders across date presets",
      bars: orderBars,
    },
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
        const [snapshot, ordersResponse] = await Promise.all([
          getAdminReportsSnapshotRequest(snapshotFilters),
          getAllOrdersForReports({
            dateFrom: snapshotFilters.dateFrom,
            dateTo: snapshotFilters.dateTo,
            page: 1,
            limit: REPORT_ORDERS_PAGE_SIZE,
            sortField: "PLACED_AT",
            sortDirection: "ASC",
          }),
        ]);
        const mergedSnapshot = mergeReportsWithOrderData(snapshot, ordersResponse, snapshotFilters);

        if (isMounted) {
          setReportSnapshot(mergedSnapshot);
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
