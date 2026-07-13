const accentClasses = {
  soft: {
    chip: "bg-[#fff3ec] text-[#d46f3b]",
    dot: "bg-[#f9dcc8]",
  },
  warm: {
    chip: "bg-[#fff1ea] text-[#d66a36]",
    dot: "bg-[#eb7f4c]",
  },
  neutral: {
    chip: "bg-[#fff5ef] text-[#d97442]",
    dot: "bg-[#d97442]",
  },
  strong: {
    chip: "bg-[#fff3ea] text-[#d06f3d]",
    dot: "bg-[#e6a37c]",
  },
};

export default function NotificationOverviewCard({ label, value, accent = "soft" }) {
  const styles = accentClasses[accent] || accentClasses.soft;

  return (
    <article className="rounded-[12px] border border-[#ece4de] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(55,31,13,0.07)]">
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full ${styles.chip}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
        </span>

        <div className="min-w-0">
          <p className="text-[12px] font-bold leading-5 text-[#534841]">{label}</p>
          <p className="mt-1 text-[22px] font-bold leading-none tracking-[-0.03em] text-[#1d1612]">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}
