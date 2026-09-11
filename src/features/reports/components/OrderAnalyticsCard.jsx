import { rt, useReportLanguage } from "../reportsTranslation.js";
import ReportsBarChart from "./ReportsBarChart.jsx";
import ReportsSectionCard from "./ReportsSectionCard.jsx";

export default function OrderAnalyticsCard({ analytics }) {
  useReportLanguage();
  return (
    <ReportsSectionCard className="h-full">
      <div className="mb-3">
        <h2 className="text-[18px] font-extrabold tracking-[-0.04em] text-[#18120f]">
          {rt(analytics.title)}
        </h2>
        <p className="text-[12px] font-medium text-[#8a7d74]">{rt(analytics.subtitle)}</p>
      </div>

      <p className="mb-2 text-[11px] font-medium text-[#9a8d84]">{rt("Hover a bar to view the exact order count.")}</p>
      <ReportsBarChart bars={analytics.bars} className="mt-1" scale={analytics.scale} />
    </ReportsSectionCard>
  );
}
