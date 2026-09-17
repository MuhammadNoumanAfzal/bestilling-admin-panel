import { ot, useOrderLanguage, orderLocale } from "../../orderTranslation.js";
import { hasDetailValue } from "./hasDetailValue.js";
import { Eye, Store, Star } from "lucide-react";

function displayValue(value, fallback = "Not available") {
  if (value === null || value === undefined) {
    return ot(fallback);
  }

  const normalized = `${value}`.trim();
  return normalized || ot(fallback);
}

export default function VendorInfoCard({ vendor, onViewProfile }) {
  useOrderLanguage();
  return (
    <article className="h-full rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[#eee4dd] pb-3">
        <div className="flex min-w-[180px] flex-1 items-center gap-2">
          <Store size={18} className="text-[#cf6432]" />
          <h3 className="min-w-0 break-words text-[18px] font-bold leading-tight text-[#18120f]">{ot("Vendor Information")}</h3>
        </div>
        {onViewProfile ? (
          <button
            className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-[8px] border border-[#efcfbf] bg-[#fff8f3] px-2.5 text-[12px] font-semibold text-[#c86434] transition hover:border-[#cf6e38] hover:bg-[#fff1e8] hover:text-[#a94f24]"
            onClick={onViewProfile}
            type="button"
          >
            <Eye size={14} className="shrink-0" />
            <span>{ot("View Profile")}</span>
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
            <span className="inline-flex rounded-full bg-[#edf8f1] px-2 py-0.5 text-[10px] font-bold text-[#2b9e62]">{ot("Vendor")}</span>
          </div>
          {hasDetailValue(vendor.email) && <p className="truncate text-[12px] text-[#5a4d46]">{vendor.email}</p>}
          {hasDetailValue(vendor.phone) && <p className="text-[12px] text-[#5a4d46]">{vendor.phone}</p>}
        </div>
      </div>

      <div className="space-y-3 border-t border-[#f1e9e2] pt-4">
        {hasDetailValue(vendor.city) && (
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">{ot("City")}</span>
          <span className="font-bold text-[#18120f]">{displayValue(vendor.city)}</span>
        </div>
        )}
        {hasDetailValue(vendor.totalOrders) && (
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">{ot("Total Orders")}</span>
          <span className="font-bold text-[#18120f]">{displayValue(vendor.totalOrders)}</span>
        </div>
        )}
        {typeof vendor.rating === "number" && (
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">{ot("Rating")}</span>
          {typeof vendor.rating === "number" ? (
            <span className="flex items-center gap-1 font-bold text-[#18120f]">
              {vendor.rating.toLocaleString(orderLocale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              <Star size={13} fill="#ffc107" stroke="none" />
            </span>
          ) : (
            <span className="font-bold text-[#18120f]">{ot("Not available")}</span>
          )}
        </div>
        )}
        {hasDetailValue(vendor.address) && (
        <div className="space-y-1 text-[13px]">
          <span className="block font-semibold text-[#8c8077]">{ot("Address")}</span>
          <span className="block leading-6 text-[#18120f]">{displayValue(vendor.address, "Not provided")}</span>
        </div>
        )}
      </div>
    </article>
  );
}
