import { useEffect, useMemo, useState } from "react";

function formatMetricValue(metric, value) {
  if (metric === "REVENUE") {
    return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`;
  }

  return `${value}`;
}

function getMetricLabel(metric, value) {
  if (metric === "REVENUE") {
    return `NOK ${value.toLocaleString("en-GB")}`;
  }

  return `${value.toLocaleString("en-GB")} orders`;
}

export default function RevenueAnalyticsChart({ timeframe, chart, isLoading = false }) {
  const metricOptions = Array.isArray(chart?.metricOptions) ? chart.metricOptions : ["REVENUE", "ORDERS"];
  const [activeMetric, setActiveMetric] = useState(chart?.defaultMetric || "REVENUE");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    setActiveMetric(chart?.defaultMetric || "REVENUE");
  }, [chart?.defaultMetric]);

  const points = useMemo(() => (Array.isArray(chart?.points) ? chart.points : []), [chart?.points]);

  const maxValue = useMemo(() => {
    const values = points.map((item) => (activeMetric === "ORDERS" ? item.orders : item.revenue));
    const max = Math.max(...values, 100);
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    return Math.ceil(max / (magnitude / 2)) * (magnitude / 2);
  }, [activeMetric, points]);

  const yTicks = useMemo(() => [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue], [maxValue]);

  const svgWidth = 600;
  const svgHeight = 280;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  return (
    <div className="flex h-full flex-col rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h2 className="text-[18px] font-bold text-[#1f1711]">Revenue & Order Analytics</h2>
          <p className="text-[13px] leading-5 text-[#6f655e]">
            {timeframe === "Last 7 days"
              ? "Daily platform performance for the last 7 days."
              : `Performance metrics for ${timeframe.toLowerCase()}.`}
          </p>
        </div>

        <div className="inline-flex self-start rounded-full bg-[#f4f1ee] p-1 sm:self-auto">
          {metricOptions.map((metric) => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={`rounded-full px-4 py-1.5 text-[12px] font-bold transition-all ${
                activeMetric === metric
                  ? "bg-[#d96834] text-white shadow-sm"
                  : "text-[#6f655e] hover:text-[#1f1711]"
              }`}
              type="button"
            >
              {metric === "ORDERS" ? "Orders" : "Revenue"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[280px] items-center justify-center text-[15px] font-medium text-[#6f645d]">
          Loading analytics...
        </div>
      ) : points.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center rounded-[14px] border border-dashed border-[#e5dad2] text-[15px] font-medium text-[#6f645d]">
          No analytics data available for this time range.
        </div>
      ) : (
        <div className="relative w-full flex-1 overflow-hidden">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="h-auto w-full select-none">
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
                    {formatMetricValue(activeMetric, Number(tick))}
                  </text>
                </g>
              );
            })}

            {points.map((item, index) => {
              const value = activeMetric === "ORDERS" ? item.orders : item.revenue;
              const barWidth = Math.min(32, chartWidth / points.length - 20);
              const x =
                paddingLeft +
                (index * chartWidth) / points.length +
                (chartWidth / points.length - barWidth) / 2;
              const barHeight = (value / maxValue) * chartHeight;
              const y = paddingTop + chartHeight - barHeight;
              const radius = Math.min(6, barHeight);
              const isHovered = hoveredIndex === index;
              const pathData =
                barHeight > 0
                  ? `M ${x} ${y + barHeight}
                     L ${x} ${y + radius}
                     A ${radius} ${radius} 0 0 1 ${x + radius} ${y}
                     L ${x + barWidth - radius} ${y}
                     A ${radius} ${radius} 0 0 1 ${x + barWidth} ${y + radius}
                     L ${x + barWidth} ${y + barHeight}
                     Z`
                  : "";

              return (
                <g
                  key={`${item.label}-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {barHeight > 0 ? (
                    <path
                      d={pathData}
                      fill={isHovered ? "#b75424" : "#d96834"}
                      className="transition-all duration-200"
                    />
                  ) : null}

                  <text
                    x={x + barWidth / 2}
                    y={svgHeight - paddingBottom + 20}
                    textAnchor="middle"
                    className={`text-[12px] font-semibold transition-colors duration-200 ${
                      isHovered ? "fill-[#d96834]" : "fill-[#6f655e]"
                    }`}
                  >
                    {item.label}
                  </text>

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

            <line
              x1={paddingLeft}
              y1={paddingTop + chartHeight}
              x2={svgWidth - paddingRight}
              y2={paddingTop + chartHeight}
              stroke="#d8ccc2"
              strokeWidth="1.5"
            />
          </svg>

          {hoveredIndex !== null ? (
            <div
              className="pointer-events-none absolute z-10 rounded-[8px] border border-[#d8ccc2] bg-white px-3 py-2 text-[12px] font-bold text-[#1f1711] shadow-[0_4px_12px_rgba(53,34,20,0.12)]"
              style={{
                left: `${
                  paddingLeft +
                  (hoveredIndex * chartWidth) / points.length +
                  chartWidth / points.length / 2
                }px`,
                top: `${
                  paddingTop +
                  chartHeight -
                  ((activeMetric === "ORDERS" ? points[hoveredIndex].orders : points[hoveredIndex].revenue) /
                    maxValue) *
                    chartHeight -
                  15
                }px`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-[#9a8f86]">
                  {points[hoveredIndex].label}
                </p>
                <p className="mt-0.5 text-[#d96834]">
                  {getMetricLabel(
                    activeMetric,
                    activeMetric === "ORDERS"
                      ? points[hoveredIndex].orders
                      : points[hoveredIndex].revenue,
                  )}
                </p>
              </div>
              <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-[#d8ccc2] bg-white"></div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
