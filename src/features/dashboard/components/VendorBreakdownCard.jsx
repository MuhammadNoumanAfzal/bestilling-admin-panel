import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const breakdownItems = [
  { key: "active", labelKey: "active", valueClassName: "text-[#18120f]", labelClassName: "text-[#6f645d]", target: "/vendors?tab=Active" },
  { key: "pending", labelKey: "pending", valueClassName: "text-[#18120f]", labelClassName: "text-[#6f645d]", target: "/vendors?tab=Pending%20Approval" },
  { key: "topRated", labelKey: "topRated", valueClassName: "text-[#18120f]", labelClassName: "text-[#6f645d]", target: "/vendors?tab=Top%20Performing" },
];

export default function VendorBreakdownCard({ breakdown }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <h2 className="text-[18px] font-bold text-[#18120f] mb-4">{t("adminDashboard.vendorBreakdown.title")}</h2>

      <div className="grid grid-cols-2 gap-3">
        {breakdownItems.map((item) => (
          <button
            className={`rounded-[10px] border border-[#eee4dd] bg-[#fcfbfa] p-3 text-center transition hover:border-[#cf6e38]/35 hover:bg-white ${item.key === "topRated" ? "col-span-2" : ""}`}
            key={item.key}
            onClick={() => navigate(item.target)}
            type="button"
          >
            <p className={`text-[22px] font-extrabold ${item.valueClassName}`}>{breakdown[item.key] ?? 0}</p>
            <p className={`mt-1 text-[12px] font-bold ${item.labelClassName}`}>{t(`adminDashboard.vendorBreakdown.${item.labelKey}`)}</p>
          </button>
        ))}
      </div>
    </article>
  );
}
