import { useEffect, useMemo, useState } from "react";
import AddDeliveryAreaModal from "../components/AddDeliveryAreaModal.jsx";
import DeliveryAreasTable from "../components/DeliveryAreasTable.jsx";
import DeliveryOverviewCard from "../components/DeliveryOverviewCard.jsx";
import DeliveryToolbar from "../components/DeliveryToolbar.jsx";
import { deliveryAreaRows, deliveryPagination, deliverySummary } from "../data/deliveryData.js";

export default function DeliveryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const pageSize = deliveryPagination.pageSize;

  const cityOptions = useMemo(
    () => [...new Set(deliveryAreaRows.map((row) => row.city))].sort((a, b) => a.localeCompare(b)),
    [],
  );
  const regionOptions = useMemo(
    () => [...new Set(deliveryAreaRows.map((row) => row.region))].sort((a, b) => a.localeCompare(b)),
    [],
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return deliveryAreaRows.filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.city.toLowerCase().includes(normalizedSearch) ||
        row.region.toLowerCase().includes(normalizedSearch) ||
        row.postalAreas.some(
          (area) =>
            area.postalCode.toLowerCase().includes(normalizedSearch) ||
            area.areaName.toLowerCase().includes(normalizedSearch),
        );

      const matchesStatus = !statusFilter || row.status === statusFilter;
      const matchesRegion = !regionFilter || row.region === regionFilter;
      const matchesCity = !cityFilter || row.city === cityFilter;

      return matchesSearch && matchesStatus && matchesRegion && matchesCity;
    });
  }, [cityFilter, regionFilter, searchTerm, statusFilter]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, regionFilter, cityFilter]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredRows.slice(startIndex, endIndex);
  }, [currentPage, filteredRows, pageSize]);

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setCurrentPage(safePage);
  }

  return (
    <>
      <div className="space-y-5">
        <section className="space-y-1">
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Delivery Areas</h1>
          <p className="text-[18px] leading-7 text-[#6f645d]">
            Manage delivery coverage, postal codes, and regional restrictions across Norway.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {deliverySummary.map((item) => (
            <DeliveryOverviewCard key={item.id} {...item} />
          ))}
        </section>

        <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
          <DeliveryToolbar
            cityFilter={cityFilter}
            cityOptions={cityOptions}
            onAddDeliveryArea={() => setIsAddAreaOpen(true)}
            onCityFilterChange={setCityFilter}
            onRegionFilterChange={setRegionFilter}
            onResetFilters={() => {
              setSearchTerm("");
              setStatusFilter("");
              setRegionFilter("");
              setCityFilter("");
              setCurrentPage(1);
            }}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            regionFilter={regionFilter}
            regionOptions={regionOptions}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
          <DeliveryAreasTable
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            rows={paginatedRows}
            totalItems={totalItems}
          />
        </section>
      </div>

      {isAddAreaOpen ? <AddDeliveryAreaModal onClose={() => setIsAddAreaOpen(false)} /> : null}
    </>
  );
}
