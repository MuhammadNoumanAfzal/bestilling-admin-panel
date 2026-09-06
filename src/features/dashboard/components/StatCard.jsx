export default function StatCard({ title, value, icon: Icon, onClick }) {
  const className = [
    "flex flex-col gap-4 rounded-[14px] border border-[#ece4de] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]",
    onClick ? "cursor-pointer text-left hover:border-[#d8c7bb]" : "",
  ].join(" ");

  const content = (
    <>
      <div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834]">
          {Icon ? <Icon size={17} strokeWidth={2.2} /> : null}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[13px] font-bold leading-5 text-[#4d423b]">{title}</p>
        <strong className="block min-w-0 break-words text-[clamp(20px,1.8vw,28px)] font-extrabold leading-[1.08] tracking-[-0.035em] tabular-nums text-[#221914]">
          {value}
        </strong>
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
