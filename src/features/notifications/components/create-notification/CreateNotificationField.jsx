export default function CreateNotificationField({
  label,
  placeholder,
  type = "text",
  as = "input",
  value,
  onChange,
  options = [],
  helperText,
  error,
  disabled = false,
  min,
  step,
  lang,
}) {
  const sharedClassName =
    [
      "w-full rounded-[12px] border px-4 text-[15px] text-[#2a1f19] outline-none transition placeholder:text-[#aa9f96]",
      disabled
        ? "cursor-not-allowed border-[#e3dad3] bg-[#f3efec] text-[#9d9087]"
        : "bg-[#f6f4f2] focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]",
      error ? "border-[#e67a63] focus:border-[#e67a63]" : "border-[#d9d1ca]",
    ].join(" ");

  return (
    <label className="flex flex-col gap-2">
      <span className="text-[15px] font-bold text-[#2f241d]">{label}</span>
      {as === "textarea" ? (
        <textarea
          className={`${sharedClassName} min-h-[136px] py-4 resize-none leading-7`}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
        />
      ) : null}

      {as === "select" ? (
        <select className={`${sharedClassName} h-13 cursor-pointer`} disabled={disabled} onChange={onChange} value={value}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      {as === "input" ? (
        <input
          className={`${sharedClassName} h-13`}
          disabled={disabled}
          lang={lang}
          min={min}
          onChange={onChange}
          placeholder={placeholder}
          step={step}
          type={type}
          value={value}
        />
      ) : null}

      {error ? <span className="text-[13px] font-medium text-[#d15b42]">{error}</span> : null}
      {!error && helperText ? <span className="text-[13px] leading-5 text-[#8d8077]">{helperText}</span> : null}
    </label>
  );
}
