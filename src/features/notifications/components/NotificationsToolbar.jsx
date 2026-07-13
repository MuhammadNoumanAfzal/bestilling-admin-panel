import { ChevronDown, Plus, Search } from "lucide-react";

function FilterButton({ children, isActive = false }) {
  return (
    <button
      className={[
        "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition",
        isActive
          ? "border-[#cf6e38] bg-[#cf6e38] text-white"
          : "border-[#ddd2ca] bg-white text-[#3f3530] hover:border-[#cf6e38]/50",
      ].join(" ")}
      type="button"
    >
      <span>{children}</span>
      {!isActive ? <ChevronDown size={12} strokeWidth={2.25} /> : null}
    </button>
  );
}

export default function NotificationsToolbar() {
  return (
    <div className="flex flex-col gap-4 border-b border-[#e7ddd5] px-3 py-3 sm:px-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative w-full max-w-[320px]">
          <input
            className="h-10 w-full rounded-full border border-[#ebe2db] bg-[#f6f4f2] pl-9 pr-3 text-[14px] text-[#2a1f19] outline-none transition placeholder:text-[#b3aaa2] focus:border-[#cf6e38] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            placeholder="Search by order ID, customer or vendor..."
            type="search"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b2a9a1]">
            <Search size={12} />
          </span>
        </label>

        <button
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 self-start rounded-[8px] bg-[#cf6e38] px-3.5 text-[13px] font-bold text-white transition hover:bg-[#bc6030]"
          type="button"
        >
          <Plus size={12} strokeWidth={2.8} />
          <span>Create Notification</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterButton isActive>All</FilterButton>
        <FilterButton>Audience</FilterButton>
        <FilterButton>Method</FilterButton>
        <FilterButton>Status</FilterButton>
      </div>
    </div>
  );
}
