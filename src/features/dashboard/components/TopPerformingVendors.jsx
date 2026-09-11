import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getVendorDetailPath } from "../../vendors/utils/vendorRoutes.js";

function formatRevenue(value, locale) {
  return `NOK ${Number(value ?? 0).toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function TopPerformingVendors({ vendors = [] }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "nb" ? "nb-NO" : "en-GB";

  return (
    <article className="flex flex-1 flex-col rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <button className="mb-4 text-left" onClick={() => navigate("/vendors?tab=Top%20Performing")} type="button">
        <h2 className="text-[18px] font-bold text-[#18120f]">{t("adminDashboard.topVendors.title")}</h2>
      </button>

      <div className="flex-1 space-y-3">
        {vendors.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-[#e5dad2] px-4 py-8 text-center text-[14px] text-[#6f645d]">
            {t("adminDashboard.topVendors.empty")}
          </div>
        ) : (
          vendors.map((vendor) => (
            <button key={vendor.id} className="w-full rounded-[10px] border border-[#f1e9e2] bg-[#fcfbfa] p-3 text-left transition hover:border-[#cf6e38]" onClick={() => navigate(getVendorDetailPath(vendor))} type="button">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {vendor.avatarUrl ? (
                    <img src={vendor.avatarUrl} alt={vendor.name} className="h-10 w-10 rounded-full border border-[#eee4dd] object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6eee8] text-[10px] font-bold text-[#2f241d]">{vendor.avatar}</div>
                  )}
                  <div>
                    <span className="block text-[15px] font-bold text-[#18120f]">{vendor.name}</span>
                    <span className="block text-[12px] text-[#6f645d]">{vendor.totalOrders} {t("adminDashboard.common.orders")}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 rounded-full border border-[#fae2a0] bg-[#fffcf0] px-2 py-0.5 text-[12px] font-bold text-[#b58c09]">
                  <Star size={10} fill="#b58c09" stroke="none" />
                  <span>{vendor.rating.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[12px] text-[#6f645d]">
                <span>{t("adminDashboard.common.revenue")}: <strong className="text-[#18120f]">{formatRevenue(vendor.totalRevenue, locale)}</strong></span>
                <span>{t("adminDashboard.common.completion")}: <strong className="text-[#18120f]">{vendor.completionRate}%</strong></span>
              </div>
            </button>
          ))
        )}
      </div>
    </article>
  );
}
