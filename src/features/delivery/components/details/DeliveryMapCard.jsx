import { MapPin, MapPinned } from "lucide-react";

const coverageChipStyles = {
  Active: "bg-[#fff1e7] text-[#cf6e38]",
  Limited: "bg-[#f3f0ed] text-[#6f645d]",
  Inactive: "bg-[#f6f2ef] text-[#8d8077]",
};

function CoverageChip({ label }) {
  return (
    <span
      className={[
        "inline-flex h-7 items-center rounded-full px-2.5 text-[10px] font-bold leading-none",
        coverageChipStyles[label] || coverageChipStyles.Active,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export default function DeliveryMapCard({ area }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[#ddd4cd] bg-white shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-[21px] font-bold tracking-[-0.03em] text-[#18120f]">Coverage Map: {area.city}</h2>
            <p className="mt-1.5 text-[14px] leading-6 text-[#7a6d66]">
              Visualizing active delivery radiuses and vendor clusters across the selected area.
            </p>
          </div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <CoverageChip label="Active" />
            <CoverageChip label="Limited" />
            <CoverageChip label="Inactive" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[16px] border border-[#e8ddd5]">
          <img
            alt={`${area.city} coverage map`}
            className="h-[270px] w-full object-cover"
            src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=80"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(38,24,16,0.12)_100%)]" />
          <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/24 shadow-[0_18px_40px_rgba(47,28,18,0.16)] backdrop-blur-md">
            <div className="absolute h-24 w-24 rounded-full border border-white/50" />
            <div className="absolute h-14 w-14 rounded-full border border-white/50" />
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#cf6e38] shadow-[0_10px_24px_rgba(255,255,255,0.45)]">
              <MapPin size={18} fill="currentColor" />
            </div>
          </div>

          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1.5 shadow-[0_10px_24px_rgba(39,22,14,0.1)] backdrop-blur-sm">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fff1e7] text-[#cf6e38]">
              <MapPinned size={14} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Coverage</p>
              <p className="text-[13px] font-semibold text-[#18120f]">{area.coveragePercent} of area enabled</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
