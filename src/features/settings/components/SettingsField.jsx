import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SettingsField({
  label,
  value,
  type = "text",
  placeholder,
  className = "",
  readOnly = false,
  onChange,
  autoComplete,
  disabled = false,
  helperText,
  enablePasswordToggle = false,
}) {
  const isPasswordField = type === "password";
  const canTogglePassword = enablePasswordToggle && isPasswordField;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const resolvedType = canTogglePassword && isPasswordVisible ? "text" : type;

  return (
    <label className={["flex flex-col gap-1.5", className].join(" ")}>
      <span className="text-[12px] font-bold text-[#2f241d]">{label}</span>
      <div className="relative">
        <input
          className={[
            "h-12 w-full rounded-[10px] border border-[#d9d1ca] bg-[#f6f4f2] px-3.5 text-[13px] text-[#2a1f19] outline-none transition placeholder:text-[#aa9f96] focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)] disabled:cursor-not-allowed disabled:opacity-70",
            canTogglePassword ? "pr-11" : "",
          ].join(" ")}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          type={resolvedType}
          value={value}
        />
        {canTogglePassword ? (
          <button
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-[#8d7e72] transition hover:text-[#cf6e38]"
            onClick={() => setIsPasswordVisible((current) => !current)}
            type="button"
          >
            {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
      </div>
      {helperText ? <span className="text-[11px] leading-5 text-[#9c9087]">{helperText}</span> : null}
    </label>
  );
}
