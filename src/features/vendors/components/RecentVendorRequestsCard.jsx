function getRelativeTimeLabel(dateValue) {
  const joinedDate = new Date(`${dateValue}T00:00:00`);
  const now = new Date("2026-07-23T00:00:00");
  const diffInDays = Math.max(0, Math.round((now - joinedDate) / (1000 * 60 * 60 * 24)));

  if (diffInDays === 0) {
    return "Today";
  }

  if (diffInDays === 1) {
    return "1 day ago";
  }

  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }

  const diffInMonths = Math.max(1, Math.round(diffInDays / 30));
  return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
}

export default function RecentVendorRequestsCard({ vendors = [] }) {
  const recentVendorRequests = vendors
    .filter((vendor) => vendor.status === "Pending Approval")
    .sort((left, right) => new Date(right.joinDateValue) - new Date(left.joinDateValue))
    .slice(0, 5)
    .map((vendor) => ({
      ...vendor,
      time: getRelativeTimeLabel(vendor.joinDateValue),
      status: "Pending",
    }));

  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] flex flex-col justify-between h-full">
      <div>
        <header className="mb-4 flex items-center justify-between border-b border-[#eee4dd] pb-3">
          <h3 className="text-[18px] font-bold text-[#18120f]">Recent Vendor Requests</h3>
        </header>

        {recentVendorRequests.length > 0 ? (
          <div className="space-y-4">
            {recentVendorRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between gap-3">
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

                <div className="text-right shrink-0">
                  <p className="text-[11px] text-[#8a7f76] font-semibold">{req.time}</p>
                  <span className="inline-block mt-0.5 rounded-[4px] bg-[#fff0e7] px-1.5 py-0.5 text-[9px] font-extrabold text-[#cf6e38] uppercase tracking-wider">
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-[14px] font-medium text-[#6f645d]">
            No pending requests match the current filters.
          </p>
        )}
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
