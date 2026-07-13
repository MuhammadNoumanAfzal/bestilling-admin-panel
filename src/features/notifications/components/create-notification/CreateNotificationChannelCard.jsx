export default function CreateNotificationChannelCard({
  title,
  description,
  icon,
  isActive = false,
  onClick,
}) {
  return (
    <button
      className={[
        "flex min-h-[118px] cursor-pointer items-start gap-4 rounded-[16px] border px-5 py-5 text-left transition",
        isActive
          ? "border-[#f2b69a] bg-[#ffe5d8] shadow-[0_12px_28px_rgba(207,110,56,0.14)]"
          : "border-[#ddd5cf] bg-white shadow-[0_6px_18px_rgba(53,34,20,0.03)] hover:border-[#cf6e38]/35 hover:bg-[#fff9f5]",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      <span
        className={[
          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          isActive ? "bg-[#ffd1be] text-[#cf6e38]" : "bg-[#f3f1ef] text-[#81756d]",
        ].join(" ")}
      >
        {icon}
      </span>

      <span className="block">
        <span className="block text-[17px] font-bold tracking-[-0.01em] text-[#241913]">{title}</span>
        <span className="mt-1.5 block text-[14px] leading-6 text-[#8e8178]">{description}</span>
      </span>
    </button>
  );
}
