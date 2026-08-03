import { useState } from "react";

export default function TopCateringCategoriesChart({ items, isLoading = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const chartItems = Array.isArray(items) ? items : [];
  const maxVal = Math.max(10, ...chartItems.map((item) => Number(item.percentage ?? 0)));
  const ticks = [0, 25, 50, 75, 100].filter((tick) => tick <= Math.max(100, Math.ceil(maxVal)));
  const svgWidth = 700;
  const svgHeight = 300;
  const paddingLeft = 46;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 56;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[#18120f]">Order Category Breakdown</h2>
          <p className="text-[13px] text-[#7a6d66]">
            Revenue share across catering categories for the selected period.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[260px] items-center justify-center text-[15px] font-medium text-[#6f645d]">
          Loading chart...
        </div>
      ) : chartItems.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center rounded-[14px] border border-dashed border-[#e5dad2] text-[15px] font-medium text-[#6f645d]">
          No category data available for this filter set.
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="h-auto w-full select-none">
            {ticks.map((tick) => {
              const y = paddingTop + chartHeight - (tick / 100) * chartHeight;

              return (
                <g key={tick}>
                  <line
                    x1={paddingLeft}
                    x2={svgWidth - paddingRight}
                    y1={y}
                    y2={y}
                    stroke="#eee4dd"
                    strokeDasharray={tick === 0 ? "0" : "4 4"}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-[#9a8f86] text-[11px] font-bold"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            {chartItems.map((item, index) => {
              const segmentWidth = chartWidth / chartItems.length;
              const barWidth = Math.min(48, segmentWidth - 20);
              const x = paddingLeft + index * segmentWidth + (segmentWidth - barWidth) / 2;
              const barHeight = (Number(item.percentage ?? 0) / 100) * chartHeight;
              const y = paddingTop + chartHeight - barHeight;
              const isHovered = hoveredIndex === index;

              return (
                <g
                  key={`${item.label}-${index}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="10"
                    fill={isHovered ? "#b75424" : "#cf6432"}
                  />

                  <text
                    x={x + barWidth / 2}
                    y={svgHeight - paddingBottom + 20}
                    textAnchor="middle"
                    className="fill-[#6f655e] text-[11px] font-semibold"
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}

            <line
              x1={paddingLeft}
              x2={svgWidth - paddingRight}
              y1={paddingTop + chartHeight}
              y2={paddingTop + chartHeight}
              stroke="#d8ccc2"
              strokeWidth="1.5"
            />
          </svg>

          {hoveredIndex !== null ? (
            <div
              className="pointer-events-none absolute z-10 rounded-[10px] border border-[#d8ccc2] bg-white px-3 py-2 text-[12px] shadow-[0_4px_12px_rgba(53,34,20,0.12)]"
              style={{
                left: `${
                  paddingLeft + ((hoveredIndex + 0.5) * chartWidth) / chartItems.length
                }px`,
                top: "24px",
                transform: "translateX(-50%)",
              }}
            >
              <p className="font-bold text-[#18120f]">{chartItems[hoveredIndex].label}</p>
              <p className="mt-0.5 text-[#cf6432]">
                {Number(chartItems[hoveredIndex].percentage ?? 0).toFixed(1)}% share
              </p>
              <p className="mt-0.5 text-[#7a6d66]">
                {chartItems[hoveredIndex].orderCount} orders
              </p>
              <p className="mt-0.5 text-[#7a6d66]">{chartItems[hoveredIndex].revenue}</p>
            </div>
          ) : null}
        </div>
      )}
    </article>
  );
}
