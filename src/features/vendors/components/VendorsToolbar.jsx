import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Star } from "lucide-react";

export default function VendorsToolbar({
  searchTerm,
  onSearchChange,
  vendorFilter,
  onVendorFilterChange,
  cityFilter,
  onCityFilterChange,
  ratingFilter,
  onRatingFilterChange,
  timeframeFilter,
  onTimeframeFilterChange,
  activeTab,
  onTabChange,
  vendors,
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

  const handleSelectVendor = (val) => {
    onVendorFilterChange(val);
    setActiveDropdown(null);
  };

  const handleSelectCity = (val) => {
    onCityFilterChange(val);
    setActiveDropdown(null);
  };

  const handleSelectRating = (val) => {
    onRatingFilterChange(val);
    setActiveDropdown(null);
  };

  const handleSelectTimeframe = (val) => {
    onTimeframeFilterChange(val);
    setActiveDropdown(null);
  };

  const ratingOptions = [
    { label: "All Ratings", value: "" },
    { label: "4.5+ Rating", value: "4.5" },
    { label: "4.0+ Rating", value: "4.0" },
  ];

  const dateOptions = [
    { label: "All Joined Dates", value: "" },
    { label: "Last 7 days", value: "7days" },
    { label: "Last Month", value: "month" },
    { label: "This Year", value: "year" },
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
            placeholder="Search by vendor..."
            className="h-9 w-full rounded-[8px] border border-[#ddd4cb] bg-white pl-9 pr-4 text-[13px] text-[#231913] outline-none transition placeholder:text-[#baaea0] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#baaea0]">
            <Search size={14} />
          </span>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Vendor Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "vendor" ? null : "vendor")}
              className="inline-flex h-9 items-center justify-between gap-1.5 rounded-[8px] border border-[#d8ccc2] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition hover:bg-[#faf9f8] cursor-pointer"
              type="button"
            >
              <span>{vendorFilter || "All Vendors"}</span>
              <ChevronDown size={13} className="text-[#8c8077]" />
            </button>

            {activeDropdown === "vendor" && (
              <div className="absolute left-0 mt-1 z-30 w-44 rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left">
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

          {/* City Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "city" ? null : "city")}
              className="inline-flex h-9 items-center justify-between gap-1.5 rounded-[8px] border border-[#d8ccc2] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition hover:bg-[#faf9f8] cursor-pointer"
              type="button"
            >
              <span>{cityFilter ? `City: ${cityFilter}` : "All Cities"}</span>
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

          {/* Joined Date Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "date" ? null : "date")}
              className="inline-flex h-9 items-center justify-between gap-1.5 rounded-[8px] border border-[#d8ccc2] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition hover:bg-[#faf9f8] cursor-pointer"
              type="button"
            >
              <span>
                {timeframeFilter
                  ? dateOptions.find((o) => o.value === timeframeFilter)?.label
                  : "Joined Date"}
              </span>
              <ChevronDown size={13} className="text-[#8c8077]" />
            </button>

            {activeDropdown === "date" && (
              <div className="absolute right-0 lg:left-0 mt-1 z-30 w-40 rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left">
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
