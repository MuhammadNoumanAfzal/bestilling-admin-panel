import ReportsBarChart from "./ReportsBarChart.jsx";
import ReportsSectionCard from "./ReportsSectionCard.jsx";

export default function RevenueAnalyticsCard({ analytics }) {
  return (
    <ReportsSectionCard className="h-full">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-extrabold tracking-[-0.04em] text-[#18120f]">
            {analytics.title}
          </h2>
          <p className="text-[12px] font-medium text-[#8a7d74]">{analytics.subtitle}</p>
        </div>

        <button
          className="rounded-full border border-[#e2d7cf] bg-[#fcfaf8] px-2.5 py-1 text-[10px] font-semibold text-[#645851]"
          type="button"
        >
          {analytics.filterLabel}
        </button>
      </div>

      <ReportsBarChart bars={analytics.bars} className="mt-1" scale={analytics.scale} valuePrefix={analytics.valuePrefix} />
    </ReportsSectionCard>
  );
}
