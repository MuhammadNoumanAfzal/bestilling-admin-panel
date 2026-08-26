import { ArrowUpRight, Store, Star } from "lucide-react";

function displayValue(value, fallback = "Not available") {
  if (value === null || value === undefined) {
    return fallback;
  }

  const normalized = `${value}`.trim();
  return normalized || fallback;
}

export default function VendorInfoCard({ vendor, onViewProfile }) {
  return (
    <article className="h-full rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <header className="mb-4 flex items-center justify-between gap-3 border-b border-[#eee4dd] pb-3">
        <div className="flex items-center gap-2">
          <Store size={18} className="text-[#cf6432]" />
          <h3 className="text-[18px] font-bold text-[#18120f]">Vendor Information</h3>
        </div>
        {onViewProfile ? (
          <button
            className="inline-flex items-center gap-1.5 rounded-full border border-[#efcfbf] bg-[linear-gradient(180deg,#fff8f3_0%,#fff1e8_100%)] px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#c86434] shadow-[0_8px_18px_rgba(207,110,56,0.12)] transition hover:-translate-y-0.5 hover:border-[#cf6e38] hover:bg-[linear-gradient(180deg,#fff3ec_0%,#ffe7d8_100%)] hover:text-[#a94f24]"
            onClick={onViewProfile}
            type="button"
          >
            <span>View Profile</span>
            <ArrowUpRight size={12} />
          </button>
        ) : null}
      </header>

      <div className="mb-5 flex items-center gap-3">
        {vendor.avatarUrl ? (
          <img
            src={vendor.avatarUrl}
            alt={vendor.businessName}
            className="h-12 w-12 rounded-full border border-[#eee4dd] object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6eee8] text-[13px] font-bold text-[#2f241d]">
            {vendor.avatar}
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[16px] font-bold text-[#18120f]">{vendor.businessName}</span>
            <span className="inline-flex rounded-full bg-[#edf8f1] px-2 py-0.5 text-[10px] font-bold text-[#2b9e62]">
              Vendor
            </span>
          </div>
          <p className="truncate text-[12px] text-[#5a4d46]">{displayValue(vendor.email)}</p>
          <p className="text-[12px] text-[#5a4d46]">{displayValue(vendor.phone)}</p>
        </div>
      </div>

      <div className="space-y-3 border-t border-[#f1e9e2] pt-4">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">City</span>
          <span className="font-bold text-[#18120f]">{displayValue(vendor.city)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Total Orders</span>
          <span className="font-bold text-[#18120f]">{displayValue(vendor.totalOrders)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Rating</span>
          {typeof vendor.rating === "number" ? (
            <span className="flex items-center gap-1 font-bold text-[#18120f]">
              {vendor.rating.toFixed(1)}
              <Star size={13} fill="#ffc107" stroke="none" />
            </span>
          ) : (
            <span className="font-bold text-[#18120f]">Not available</span>
          )}
        </div>
        <div className="space-y-1 text-[13px]">
          <span className="block font-semibold text-[#8c8077]">Address</span>
          <span className="block leading-6 text-[#18120f]">{displayValue(vendor.address, "Not provided")}</span>
        </div>
      </div>
    </article>
  );
}
