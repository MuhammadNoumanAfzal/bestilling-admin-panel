import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown, Calendar, X } from "lucide-react";
import { dashboardFilterOptions } from "../data/dashboardData.js";

const filterTranslationKeys = {
  "All time": "allTime",
  "Last 7 days": "last7Days",
  "Last Month": "lastMonth",
  "Last 3 Months": "last3Months",
  "Last 6 Months": "last6Months",
  "This Year": "thisYear",
  "Custom Date": "customDate",
  "Clear Filter": "clearFilter",
};

export default function DateFilterDropdown({
  selectedFilter,
  onChangeFilter,
  startDate,
  endDate,
  onCustomDateChange,
  clearFilterValue = "Last 7 days",
  options = dashboardFilterOptions,
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [tempStart, setTempStart] = useState(startDate || "");
  const [tempEnd, setTempEnd] = useState(endDate || "");
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 640 : false));
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, maxHeight: 360 });

  const getFilterLabel = (filter) => {
    const key = filterTranslationKeys[filter];
    return key ? t(`adminDashboard.filters.${key}`) : filter;
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    const position = () => {
      const anchor = dropdownRef.current.getBoundingClientRect();
      const width = Math.min(256, window.innerWidth - 32);
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

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const getDateRangeDisplay = () => {
    if (selectedFilter === "Custom Date" && startDate && endDate) {
      return t("adminDashboard.filters.fromTo", { from: formatDateLabel(startDate), to: formatDateLabel(endDate) });
    }
    return null;
  };

  const displayRange = getDateRangeDisplay();
  const triggerLabel = selectedFilter === "Custom Date" && startDate && endDate ? (isMobile ? `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}` : getFilterLabel("Custom Date")) : getFilterLabel(selectedFilter);

  return (
    <div className="relative inline-flex max-w-full items-center justify-end gap-2 select-none" ref={dropdownRef}>
      {displayRange && !isMobile && (
        <button onClick={() => { setIsOpen(true); setShowCustomFields(selectedFilter === "Custom Date"); }} className="inline-flex max-w-[calc(100vw-8rem)] cursor-pointer items-center gap-1.5 rounded-[12px] border border-[#eadfd5] bg-white px-3 py-2 text-[12px] font-bold text-[#c75f2e] shadow-[0_8px_18px_rgba(45,28,16,0.05)] transition hover:border-[#e4c9b8] hover:bg-[#fff8f3] outline-none sm:max-w-none" type="button">
          <span className="truncate">{displayRange}</span>
          <ChevronDown size={14} className="shrink-0 text-[#9a8f86]" />
        </button>
      )}

      <button onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-label={t("adminDashboard.filters.filterByDate")} className="inline-flex h-10 max-w-full cursor-pointer items-center justify-between gap-2 rounded-[12px] border border-[#d8ccc2] bg-white px-3.5 text-[13px] font-bold text-[#2a211b] shadow-[0_8px_18px_rgba(45,28,16,0.04)] transition hover:border-[#cfb8a8] hover:bg-[#fbf8f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cf6e38]" type="button">
        <Calendar size={15} className="shrink-0 text-[#c75f2e]" />
        <span className="truncate">{triggerLabel}</span>
        <ChevronDown size={14} className={`shrink-0 text-[#8c8077] transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && createPortal(
        <div ref={menuRef} style={menuPosition} className="fixed z-[100] w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[16px] border border-[#eadfd5] bg-white p-2 shadow-[0_18px_44px_rgba(45,28,16,0.14)]">
          {!showCustomFields ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 px-2.5 pb-2 pt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8c8077]">
                <Calendar size={13} className="text-[#c75f2e]" />
                {t("adminDashboard.filters.filterByDate")}
              </div>
              {options.map((opt) => {
                if (opt === "Clear Filter") {
                  return <button key={opt} onClick={handleClear} className="mt-1 flex h-10 w-full cursor-pointer items-center rounded-[10px] border-t border-[#f1e9e2] px-3 text-left text-[13px] font-bold text-[#c75f2e] transition hover:bg-[#fff3ec]" type="button">{getFilterLabel(opt)}</button>;
                }

                const isActive = selectedFilter === opt;
                return (
                  <button key={opt} onClick={() => handleSelectOption(opt)} aria-current={isActive ? "true" : undefined} className={`flex h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] px-3 text-left text-[13px] font-semibold transition ${isActive ? "bg-[#fff3ec] text-[#c75f2e]" : "text-[#554940] hover:bg-[#faf6f2] hover:text-[#cf6e38]"}`} type="button">
                    <span className="truncate">{getFilterLabel(opt)}</span>
                    {isActive ? <Check size={14} className="shrink-0" /> : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleApplyCustomDate} className="space-y-3 p-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#1f1711]"><Calendar size={13} className="text-[#c75f2e]" />{t("adminDashboard.filters.customRange")}</span>
                <button type="button" onClick={() => setShowCustomFields(false)} className="cursor-pointer rounded-full p-1 text-[#9a8f86] hover:bg-[#f1e9e2] hover:text-[#1f1711]"><X size={14} aria-label={t("adminDashboard.common.cancel")} /></button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#6f655e]">{t("adminDashboard.filters.startDate")}</label>
                  <input type="date" aria-label={t("adminDashboard.filters.startDate")} required value={tempStart} onChange={(e) => setTempStart(e.target.value)} className="h-10 w-full cursor-pointer rounded-[10px] border border-[#d8ccc2] bg-white px-3 py-1 text-[12px] font-semibold text-[#231913] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]" />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#6f655e]">{t("adminDashboard.filters.endDate")}</label>
                  <input type="date" aria-label={t("adminDashboard.filters.endDate")} required value={tempEnd} onChange={(e) => setTempEnd(e.target.value)} className="h-10 w-full cursor-pointer rounded-[10px] border border-[#d8ccc2] bg-white px-3 py-1 text-[12px] font-semibold text-[#231913] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]" />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowCustomFields(false)} className="flex-1 cursor-pointer rounded-[10px] border border-[#d8ccc2] py-2 text-[11px] font-bold text-[#6f655e] transition hover:bg-[#faf9f8]">{t("adminDashboard.filters.back")}</button>
                <button type="submit" disabled={!tempStart || !tempEnd || tempStart > tempEnd} className="flex-1 cursor-pointer rounded-[10px] bg-[#d96834] py-2 text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(217,104,52,0.20)] transition hover:bg-[#b75424] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none">{t("adminDashboard.filters.apply")}</button>
              </div>

              {tempStart && tempEnd && tempStart > tempEnd ? <p className="text-[11px] font-medium text-[#d83f3f]">{t("adminDashboard.filters.invalidRange")}</p> : null}
            </form>
          )}
        </div>, document.body
      )}
    </div>
  );
}


