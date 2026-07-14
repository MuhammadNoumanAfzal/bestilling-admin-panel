import { Search, RotateCw } from "lucide-react";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";

export default function OrdersToolbar({
  searchTerm,
  onSearchChange,
  vendorFilter,
  onVendorFilterChange,
  eventTypeFilter,
  onEventTypeFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  timeframe,
  onTimeframeChange,
  customStart,
  customEnd,
  onCustomDateChange,
  onResetFilters,
  vendors,
  eventTypes,
  paymentStatuses,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#eee4dd] bg-[#fcfbfa] p-4 lg:flex-row lg:items-center">
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

      {/* Select Filters & Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Vendor Selector */}
        <select
          value={vendorFilter}
          onChange={(e) => onVendorFilterChange(e.target.value)}
          className="h-9 rounded-[8px] border border-[#d8ccc2] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition focus:border-[#cf6e38] cursor-pointer"
        >
          <option value="">All Vendors</option>
          {vendors.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        {/* Event Type Selector */}
        <select
          value={eventTypeFilter}
          onChange={(e) => onEventTypeFilterChange(e.target.value)}
          className="h-9 rounded-[8px] border border-[#d8ccc2] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition focus:border-[#cf6e38] cursor-pointer"
        >
          <option value="">All Orders Type</option>
          {eventTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Payment Selector */}
        <select
          value={paymentFilter}
          onChange={(e) => onPaymentFilterChange(e.target.value)}
          className="h-9 rounded-[8px] border border-[#d8ccc2] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition focus:border-[#cf6e38] cursor-pointer"
        >
          <option value="">All Payment Status</option>
          {paymentStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Date Filter Dropdown */}
        <DateFilterDropdown
          selectedFilter={timeframe}
          onChangeFilter={onTimeframeChange}
          startDate={customStart}
          endDate={customEnd}
          onCustomDateChange={onCustomDateChange}
        />

        {/* Reset Filter Button */}
        <button
          onClick={onResetFilters}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#d8ccc2] bg-white text-[#5b4f47] transition hover:bg-[#faf5f1] hover:text-[#cf6e38] cursor-pointer"
          title="Reset Filters"
          type="button"
        >
          <RotateCw size={14} />
        </button>
      </div>
    </div>
  );
}
