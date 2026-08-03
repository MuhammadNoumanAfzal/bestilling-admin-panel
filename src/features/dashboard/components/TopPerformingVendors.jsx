import { Star } from "lucide-react";

function formatRevenue(value) {
  return `NOK ${Number(value ?? 0).toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export default function TopPerformingVendors({ vendors = [] }) {
  return (
    <article className="mt-3 rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <h2 className="mb-4 text-[18px] font-bold text-[#18120f]">Top Performing Vendors</h2>

      <div className="space-y-3">
        {vendors.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-[#e5dad2] px-4 py-8 text-center text-[14px] text-[#6f645d]">
            No vendor performance data available yet.
          </div>
        ) : (
          vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="rounded-[10px] border border-[#f1e9e2] bg-[#fcfbfa] p-3 transition hover:border-[#cf6e38]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {vendor.avatarUrl ? (
                    <img
                      src={vendor.avatarUrl}
                      alt={vendor.name}
                      className="h-10 w-10 rounded-full border border-[#eee4dd] object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6eee8] text-[10px] font-bold text-[#2f241d]">
                      {vendor.avatar}
                    </div>
                  )}
                  <div>
                    <span className="block text-[15px] font-bold text-[#18120f]">{vendor.name}</span>
                    <span className="block text-[12px] text-[#6f645d]">
                      {vendor.totalOrders} orders
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 rounded-full border border-[#fae2a0] bg-[#fffcf0] px-2 py-0.5 text-[12px] font-bold text-[#b58c09]">
                  <Star size={10} fill="#b58c09" stroke="none" />
                  <span>{vendor.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[12px] text-[#6f645d]">
                <span>Revenue: <strong className="text-[#18120f]">{formatRevenue(vendor.totalRevenue)}</strong></span>
                <span>Completion: <strong className="text-[#18120f]">{vendor.completionRate}%</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
