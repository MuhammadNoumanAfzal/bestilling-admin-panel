import { AlertTriangle } from "lucide-react";

export default function CustomerDangerZoneCard({
  customerName,
  isSubmitting = false,
  onDeactivate,
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5 px-1">
        <span className="h-5 w-[3px] bg-[#d83f3f] rounded-full" />
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-[#fdeded] text-[#d83f3f] shadow-sm">
          <AlertTriangle size={13} strokeWidth={2.5} />
        </span>
        <h3 className="text-[18px] font-extrabold tracking-tight text-[#d83f3f]">
          Administrative Danger Zone
        </h3>
      </div>

      <article className="flex flex-col justify-between gap-5 rounded-[16px] border border-[#fbcaca] bg-gradient-to-br from-white to-[#fffcfc] p-4 shadow-[0_4px_16px_rgba(216,63,63,0.02)] transition-all duration-300 hover:border-[#d83f3f]/30 hover:shadow-md sm:p-6">
        <div className="space-y-2">
          <h4 className="text-[16px] font-extrabold text-[#18120f]">
            Deactivate Customer Account
          </h4>
          <p className="text-[13px] leading-relaxed font-medium text-[#5a4d46]">
            Deactivation keeps historical order and billing records intact, but prevents {customerName} from using the
            platform until the account is restored manually.
          </p>
        </div>
        <button
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-[10px] border border-[#d83f3f] bg-white text-[13px] font-bold text-[#d83f3f] outline-none transition duration-150 hover:bg-[#fdf2f2] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          onClick={onDeactivate}
          type="button"
        >
          {isSubmitting ? "Deactivating..." : "Deactivate Account"}
        </button>
      </article>
    </section>
  );
}
