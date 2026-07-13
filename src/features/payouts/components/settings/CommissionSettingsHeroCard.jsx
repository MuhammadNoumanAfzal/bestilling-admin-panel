export default function CommissionSettingsHeroCard({ settings }) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="border-b border-[#eee4dd] px-4 py-4 lg:border-b-0 lg:border-r">
          <div className="inline-flex rounded-full border border-[#e8ddd6] bg-[#faf7f4] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#8d8077]">
            {settings.label}
          </div>
          <h2 className="mt-3 text-[16px] font-bold text-[#221914]">Platform Default Commission</h2>
          <p className="mt-2 max-w-[72ch] text-[12px] leading-6 text-[#6f645d]">{settings.description}</p>
        </div>

        <div className="flex flex-col justify-between gap-4 px-4 py-4">
          <div className="text-right">
            <p className="text-[28px] font-bold tracking-[-0.04em] text-[#1d1612]">{settings.currentRate}</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8d8077]">Current Rate</p>
          </div>

          <button
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[8px] border border-[#ddd2ca] bg-white px-3 text-[12px] font-bold text-[#2f241d] transition hover:border-[#cf6e38]/35 hover:bg-[#fff9f5]"
            type="button"
          >
            Edit Global Commission
          </button>
        </div>
      </div>
    </section>
  );
}
