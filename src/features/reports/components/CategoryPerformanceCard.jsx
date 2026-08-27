import ReportsSectionCard from "./ReportsSectionCard.jsx";

function buildDonutGradient(categories) {
  let runningTotal = 0;
  const stops = categories.map((item) => {
    const start = runningTotal;
    runningTotal += item.value;
    return `${item.color} ${start}% ${runningTotal}%`;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

function getDominantCategory(categories) {
  return [...categories].sort((left, right) => Number(right?.value ?? 0) - Number(left?.value ?? 0))[0] || null;
}

export default function CategoryPerformanceCard({ categories }) {
  if (!categories.length) {
    return (
      <ReportsSectionCard className="h-full p-6">
        <div className="space-y-3">
          <h2 className="text-[18px] font-extrabold tracking-[-0.04em] text-[#18120f] sm:text-[20px]">
            Category Performance
          </h2>
          <p className="text-[12px] font-medium text-[#8a7d74]">Market share by event type</p>
          <div className="rounded-[14px] border border-dashed border-[#e1d7d0] bg-[#fbf8f5] px-4 py-10 text-center text-[14px] font-medium text-[#7a6e67]">
            No category performance data is available for the selected period.
          </div>
        </div>
      </ReportsSectionCard>
    );
  }

  const donutBackground = buildDonutGradient(categories);
  const primaryCategory = getDominantCategory(categories);
  const secondaryCategories = categories.filter((category) => category.id !== primaryCategory?.id);

  return (
    <ReportsSectionCard className="h-full p-6">
      <div className="flex h-full flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <span className="inline-flex rounded-full border border-[#f0d9ca] bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#d16936]">
              Revenue Mix
            </span>
            <h2 className="mt-3 text-[20px] font-black tracking-[-0.05em] text-[#18120f] sm:text-[22px]">
              Category Performance
            </h2>
            <p className="mt-1 text-[12px] font-medium text-[#8a7d74]">Market share by event type</p>
          </div>

          <div className="w-full rounded-[18px] border border-[#edd9ca] bg-white/80 px-4 py-3 shadow-[0_10px_26px_rgba(55,31,13,0.05)] lg:max-w-[220px]">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9e8879]">Top Segment</p>
            <p
              className="mt-1 break-words text-[15px] font-black tracking-[-0.03em]"
              style={{ color: primaryCategory?.color || "#d16936" }}
            >
              {primaryCategory?.label || "N/A"}
            </p>
            <p className="mt-1 text-[12px] font-semibold text-[#5d5047]">{primaryCategory?.value || 0}% of revenue mix</p>
          </div>
        </div>

        <div className="grid items-center gap-6 2xl:grid-cols-[minmax(260px,0.95fr)_minmax(0,1.05fr)]">
          <div className="flex justify-center">
            <div className="relative flex h-[220px] w-[220px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.96)_0%,rgba(255,248,242,0.9)_58%,rgba(240,216,202,0.55)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_22px_48px_rgba(209,105,54,0.12)] sm:h-[240px] sm:w-[240px] lg:h-[260px] lg:w-[260px] sm:p-5">
              <div
                className="relative h-[170px] w-[170px] rounded-full shadow-[0_16px_34px_rgba(50,28,13,0.12)] sm:h-[185px] sm:w-[185px] lg:h-[200px] lg:w-[200px]"
                style={{ background: donutBackground }}
              >
                <div className="absolute inset-[28px] flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#fffefd_0%,#fff6ef_70%,#f6e5d9_100%)] shadow-[inset_0_2px_10px_rgba(255,255,255,0.85)] sm:inset-[30px] lg:inset-[34px]">
                  <div className="text-center">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#9c8779]">Leader</p>
                    <p className="mt-2 text-[16px] font-black leading-5 tracking-[-0.04em] text-[#1b140f] sm:text-[18px]">
                      {primaryCategory?.value || 0}%
                    </p>
                    <p className="mt-1 max-w-[72px] text-[10px] font-semibold leading-4 text-[#7c6f66] sm:max-w-[84px] sm:text-[11px]">
                      {primaryCategory?.label || "No data"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {categories.map((category, index) => {
              const isPrimary = category.id === primaryCategory?.id;

              return (
                <div
                  className={[
                    "rounded-[18px] border px-4 py-3.5 transition",
                    isPrimary
                      ? "border-[#ebcfbd] bg-white shadow-[0_16px_30px_rgba(50,28,13,0.08)]"
                      : "border-[#efe2d8] bg-[#fffdfa]",
                  ].join(" ")}
                  key={category.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.72)]"
                          style={{ backgroundColor: category.color }}
                        />
                        <p className="truncate text-[15px] font-bold text-[#211711]">{category.label}</p>
                      </div>
                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#f4e8de]">
                        <div
                          className="h-full rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                          style={{
                            width: `${category.value}%`,
                            background: `linear-gradient(90deg, ${category.color} 0%, ${category.color}CC 100%)`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="shrink-0 sm:text-right">
                      <p className="text-[20px] font-black tracking-[-0.05em] text-[#18120f]">{category.value}%</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9f897a]">
                        {isPrimary ? "Top" : `Rank ${index + 1}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {secondaryCategories.length ? (
          <div className="rounded-[18px] border border-[#efdfd3] bg-white/65 px-4 py-3 text-[12px] leading-6 text-[#6d6057]">
            Secondary categories continue to contribute meaningful revenue spread, helping reduce over-reliance on a single event type.
          </div>
        ) : null}
      </div>
    </ReportsSectionCard>
  );
}
