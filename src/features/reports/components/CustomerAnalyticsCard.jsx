import ReportsSectionCard from "./ReportsSectionCard.jsx";

function MetricTile({ label, value, note }) {
  return (
    <div className="rounded-[14px] border border-[#e9dfd8] bg-[#fbf9f7] px-3.5 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.03em] text-[#8b7f76]">{label}</p>
      <p className="mt-1.5 text-[28px] font-extrabold leading-none tracking-[-0.05em] text-[#1e1611]">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] font-medium text-[#8b7f76]">{note}</p>
    </div>
  );
}

export default function CustomerAnalyticsCard({ stats, satisfaction }) {
  return (
    <ReportsSectionCard className="h-full">
      <div className="space-y-4">
        <div>
          <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#18120f]">
            Customer Analytics
          </h2>
          <p className="text-[12px] font-medium text-[#8a7d74]">
            Acquisition and retention metrics
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map((item) => (
            <MetricTile key={item.id} {...item} />
          ))}
        </div>

        <div className="rounded-[16px] border border-[#84b6ff] bg-[#edf5ff] px-4 py-3.5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[12px] font-bold text-[#2570dd]">Customer Satisfaction Score</p>
            <span className="rounded-full bg-[#2f80ff] px-2 py-0.5 text-[10px] font-bold text-white">
              4.8/5
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-white/90">
            <div
              className="h-full rounded-full bg-[#2f80ff]"
              style={{ width: satisfaction.score }}
            />
          </div>

          <p className="mt-3 text-[11px] font-medium text-[#4e7dc1]">{satisfaction.note}</p>
        </div>
      </div>
    </ReportsSectionCard>
  );
}
