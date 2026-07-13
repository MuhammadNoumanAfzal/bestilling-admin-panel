import { CircleDot } from "lucide-react";

const accentClasses = {
  soft: "bg-[#fff3ec] text-[#d46f3b]",
  warm: "bg-[#fff1ea] text-[#d66a36]",
  neutral: "bg-[#fff5ef] text-[#d97442]",
  strong: "bg-[#fff3ea] text-[#d06f3d]",
};

export default function DeliveryOverviewCard({ label, value, subtitle, accent = "soft" }) {
  return (
    <article className="rounded-[12px] border border-[#ece4de] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(55,31,13,0.07)]">
      <div className="flex items-start gap-3">
        <span
          className={[
            "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full",
            accentClasses[accent] || accentClasses.soft,
          ].join(" ")}
        >
          <CircleDot size={14} strokeWidth={2.4} />
        </span>

        <div className="min-w-0">
          <p className="text-[12px] font-bold leading-5 text-[#534841]">{label}</p>
          <p className="mt-1 text-[22px] font-bold leading-none tracking-[-0.03em] text-[#1d1612]">
            {value}
          </p>
          {subtitle ? <p className="mt-1 text-[11px] text-[#8a7d74]">{subtitle}</p> : null}
        </div>
      </div>
    </article>
  );
}
