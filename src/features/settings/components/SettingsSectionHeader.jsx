export default function SettingsSectionHeader({ icon: Icon, title }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {Icon ? (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#fff3eb] text-[#d16737]">
          <Icon size={16} />
        </span>
      ) : null}
      <h2 className="text-[22px] font-bold tracking-[-0.03em] text-[#2a1f18]">{title}</h2>
    </div>
  );
}
