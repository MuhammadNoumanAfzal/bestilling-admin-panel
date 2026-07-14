import { recentVendorRequests } from "../data/vendorsData.js";

export default function RecentVendorRequestsCard() {
  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] flex flex-col justify-between h-full">
      <div>
        <header className="mb-4 flex items-center justify-between border-b border-[#eee4dd] pb-3">
          <h3 className="text-[18px] font-bold text-[#18120f]">Recent Vendor Requests</h3>
        </header>

        {/* Requests list */}
        <div className="space-y-4">
          {recentVendorRequests.map((req, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {req.avatarUrl ? (
                  <img
                    src={req.avatarUrl}
                    alt={req.name}
                    className="h-9 w-9 rounded-full object-cover border border-[#eee4dd] shrink-0"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6eee8] text-[11px] font-bold text-[#2f241d] shrink-0">
                    {req.avatar}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold text-[#18120f]">{req.name}</p>
                  <p className="truncate text-[11px] text-[#6f645d]">{req.city}</p>
                </div>
              </div>

              {/* Time & Pending badge */}
              <div className="text-right shrink-0">
                <p className="text-[11px] text-[#8a7f76] font-semibold">{req.time}</p>
                <span className="inline-block mt-0.5 rounded-[4px] bg-[#fff0e7] px-1.5 py-0.5 text-[9px] font-extrabold text-[#cf6e38] uppercase tracking-wider">
                  {req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => alert("Redirecting to vendor onboarding requests page")}
        className="mt-6 w-full text-center text-[12px] font-bold text-[#cf6e38] hover:underline cursor-pointer flex items-center justify-center gap-1 outline-none"
        type="button"
      >
        View All Request
        <span className="text-[14px]">&rarr;</span>
      </button>
    </article>
  );
}
