import { Star } from "lucide-react";
import { topPerformingVendors } from "../data/dashboardData.js";

export default function TopPerformingVendors() {
  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] mt-3">
      <h2 className="text-[18px] font-bold text-[#18120f] mb-4">Top Performing Vendors</h2>

      <div className="space-y-3">
        {topPerformingVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="flex items-center justify-between rounded-[10px] border border-[#f1e9e2] bg-[#fcfbfa] p-2.5 transition hover:border-[#cf6e38] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {vendor.avatarUrl ? (
                <img
                  src={vendor.avatarUrl}
                  alt={vendor.name}
                  className="h-10 w-10 rounded-full object-cover border border-[#eee4dd]"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6eee8] text-[10px] font-bold text-[#2f241d]">
                  {vendor.avatar}
                </div>
              )}
              <span className="text-[15px] font-bold text-[#18120f]">{vendor.name}</span>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-[#fffcf0] border border-[#fae2a0] px-2 py-0.5 text-[12px] font-bold text-[#b58c09]">
              <Star size={10} fill="#b58c09" stroke="none" />
              <span>{vendor.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
