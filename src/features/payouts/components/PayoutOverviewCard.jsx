import { BadgeCheck, CircleDollarSign, Clock3, HandCoins } from "lucide-react";

const accentClasses = {
  soft: "bg-[#fff3ec] text-[#d46f3b]",
  warm: "bg-[#fff1ea] text-[#d66a36]",
  neutral: "bg-[#fff5ef] text-[#d97442]",
  strong: "bg-[#fff3ea] text-[#d06f3d]",
};

const summaryIcons = {
  total: CircleDollarSign,
  commission: HandCoins,
  pending: Clock3,
  completed: BadgeCheck,
};

export default function PayoutOverviewCard({ id, label, value, accent = "soft" }) {
  const Icon = summaryIcons[id] || CircleDollarSign;

  return (
    <article className="flex min-h-[92px] rounded-[14px] border border-[#ece4de] bg-white px-4 py-3 shadow-[0_8px_18px_rgba(55,31,13,0.05)]">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span
            className={[
              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
              accentClasses[accent] || accentClasses.soft,
            ].join(" ")}
          >
            <Icon size={13} strokeWidth={2.2} />
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.03em] text-[#8c7f76]">
            {label}
          </p>
        </div>

        <p className="break-words text-[15px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#1f1711] sm:text-[17px] xl:text-[18px]">
          {value}
        </p>
      </div>
    </article>
  );
}
