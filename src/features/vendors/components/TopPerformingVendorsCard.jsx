import { topPerformingVendors } from "../data/vendorsData.js";

export default function TopPerformingVendorsCard() {
  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] flex flex-col justify-between h-full">
      <div>
        <header className="mb-4 flex items-center justify-between border-b border-[#eee4dd] pb-3">
          <h3 className="text-[18px] font-bold text-[#18120f]">Top Performing Vendors</h3>
        </header>

        {/* Top 5 list */}
        <div className="space-y-4">
          {topPerformingVendors.map((vendor, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[14px] font-bold text-[#cf6432] w-4 shrink-0">
                  {idx + 1}
                </span>
                {vendor.avatarUrl ? (
                  <img
                    src={vendor.avatarUrl}
                    alt={vendor.name}
                    className="h-9 w-9 rounded-full object-cover border border-[#eee4dd] shrink-0"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6eee8] text-[11px] font-bold text-[#2f241d] shrink-0">
                    {vendor.avatar}
                  </div>
                )}
                <span className="truncate text-[14px] font-bold text-[#18120f]">
                  {vendor.name}
                </span>
              </div>
              <span className="text-[14px] font-bold text-[#18120f] shrink-0">
                {vendor.revenue}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => alert("Viewing all top performing vendors")}
        className="mt-6 w-full text-center text-[12px] font-bold text-[#cf6e38] hover:underline cursor-pointer outline-none"
        type="button"
      >
        View All
      </button>
    </article>
  );
}
