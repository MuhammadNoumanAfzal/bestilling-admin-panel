import { ChevronDown, RotateCw, Search } from "lucide-react";

function FilterButton({ children, isActive = false }) {
  return (
    <button
      className={[
        "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[10px] border px-3.5 text-[13px] font-semibold transition",
        isActive
          ? "border-[#cf6e38] bg-[#cf6e38] text-white"
          : "border-[#ddd2ca] bg-white text-[#3f3530] hover:border-[#cf6e38]/50 hover:bg-[#fff9f5]",
      ].join(" ")}
      type="button"
    >
      <span>{children}</span>
      {!isActive ? <ChevronDown size={13} strokeWidth={2.25} /> : null}
    </button>
  );
}

export default function CustomersToolbar() {
  return (
    <div className="flex flex-col gap-5 border-b border-[#e7ddd5] px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative w-full max-w-[340px]">
          <input
            className="h-10 w-full rounded-full border border-[#ebe2db] bg-[#f6f4f2] pl-9 pr-3 text-[14px] text-[#2a1f19] outline-none transition placeholder:text-[#b3aaa2] focus:border-[#cf6e38] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            placeholder="Search by order ID, customer or vendor..."
            type="search"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b2a9a1]">
            <Search size={13} />
          </span>
        </label>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          <FilterButton>Last 7 days</FilterButton>
          <button
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-[#ddd2ca] bg-white text-[#6f645d] transition hover:border-[#cf6e38]/40 hover:bg-[#fff9f5] hover:text-[#cf6e38]"
            type="button"
          >
            <RotateCw size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterButton isActive>All</FilterButton>
        <FilterButton>Status</FilterButton>
        <FilterButton>City</FilterButton>
        <FilterButton>Registration Date</FilterButton>
      </div>
    </div>
  );
}
