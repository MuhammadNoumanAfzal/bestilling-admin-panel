import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  createDeliveryAreaRequest,
  getAdminDeliveryAreasRequest,
  getAdminDeliverySummaryRequest,
} from "../api/deliveryApi.js";
import AddDeliveryAreaModal from "../components/AddDeliveryAreaModal.jsx";
import DeliveryAreasTable from "../components/DeliveryAreasTable.jsx";
import DeliveryOverviewCard from "../components/DeliveryOverviewCard.jsx";
import DeliveryToolbar from "../components/DeliveryToolbar.jsx";

const PAGE_SIZE = 10;

export default function DeliveryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [isSubmittingArea, setIsSubmittingArea] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [summaryCards, setSummaryCards] = useState([]);
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });
  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    regions: [],
    statuses: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const normalizedFilters = useMemo(
    () => ({
      page: currentPage,
      pageSize: PAGE_SIZE,
      search: searchTerm,
      status: statusFilter ? statusFilter.toUpperCase() : null,
      region: regionFilter || null,
      city: cityFilter || null,
      sortBy: "city",
      sortOrder: "ASC",
    }),
    [cityFilter, currentPage, regionFilter, searchTerm, statusFilter],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadDeliveryPage() {
      setIsLoading(true);
      setLoadError("");

      try {
        const [summaryResult, areasResult] = await Promise.all([
          getAdminDeliverySummaryRequest(),
          getAdminDeliveryAreasRequest(normalizedFilters),
        ]);

        if (!isMounted) {
          return;
        }

        setSummaryCards(summaryResult);
        setRows(areasResult.rows);
        setPageInfo(areasResult.pageInfo);
        setFilterOptions(areasResult.filterOptions);
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load delivery areas.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDeliveryPage();

    return () => {
      isMounted = false;
    };
  }, [normalizedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, regionFilter, cityFilter]);

  async function handleCreateDeliveryArea(input) {
    try {
      setIsSubmittingArea(true);
      const result = await createDeliveryAreaRequest(input);
      setIsAddAreaOpen(false);
      setCurrentPage(1);
      const [summaryResult, areasResult] = await Promise.all([
        getAdminDeliverySummaryRequest(),
        getAdminDeliveryAreasRequest({
          ...normalizedFilters,
          page: 1,
        }),
      ]);
      setSummaryCards(summaryResult);
      setRows(areasResult.rows);
      setPageInfo(areasResult.pageInfo);
      setFilterOptions(areasResult.filterOptions);

      await Swal.fire({
        icon: "success",
        title: "Delivery area created",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to create delivery area",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSubmittingArea(false);
    }
  }

  return (
    <>
      <div className="space-y-5">
        {loadError ? (
          <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-8 text-center text-[15px] font-medium text-[#9f4d33]">
            {loadError}
          </div>
        ) : null}

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {summaryCards.map((item) => (
            <DeliveryOverviewCard key={item.id} {...item} />
          ))}
        </section>

        <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
          <DeliveryToolbar
            cityFilter={cityFilter}
            cityOptions={filterOptions.cities}
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
            regionOptions={filterOptions.regions}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            statusOptions={filterOptions.statuses.map((item) =>
              item === "ACTIVE" ? "Active" : item === "INACTIVE" ? "Inactive" : item,
            )}
          />
          {isLoading ? (
            <div className="px-5 py-12 text-center text-[15px] font-medium text-[#6f645d]">
              Loading delivery areas...
            </div>
          ) : (
            <DeliveryAreasTable
              currentPage={pageInfo.page}
              onPageChange={setCurrentPage}
              pageSize={pageInfo.pageSize}
              rows={rows}
              totalItems={pageInfo.totalItems}
            />
          )}
        </section>
      </div>

      {isAddAreaOpen ? (
        <AddDeliveryAreaModal
          isSubmitting={isSubmittingArea}
          onClose={() => setIsAddAreaOpen(false)}
          onSubmit={handleCreateDeliveryArea}
          regionOptions={filterOptions.regions}
        />
      ) : null}
    </>
  );
}
