import { useState, useEffect, useRef } from "react";
import { ChevronDown, RotateCw, Search } from "lucide-react";

export default function CustomersToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  cityFilter,
  onCityFilterChange,
  timeframeFilter,
  onTimeframeFilterChange,
  cities = [],
  onResetFilters,
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toolbarRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setActiveDropdown(null);
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

  const handleSelectCity = (val) => {
    onCityFilterChange(val);
    setActiveDropdown(null);
  };

  const handleSelectTimeframe = (val) => {
    onTimeframeFilterChange(val);
    setActiveDropdown(null);
  };

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Active", value: "Active" },
    { label: "Blocked", value: "Blocked" },
  ];

  const dateOptions = [
    { label: "All Registration Dates", value: "" },
    { label: "Last 7 days", value: "7days" },
    { label: "Last Month", value: "month" },
    { label: "This Year", value: "year" },
  ];

  // Check if any specific filter is active to highlight "All" tab vs custom filters
  const isAnyFilterActive = statusFilter || cityFilter || timeframeFilter;

  return (
    <div ref={toolbarRef} className="flex flex-col gap-4 border-b border-[#e7ddd5] bg-[#fcfbfa] p-4 select-none">
      {/* Top Search bar row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 min-w-0 max-w-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID, customer name or phone..."
            className="h-9 w-full rounded-[8px] border border-[#ddd4cb] bg-white pl-9 pr-4 text-[13px] text-[#231913] outline-none transition placeholder:text-[#baaea0] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#baaea0]">
            <Search size={13} />
          </span>
        </div>

        {/* Reset filters */}
        <button
          onClick={onResetFilters}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#d8ccc2] bg-white text-[#6f655e] transition hover:bg-[#faf5f1] hover:text-[#cf6e38] cursor-pointer outline-none self-end md:self-auto"
          title="Reset Filters"
          type="button"
        >
          <RotateCw size={14} />
        </button>
      </div>

      {/* Filters options row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* All Tab */}
        <button
          onClick={onResetFilters}
          className={`inline-flex h-9 items-center justify-center rounded-[8px] px-4 text-[12px] font-bold transition cursor-pointer outline-none ${
            !isAnyFilterActive
              ? "bg-[#cf6e38] text-white"
              : "border border-[#d8ccc2] bg-white text-[#4d423b] hover:bg-[#faf9f8]"
          }`}
          type="button"
        >
          All
        </button>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === "status" ? null : "status")}
            className={`inline-flex h-9 items-center justify-between gap-1.5 rounded-[8px] border px-3 text-[12px] font-semibold outline-none transition hover:bg-[#faf9f8] cursor-pointer ${
              statusFilter
                ? "border-[#cf6e38] bg-[#fffcfb] text-[#cf6e38]"
                : "border-[#d8ccc2] bg-white text-[#4d423b]"
            }`}
            type="button"
          >
            <span>{statusFilter ? `Status: ${statusFilter}` : "Status"}</span>
            <ChevronDown size={13} className="text-[#8c8077]" />
          </button>

          {activeDropdown === "status" && (
            <div className="absolute left-0 mt-1 z-30 w-36 rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelectStatus(opt.value)}
                  className={`block w-full px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                    statusFilter === opt.value
                      ? "bg-[#fff3ec] text-[#d96834] font-bold"
                      : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                  }`}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* City Dropdown */}
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === "city" ? null : "city")}
            className={`inline-flex h-9 items-center justify-between gap-1.5 rounded-[8px] border px-3 text-[12px] font-semibold outline-none transition hover:bg-[#faf9f8] cursor-pointer ${
              cityFilter
                ? "border-[#cf6e38] bg-[#fffcfb] text-[#cf6e38]"
                : "border-[#d8ccc2] bg-white text-[#4d423b]"
            }`}
            type="button"
          >
            <span>{cityFilter ? `City: ${cityFilter}` : "City"}</span>
            <ChevronDown size={13} className="text-[#8c8077]" />
          </button>

          {activeDropdown === "city" && (
            <div className="absolute left-0 mt-1 z-30 w-36 rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left">
              <button
                onClick={() => handleSelectCity("")}
                className={`block w-full px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                  !cityFilter
                    ? "bg-[#fff3ec] text-[#d96834] font-bold"
                    : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                }`}
                type="button"
              >
                All Cities
              </button>
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => handleSelectCity(c)}
                  className={`block w-full px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                    cityFilter === c
                      ? "bg-[#fff3ec] text-[#d96834] font-bold"
                      : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                  }`}
                  type="button"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Registration Date Dropdown */}
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === "date" ? null : "date")}
            className={`inline-flex h-9 items-center justify-between gap-1.5 rounded-[8px] border px-3 text-[12px] font-semibold outline-none transition hover:bg-[#faf9f8] cursor-pointer ${
              timeframeFilter
                ? "border-[#cf6e38] bg-[#fffcfb] text-[#cf6e38]"
                : "border-[#d8ccc2] bg-white text-[#4d423b]"
            }`}
            type="button"
          >
            <span>
              {timeframeFilter
                ? dateOptions.find((o) => o.value === timeframeFilter)?.label
                : "Registration Date"}
            </span>
            <ChevronDown size={13} className="text-[#8c8077]" />
          </button>

          {activeDropdown === "date" && (
            <div className="absolute left-0 mt-1 z-30 w-44 rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left">
              {dateOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelectTimeframe(opt.value)}
                  className={`block w-full px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                    timeframeFilter === opt.value
                      ? "bg-[#fff3ec] text-[#d96834] font-bold"
                      : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                  }`}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
