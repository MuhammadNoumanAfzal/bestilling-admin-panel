export default function ReportsBarChart({
  bars,
  scale,
  valuePrefix = "",
  className = "",
}) {
  const maxValue = Math.max(...scale, ...bars.map((item) => item.value), 1);
  const ticks = [...scale].reverse();
  const chartHeight = 190;
  const chartWidth = Math.max(bars.length * 44, 280);
  const barWidth = Math.min(28, Math.max(18, Math.floor(chartWidth / (bars.length * 2.2))));
  const stepX = chartWidth / bars.length;

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
    <div className={["h-[220px] min-w-0", className].join(" ")}>
      <div className="flex h-full gap-3">
        <div className="flex h-[190px] w-[46px] shrink-0 flex-col justify-between pt-1">
          {ticks.map((tick) => (
            <span key={tick} className="text-[10px] font-medium leading-none text-[#7a6e67]">
              {valuePrefix}
              {tick}
            </span>
          ))}
        </div>

        <div className="grid min-w-0 flex-1 grid-rows-[190px_auto]">
          <div className="relative h-[190px] overflow-hidden rounded-[12px]">
            <svg
              aria-hidden="true"
              className="h-full w-full"
              preserveAspectRatio="none"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            >
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

              {bars.map((bar, index) => {
                const barHeight = Math.max((bar.value / maxValue) * (chartHeight - 8), 16);
                const x = stepX * index + (stepX - barWidth) / 2;
                const y = chartHeight - barHeight;
                const path = buildBarPath(x, y, barWidth, barHeight, 10);

                return (
                  <path
                    key={bar.label}
                    d={path}
                    fill="#d46a37"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex min-w-0 gap-4 pt-2">
            {bars.map((bar) => (
              <div key={bar.label} className="flex min-w-0 flex-1 justify-center">
                <span className="truncate text-[10px] font-semibold text-[#5c5048]">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
