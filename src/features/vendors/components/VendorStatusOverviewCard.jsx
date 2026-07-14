export default function VendorStatusOverviewCard() {
  const data = [
    { label: "Active", count: 198, percentage: "77.3%", color: "#48c774" },
    { label: "Pending", count: 28, percentage: "10.9%", color: "#ffb020" },
    { label: "Suspended", count: 12, percentage: "4.7%", color: "#d0021b" },
    { label: "Rejected", count: 18, percentage: "7.0%", color: "#d1d5db" },
  ];

  // Donut chart stroke math
  // Radius = 36, Circumference = 2 * PI * 36 = 226.19
  const circumference = 226.19;
  const slices = [
    { pct: 0.773, color: "#48c774" },
    { pct: 0.109, color: "#ffb020" },
    { pct: 0.047, color: "#d0021b" },
    { pct: 0.071, color: "#d1d5db" },
  ];

  let accumulatedPercent = 0;

  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] h-full">
      <h3 className="text-[18px] font-bold text-[#18120f] mb-6">Vendor Status Overview</h3>

      {/* Grid: Donut Left, Legend Right */}
      <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
        
        {/* SVG Donut */}
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            {/* Background Track Circle */}
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="transparent"
              stroke="#f3ede8"
              strokeWidth="9"
            />
            {/* Slices */}
            {slices.map((slice, idx) => {
              // Subtract 3.5 pixels from each slice stroke length to create crisp gaps
              const strokeLength = slice.pct * circumference - 3.5;
              const strokeOffset = circumference - accumulatedPercent * circumference;
              accumulatedPercent += slice.pct;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r="36"
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="9"
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
          </svg>
          {/* Centered Labels */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[18px] font-extrabold text-[#18120f] leading-none">256</span>
            <span className="text-[9px] font-bold text-[#8c8077] uppercase tracking-wider mt-1.5">Total Vendors</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3.5 w-full">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0 mt-1"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-[#1f1711] leading-none">{item.label}</span>
                <span className="text-[11px] font-semibold text-[#8c8077] mt-1 leading-none">
                  {item.count} ({item.percentage})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
