import { useNavigate } from "react-router-dom";

const breakdownItems = [
  {
    key: "active",
    label: "Active Vendors",
    valueClassName: "text-[#18120f]",
    labelClassName: "text-[#6f645d]",
    target: "/vendors?tab=Active",
  },
  {
    key: "pending",
    label: "Pending Approval",
    valueClassName: "text-[#18120f]",
    labelClassName: "text-[#6f645d]",
    target: "/vendors?tab=Pending%20Approval",
  },
  {
    key: "outOfStock",
    label: "Out of Stock",
    valueClassName: "text-[#d83f3f]",
    labelClassName: "text-[#d83f3f]",
    target: "/vendors",
  },
  {
    key: "topRated",
    label: "Top Rated",
    valueClassName: "text-[#18120f]",
    labelClassName: "text-[#6f645d]",
    target: "/vendors?tab=Top%20Performing",
  },
];

export default function VendorBreakdownCard({ breakdown }) {
  const navigate = useNavigate();

  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <h2 className="text-[18px] font-bold text-[#18120f] mb-4">Vendor Breakdown</h2>

      <div className="grid grid-cols-2 gap-3">
        {breakdownItems.map((item) => (
          <button
            className="rounded-[10px] border border-[#eee4dd] bg-[#fcfbfa] p-3 text-center transition hover:border-[#cf6e38]/35 hover:bg-white"
            key={item.key}
            onClick={() => navigate(item.target)}
            type="button"
          >
            <p className={`text-[22px] font-extrabold ${item.valueClassName}`}>
              {breakdown[item.key] ?? 0}
            </p>
            <p className={`mt-1 text-[12px] font-bold ${item.labelClassName}`}>
              {item.label}
            </p>
          </button>
        ))}
      </div>
    </article>
  );
}
