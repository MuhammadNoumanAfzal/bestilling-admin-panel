import { useNavigate } from "react-router-dom";

function RegionRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[14px] border border-[#f3e6dd] bg-[#fcf8f5] px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#fff0e7] text-[#cf6e38]">
          <span className="h-2 w-2 rounded-full bg-current" />
        </span>
        <span className="text-[15px] font-semibold text-[#18120f]">{label}</span>
      </div>
      <span className="text-[15px] font-bold text-[#18120f]">{value}</span>
    </div>
  );
}

function VendorAvatar({ label, src }) {
  return (
    <button
      className="inline-flex h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-full transition hover:scale-[1.03]"
      type="button"
    >
      {src ? (
        <img alt={label} className="h-full w-full object-cover" src={src} />
      ) : (
        <span className="inline-flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#3b3028_0%,#9d6d3d_100%)] text-[10px] font-bold text-white">
          {label}
        </span>
      )}
    </button>
  );
}

function VendorShareRow({ avatar, avatarUrl, name, share }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[14px] border border-[#f3e6dd] bg-[#fbfaf8] px-4 py-2.5 transition hover:border-[#e8d5c7]">
      <div className="flex items-center gap-2.5">
        <VendorAvatar label={avatar} src={avatarUrl} />
        <span className="text-[15px] font-semibold text-[#18120f]">{name}</span>
      </div>
      <span className="text-[15px] font-bold text-[#18120f]">{share}</span>
    </div>
  );
}

export default function CommissionBreakdownCard({ regions, vendors }) {
  const navigate = useNavigate();

  return (
    <section className="overflow-hidden rounded-[18px] border border-[#d8ccc2] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="flex flex-col gap-3 border-b border-[#e9dfd8] bg-[linear-gradient(180deg,#fff8f2_0%,#fffdfa_100%)] px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-[#221914] sm:text-[20px]">Commission Breakdown</h2>
          <p className="mt-1.5 text-[14px] leading-6 text-[#7b6f68]">
            Review the default platform split and high-performing vendor contribution by region.
          </p>
        </div>

        <div className="rounded-[16px] border border-[#f2d7c7] bg-white px-4 py-2.5 shadow-[0_8px_20px_rgba(59,33,18,0.05)]">
          <p className="text-[13px] font-bold text-[#cf6e38]">Platform Default Commission</p>
          <span className="mt-1 block text-[26px] font-bold tracking-[-0.03em] text-[#18120f]">15%</span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="border-b border-[#e9dfd8] px-5 py-3.5 lg:border-b-0 lg:border-r">
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#8b7d75]">Region</p>
          <div className="mt-2.5 space-y-2">
            {regions.map((region) => (
              <RegionRow key={region.id} label={region.label} value={region.value} />
            ))}
          </div>
        </div>

        <div className="px-5 py-3.5">
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#8b7d75]">Vendors</p>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {vendors.map((vendor) => (
              <VendorShareRow key={vendor.id} {...vendor} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#e9dfd8] px-5 py-3.5">
        <button
          className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#cf6e38] px-4 text-[13px] font-semibold text-white transition hover:bg-[#bc6030]"
          onClick={() => navigate("/payouts/commission-settings")}
          type="button"
        >
          Edit Commission
        </button>
      </div>
    </section>
  );
}
