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

      <p className="mb-2 text-[11px] font-medium text-[#9a8d84]">Hover a bar to view the exact revenue.</p>
      <ReportsBarChart bars={analytics.bars} className="mt-1" scale={analytics.scale} valuePrefix={analytics.valuePrefix} valueType="currency" />
    </ReportsSectionCard>
  );
}
