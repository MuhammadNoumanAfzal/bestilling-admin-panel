export default function CreateNotificationField({
  label,
  placeholder,
  type = "text",
  as = "input",
  value,
  onChange,
  options = [],
}) {
  const sharedClassName =
    "w-full rounded-[12px] border border-[#d9d1ca] bg-[#f6f4f2] px-4 text-[15px] text-[#2a1f19] outline-none transition placeholder:text-[#aa9f96] focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]";

  return (
    <label className="flex flex-col gap-2">
      <span className="text-[15px] font-bold text-[#2f241d]">{label}</span>
      {as === "textarea" ? (
        <textarea
          className={`${sharedClassName} min-h-[136px] py-4 resize-none leading-7`}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
        />
      ) : null}

      {as === "select" ? (
        <select className={`${sharedClassName} h-13`} onChange={onChange} value={value}>
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
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      ) : null}
    </label>
  );
}
