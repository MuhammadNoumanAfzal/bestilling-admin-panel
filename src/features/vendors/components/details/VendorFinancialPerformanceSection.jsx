function RevenueChart({ series }) {
  const maxValue = Math.max(...series.map((item) => item.value), 1);
  const chartHeight = 180;
  const chartWidth = 360;
  const ticks = [10000, 7500, 5000, 2500, 0];

  function buildBarPath(x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height);
    const right = x + width;
    const bottom = y + height;

    return [
      `M ${x} ${bottom}`,
      `L ${x} ${y + safeRadius}`,
      `Q ${x} ${y} ${x + safeRadius} ${y}`,
      `L ${right - safeRadius} ${y}`,
      `Q ${right} ${y} ${right} ${y + safeRadius}`,
      `L ${right} ${bottom}`,
      "Z",
    ].join(" ");
  }

  return (
    <div className="grid grid-cols-[42px_minmax(0,1fr)] gap-3">
      <div className="flex h-[180px] flex-col justify-between">
        {ticks.map((tick) => (
          <span key={tick} className="text-[10px] font-medium text-[#7a6e67]">
            ${tick}
          </span>
        ))}
      </div>
      <div className="grid grid-rows-[180px_auto]">
        <svg aria-hidden="true" className="h-[180px] w-full" preserveAspectRatio="none" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {ticks.map((tick, index) => {
            const y = (chartHeight / (ticks.length - 1)) * index;
            return (
              <line
                key={tick}
                stroke="#e4dbd4"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1="0"
                x2={chartWidth}
                y1={y}
                y2={y}
              />
            );
          })}
          {series.map((item, index) => {
            const step = chartWidth / series.length;
            const width = 32;
            const height = Math.max((item.value / maxValue) * (chartHeight - 10), 16);
            const x = step * index + (step - width) / 2;
            const y = chartHeight - height;
            return <path key={item.label} d={buildBarPath(x, y, width, height, 10)} fill="#d46a37" />;
          })}
        </svg>
        <div className="flex gap-3 pt-2">
          {series.map((item) => (
            <div key={item.label} className="flex flex-1 justify-center">
              <span className="text-[10px] font-semibold text-[#5c5048]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VendorFinancialPerformanceSection({ financial }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="h-5 w-[3px] rounded-full bg-[#d96834]" />
        <h2 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">
          Financial Performance
        </h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
        <article className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[18px] font-extrabold text-[#18120f]">{financial.chartTitle}</h3>
              <p className="text-[12px] text-[#8a7f76]">{financial.chartSubtitle}</p>
            </div>
            <span className="rounded-full border border-[#e4d7ce] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#5f534b]">
              {financial.filterLabel}
            </span>
          </div>
          <RevenueChart series={financial.revenueSeries} />
        </article>

        <div className="space-y-4">
          <article className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8c8077]">Pending Payout</p>
            <p className="mt-2 text-[30px] font-extrabold leading-none tracking-[-0.04em] text-[#18120f]">
              {financial.pendingPayout}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-[#fff0e7] px-2.5 py-1 text-[10px] font-bold text-[#cf6e38]">
              {financial.payoutStatus}
            </span>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#8c8077]">Est. Payout</p>
                <p className="mt-1 text-[12px] font-bold text-[#1f1711]">{financial.estimatedPayout}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#8c8077]">Last Payout</p>
                <p className="mt-1 text-[12px] font-bold text-[#1f1711]">{financial.lastPayout}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
            <h3 className="text-[16px] font-extrabold text-[#18120f]">Financial Breakdown</h3>
            <div className="mt-4 space-y-3">
              {financial.breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-medium text-[#8a7f76]">{item.label}</span>
                  <span
                    className={[
                      "text-[12px] font-bold",
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
          </article>
        </div>
      </div>
    </section>
  );
}
