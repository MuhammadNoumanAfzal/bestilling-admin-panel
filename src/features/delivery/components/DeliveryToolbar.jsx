import { dt, useDeliveryLanguage } from "../deliveryTranslation.js";
import { ChevronDown, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function uniqueOptions(options = []) {
  const seen = new Set();

  return options.filter((option) => {
    const key = `${option?.value ?? ""}`.trim().toLowerCase();

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function FilterSelect({ value, onChange, options, emptyLabel, translateOptions = true }) {
  useDeliveryLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const selectableOptions = useMemo(() => uniqueOptions(options), [options]);
  const selectedOption = selectableOptions.find((option) => option.value === value);
  const buttonLabel = value
    ? translateOptions
      ? dt(selectedOption?.label || value)
      : selectedOption?.label || value
    : dt(emptyLabel);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-9 min-w-[140px] cursor-pointer items-center justify-between gap-2 rounded-[10px] border border-[#ddd2ca] bg-white px-3.5 text-left text-[13px] font-semibold text-[#3f3530] outline-none transition hover:border-[#cf6e38]/50 hover:bg-[#fff9f5] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{buttonLabel}</span>
        <ChevronDown size={14} className={`shrink-0 text-[#9b8f86] transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-[calc(100%+6px)] z-30 max-h-72 min-w-full overflow-y-auto rounded-[10px] border border-[#ddd2ca] bg-white py-1 shadow-[0_14px_34px_rgba(40,26,16,0.14)]" role="listbox">
          {selectableOptions.length > 0 ? (
            selectableOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full cursor-pointer whitespace-nowrap px-3.5 py-2 text-left text-[13px] font-semibold transition ${isSelected ? "bg-[#fff0e8] text-[#cf6e38]" : "text-[#3f3530] hover:bg-[#fff9f5]"}`}
                >
                  {translateOptions ? dt(option.label) : option.label}
                </button>
              );
            })
          ) : (
            <div className="px-3.5 py-2 text-[13px] font-semibold text-[#9b8f86]">{dt("No options available")}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function DeliveryToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  regionFilter,
  onRegionFilterChange,
  cityFilter,
  onCityFilterChange,
  onResetFilters,
  onAddDeliveryArea,
  cityOptions,
  regionOptions,
  statusOptions,
}) {
  useDeliveryLanguage();
  const isAllActive = !searchTerm && !statusFilter && !regionFilter && !cityFilter;

  return (
    <div className="flex flex-col gap-5 border-b border-[#e7ddd5] px-4 py-4 pb-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative w-full max-w-[340px]">
          <input
            className="h-10 w-full rounded-full border border-[#ebe2db] bg-[#f6f4f2] pl-9 pr-3 text-[14px] text-[#2a1f19] outline-none transition placeholder:text-[#b3aaa2] focus:border-[#cf6e38] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={dt("Search by city, region, or postal area...")}
            type="search"
            value={searchTerm}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b2a9a1]">
            <Search size={13} />
          </span>
        </label>

        <button
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 self-start rounded-[8px] bg-[#cf6e38] px-3.5 text-[13px] font-bold text-white transition hover:bg-[#bc6030]"
          onClick={onAddDeliveryArea}
          type="button"
        >
          <Plus size={13} strokeWidth={2.8} />
          <span>{dt("Add Delivery Area")}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className={[
            "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[10px] border px-3.5 text-[13px] font-semibold transition",
            isAllActive
              ? "border-[#cf6e38] bg-[#cf6e38] text-white"
              : "border-[#ddd2ca] bg-white text-[#3f3530] hover:border-[#cf6e38]/50 hover:bg-[#fff9f5]",
          ].join(" ")}
          onClick={onResetFilters}
          type="button"
        >{dt("All")}</button>

        <FilterSelect
          emptyLabel="All Status"
          onChange={onStatusFilterChange}
          options={(statusOptions || []).map((item) => ({ label: item, value: item }))}
          value={statusFilter}
        />

        <FilterSelect
          emptyLabel="All Region"
          translateOptions={false}
          onChange={onRegionFilterChange}
          options={(regionOptions || []).map((item) => ({ label: item, value: item }))}
          value={regionFilter}
        />

        <FilterSelect
          emptyLabel="All City"
          translateOptions={false}
          onChange={onCityFilterChange}
          options={(cityOptions || []).map((item) => ({ label: item, value: item }))}
          value={cityFilter}
        />
      </div>
    </div>
  );
}
