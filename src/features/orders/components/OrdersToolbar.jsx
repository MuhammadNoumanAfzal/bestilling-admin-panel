import { useEffect, useRef, useState } from "react";
import { Search, RotateCw, ChevronDown } from "lucide-react";

function Dropdown({
  isOpen,
  label,
  onToggle,
  options,
  selectedValue,
  defaultLabel,
  clearLabel,
  onSelect,
}) {
  return (
    <div className="relative">
      <button
        className="inline-flex h-10 w-full items-center justify-between gap-2 rounded-[10px] border border-[#d8ccc2] bg-white px-3 text-[13px] font-semibold text-[#4d423b] transition hover:bg-[#faf9f8] sm:w-auto"
        onClick={onToggle}
        type="button"
      >
        <span>{label || defaultLabel}</span>
        <ChevronDown size={14} className="text-[#8c8077]" />
      </button>

      {isOpen ? (
        <div className="absolute left-0 z-30 mt-1 w-full min-w-[12rem] rounded-[10px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] sm:w-48">
          <button
            className={`block w-full px-3.5 py-2 text-left text-[12px] font-semibold transition ${
              !selectedValue
                ? "bg-[#fff3ec] text-[#d96834]"
                : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
            }`}
            onClick={() => onSelect("")}
            type="button"
          >
            {clearLabel || defaultLabel}
          </button>

          {options.map((option) => {
            const key = typeof option === "string" ? option : option.id;
            const value = typeof option === "string" ? option : option.id;
            const text = typeof option === "string" ? option : option.label;

            return (
              <button
                key={key}
                className={`block w-full px-3.5 py-2 text-left text-[12px] font-semibold transition ${
                  selectedValue === value
                    ? "bg-[#fff3ec] text-[#d96834]"
                    : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                }`}
                onClick={() => onSelect(value)}
                type="button"
              >
                {text}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function OrdersToolbar({
  searchTerm,
  onSearchChange,
  vendorFilter,
  onVendorFilterChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  onResetFilters,
  vendors,
  statuses,
  paymentStatuses,
}) {
  const [activeDropdown, setActiveDropdown] = useState("");
  const toolbarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setActiveDropdown("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSelect(callback, value) {
    callback(value);
    setActiveDropdown("");
  }

  return (
    <div
      ref={toolbarRef}
      className="flex flex-col gap-3 border-b border-[#eee4dd] bg-[#fcfbfa] p-4 lg:flex-row lg:items-center"
    >
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by order number, customer, vendor, or email..."
          className="h-10 w-full rounded-[10px] border border-[#ddd4cb] bg-white pl-10 pr-4 text-[13px] text-[#231913] outline-none transition placeholder:text-[#baaea0] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#baaea0]">
          <Search size={15} />
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <Dropdown
          clearLabel="Any vendor"
          defaultLabel="Vendor"
          isOpen={activeDropdown === "vendor"}
          label={vendors.find((item) => item.id === vendorFilter)?.label}
          onSelect={(value) => handleSelect(onVendorFilterChange, value)}
          onToggle={() =>
            setActiveDropdown((current) => (current === "vendor" ? "" : "vendor"))
          }
          options={vendors}
          selectedValue={vendorFilter}
        />

        <Dropdown
          clearLabel="Any order status"
          defaultLabel="Order Status"
          isOpen={activeDropdown === "status"}
          label={statusFilter}
          onSelect={(value) => handleSelect(onStatusFilterChange, value)}
          onToggle={() =>
            setActiveDropdown((current) => (current === "status" ? "" : "status"))
          }
          options={statuses}
          selectedValue={statusFilter}
        />

        <Dropdown
          clearLabel="Any payment status"
          defaultLabel="Payment Status"
          isOpen={activeDropdown === "payment"}
          label={paymentFilter}
          onSelect={(value) => handleSelect(onPaymentFilterChange, value)}
          onToggle={() =>
            setActiveDropdown((current) => (current === "payment" ? "" : "payment"))
          }
          options={paymentStatuses}
          selectedValue={paymentFilter}
        />

        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#e0d4cb] bg-white px-3 text-[12px] font-semibold text-[#6f655e] transition hover:bg-[#faf5f1] hover:text-[#cf6e38]"
          onClick={onResetFilters}
          type="button"
        >
          <RotateCw size={14} />
          Clear Filters
        </button>
      </div>
    </div>
  );
}
