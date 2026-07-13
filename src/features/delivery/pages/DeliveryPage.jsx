import { useMemo, useState } from "react";
import AddDeliveryAreaModal from "../components/AddDeliveryAreaModal.jsx";
import DeliveryAreasTable from "../components/DeliveryAreasTable.jsx";
import DeliveryOverviewCard from "../components/DeliveryOverviewCard.jsx";
import DeliveryToolbar from "../components/DeliveryToolbar.jsx";
import { deliveryAreaRows, deliveryPagination, deliverySummary } from "../data/deliveryData.js";

export default function DeliveryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const pageSize = deliveryPagination.pageSize;
  const totalItems = deliveryAreaRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return deliveryAreaRows.slice(startIndex, endIndex);
  }, [currentPage, pageSize]);

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setCurrentPage(safePage);
  }

  return (
    <>
      <div className="space-y-5">
        <section className="space-y-1">
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Delivery Areas</h1>
          <p className="text-[14px] leading-6 text-[#6f645d]">
            Manage delivery coverage, postal codes, and regional restrictions across Norway.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {deliverySummary.map((item) => (
            <DeliveryOverviewCard key={item.id} {...item} />
          ))}
        </section>

        <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
          <DeliveryToolbar onAddDeliveryArea={() => setIsAddAreaOpen(true)} />
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
