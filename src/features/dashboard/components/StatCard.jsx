import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

function TrendBadge({ trend }) {
  if (!trend) {
    return null;
  }

  const direction = `${trend.direction ?? ""}`.trim().toUpperCase();
  const Icon =
    direction === "UP" ? ArrowUpRight : direction === "DOWN" ? ArrowDownRight : ArrowRight;
  const className =
    direction === "UP"
      ? "bg-[#edf8f1] text-[#2b9e62]"
      : direction === "DOWN"
      ? "bg-[#fff2f1] text-[#d83f3f]"
      : "bg-[#f4efe9] text-[#7a6d66]";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${className}`}>
      <Icon size={12} />
      {trend.percentage}%
    </span>
  );
}

export default function StatCard({ title, value, note, trend, icon: Icon, onClick }) {
  const className = [
    "flex flex-col gap-4 rounded-[14px] border border-[#ece4de] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]",
    onClick ? "cursor-pointer text-left hover:border-[#d8c7bb]" : "",
  ].join(" ");

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834]">
          {Icon ? <Icon size={17} strokeWidth={2.2} /> : <ArrowUpRight size={17} strokeWidth={2.2} />}
        </div>
        <TrendBadge trend={trend} />
      </div>

      <div className="space-y-3">
        <p className="text-[13px] font-bold leading-5 text-[#4d423b]">{title}</p>
        <strong className="block text-[28px] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#221914]">
          {value}
        </strong>
        {note ? <p className="text-[12px] leading-5 text-[#7c6f67]">{note}</p> : null}
        {trend?.label ? <p className="text-[11px] font-medium text-[#998d82]">{trend.label}</p> : null}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button className={className} onClick={onClick} type="button">
        {content}
      </button>
    );
  }

  return <article className={className}>{content}</article>;
}
