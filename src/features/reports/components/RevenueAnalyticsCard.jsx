import ReportsBarChart from "./ReportsBarChart.jsx";
import ReportsSectionCard from "./ReportsSectionCard.jsx";

export default function RevenueAnalyticsCard({ analytics }) {
  return (
    <ReportsSectionCard className="h-full">
      <div className="mb-3">
        <div>
          <h2 className="text-[18px] font-extrabold tracking-[-0.04em] text-[#18120f]">
            {analytics.title}
          </h2>
          <p className="text-[12px] font-medium text-[#8a7d74]">{analytics.subtitle}</p>
        </div>
      </div>

      <ReportsBarChart bars={analytics.bars} className="mt-1" scale={analytics.scale} valuePrefix={analytics.valuePrefix} />
    </ReportsSectionCard>
  );
}
