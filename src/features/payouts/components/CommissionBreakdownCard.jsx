import { useNavigate } from "react-router-dom";

function RegionRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[#fcf8f5] px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#fff0e7] text-[#cf6e38]">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        </span>
        <span className="text-[12px] font-semibold text-[#3f332d]">{label}</span>
      </div>
      <span className="text-[12px] font-bold text-[#2a1e17]">{value}</span>
    </div>
  );
}

function VendorAvatar({ label }) {
  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3b3028_0%,#9d6d3d_100%)] text-[10px] font-bold text-white">
      {label}
    </span>
  );
}

function VendorShareRow({ name, share, avatar }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[#fbfaf8] px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <VendorAvatar label={avatar} />
        <span className="text-[12px] font-semibold text-[#2e241e]">{name}</span>
      </div>
      <span className="text-[12px] font-bold text-[#2a1e17]">{share}</span>
    </div>
  );
}

export default function CommissionBreakdownCard({ regions, vendors }) {
  const navigate = useNavigate();

  return (
    <section className="overflow-hidden rounded-[18px] border border-[#d8ccc2] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="flex flex-col gap-4 border-b border-[#e9dfd8] bg-[linear-gradient(180deg,#fff8f2_0%,#fffdfa_100%)] px-5 py-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#221914]">Commission Breakdown</h2>
          <p className="mt-1 text-[13px] leading-6 text-[#8d8077]">
            Review the default platform split and high-performing vendor contribution by region.
          </p>
        </div>

        <div className="rounded-[16px] border border-[#f2d7c7] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(59,33,18,0.05)]">
          <p className="text-[12px] font-bold text-[#cf6e38]">Platform Default Commission</p>
          <span className="mt-1 block text-[24px] font-bold tracking-[-0.03em] text-[#2a1e17]">15%</span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="border-b border-[#e9dfd8] px-5 py-4 lg:border-b-0 lg:border-r">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#8b7d75]">Region</p>
          <div className="mt-3 space-y-2">
            {regions.map((region) => (
              <RegionRow key={region.id} label={region.label} value={region.value} />
            ))}
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#8b7d75]">Vendors</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {vendors.map((vendor) => (
              <VendorShareRow key={vendor.id} {...vendor} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#e9dfd8] px-5 py-4">
        <button
          className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#cf6e38] px-4 text-[13px] font-bold text-white transition hover:bg-[#bc6030]"
          onClick={() => navigate("/payouts/commission-settings")}
          type="button"
        >
          Edit Commission
        </button>
      </div>
    </section>
  );
}
