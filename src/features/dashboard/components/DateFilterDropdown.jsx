import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Calendar, X } from "lucide-react";
import { dashboardFilterOptions } from "../data/dashboardData.js";

export default function DateFilterDropdown({
  selectedFilter,
  onChangeFilter,
  startDate,
  endDate,
  onCustomDateChange,
  clearFilterValue = "Last 7 days",
  options = dashboardFilterOptions,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [tempStart, setTempStart] = useState(startDate || "");
  const [tempEnd, setTempEnd] = useState(endDate || "");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, maxHeight: 360 });

  useLayoutEffect(() => {
    if (!isOpen) return;
    const position = () => {
      const anchor = dropdownRef.current.getBoundingClientRect();
      const width = Math.min(224, window.innerWidth - 32);
      const height = menuRef.current?.offsetHeight || 304;
      const below = window.innerHeight - anchor.bottom - 22;
      const above = anchor.top - 22;
      const opensAbove = below < height && above > below;
      setMenuPosition({
        left: Math.max(16, Math.min(anchor.right - width, window.innerWidth - width - 16)),
        top: opensAbove ? Math.max(16, anchor.top - height - 6) : anchor.bottom + 6,
        maxHeight: Math.max(80, opensAbove ? above : below),
      });
    };
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [isOpen, showCustomFields]);

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !menuRef.current?.contains(event.target)) {
        setIsOpen(false);
        setShowCustomFields(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setShowCustomFields(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
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
        aria-expanded={isOpen}
        aria-label="Filter by date"
        className="inline-flex h-[38px] max-w-full cursor-pointer items-center justify-between gap-2 rounded-full border border-[#e66b35] bg-white px-4 text-[14px] font-medium text-[#231913] transition hover:bg-[#fff7f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e66b35]"
        type="button"
      >
        <span className="truncate">
          {triggerLabel}
        </span>
        <ChevronDown size={14} className="shrink-0 text-[#6f655e]" />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && createPortal(
        <div ref={menuRef} style={menuPosition} className="fixed z-[100] w-56 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[12px] border border-[#d8ccc2] bg-white py-2 shadow-[0_8px_24px_rgba(53,34,20,0.12)]">
          {!showCustomFields ? (
            <div className="flex flex-col">
              {options.map((opt) => {
                if (opt === "Clear Filter") {
                  return (
                    <button
                      key={opt}
                      onClick={handleClear}
                      className="mt-1 flex h-10 w-full cursor-pointer items-center border-t border-[#f1e9e2] px-4 text-left text-[14px] font-medium text-[#ee6538] transition hover:bg-[#fff3ec]"
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
                    aria-current={isActive ? "true" : undefined}
                    className={`flex h-10 w-full cursor-pointer items-center px-4 text-left text-[14px] font-medium transition ${
                      isActive
                        ? "bg-[#fff3ec] text-[#e66b35]"
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
        </div>, document.body
      )}
    </div>
  );
}
