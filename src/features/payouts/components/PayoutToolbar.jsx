import { ChevronDown, RotateCw, Search } from "lucide-react";

function FilterSelect({ onChange, options, value }) {
  return (
    <div className="relative">
      <select
        className="h-10 cursor-pointer appearance-none rounded-[10px] border border-[#ddd2ca] bg-white pl-3.5 pr-9 text-[13px] font-semibold text-[#3f3530] outline-none transition hover:border-[#cf6e38]/50 focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
        onChange={onChange}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8d8077]" size={14} />
    </div>
  );
}

function AllButton({ isActive, onClick }) {
  return (
    <button
      className={[
        "inline-flex h-10 cursor-pointer items-center rounded-[10px] border px-4 text-[13px] font-semibold transition",
        isActive
          ? "border-[#cf6e38] bg-[#cf6e38] text-white"
          : "border-[#ddd2ca] bg-white text-[#3f3530] hover:border-[#cf6e38]/50 hover:bg-[#fff9f5]",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      All
    </button>
  );
}

export default function PayoutToolbar({
  dateFilter,
  onDateFilterChange,
  onResetFilters,
  onSearchChange,
  onStatusFilterChange,
  onVendorFilterChange,
  searchTerm,
  statusFilter,
  vendorFilter,
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-[#e7ddd5] px-4 py-4 pb-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative w-full max-w-[360px]">
          <input
            className="h-10 w-full rounded-full border border-[#ebe2db] bg-[#f6f4f2] pl-10 pr-4 text-[14px] font-medium text-[#18120f] outline-none transition placeholder:text-[#b3aaa2] focus:border-[#cf6e38] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by order ID, customer or vendor..."
            type="search"
            value={searchTerm}
          />
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b2a9a1]">
            <Search size={14} />
          </span>
        </label>

        <button
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#ddd2ca] bg-white text-[#6f645d] transition hover:border-[#cf6e38]/40 hover:bg-[#fff9f5] hover:text-[#cf6e38]"
          onClick={onResetFilters}
          type="button"
        >
          <RotateCw size={14} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AllButton
          isActive={statusFilter === "all" && vendorFilter === "all" && dateFilter === "all" && searchTerm === ""}
          onClick={onResetFilters}
        />
        <FilterSelect
          onChange={(event) => onStatusFilterChange(event.target.value)}
          options={[
            { value: "all", label: "Status" },
            { value: "Delivered", label: "Delivered" },
            { value: "Canceled", label: "Canceled" },
            { value: "Pending", label: "Pending" },
          ]}
          value={statusFilter}
        />
        <FilterSelect
          onChange={(event) => onVendorFilterChange(event.target.value)}
          options={[
            { value: "all", label: "Vendor" },
            { value: "Grill Bar", label: "Grill Bar" },
            { value: "Chop Chop", label: "Chop Chop" },
            { value: "Flavor Hunt", label: "Flavor Hunt" },
            { value: "12 AM Hunger", label: "12 AM Hunger" },
            { value: "BBQ Taste", label: "BBQ Taste" },
          ]}
          value={vendorFilter}
        />
        <FilterSelect
          onChange={(event) => onDateFilterChange(event.target.value)}
          options={[
            { value: "all", label: "Date Range" },
            { value: "7", label: "Last 7 days" },
            { value: "30", label: "Last 30 days" },
            { value: "90", label: "Last 90 days" },
          ]}
          value={dateFilter}
        />
      </div>
    </div>
  );
}
