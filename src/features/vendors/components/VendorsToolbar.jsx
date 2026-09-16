import { vt, useVendorLanguage } from "../utils/vendorTranslation.js";
import { Search, MapPin } from "lucide-react";

export default function VendorsToolbar({
  searchTerm,
  onSearchChange,
  cityFilter,
  onCityFilterChange,
  activeTab,
  onTabChange,
  onResetFilters,
  cities,
}) {
  useVendorLanguage();
  const tabs = [
    { label: "All Vendors", value: "All" },
    { label: "Top Performing", value: "Top Performing" },
    { label: "Pending Approval", value: "Pending Approval" },
    { label: "Active", value: "Active" },
    { label: "Suspended", value: "Suspended" },
  ];

  return (
    <div className="flex flex-col gap-4 border-b border-[#eee4dd] bg-[#fcfbfa] p-4 select-none">
      <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center">
        <div className="relative min-w-0 flex-1">
          <input
            className="h-9 w-full rounded-[8px] border border-[#ddd4cb] bg-white pl-9 pr-4 text-[13px] text-[#231913] outline-none transition placeholder:text-[#baaea0] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={vt("Search by vendor, cuisine, or city...")}
            type="text"
            value={searchTerm}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#baaea0]" size={14} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-[180px]">
            <span className="sr-only">{vt("Filter by city")}</span>
            <input
              className="h-9 w-full rounded-[8px] border border-[#ddd4cb] bg-white pl-9 pr-4 text-[12px] font-semibold text-[#231913] outline-none transition placeholder:text-[#baaea0] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              list="vendor-city-filter-options"
              onChange={(event) => onCityFilterChange(event.target.value)}
              placeholder={vt("Filter by city...")}
              type="text"
              value={cityFilter}
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#baaea0]" size={13} />
            <datalist id="vendor-city-filter-options">
              {cities.map((city) => <option key={city} value={city} />)}
            </datalist>
          </label>
          <button className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#ead7ca] bg-[#fff8f4] px-3 text-[12px] font-semibold text-[#cf6e38] transition hover:bg-[#fff1e8]" onClick={onResetFilters} type="button">
            {vt("Clear Filters")}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-[#f1e9e2] pt-3.5">
        {tabs.map((tab) => (
          <button
            className={`rounded-[8px] px-3.5 py-1.5 text-[12px] font-bold transition cursor-pointer outline-none ${activeTab === tab.value ? "bg-[#d96834] text-white" : "text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"}`}
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            type="button"
          >
            {vt(tab.label)}
          </button>
        ))}
      </div>
    </div>
  );
}