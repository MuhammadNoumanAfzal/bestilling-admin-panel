import { useState, useMemo } from "react";
import { chartAnalyticsData } from "../data/dashboardData.js";

export default function RevenueAnalyticsChart() {
  const [activeTab, setActiveTab] = useState("revenue"); // "revenue" | "orders"
  const [timeframe, setTimeframe] = useState("Last 7 days"); // "Last 7 days" | "Last Month"
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = useMemo(() => {
    return chartAnalyticsData[timeframe] || chartAnalyticsData["Last 7 days"];
  }, [timeframe]);

  // Calculate maximum value to scale the chart
  const maxValue = useMemo(() => {
    const values = data.map((d) => (activeTab === "revenue" ? d.revenue : d.orders));
    const max = Math.max(...values, 100);
    // Round up to a clean multiple
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    const roundedMax = Math.ceil(max / (magnitude / 2)) * (magnitude / 2);
    return roundedMax;
  }, [data, activeTab]);

  const yTicks = useMemo(() => {
    return [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue];
  }, [maxValue]);

  const formatValue = (val) => {
    if (activeTab === "revenue") {
      return val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val;
    }
    return val;
  };

  const getFullValueText = (val) => {
    if (activeTab === "revenue") {
      return `NOK ${val.toLocaleString()}`;
    }
    return `${val} Orders`;
  };

  // Dimensions for SVG
  const svgWidth = 600;
  const svgHeight = 280;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  return (
    <div className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      {/* Header controls */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h2 className="text-[18px] font-bold text-[#1f1711]">Revenue & Order Analytics</h2>
          <p className="text-[13px] leading-5 text-[#6f655e]">
            {timeframe === "Last 7 days"
              ? "Daily performance data for the last 7 days"
              : "Weekly performance data for the last month"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Revenue / Orders Toggle */}
          <div className="inline-flex rounded-full bg-[#f4f1ee] p-1">
            <button
              onClick={() => setActiveTab("revenue")}
              className={`rounded-full px-4 py-1.5 text-[12px] font-bold transition-all cursor-pointer ${
                activeTab === "revenue"
                  ? "bg-[#d96834] text-white shadow-sm"
                  : "text-[#6f655e] hover:text-[#1f1711]"
              }`}
              type="button"
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`rounded-full px-4 py-1.5 text-[12px] font-bold transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#d96834] text-white shadow-sm"
                  : "text-[#6f655e] hover:text-[#1f1711]"
              }`}
              type="button"
            >
              Orders
            </button>
          </div>

          {/* Timeframe Select */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-[8px] border border-[#d8ccc2] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#4d423b] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)] cursor-pointer"
          >
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last Month">Last Month</option>
          </select>
        </div>
      </div>

      {/* SVG Chart area */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
        >
          {/* Horizontal Gridlines */}
          {yTicks.map((tick, index) => {
            const y = paddingTop + chartHeight - (tick / maxValue) * chartHeight;
            return (
              <g key={tick} className="opacity-60">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#eee4dd"
                  strokeWidth="1"
                  strokeDasharray={index === 0 ? "0" : "4 4"}
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[#9a8f86] text-[11px] font-bold"
                >
                  {formatValue(tick)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, index) => {
            const val = activeTab === "revenue" ? item.revenue : item.orders;
            const barWidth = Math.min(32, chartWidth / data.length - 20);
            const x =
              paddingLeft +
              (index * chartWidth) / data.length +
              (chartWidth / data.length - barWidth) / 2;
            const barHeight = (val / maxValue) * chartHeight;
            const y = paddingTop + chartHeight - barHeight;

            // Define custom path for rounded top corners only
            const r = Math.min(6, barHeight); // radius
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
                {/* Visual Bar */}
                {barHeight > 0 && (
                  <path
                    d={pathData}
                    fill={isHovered ? "#b75424" : "#d96834"}
                    className="transition-all duration-200"
                  />
                )}

                {/* X-Axis Label */}
                <text
                  x={x + barWidth / 2}
                  y={svgHeight - paddingBottom + 20}
                  textAnchor="middle"
                  className={`text-[12px] font-semibold transition-colors duration-200 ${
                    isHovered ? "fill-[#d96834] font-bold" : "fill-[#6f655e]"
                  }`}
                >
                  {item.label}
                </text>

                {/* Invisible Hover Catcher Box (for easier mouse interactions) */}
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

          {/* X Axis Baseline */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={svgWidth - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="#d8ccc2"
            strokeWidth="1.5"
          />
        </svg>

        {/* Floating Tooltip Box */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-10 rounded-[8px] border border-[#d8ccc2] bg-white px-3 py-2 text-[12px] font-bold text-[#1f1711] shadow-[0_4px_12px_rgba(53,34,20,0.12)] pointer-events-none transition-all duration-150"
            style={{
              left: `${
                paddingLeft +
                (hoveredIndex * chartWidth) / data.length +
                chartWidth / data.length / 2
              }px`,
              top: `${
                paddingTop +
                chartHeight -
                ((activeTab === "revenue"
                  ? data[hoveredIndex].revenue
                  : data[hoveredIndex].orders) /
                  maxValue) *
                  chartHeight -
                15
              }px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-[#9a8f86]">
                {data[hoveredIndex].label}
              </p>
              <p className="mt-0.5 text-[#d96834]">
                {getFullValueText(
                  activeTab === "revenue"
                    ? data[hoveredIndex].revenue
                    : data[hoveredIndex].orders
                )}
              </p>
            </div>
            {/* Small arrow */}
            <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-[#d8ccc2] bg-white"></div>
          </div>
        )}
      </div>
    </div>
  );
}
