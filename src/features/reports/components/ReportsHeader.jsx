import { Download } from "lucide-react";

export default function ReportsHeader({ filterLabel }) {
  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1.5">
        <h1 className="text-[30px] font-extrabold tracking-[-0.045em] text-[#18120f] sm:text-[34px]">
          Reports & Analytics
        </h1>
        <p className="max-w-[720px] text-[13px] leading-5 text-[#6f645d] sm:text-[14px] sm:leading-6">
          Monitor platform performance and strategic business insights.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start">
        <button
          className="inline-flex items-center gap-2 rounded-full bg-[#d66b38] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_10px_18px_rgba(214,107,56,0.22)] transition hover:bg-[#c95d29]"
          type="button"
        >
          <Download size={14} />
          <span>Export Report</span>
        </button>

        <button
          className="rounded-full border border-[#dbd0c7] bg-white px-3 py-2 text-[11px] font-semibold text-[#4c4139] transition hover:border-[#d1c2b6] hover:bg-[#faf7f5]"
          type="button"
        >
          {filterLabel}
        </button>
      </div>
    </section>
  );
}
