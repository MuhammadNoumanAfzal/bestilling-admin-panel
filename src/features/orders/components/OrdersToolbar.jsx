import { useState, useEffect, useRef } from "react";
import { Search, RotateCw, ChevronDown, Calendar, X } from "lucide-react";

export default function OrdersToolbar({
  searchTerm,
  onSearchChange,
  vendorFilter,
  onVendorFilterChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  timeframe,
  onTimeframeChange,
  customStart,
  customEnd,
  onCustomDateChange,
  onResetFilters,
  vendors,
  statuses,
  paymentStatuses,
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [tempStart, setTempStart] = useState(customStart || "");
  const [tempEnd, setTempEnd] = useState(customEnd || "");
  const toolbarRef = useRef(null);

  useEffect(() => {
    setTempStart(customStart || "");
    setTempEnd(customEnd || "");
  }, [customStart, customEnd]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setShowCustomFields(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectStatus = (val) => {
    onStatusFilterChange(val);
    setActiveDropdown(null);
  };

  const handleSelectPayment = (val) => {
    onPaymentFilterChange(val);
    setActiveDropdown(null);
  };

  const handleSelectVendor = (val) => {
    onVendorFilterChange(val);
    setActiveDropdown(null);
  };

  const handleSelectTimeframe = (val) => {
    if (val === "Custom Date") {
      setShowCustomFields(true);
    } else if (val === "Clear Filter") {
      onTimeframeChange("Last 7 days");
      onCustomDateChange("", "");
      setTempStart("");
      setTempEnd("");
      setActiveDropdown(null);
      setShowCustomFields(false);
    } else {
      onTimeframeChange(val);
      setActiveDropdown(null);
      setShowCustomFields(false);
    }
  };

  const handleApplyCustomDate = (e) => {
    e.preventDefault();
    if (tempStart && tempEnd && tempStart <= tempEnd) {
      onCustomDateChange(tempStart, tempEnd);
      onTimeframeChange("Custom Date");
      setActiveDropdown(null);
      setShowCustomFields(false);
    }
  };

  const dateOptions = [
    "Last 7 days",
    "Last Month",
    "Last 3 Months",
    "Last 6 Months",
    "This Year",
    "Custom Date",
    "Clear Filter",
  ];

  return (
    <div
      ref={toolbarRef}
      className="flex flex-col gap-3 border-b border-[#eee4dd] bg-[#fcfbfa] p-4 lg:flex-row lg:items-center select-none"
    >
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by order ID, Customer or vendors..."
          className="h-9 w-full rounded-[8px] border border-[#ddd4cb] bg-white pl-9 pr-4 text-[13px] text-[#231913] outline-none transition placeholder:text-[#baaea0] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#baaea0]">
          <Search size={14} />
        </span>
      </div>

      {/* Floating Dropdown Filters list */}
      <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
        
        {/* Dropdown 1: All Vendors */}
        <div className="relative">
          <button
            onClick={() => {
              setActiveDropdown(activeDropdown === "vendor" ? null : "vendor");
              setShowCustomFields(false);
            }}
            className="inline-flex h-9 w-full items-center justify-between gap-1.5 rounded-[8px] border border-[#d8ccc2] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition hover:bg-[#faf9f8] cursor-pointer sm:w-auto"
            type="button"
          >
            <span>{vendorFilter || "All Vendors"}</span>
            <ChevronDown size={13} className="text-[#8c8077]" />
          </button>

          {activeDropdown === "vendor" && (
            <div className="absolute left-0 mt-1 z-30 w-full min-w-[11rem] rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left sm:w-44">
              <button
                onClick={() => handleSelectVendor("")}
                className={`block w-full px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                  !vendorFilter
                    ? "bg-[#fff3ec] text-[#d96834] font-bold"
                    : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                }`}
                type="button"
              >
                All Vendors
              </button>
              {vendors.map((v) => (
                <button
                  key={v}
                  onClick={() => handleSelectVendor(v)}
                  className={`block w-full px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                    vendorFilter === v
                      ? "bg-[#fff3ec] text-[#d96834] font-bold"
                      : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                  }`}
                  type="button"
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown 2: Status (labeled All Orders Type in mockup) */}
        <div className="relative">
          <button
            onClick={() => {
              setActiveDropdown(activeDropdown === "status" ? null : "status");
              setShowCustomFields(false);
            }}
            className="inline-flex h-9 w-full items-center justify-between gap-1.5 rounded-[8px] border border-[#d8ccc2] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition hover:bg-[#faf9f8] cursor-pointer sm:w-auto"
            type="button"
          >
            <span>{statusFilter || "All Orders Type"}</span>
            <ChevronDown size={13} className="text-[#8c8077]" />
          </button>

          {activeDropdown === "status" && (
            <div className="absolute left-0 mt-1 z-30 w-full min-w-[11rem] rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left sm:w-36">
              <button
                onClick={() => handleSelectStatus("")}
                className={`block w-full px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                  !statusFilter
                    ? "bg-[#fff3ec] text-[#d96834] font-bold"
                    : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                }`}
                type="button"
              >
                All Orders Type
              </button>
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSelectStatus(s)}
                  className={`block w-full px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                    statusFilter === s
                      ? "bg-[#fff3ec] text-[#d96834] font-bold"
                      : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                  }`}
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown 3: Payment Status */}
        <div className="relative">
          <button
            onClick={() => {
              setActiveDropdown(activeDropdown === "payment" ? null : "payment");
              setShowCustomFields(false);
            }}
            className="inline-flex h-9 w-full items-center justify-between gap-1.5 rounded-[8px] border border-[#d8ccc2] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition hover:bg-[#faf9f8] cursor-pointer sm:w-auto"
            type="button"
          >
            <span>{paymentFilter || "All Payment Status"}</span>
            <ChevronDown size={13} className="text-[#8c8077]" />
          </button>

          {activeDropdown === "payment" && (
            <div className="absolute left-0 mt-1 z-30 w-full min-w-[11rem] rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left sm:w-44">
              <button
                onClick={() => handleSelectPayment("")}
                className={`block w-full px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                  !paymentFilter
                    ? "bg-[#fff3ec] text-[#d96834] font-bold"
                    : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                }`}
                type="button"
              >
                All Payment Status
              </button>
              {paymentStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSelectPayment(s)}
                  className={`block w-full px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                    paymentFilter === s
                      ? "bg-[#fff3ec] text-[#d96834] font-bold"
                      : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                  }`}
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown 4: Date Range */}
        <div className="relative">
          <button
            onClick={() => {
              setActiveDropdown(activeDropdown === "date" ? null : "date");
              setShowCustomFields(timeframe === "Custom Date");
            }}
            className="inline-flex h-9 w-full items-center justify-between gap-1.5 rounded-[8px] border border-[#d8ccc2] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition hover:bg-[#faf9f8] cursor-pointer sm:w-auto"
            type="button"
          >
            <span>
              {timeframe === "Custom Date" ? "Custom Date" : timeframe || "Date Range"}
            </span>
            <ChevronDown size={13} className="text-[#8c8077]" />
          </button>

          {activeDropdown === "date" && (
            <div className="absolute left-0 mt-1 z-30 w-full min-w-[13rem] rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left sm:w-52">
              {!showCustomFields ? (
                <div className="flex flex-col">
                  {dateOptions.map((opt) => {
                    if (opt === "Clear Filter") {
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectTimeframe(opt)}
                          className="border-t border-[#f1e9e2] mt-1 pt-1 flex w-full items-center px-3.5 py-1.5 text-left text-[12px] font-bold text-[#d83f3f] transition hover:bg-[#fff2f1] cursor-pointer"
                          type="button"
                        >
                          {opt}
                        </button>
                      );
                    }

                    const isActive = timeframe === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectTimeframe(opt)}
                        className={`flex w-full items-center px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                          isActive
                            ? "bg-[#fff3ec] text-[#d96834] font-bold"
                            : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                        }`}
                        type="button"
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <form onSubmit={handleApplyCustomDate} className="p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#1f1711] flex items-center gap-1">
                      <Calendar size={12} className="text-[#d96834]" />
                      Custom Range
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCustomFields(false)}
                      className="text-[#9a8f86] hover:text-[#1f1711] p-0.5 rounded-full hover:bg-[#f1e9e2]"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <label className="block text-[10px] font-bold text-[#6f655e] mb-0.5">
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={tempStart}
                        onChange={(e) => setTempStart(e.target.value)}
                        className="w-full rounded-[4px] border border-[#d8ccc2] px-1.5 py-0.5 text-[11px] text-[#231913] bg-white outline-none focus:border-[#cf6e38] cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#6f655e] mb-0.5">
                        End Date
                      </label>
                      <input
                        type="date"
                        required
                        value={tempEnd}
                        onChange={(e) => setTempEnd(e.target.value)}
                        className="w-full rounded-[4px] border border-[#d8ccc2] px-1.5 py-0.5 text-[11px] text-[#231913] bg-white outline-none focus:border-[#cf6e38] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowCustomFields(false)}
                      className="flex-1 rounded-[4px] border border-[#d8ccc2] py-1 text-[10px] font-bold text-[#6f655e] transition hover:bg-[#faf9f8] cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!tempStart || !tempEnd || tempStart > tempEnd}
                      className="flex-1 rounded-[4px] bg-[#d96834] py-1 text-[10px] font-bold text-white transition hover:bg-[#b75424] cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>

                  {tempStart && tempEnd && tempStart > tempEnd ? (
                    <p className="text-[10px] font-medium text-[#d83f3f]">
                      End date must be after start date.
                    </p>
                  ) : null}
                </form>
              )}
            </div>
          )}
        </div>

        {/* Reset Filter Button */}
        <button
          onClick={onResetFilters}
          className="inline-flex h-9 w-full items-center justify-center rounded-[8px] border border-[#d8ccc2] bg-white text-[#5b4f47] transition hover:bg-[#faf5f1] hover:text-[#cf6e38] cursor-pointer outline-none sm:w-9"
          title="Reset Filters"
          type="button"
        >
          <RotateCw size={14} />
        </button>
      </div>
    </div>
  );
}
