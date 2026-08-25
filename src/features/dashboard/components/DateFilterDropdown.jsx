import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, X } from "lucide-react";
import { dashboardFilterOptions } from "../data/dashboardData.js";

export default function DateFilterDropdown({
  selectedFilter,
  onChangeFilter,
  startDate,
  endDate,
  onCustomDateChange,
  clearFilterValue = "Last 7 days",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [tempStart, setTempStart] = useState(startDate || "");
  const [tempEnd, setTempEnd] = useState(endDate || "");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    setTempStart(startDate || "");
    setTempEnd(endDate || "");
  }, [startDate, endDate]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    onChangeFilter(clearFilterValue);
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
  const triggerLabel =
    selectedFilter === "Custom Date" && startDate && endDate
      ? isMobile
        ? `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}`
        : "Custom Date"
      : selectedFilter;

  return (
    <div
      className="relative inline-flex max-w-full items-center justify-end gap-2 select-none"
      ref={dropdownRef}
    >
      {/* Date Range Pill Display */}
      {displayRange && !isMobile && (
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
        className="inline-flex h-9 max-w-full min-w-[110px] cursor-pointer items-center justify-between gap-1.5 rounded-full border border-[#d8ccc2] bg-white px-3 py-1.5 text-[12px] font-bold text-[#231913] transition hover:bg-[#faf9f8] outline-none focus:border-[#cf6e38] sm:h-auto sm:min-w-0 sm:px-4 sm:text-[13px]"
        type="button"
      >
        <span className="truncate">
          {triggerLabel}
        </span>
        <ChevronDown size={14} className="shrink-0 text-[#6f655e]" />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div className="absolute right-0 top-full z-40 mt-1.5 w-[11rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] border border-[#d8ccc2] bg-white py-2 shadow-[0_8px_24px_rgba(53,34,20,0.12)] sm:w-56">
          {!showCustomFields ? (
            <div className="flex flex-col">
              {dashboardFilterOptions.map((opt) => {
                if (opt === "Clear Filter") {
                  return (
                    <button
                      key={opt}
                      onClick={handleClear}
                      className="mt-1.5 flex w-full cursor-pointer items-center border-t border-[#f1e9e2] px-4 py-2 text-left text-[12px] font-bold text-[#d83f3f] transition hover:bg-[#fff2f1] sm:text-[13px]"
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
                    className={`flex w-full cursor-pointer items-center px-4 py-2 text-left text-[12px] font-semibold transition sm:text-[13px] ${
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
            <form onSubmit={handleApplyCustomDate} className="space-y-3 p-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[12px] font-bold text-[#1f1711]">
                  <Calendar size={13} className="text-[#d96834]" />
                  Custom Date Range
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomFields(false)}
                  className="rounded-full p-0.5 text-[#9a8f86] hover:bg-[#f1e9e2] hover:text-[#1f1711]"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#6f655e]">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={tempStart}
                    onChange={(e) => setTempStart(e.target.value)}
                    className="h-9 w-full cursor-pointer rounded-[8px] border border-[#d8ccc2] bg-white px-2.5 py-1 text-[12px] text-[#231913] outline-none focus:border-[#cf6e38]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#6f655e]">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={tempEnd}
                    onChange={(e) => setTempEnd(e.target.value)}
                    className="h-9 w-full cursor-pointer rounded-[8px] border border-[#d8ccc2] bg-white px-2.5 py-1 text-[12px] text-[#231913] outline-none focus:border-[#cf6e38]"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomFields(false)}
                  className="flex-1 cursor-pointer rounded-[8px] border border-[#d8ccc2] py-2 text-[11px] font-bold text-[#6f655e] transition hover:bg-[#faf9f8]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!tempStart || !tempEnd || tempStart > tempEnd}
                  className="flex-1 cursor-pointer rounded-[8px] bg-[#d96834] py-2 text-[11px] font-bold text-white transition hover:bg-[#b75424] disabled:cursor-not-allowed disabled:opacity-60"
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
