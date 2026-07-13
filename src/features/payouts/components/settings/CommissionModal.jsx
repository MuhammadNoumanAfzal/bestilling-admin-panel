import { Save, X } from "lucide-react";

function Field({ children, label }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-bold text-[#2f241d]">{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  "h-11 w-full rounded-[12px] border border-[#ddd2ca] bg-[#f8f5f2] px-3.5 text-[14px] font-medium text-[#18120f] outline-none transition placeholder:text-[#aa9f96] focus:border-[#cf6e38] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]";

export default function CommissionModal({
  fields,
  isOpen,
  onChange,
  onClose,
  onSubmit,
  submitLabel,
  title,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211713]/50 px-4 py-4 backdrop-blur-[4px]">
      <div className="flex max-h-[84vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[24px] border border-[#ecdccf] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f1_100%)] shadow-[0_30px_80px_rgba(28,18,12,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#f1e2d8] px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#cf6e38]">Commission Setup</p>
            <h2 className="mt-1 text-[24px] font-bold tracking-[-0.03em] text-[#18120f]">{title}</h2>
          </div>

          <button
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#efddd1] bg-white text-[#685b53] transition hover:border-[#cf6e38]/30 hover:bg-[#fff2ea] hover:text-[#cf6e38]"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className={field.fullWidth ? "sm:col-span-2" : ""}>
                <Field label={field.label}>
                  {field.type === "select" ? (
                    <select
                      className={`${inputClassName} cursor-pointer appearance-none pr-9`}
                      onChange={(event) => onChange(field.key, event.target.value)}
                      value={field.value}
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className={inputClassName}
                      onChange={(event) => onChange(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      type={field.type || "text"}
                      value={field.value}
                    />
                  )}
                </Field>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-[#f1e2d8] px-5 py-4">
          <button
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#d5ccc5] bg-white px-4 text-[13px] font-semibold text-[#332822] transition hover:bg-[#faf6f2]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#cf6e38] px-4 text-[13px] font-semibold text-white transition hover:bg-[#bc6030]"
            onClick={onSubmit}
            type="button"
          >
            <Save size={14} />
            <span>{submitLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
