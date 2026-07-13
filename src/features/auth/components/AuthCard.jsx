import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function AuthField({ field }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = field.type === "password";
  const inputType = isPasswordField && isPasswordVisible ? "text" : field.type || "text";

  return (
    <label className="flex flex-col gap-2">
      <span className="type-para text-[13px] font-semibold text-[#7f7269]">{field.label}</span>
      <div className="relative">
        <input
          {...field}
          type={inputType}
          className="type-para min-h-[42px] w-full rounded-[6px] border border-[#ddd4cb] bg-white px-3.5 pr-10 text-[#1d1713] outline-none transition duration-150 placeholder:font-normal placeholder:text-[#baaea0] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
        />
        {isPasswordField ? (
          <button
            className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-[#8d7e72]"
            onClick={() => setIsPasswordVisible((current) => !current)}
            type="button"
          >
            {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
      </div>
      {field.helperText ? (
        <span className="type-subpara text-[12px] text-[#a69a90]">{field.helperText}</span>
      ) : null}
    </label>
  );
}

export default function AuthCard({
  eyebrow,
  title,
  subtitle,
  fields = [],
  belowFieldsContent,
  maxWidthClassName = "max-w-[410px]",
  dense = false,
  actionLabel,
  actionDisabled = false,
  onAction,
  rememberMeLabel,
  rememberMeChecked,
  onRememberMeChange,
  auxiliaryLinkLabel,
  auxiliaryLinkTo,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  note,
  backLinkLabel,
  backLinkTo,
  extraContent,
  actionNote,
  footerPanel,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onAction?.();
  }

  return (
    <div className={`w-full rounded-[14px] border border-[#eadfd4] bg-white/96 shadow-[0_20px_48px_rgba(42,24,13,0.14)] ${maxWidthClassName}`}>
      <form
        className={`px-5 sm:px-6 ${dense ? "pb-4 pt-4.5 sm:pb-4.5 sm:pt-4.5" : "pb-4.5 pt-4.5 sm:pb-5 sm:pt-5"}`}
        onSubmit={handleSubmit}
      >
        {eyebrow ? (
          <p className="type-subpara uppercase tracking-[0.24em] text-[#cf6e38]">{eyebrow}</p>
        ) : null}
        <h1 className="type-h3 mt-1.5 text-[#17120e]">{title}</h1>
        <p className="type-para mt-1.5 max-w-[34ch] text-[#6f655d]">{subtitle}</p>

        <div className={`mt-4 flex flex-col ${dense ? "gap-2" : "gap-2.5"}`}>
          {fields.map((field) => (
            <AuthField key={field.name || field.label} field={field} />
          ))}
        </div>

        {belowFieldsContent ? <div className={dense ? "mt-2.5" : "mt-3"}>{belowFieldsContent}</div> : null}

        {rememberMeLabel || auxiliaryLinkLabel ? (
          <div className={`${dense ? "mt-2" : "mt-2.5"} flex items-center justify-between gap-3`}>
            {rememberMeLabel ? (
              <label className="type-subpara inline-flex items-center gap-1.5 text-[12px] text-[#84776d]">
                <input
                  checked={Boolean(rememberMeChecked)}
                  className="accent-[#cf6e38]"
                  onChange={onRememberMeChange}
                  type="checkbox"
                />
                <span>{rememberMeLabel}</span>
              </label>
            ) : (
              <span />
            )}
            {auxiliaryLinkLabel && auxiliaryLinkTo ? (
              <Link className="type-subpara text-[12px] text-[#7d7065] hover:text-[#cf6e38]" to={auxiliaryLinkTo}>
                {auxiliaryLinkLabel}
              </Link>
            ) : null}
          </div>
        ) : null}

        <button
          className={`type-para ${dense ? "mt-3 min-h-[38px]" : "mt-3.5 min-h-[40px]"} w-full rounded-[4px] bg-[#cf6e38] font-bold text-white transition hover:bg-[#bf622f] disabled:cursor-not-allowed disabled:opacity-60`}
          disabled={actionDisabled}
          type="submit"
        >
          {actionLabel}
        </button>

        {actionNote ? (
          <p className="type-subpara mt-2 text-center text-[12px] text-[#a48f80]">{actionNote}</p>
        ) : null}

        {extraContent ? <div className={dense ? "mt-2.5" : "mt-3"}>{extraContent}</div> : null}

        {note ? (
          <div className={`${dense ? "mt-2.5" : "mt-3"} rounded-[8px] border border-[#efe2d7] bg-[#fcf7f2] px-3 py-2.5`}>
            <p className="type-subpara text-[12px] text-[#8d7e72]">{note}</p>
          </div>
        ) : null}

        {footerPanel ? <div className={dense ? "mt-2.5" : "mt-3"}>{footerPanel}</div> : null}

        {backLinkLabel && backLinkTo ? (
          <Link className={`type-subpara ${dense ? "mt-2.5" : "mt-3"} block text-center text-[12px] text-[#7d7065] hover:text-[#cf6e38]`} to={backLinkTo}>
            {backLinkLabel}
          </Link>
        ) : null}

        {footerText ? (
          <p className={`type-subpara ${dense ? "mt-2.5" : "mt-3"} text-center text-[12px] text-[#8d7e72]`}>
            {footerText}{" "}
            {footerLinkLabel && footerLinkTo ? (
              <Link className="font-bold text-[#cf6e38] hover:text-[#bf622f]" to={footerLinkTo}>
                {footerLinkLabel}
              </Link>
            ) : null}
          </p>
        ) : null}
      </form>
    </div>
  );
}
