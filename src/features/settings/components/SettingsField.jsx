export default function SettingsField({
  label,
  value,
  type = "text",
  placeholder,
  className = "",
  readOnly = false,
  onChange,
  autoComplete,
}) {
  return (
    <label className={["flex flex-col gap-1.5", className].join(" ")}>
      <span className="text-[12px] font-bold text-[#2f241d]">{label}</span>
      <input
        className="h-12 rounded-[10px] border border-[#d9d1ca] bg-[#f6f4f2] px-3.5 text-[13px] text-[#2a1f19] outline-none transition placeholder:text-[#aa9f96] focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
        autoComplete={autoComplete}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        type={type}
        value={value}
      />
    </label>
  );
}
