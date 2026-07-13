export default function CommissionSettingsHeroCard({ onEdit, settings }) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="border-b border-[#eee4dd] px-5 py-5 lg:border-b-0 lg:border-r">
          <div className="inline-flex rounded-full border border-[#e8ddd6] bg-[#faf7f4] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#8d8077]">
            {settings.label}
          </div>
          <h2 className="mt-3 text-[20px] font-bold text-[#221914]">Platform Default Commission</h2>
          <p className="mt-2 max-w-[72ch] text-[14px] leading-6 text-[#6f645d]">{settings.description}</p>
        </div>

        <div className="flex flex-col justify-center gap-4 bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f1_100%)] px-5 py-5">
          <div className="rounded-[18px] border border-[#efddd2] bg-white px-4 py-4 text-center shadow-[0_10px_22px_rgba(56,33,17,0.05)]">
            <p className="text-[36px] font-bold tracking-[-0.05em] text-[#1d1612]">{settings.currentRate}</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8d8077]">Current Rate</p>
          </div>

          <button
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[12px] border border-[#cf6e38]/20 bg-[#cf6e38] px-4 text-center text-[14px] font-semibold text-white transition hover:bg-[#bc6030]"
            onClick={onEdit}
            type="button"
          >
            Edit Global Commission
          </button>
        </div>
      </div>
    </section>
  );
}
