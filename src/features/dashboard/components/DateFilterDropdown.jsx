import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, X } from "lucide-react";
import { dashboardFilterOptions } from "../data/dashboardData.js";

export default function DateFilterDropdown({
  selectedFilter,
  onChangeFilter,
  startDate,
  endDate,
  onCustomDateChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [tempStart, setTempStart] = useState(startDate || "");
  const [tempEnd, setTempEnd] = useState(endDate || "");
  const dropdownRef = useRef(null);

  useEffect(() => {
    setTempStart(startDate || "");
    setTempEnd(endDate || "");
  }, [startDate, endDate]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowCustomFields(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option) => {
    if (option === "Custom Date") {
      setShowCustomFields(true);
    } else {
      onChangeFilter(option);
      setIsOpen(false);
      setShowCustomFields(false);
    }
  };

  const handleApplyCustomDate = (e) => {
    e.preventDefault();
    if (tempStart && tempEnd && tempStart <= tempEnd) {
      onCustomDateChange(tempStart, tempEnd);
      onChangeFilter("Custom Date");
      setIsOpen(false);
      setShowCustomFields(false);
    }
  };

  const handleClear = () => {
    onChangeFilter("Last 7 days");
    onCustomDateChange("", "");
    setTempStart("");
    setTempEnd("");
    setIsOpen(false);
    setShowCustomFields(false);
  };

  // Helper to format date label
  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  // Generate date display range based on selection (only shown for Custom Date)
  const getDateRangeDisplay = () => {
    if (selectedFilter === "Custom Date" && startDate && endDate) {
      return `From: ${formatDateLabel(startDate)} To: ${formatDateLabel(endDate)}`;
    }
    return null;
  };

  const displayRange = getDateRangeDisplay();

  return (
    <div
      className="relative inline-flex max-w-full items-center gap-2 select-none"
      ref={dropdownRef}
    >
      {/* Date Range Pill Display */}
      {displayRange && (
        <button
          onClick={() => {
            setIsOpen(true);
            setShowCustomFields(selectedFilter === "Custom Date");
          }}
          className="inline-flex max-w-[calc(100vw-8rem)] cursor-pointer items-center gap-1.5 rounded-full border border-[#f9dac6] bg-[#fff3ec] px-4 py-1.5 text-[13px] font-bold text-[#d96834] transition hover:bg-[#ffebd8] outline-none sm:max-w-none"
          type="button"
        >
          <span className="truncate">{displayRange}</span>
          <ChevronDown size={14} className="shrink-0 text-[#d96834]" />
        </button>
      )}

      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-full border border-[#d8ccc2] bg-white px-4 py-1.5 text-[13px] font-bold text-[#231913] transition hover:bg-[#faf9f8] outline-none focus:border-[#cf6e38]"
        type="button"
      >
        <span className="truncate">
          {selectedFilter === "Custom Date" ? "Custom Date" : selectedFilter}
        </span>
        <ChevronDown size={14} className="shrink-0 text-[#6f655e]" />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div className="absolute left-0 top-full z-40 mt-1.5 w-[min(14rem,calc(100vw-2rem))] rounded-[12px] border border-[#d8ccc2] bg-white py-2 shadow-[0_8px_24px_rgba(53,34,20,0.12)] sm:left-auto sm:right-0 sm:w-56">
          {!showCustomFields ? (
            <div className="flex flex-col">
              {dashboardFilterOptions.map((opt) => {
                if (opt === "Clear Filter") {
                  return (
                    <button
                      key={opt}
                      onClick={handleClear}
                      className="border-t border-[#f1e9e2] mt-1.5 pt-1.5 flex w-full items-center px-4 py-2 text-left text-[13px] font-bold text-[#d83f3f] transition hover:bg-[#fff2f1] cursor-pointer"
                      type="button"
                    >
                      {opt}
                    </button>
                  );
                }

                const isActive = selectedFilter === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    className={`flex w-full items-center px-4 py-2 text-left text-[13px] font-semibold transition cursor-pointer ${
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
            <form onSubmit={handleApplyCustomDate} className="p-3.5 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#1f1711] flex items-center gap-1">
                  <Calendar size={13} className="text-[#d96834]" />
                  Custom Date Range
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomFields(false)}
                  className="text-[#9a8f86] hover:text-[#1f1711] p-0.5 rounded-full hover:bg-[#f1e9e2]"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6f655e] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={tempStart}
                    onChange={(e) => setTempStart(e.target.value)}
                    className="w-full rounded-[6px] border border-[#d8ccc2] px-2 py-1 text-[12px] text-[#231913] bg-white outline-none focus:border-[#cf6e38] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6f655e] mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={tempEnd}
                    onChange={(e) => setTempEnd(e.target.value)}
                    className="w-full rounded-[6px] border border-[#d8ccc2] px-2 py-1 text-[12px] text-[#231913] bg-white outline-none focus:border-[#cf6e38] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomFields(false)}
                  className="flex-1 rounded-[6px] border border-[#d8ccc2] py-1.5 text-[11px] font-bold text-[#6f655e] transition hover:bg-[#faf9f8] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!tempStart || !tempEnd || tempStart > tempEnd}
                  className="flex-1 rounded-[6px] bg-[#d96834] py-1.5 text-[11px] font-bold text-white transition hover:bg-[#b75424] cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {tempStart && tempEnd && tempStart > tempEnd ? (
                <p className="text-[11px] font-medium text-[#d83f3f]">
                  End date must be the same as or after the start date.
                </p>
              ) : null}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
