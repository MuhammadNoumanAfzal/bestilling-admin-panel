import { RotateCw, Search } from "lucide-react";

function FilterSelect({ value, onChange, options }) {
  return (
    <label>
      <select
        className="h-9 cursor-pointer appearance-none rounded-[10px] border border-[#ddd2ca] bg-white px-3.5 pr-9 text-[13px] font-semibold text-[#3f3530] outline-none transition hover:border-[#cf6e38]/50 hover:bg-[#fff9f5] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function SupportToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  userFilter,
  onUserFilterChange,
  onResetFilters,
}) {
  const isAllActive = !searchTerm && !statusFilter && !userFilter;

  return (
    <div className="flex flex-col gap-5 border-b border-[#e7ddd5] px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative w-full max-w-[340px]">
          <input
            className="h-10 w-full rounded-full border border-[#ebe2db] bg-[#f6f4f2] pl-9 pr-3 text-[14px] text-[#2a1f19] outline-none transition placeholder:text-[#b3aaa2] focus:border-[#cf6e38] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by ticket ID, user or subject..."
            type="search"
            value={searchTerm}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b2a9a1]">
            <Search size={13} />
          </span>
        </label>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button
            className={[
              "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[10px] border px-3.5 text-[13px] font-semibold transition",
              isAllActive
                ? "border-[#cf6e38] bg-[#cf6e38] text-white"
                : "border-[#ddd2ca] bg-white text-[#3f3530] hover:border-[#cf6e38]/50 hover:bg-[#fff9f5]",
            ].join(" ")}
            onClick={onResetFilters}
            type="button"
          >
            All
          </button>
          <button
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-[#ddd2ca] bg-white text-[#6f645d] transition hover:border-[#cf6e38]/40 hover:bg-[#fff9f5] hover:text-[#cf6e38]"
            onClick={onResetFilters}
            type="button"
          >
            <RotateCw size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          onChange={onStatusFilterChange}
          options={[
            { label: "All Status", value: "" },
            { label: "Resolved", value: "Resolved" },
            { label: "Open", value: "Open" },
            { label: "In Progress", value: "In Progress" },
          ]}
          value={statusFilter}
        />

        <FilterSelect
          onChange={onUserFilterChange}
          options={[
            { label: "All Users", value: "" },
            { label: "Customer", value: "Customer" },
            { label: "Vendor", value: "Vendor" },
          ]}
          value={userFilter}
        />
      </div>
    </div>
  );
}
