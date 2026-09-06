import ReportsFilterDropdown from "./ReportsFilterDropdown.jsx";

export default function ReportsHeader({
  filterLabel,
  filterOptions,
  onChangeFilter,
  onCustomDateChange,
  startDate,
  endDate,
  className = "",
}) {
  return (
    <section className={`flex justify-end ${className}`.trim()}>
      <div className="flex items-center gap-3 self-start">
        <ReportsFilterDropdown
          endDate={endDate}
          onChangeFilter={onChangeFilter}
          onCustomDateChange={onCustomDateChange}
          options={filterOptions}
          selectedFilter={filterLabel}
          startDate={startDate}
        />
      </div>
    </section>
  );
}
