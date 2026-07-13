import { MapPinned } from "lucide-react";
import DeliveryStatusPill from "./DeliveryStatusPill.jsx";

export default function DeliveryMapCard({ area }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[#ddd4cd] bg-white shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <div className="flex items-start justify-between gap-3 border-b border-[#eee4dd] px-4 py-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#231913]">Coverage Map: {area.city}</h2>
          <p className="mt-1 text-[12px] leading-5 text-[#8d8077]">Delivery area visibility and local service reach.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex rounded-full bg-[#fff4ea] px-3 py-1.5 text-[11px] font-bold text-[#cf6e38]">
            {area.coveragePercent} Covered
          </span>
          <DeliveryStatusPill status={area.status} />
        </div>
      </div>

      <div className="relative h-[250px] overflow-hidden bg-[linear-gradient(135deg,#bcd4d9_0%,#e5ddd3_50%,#b8c8be_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_40%,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.2)_22%,transparent_48%)]" />
        <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/25 shadow-[0_12px_35px_rgba(59,39,25,0.12)] backdrop-blur-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#cf6e38] text-white shadow-[0_10px_24px_rgba(207,110,56,0.35)]">
            <MapPinned size={28} />
          </div>
        </div>
      </div>
    </section>
  );
}
