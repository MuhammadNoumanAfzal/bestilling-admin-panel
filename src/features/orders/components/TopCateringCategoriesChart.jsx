import { useState } from "react";
import { cateringCategories } from "../data/ordersData.js";

export default function TopCateringCategoriesChart() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // SVG parameters
  const svgWidth = 500;
  const svgHeight = 280;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const maxVal = 50; // Max Y-axis value is 50%

  const ticks = [0, 10, 20, 30, 40, 50];

  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] w-full">
      <h2 className="text-[18px] font-bold text-[#18120f] mb-4">Top Catering Categories</h2>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
          {/* Grid lines and Y-axis Labels */}
          {ticks.map((tick) => {
            const y = paddingTop + chartHeight - (tick / maxVal) * chartHeight;
            return (
              <g key={tick} className="opacity-60">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#eee4dd"
                  strokeWidth="1"
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

          {/* Bar elements */}
          {cateringCategories.map((item, index) => {
            const barWidth = 32;
            const x =
              paddingLeft +
              (index * chartWidth) / cateringCategories.length +
              (chartWidth / cateringCategories.length - barWidth) / 2;
            const barHeight = (item.percentage / maxVal) * chartHeight;
            const y = paddingTop + chartHeight - barHeight;

            // Generate path for rounded top corners
            const r = Math.min(6, barHeight);
            const pathData =
              barHeight > 0
                ? `M ${x} ${y + barHeight} 
                   L ${x} ${y + r} 
                   A ${r} ${r} 0 0 1 ${x + r} ${y} 
                   L ${x + barWidth - r} ${y} 
                   A ${r} ${r} 0 0 1 ${x + barWidth} ${y + r} 
                   L ${x + barWidth} ${y + barHeight} 
                   Z`
                : "";

            const isHovered = hoveredIndex === index;

            return (
              <g
                key={item.label}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {barHeight > 0 && (
                  <path
                    d={pathData}
                    fill={isHovered ? "#b75424" : "#cf6432"}
                    className="transition-all duration-200"
                  />
                )}

                {/* X Axis Label */}
                <text
                  x={x + barWidth / 2}
                  y={svgHeight - paddingBottom + 18}
                  textAnchor="middle"
                  className={`text-[11px] sm:text-[12px] font-semibold transition-colors duration-200 ${
                    isHovered ? "fill-[#cf6432] font-bold" : "fill-[#6f655e]"
                  }`}
                >
                  {item.label}
                </text>

                {/* Hover catcher */}
                <rect
                  x={x - 10}
                  y={paddingTop}
                  width={barWidth + 20}
                  height={chartHeight + 10}
                  fill="transparent"
                />
              </g>
            );
          })}

          {/* Baseline */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={svgWidth - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="#d8ccc2"
            strokeWidth="1.5"
          />
        </svg>

        {/* Float Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-10 rounded-[8px] border border-[#d8ccc2] bg-white px-3 py-1.5 text-[12px] font-bold text-[#1f1711] shadow-[0_4px_12px_rgba(53,34,20,0.12)] pointer-events-none transition-all duration-150"
            style={{
              left: `${
                paddingLeft +
                (hoveredIndex * chartWidth) / cateringCategories.length +
                chartWidth / cateringCategories.length / 2
              }px`,
              top: `${
                paddingTop +
                chartHeight -
                (cateringCategories[hoveredIndex].percentage / maxVal) * chartHeight -
                15
              }px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-[#9a8f86]">
                {cateringCategories[hoveredIndex].label}
              </p>
              <p className="mt-0.5 text-[#cf6432]">
                {cateringCategories[hoveredIndex].percentage}% Share
              </p>
            </div>
            <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-[#d8ccc2] bg-white"></div>
          </div>
        )}
      </div>
    </article>
  );
}
