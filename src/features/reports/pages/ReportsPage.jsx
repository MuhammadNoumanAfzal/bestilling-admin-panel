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
  operationalHealth,
  orderAnalytics,
  reportFilterOptions,
  reportsSummary,
  revenueAnalytics,
  topVendors,
  vendorRegistration,
} from "../data/reportsData.js";

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <ReportsHeader filterLabel={reportFilterOptions[0]} />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {reportsSummary.map((item) => (
          <ReportsStatCard key={item.id} {...item} />
        ))}
      </section>

      <section className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <RevenueAnalyticsCard analytics={revenueAnalytics} />
        <OrderAnalyticsCard analytics={orderAnalytics} />
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
