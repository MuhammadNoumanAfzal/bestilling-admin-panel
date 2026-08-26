import { BellRing, Clock3, FilePenLine, Send } from "lucide-react";

const accentClasses = {
  soft: {
    chip: "bg-[#fff3ec] text-[#d46f3b]",
  },
  warm: {
    chip: "bg-[#fff1ea] text-[#d66a36]",
  },
  neutral: {
    chip: "bg-[#fff5ef] text-[#d97442]",
  },
  strong: {
    chip: "bg-[#fff3ea] text-[#d06f3d]",
  },
};

const summaryIcons = {
  total: BellRing,
  sent: Send,
  scheduled: Clock3,
  drafts: FilePenLine,
};

export default function NotificationOverviewCard({ id, label, value, accent = "soft", onClick }) {
  const styles = accentClasses[accent] || accentClasses.soft;
  const Icon = summaryIcons[id] || BellRing;
  const className = [
    "rounded-[14px] border border-[#ece4de] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]",
    onClick ? "cursor-pointer text-left hover:border-[#d8c7bb]" : "",
  ].join(" ");

  const content = (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.chip}`}>
          <Icon size={17} strokeWidth={2.2} />
        </span>
        <p className="text-[13px] font-bold leading-5 text-[#4d423b]">{label}</p>
      </div>

      <p className="text-[28px] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#221914]">{value}</p>
    </div>
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
