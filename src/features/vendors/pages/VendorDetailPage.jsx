import { useMemo } from "react";
import { useParams } from "react-router-dom";
import VendorDangerZoneSection from "../components/details/VendorDangerZoneSection.jsx";
import VendorDetailHeader from "../components/details/VendorDetailHeader.jsx";
import VendorDetailStatCard from "../components/details/VendorDetailStatCard.jsx";
import VendorBusinessOverviewSection from "../components/details/VendorBusinessOverviewSection.jsx";
import VendorFinancialPerformanceSection from "../components/details/VendorFinancialPerformanceSection.jsx";
import VendorPublishedMenusSection from "../components/details/VendorPublishedMenusSection.jsx";
import VendorRecentOrdersSection from "../components/details/VendorRecentOrdersSection.jsx";
import VendorReviewsSection from "../components/details/VendorReviewsSection.jsx";
import VendorVerificationSection from "../components/details/VendorVerificationSection.jsx";
import { getVendorDetail } from "../data/vendorDetailData.js";

export default function VendorDetailPage() {
  const { vendorId } = useParams();

  const vendor = useMemo(() => getVendorDetail(vendorId), [vendorId]);

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
      <VendorDetailHeader vendor={vendor} />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {vendor.summaryStats.map((stat) => (
          <VendorDetailStatCard key={stat.id} {...stat} />
        ))}
      </section>

      <VendorBusinessOverviewSection overview={vendor.overview} />

      <VendorPublishedMenusSection menus={vendor.publishedMenus} tabs={vendor.menuTabs} />

      <VendorRecentOrdersSection orders={vendor.recentOrders} />

      <VendorFinancialPerformanceSection financial={vendor.financial} />

      <VendorReviewsSection summary={vendor.reviewsSummary} />

      <VendorVerificationSection documents={vendor.documents} />

      <VendorDangerZoneSection dangerZone={vendor.dangerZone} vendorName={vendor.name} />
    </div>
  );
}
