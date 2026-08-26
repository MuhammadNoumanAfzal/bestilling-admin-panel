import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Star, MapPin } from "lucide-react";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";

export default function VendorsToolbar({
  searchTerm,
  onSearchChange,
  cityFilter,
  onCityFilterChange,
  ratingFilter,
  onRatingFilterChange,
  timeframeFilter,
  onTimeframeFilterChange,
  customStart,
  customEnd,
  onCustomDateChange,
  activeTab,
  onTabChange,
  onResetFilters,
  cities,
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

  const handleSelectCity = (val) => {
    onCityFilterChange(val);
    setActiveDropdown(null);
  };

  const handleSelectRating = (val) => {
    onRatingFilterChange(val);
    setActiveDropdown(null);
  };

  const ratingOptions = [
    { label: "All Ratings", value: "" },
    { label: "4.5+ Rating", value: "4.5" },
    { label: "4.0+ Rating", value: "4.0" },
  ];

  const tabs = [
    { label: "All Vendors", value: "All" },
    { label: "Top Performing", value: "Top Performing" },
    { label: "Pending Approval", value: "Pending Approval" },
    { label: "Active", value: "Active" },
    { label: "Suspended", value: "Suspended" },
    { label: "Rejected", value: "Rejected" },
  ];

  return (
    <div ref={toolbarRef} className="flex flex-col gap-4 border-b border-[#eee4dd] bg-[#fcfbfa] p-4 select-none">
      {/* Top Filter selectors */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by vendor, cuisine, or city..."
            className="h-9 w-full rounded-[8px] border border-[#ddd4cb] bg-white pl-9 pr-4 text-[13px] text-[#231913] outline-none transition placeholder:text-[#baaea0] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#baaea0]">
            <Search size={14} />
          </span>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-[180px]">
            <span className="sr-only">Filter by city</span>
            <input
              list="vendor-city-filter-options"
              type="text"
              value={cityFilter}
              onChange={(event) => handleSelectCity(event.target.value)}
              placeholder="Filter by city..."
              className="h-9 w-full rounded-[8px] border border-[#ddd4cb] bg-white pl-9 pr-4 text-[12px] font-semibold text-[#231913] outline-none transition placeholder:text-[#baaea0] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#baaea0]">
              <MapPin size={13} />
            </span>
            <datalist id="vendor-city-filter-options">
              {cities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </label>

          {/* Rating Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "rating" ? null : "rating")}
              className="inline-flex h-9 items-center justify-between gap-1.5 rounded-[8px] border border-[#d8ccc2] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition hover:bg-[#faf9f8] cursor-pointer"
              type="button"
            >
              <span className="inline-flex items-center gap-1.5">
                <Star size={13} fill="#ffb020" stroke="none" />
                {ratingFilter
                  ? ratingOptions.find((o) => o.value === ratingFilter)?.label
                  : "Rating"}
              </span>
              <ChevronDown size={13} className="text-[#8c8077]" />
            </button>

            {activeDropdown === "rating" && (
              <div className="absolute left-0 mt-1 z-30 w-36 rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left">
                {ratingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectRating(opt.value)}
                    className={`block w-full px-3.5 py-1.5 text-left text-[12px] font-semibold transition cursor-pointer ${
                      ratingFilter === opt.value
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

          <DateFilterDropdown
            clearFilterValue="All Dates"
            endDate={customEnd}
            onChangeFilter={onTimeframeFilterChange}
            onCustomDateChange={onCustomDateChange}
            selectedFilter={timeframeFilter}
            startDate={customStart}
          />

          <button
            className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#ead7ca] bg-[#fff8f4] px-3 text-[12px] font-semibold text-[#cf6e38] transition hover:bg-[#fff1e8]"
            onClick={onResetFilters}
            type="button"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Tabs list row */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-[#f1e9e2] pt-3.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`rounded-[8px] px-3.5 py-1.5 text-[12px] font-bold transition cursor-pointer outline-none ${
                isActive
                  ? "bg-[#d96834] text-white"
                  : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
              }`}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
