const statusConfig = [
  { key: "Active", label: "Active", color: "#59c779" },
  { key: "Pending Approval", label: "Pending", color: "#f3b433" },
  { key: "Suspended", label: "Suspended", color: "#d81616" },
  { key: "Rejected", label: "Rejected", color: "#d7dde5" },
];

function buildDonutGradient(items) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  if (!total) {
    return "conic-gradient(#edf0f4 0% 100%)";
  }

  let runningShare = 0;
  const stops = items.map((item) => {
    const start = runningShare;
    runningShare += (item.count / total) * 100;
    return `${item.color} ${start}% ${runningShare}%`;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

export default function VendorStatusOverviewCard({ vendors = [] }) {
  const totalVendors = vendors.length;
  const overviewItems = statusConfig.map((status) => {
    const count = vendors.filter((vendor) => vendor.status === status.key).length;
    const percentage = totalVendors > 0 ? ((count / totalVendors) * 100).toFixed(1) : "0.0";

    return {
      ...status,
      count,
      percentage,
    };
  });

  const donutBackground = buildDonutGradient(overviewItems);

  return (
    <article className="self-start rounded-[14px] border border-[#ddd6cf] bg-white p-3.5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <h3 className="mb-3 text-[16px] font-bold tracking-[-0.03em] text-[#18120f]">
        Vendor Status Overview
      </h3>

      <div className="flex items-center gap-4">
        <div className="relative h-[104px] w-[104px] shrink-0">
          <div
            className="h-full w-full rounded-full"
            style={{ background: donutBackground }}
          />
          <div className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full bg-white">
            <span className="text-[22px] font-extrabold leading-none tracking-[-0.04em] text-[#17110d]">
              {totalVendors}
            </span>
            <span className="mt-1 text-[9px] font-medium text-[#8c8077]">
              Total Vendors
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2.5">
          {overviewItems.map((item) => (
            <div key={item.key} className="flex items-start gap-2.5">
              <span
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0">
                <p className="text-[11px] font-bold leading-none text-[#1f1711]">
                  {item.label}
                </p>
                <p className="mt-1 text-[10px] font-medium leading-none text-[#8c8077]">
                  {item.count} ({item.percentage}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
