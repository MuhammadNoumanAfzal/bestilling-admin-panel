import { BadgeDollarSign, CalendarDays, CircleAlert, TrendingUp } from "lucide-react";

function formatNok(value) {
  return `NOK ${Number(value || 0).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

function RevenueChart({ series }) {
  const safeSeries = (Array.isArray(series) ? series : [])
    .map((item) => ({
      label: item?.label || "Period",
      value: Number(item?.value ?? 0),
    }))
    .filter((item) => Number.isFinite(item.value));

  if (safeSeries.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-[14px] border border-dashed border-[#e5d9d0] bg-[#fcfbfa] px-6 text-center">
        <div>
          <TrendingUp className="mx-auto h-7 w-7 text-[#c9b9ae]" />
          <p className="mt-3 text-[14px] font-semibold text-[#5f534b]">No sales trend is available yet.</p>
          <p className="mt-1 text-[12px] leading-5 text-[#8a7f76]">Revenue will appear after completed vendor orders are recorded.</p>
        </div>
      </div>
    );
  }

  const totalRevenue = safeSeries.reduce((sum, item) => sum + item.value, 0);
  const averageRevenue = totalRevenue / safeSeries.length;
  const bestPeriod = safeSeries.reduce((best, item) => (item.value > best.value ? item : best));
  const latestPeriod = safeSeries[safeSeries.length - 1];
  const peak = Math.max(...safeSeries.map((item) => item.value), 1);
  const step = 10 ** Math.floor(Math.log10(peak));
  const maxValue = Math.ceil(peak * 1.2 / step) * step;

  const insights = [
    { label: "Total sales", value: formatNok(totalRevenue), detail: "Selected range" },
    { label: "Average sales", value: formatNok(averageRevenue), detail: "Per displayed period" },
    { label: "Best period", value: formatNok(bestPeriod.value), detail: bestPeriod.label },
    { label: "Latest period", value: formatNok(latestPeriod.value), detail: latestPeriod.label },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map((insight) => (
          <div key={insight.label} className="rounded-[10px] border border-[#eee4dd] bg-[#fcfbfa] px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9b8f86]">{insight.label}</p>
            <p className="mt-1 text-[16px] font-extrabold tracking-[-0.03em] text-[#201711]">{insight.value}</p>
            <p className="mt-0.5 text-[10px] text-[#887b72]">{insight.detail}</p>
          </div>
        ))}
      </div>
      <div className="rounded-[14px] border border-[#eee4dd] bg-[#fcfbfa] p-4">
        <p className="mb-5 text-xs font-semibold text-[#796659]">Revenue (NOK)</p>
        <div className="flex">
          <div className="relative h-[220px] w-[72px] shrink-0 pr-2">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="absolute right-2 -translate-y-1/2 text-[11px] tabular-nums text-[#796659]" style={{ top: `${i * 25}%` }}>
                {((maxValue / 4) * (4 - i)).toLocaleString("en-GB", { maximumFractionDigits: 0 })}
              </span>
            ))}
          </div>
          <div className="min-w-0 flex-1 overflow-x-auto pb-2">
            <div style={{ minWidth: safeSeries.length * 100 }}>
              <div className="relative h-[220px] border-b border-l border-[#cdbbad]">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#e6d8cd]" style={{ top: `${i * 25}%` }} />
                ))}
                <div className="absolute inset-0 grid items-end" style={{ gridTemplateColumns: `repeat(${safeSeries.length}, minmax(0, 1fr))` }} role="img" aria-label={safeSeries.map(item => `${item.label}: ${formatNok(item.value)}`).join(", ")}>
                  {safeSeries.map((item, index) => (
                    <div key={index} className="relative mx-auto w-[60%] max-w-[56px] rounded-t-md bg-[#d46a37]" style={{ height: `${Math.max(0, item.value / maxValue * 100)}%` }} title={`${item.label}: ${formatNok(item.value)}`}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold text-[#694a37]">{formatNok(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${safeSeries.length}, minmax(0, 1fr))` }}>
                {safeSeries.map((item, index) => <span key={index} className="px-1 text-center text-xs font-medium text-[#695548]">{item.label}</span>)}
              </div>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-[#796659]">Month</p>
      </div>
    </div>
  );
}

export default function VendorFinancialPerformanceSection({ financial }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="h-6 w-[4px] rounded-full bg-[#d96834]" />
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#fff2ea] text-[#d96834] shadow-sm">
          <BadgeDollarSign size={15} />
        </span>
        <h2 className="text-[22px] font-extrabold tracking-tight text-[#18120f]">
          Financial Performance
        </h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
        <article className="min-w-0 rounded-[16px] border border-[#d6cbc2] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#18120f]">Sales performance</h3>
              <p className="text-[13px] font-medium text-[#8a7f76]">
                {financial.chartSubtitle || "Completed-order sales across the selected period."}
              </p>
            </div>
            <span className="rounded-full border border-[#e4d7ce] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#5f534b]">
              {financial.filterLabel}
            </span>
          </div>
          <RevenueChart series={financial.revenueSeries} />
        </article>

        <div className="space-y-4">
          <article className="overflow-hidden rounded-[16px] border border-[#d6cbc2] bg-white shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
            <div className="p-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.03em] text-[#8c8077]">Pending Payout</p>
              <p className="mt-1.5 text-[22px] font-extrabold leading-none tracking-[-0.04em] text-[#18120f]">
              {financial.pendingPayout}
              </p>
              <span className="mt-2 inline-flex rounded-full border border-[#f2c8b4] bg-[#fff4ec] px-2.5 py-1 text-[11px] font-bold text-[#cf6e38]">
              {financial.payoutStatus}
              </span>
            </div>

            <div className="border-t border-[#ddd6cf]">
              <div className="px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#8c8077]">Est. Payout</p>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] font-bold text-[#1f1711]">
                  <CalendarDays size={12} className="text-[#6f645d]" />
                  {financial.estimatedPayout}
                </p>
              </div>
            </div>

            <div className="border-t border-[#ddd6cf] px-5 py-3">
              <p className="flex items-center gap-2 text-[11px] font-medium text-[#5f534b]">
                <CircleAlert size={12} className="text-[#1f1711]" />
                {financial.payoutNote}
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-[16px] border border-[#d6cbc2] bg-white shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
            <div className="p-5">
              <h3 className="text-[18px] font-medium text-[#5f534b]">Financial Breakdown</h3>
              <div className="mt-4 space-y-3">
                {financial.breakdown
                  .filter((item) => item.label !== "Net Earnings")
                  .map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4">
                  <span className="text-[13px] font-medium text-[#8a7f76]">{item.label}</span>
                  <span
                    className={[
                      "text-[13px] font-bold",
                      item.tone === "negative"
                        ? "text-[#d83f3f]"
                        : item.tone === "positive"
                          ? "text-[#2b9e62]"
                          : "text-[#1f1711]",
                    ].join(" ")}
                  >
                    {item.value}
                  </span>
                    </div>
                  ))}
              </div>
            </div>

            {financial.breakdown
              .filter((item) => item.label === "Net Earnings")
              .map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 border-t border-[#ddd6cf] px-5 py-4"
                >
                  <span className="text-[15px] font-bold text-[#18120f]">{item.label}</span>
                  <span className="text-[16px] font-extrabold text-[#57b332]">{item.value}</span>
                </div>
              ))}
          </article>
        </div>
      </div>
    </section>
  );
}
