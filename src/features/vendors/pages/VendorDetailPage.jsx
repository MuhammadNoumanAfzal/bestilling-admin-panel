import { useMemo, useRef, useState } from "react";
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
  const [activeSection, setActiveSection] = useState("overview");

  const vendor = useMemo(() => getVendorDetail(vendorId), [vendorId]);
  const sectionRefs = useRef({});

  const sections = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "menus", label: "Menus" },
      { id: "orders", label: "Orders" },
      { id: "earnings", label: "Earnings" },
      { id: "reviews", label: "Reviews" },
      { id: "documents", label: "Documents" },
      { id: "admin-actions", label: "Admin Actions" },
    ],
    [],
  );

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-0 sm:space-y-6">
      <VendorDetailHeader
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        sections={sections}
        vendor={vendor}
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {vendor.summaryStats.map((stat) => (
          <VendorDetailStatCard key={stat.id} {...stat} />
        ))}
      </section>

      <div ref={(node) => { sectionRefs.current.overview = node; }} className="scroll-mt-6">
        <VendorBusinessOverviewSection overview={vendor.overview} />
      </div>

      <div ref={(node) => { sectionRefs.current.menus = node; }} className="scroll-mt-6">
        <VendorPublishedMenusSection menus={vendor.publishedMenus} tabs={vendor.menuTabs} />
      </div>

      <div ref={(node) => { sectionRefs.current.orders = node; }} className="scroll-mt-6">
        <VendorRecentOrdersSection orders={vendor.recentOrders} />
      </div>

      <div ref={(node) => { sectionRefs.current.earnings = node; }} className="scroll-mt-6">
        <VendorFinancialPerformanceSection financial={vendor.financial} />
      </div>

      <div ref={(node) => { sectionRefs.current.reviews = node; }} className="scroll-mt-6">
        <VendorReviewsSection summary={vendor.reviewsSummary} />
      </div>

      <div ref={(node) => { sectionRefs.current.documents = node; }} className="scroll-mt-6">
        <VendorVerificationSection documents={vendor.documents} />
      </div>

      <div ref={(node) => { sectionRefs.current["admin-actions"] = node; }} className="scroll-mt-6">
        <VendorDangerZoneSection dangerZone={vendor.dangerZone} vendorName={vendor.name} />
      </div>
    </div>
  );
}
