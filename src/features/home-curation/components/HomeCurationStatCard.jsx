export default function HomeCurationStatCard({ label, value, hint, icon: Icon, toneClass, onClick }) {
  return (
    <button
      className="rounded-[20px] border border-[#e8ddd5] bg-white p-4 text-left shadow-[0_18px_45px_rgba(49,30,19,0.05)] transition hover:-translate-y-0.5 hover:border-[#e0cdbf] hover:shadow-[0_22px_50px_rgba(49,30,19,0.08)]"
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#9d897b]">
            {label}
          </p>
          <p className="mt-2 text-[30px] font-black tracking-[-0.05em] text-[#1c1511]">{value}</p>
          <p className="mt-1 text-[12px] leading-5 text-[#7b6f67]">{hint}</p>
        </div>
        <span
          className={[
            "inline-flex h-12 w-12 items-center justify-center rounded-[16px] text-white",
            toneClass,
          ].join(" ")}
        >
          <Icon size={18} />
        </span>
      </div>
    </button>
  );
}
