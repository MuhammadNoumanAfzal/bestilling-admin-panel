import { useState } from "react";

export default function ReportsBarChart({
  bars = [],
  scale = [],
  valuePrefix = "",
  valueType = "number",
  className = "",
}) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const safeBars = Array.isArray(bars)
    ? bars.map((item, index) => ({
        label: item?.label || `Item ${index + 1}`,
        value: Math.max(0, Number(item?.value) || 0),
      }))
    : [];
  const normalizedScale = Array.isArray(scale)
    ? scale
        .map((item) => Number(item) || 0)
        .filter((item, index, values) => Number.isFinite(item) && values.indexOf(item) === index)
        .sort((left, right) => left - right)
    : [];
  const safeScale =
    normalizedScale.length > 1
      ? normalizedScale
      : [0, 1, 2, 3, 4].map((step) => {
          const maxBarValue = Math.max(...safeBars.map((item) => item.value), 0);
          const tickStep = maxBarValue > 0 ? Math.ceil(maxBarValue / 4) : 1;
          return step * tickStep;
        });
  const maxValue = Math.max(...safeScale, ...safeBars.map((item) => item.value), 1);
  const ticks = [...safeScale].reverse();
  const chartHeight = 190;
  const chartWidth = Math.max(safeBars.length * 44, 280);
  const barCount = Math.max(safeBars.length, 1);
  const barWidth = Math.min(28, Math.max(18, Math.floor(chartWidth / (barCount * 2.2))));
  const stepX = chartWidth / barCount;

  function formatAxisValue(value) {
    const compactValue = new Intl.NumberFormat("en-NO", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

    return valueType === "currency" ? `NOK ${compactValue}` : `${valuePrefix}${compactValue}`;
  }

  function formatTooltipValue(value) {
    if (valueType === "currency") {
      return `NOK ${new Intl.NumberFormat("en-NO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)}`;
    }

    return `${valuePrefix}${new Intl.NumberFormat("en-NO", {
      maximumFractionDigits: 0,
    }).format(value)}`;
  }

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
    <div className={["h-[236px] min-w-0", className].join(" ")}>
      {safeBars.length === 0 ? (
        <div className="flex h-full items-center justify-center rounded-[14px] border border-dashed border-[#e3d7cf] bg-[#fffdfa] px-4 text-center text-[13px] font-medium text-[#7a6d66]">
          No chart data is available for the selected period.
        </div>
      ) : (
      <div className="flex h-full gap-3">
        <div className="flex h-[190px] w-[58px] shrink-0 flex-col justify-between pt-1">
          {ticks.map((tick) => (
            <span key={tick} className="truncate text-[10px] font-medium leading-none text-[#7a6e67]" title={formatTooltipValue(tick)}>
              {formatAxisValue(tick)}
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

              {safeBars.map((bar, index) => {
                const barHeight = Math.max((bar.value / maxValue) * (chartHeight - 8), 16);
                const x = stepX * index + (stepX - barWidth) / 2;
                const y = chartHeight - barHeight;
                const path = buildBarPath(x, y, barWidth, barHeight, 10);

                return (
                  <path
                    key={bar.label}
                    d={path}
                    fill={hoveredBar?.index === index ? "#b95227" : "#d46a37"}
                    onMouseEnter={() => setHoveredBar({ bar, index, x: x + barWidth / 2, y })}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="cursor-pointer transition-[fill] duration-150"
                  />
                );
              })}
            </svg>
            {hoveredBar ? (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-[10px] border border-[#e1cbbd] bg-[#241812] px-3 py-2 text-center shadow-[0_10px_24px_rgba(38,21,12,0.22)]"
                style={{
                  left: `${(hoveredBar.x / chartWidth) * 100}%`,
                  top: `${Math.max(6, hoveredBar.y - 50)}px`,
                }}
              >
                <p className="text-[10px] font-semibold text-[#f2d6c5]">{hoveredBar.bar.label}</p>
                <p className="mt-0.5 whitespace-nowrap text-[12px] font-bold text-white">
                  {formatTooltipValue(hoveredBar.bar.value)}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex min-w-0 gap-4 pt-2">
            {safeBars.map((bar) => (
              <div key={bar.label} className="flex min-w-0 flex-1 justify-center">
                <span className="truncate text-[10px] font-semibold text-[#5c5048]">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
