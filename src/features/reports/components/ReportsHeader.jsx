import { Download } from "lucide-react";
import ReportsFilterDropdown from "./ReportsFilterDropdown.jsx";

export default function ReportsHeader({
  exportLabel = "Export Report",
  filterLabel,
  filterOptions,
  isExporting = false,
  onChangeFilter,
  onCustomDateChange,
  onExport,
  startDate,
  endDate,
}) {
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
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#d66b38] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_10px_18px_rgba(214,107,56,0.22)] transition hover:bg-[#c95d29] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isExporting}
          onClick={onExport}
          type="button"
        >
          <Download size={14} />
          <span>{isExporting ? "Exporting..." : exportLabel}</span>
        </button>

        <ReportsFilterDropdown
          endDate={endDate}
          onChangeFilter={onChangeFilter}
          onCustomDateChange={onCustomDateChange}
          options={filterOptions}
          selectedFilter={filterLabel}
          startDate={startDate}
        />
      </div>
    </section>
  );
}
