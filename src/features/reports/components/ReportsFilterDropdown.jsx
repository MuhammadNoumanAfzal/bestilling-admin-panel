import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronDown, X } from "lucide-react";

export default function ReportsFilterDropdown({
  options,
  selectedFilter,
  startDate,
  endDate,
  onChangeFilter,
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

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowCustomFields(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function formatDateLabel(dateValue) {
    if (!dateValue) {
      return "";
    }

    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function handleSelectOption(option) {
    if (option === "Custom Date") {
      setShowCustomFields(true);
      return;
    }

    if (option === "Clear Filter") {
      onChangeFilter("Last 7 days");
      onCustomDateChange("", "");
      setTempStart("");
      setTempEnd("");
      setIsOpen(false);
      setShowCustomFields(false);
      return;
    }

    onChangeFilter(option);
    setIsOpen(false);
    setShowCustomFields(false);
  }

  function handleApplyCustomDate(event) {
    event.preventDefault();

    if (!tempStart || !tempEnd || tempStart > tempEnd) {
      return;
    }

    onCustomDateChange(tempStart, tempEnd);
    onChangeFilter("Custom Date");
    setIsOpen(false);
    setShowCustomFields(false);
  }

  const displayLabel =
    selectedFilter === "Custom Date" && startDate && endDate
      ? `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}`
      : selectedFilter;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="inline-flex items-center gap-2 rounded-full border border-[#e17a47] bg-white px-5 py-2.5 text-[12px] font-semibold text-[#33251e] shadow-[0_6px_16px_rgba(48,28,16,0.05)] transition hover:bg-[#fff7f2]"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <span>{displayLabel}</span>
        <ChevronDown className="text-[#7d675b]" size={14} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-[225px] overflow-hidden rounded-[16px] border border-[#ead5c6] bg-white shadow-[0_18px_40px_rgba(48,28,16,0.14)]">
          {!showCustomFields ? (
            <div className="py-2">
              {options.map((option) => {
                const isActive = selectedFilter === option;
                const isClearAction = option === "Clear Filter";

                return (
                  <button
                    key={option}
                    className={[
                      "flex w-full items-center px-5 py-3 text-left text-[13px] transition",
                      isClearAction
                        ? "mt-1 border-t border-[#f1e4db] pt-3 font-medium text-[#ff4a3d] hover:bg-[#fff3f0]"
                        : isActive
                          ? "bg-[#fff4ec] font-medium text-[#ef6d2f]"
                          : "font-medium text-[#5d5048] hover:bg-[#fcf7f3]",
                    ].join(" ")}
                    onClick={() => handleSelectOption(option)}
                    type="button"
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          ) : (
            <form className="space-y-3 p-4" onSubmit={handleApplyCustomDate}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1f1711]">
                  <Calendar className="text-[#ef6d2f]" size={14} />
                  <span>Custom Date</span>
                </div>

                <button
                  className="rounded-full p-1 text-[#8a7d74] transition hover:bg-[#f7eee8] hover:text-[#1f1711]"
                  onClick={() => setShowCustomFields(false)}
                  type="button"
                >
                  <X size={14} />
                </button>
              </div>

              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-[#6f645d]">Start Date</span>
                <input
                  className="w-full rounded-[10px] border border-[#dfd1c7] px-3 py-2 text-[12px] text-[#231913] outline-none focus:border-[#d66b38]"
                  onChange={(event) => setTempStart(event.target.value)}
                  required
                  type="date"
                  value={tempStart}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-[#6f645d]">End Date</span>
                <input
                  className="w-full rounded-[10px] border border-[#dfd1c7] px-3 py-2 text-[12px] text-[#231913] outline-none focus:border-[#d66b38]"
                  onChange={(event) => setTempEnd(event.target.value)}
                  required
                  type="date"
                  value={tempEnd}
                />
              </label>

              {tempStart && tempEnd && tempStart > tempEnd ? (
                <p className="text-[11px] font-medium text-[#d83f3f]">
                  End date must be after the start date.
                </p>
              ) : null}

              <div className="flex gap-2 pt-1">
                <button
                  className="flex-1 rounded-[10px] border border-[#dfd1c7] px-3 py-2 text-[12px] font-semibold text-[#6f645d] transition hover:bg-[#faf7f4]"
                  onClick={() => setShowCustomFields(false)}
                  type="button"
                >
                  Back
                </button>
                <button
                  className="flex-1 rounded-[10px] bg-[#d66b38] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-[#c95d29] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!tempStart || !tempEnd || tempStart > tempEnd}
                  type="submit"
                >
                  Apply
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
