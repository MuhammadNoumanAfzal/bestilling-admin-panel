export default function AddDeliveryAreaField({
  label,
  value,
  onChange,
  as = "input",
  placeholder,
  options = [],
  type = "text",
  disabled = false,
}) {
  const sharedClassName =
    [
      "w-full rounded-[10px] border border-[#d9d1ca] px-3.5 text-[13px] text-[#2a1f19] outline-none transition placeholder:text-[#aa9f96]",
      disabled
        ? "cursor-not-allowed bg-[#f1eeeb] text-[#9e938b]"
        : "bg-[#f6f4f2] focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]",
    ].join(" ");

  return (
    <label className="flex flex-col gap-1">
      <span className="text-[12px] font-bold text-[#2f241d]">{label}</span>
      {as === "select" ? (
        <select className={`${sharedClassName} h-9 cursor-pointer`} disabled={disabled} onChange={onChange} value={value}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={`${sharedClassName} h-9`}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      )}
    </label>
  );
}
