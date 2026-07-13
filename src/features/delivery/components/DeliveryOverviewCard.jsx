import { Ban, Globe2, MapPinned, MapPlus } from "lucide-react";

const accentClasses = {
  soft: "bg-[#fff3ec] text-[#d46f3b]",
  warm: "bg-[#fff1ea] text-[#d66a36]",
  neutral: "bg-[#fff5ef] text-[#d97442]",
  strong: "bg-[#fff3ea] text-[#d06f3d]",
};

const summaryIcons = {
  cities: MapPinned,
  postalCodes: MapPlus,
  restricted: Ban,
  coverage: Globe2,
};

export default function DeliveryOverviewCard({ id, label, value, subtitle, accent = "soft" }) {
  const Icon = summaryIcons[id] || MapPinned;

  return (
    <article className="rounded-[14px] border border-[#ece4de] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span
            className={[
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              accentClasses[accent] || accentClasses.soft,
            ].join(" ")}
          >
            <Icon size={17} strokeWidth={2.2} />
          </span>
          <p className="text-[13px] font-bold leading-5 text-[#4d423b]">{label}</p>
        </div>

        <div>
          <p className="text-[28px] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#221914]">{value}</p>
          {subtitle ? <p className="mt-1.5 text-[12px] font-medium text-[#8a7d74]">{subtitle}</p> : null}
        </div>
      </div>
    </article>
  );
}
