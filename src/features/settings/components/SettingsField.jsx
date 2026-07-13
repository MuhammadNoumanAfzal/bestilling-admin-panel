export default function SettingsField({
  label,
  value,
  type = "text",
  placeholder,
  className = "",
  readOnly = false,
}) {
  return (
    <label className={["flex flex-col gap-1.5", className].join(" ")}>
      <span className="text-[11px] font-bold text-[#2f241d]">{label}</span>
      <input
        className="h-11 rounded-[10px] border border-[#d9d1ca] bg-[#f6f4f2] px-3 text-[12px] text-[#2a1f19] outline-none transition placeholder:text-[#aa9f96] focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
        defaultValue={value}
        placeholder={placeholder}
        readOnly={readOnly}
        type={type}
      />
    </label>
  );
}
