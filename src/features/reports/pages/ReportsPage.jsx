import { useMemo, useState } from "react";
import CategoryPerformanceCard from "../components/CategoryPerformanceCard.jsx";
import CustomerAnalyticsCard from "../components/CustomerAnalyticsCard.jsx";
import OperationalHealthCard from "../components/OperationalHealthCard.jsx";
import OrderAnalyticsCard from "../components/OrderAnalyticsCard.jsx";
import ReportsHeader from "../components/ReportsHeader.jsx";
import ReportsStatCard from "../components/ReportsStatCard.jsx";
import RevenueAnalyticsCard from "../components/RevenueAnalyticsCard.jsx";
import VendorPerformanceCard from "../components/VendorPerformanceCard.jsx";
import {
  categoryPerformance,
  customerAnalyticsStats,
  customerSatisfaction,
  getReportSnapshot,
  operationalHealth,
  reportFilterOptions,
  topVendors,
  vendorRegistration,
} from "../data/reportsData.js";

export default function ReportsPage() {
  const [selectedFilter, setSelectedFilter] = useState("Last 7 days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const reportSnapshot = useMemo(
    () => getReportSnapshot(selectedFilter, customStartDate, customEndDate),
    [customEndDate, customStartDate, selectedFilter],
  );

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
          registration={vendorRegistration}
          vendors={topVendors}
        />
        <CustomerAnalyticsCard
          satisfaction={customerSatisfaction}
          stats={customerAnalyticsStats}
        />
      </section>

      <section className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(190px,0.82fr)]">
        <CategoryPerformanceCard categories={categoryPerformance} />
        <OperationalHealthCard items={operationalHealth} />
      </section>
    </div>
  );
}
