import { useMemo, useState } from "react";
import SupportOverviewCard from "../components/SupportOverviewCard.jsx";
import SupportTicketsTable from "../components/SupportTicketsTable.jsx";
import SupportToolbar from "../components/SupportToolbar.jsx";
import { supportPagination, supportSummary, supportTicketRows } from "../data/supportData.js";

export default function SupportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = supportPagination.pageSize;
  const totalItems = supportTicketRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return supportTicketRows.slice(startIndex, endIndex);
  }, [currentPage, pageSize]);

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setCurrentPage(safePage);
  }

  return (
    <>
      <div className="space-y-5">
        <section className="space-y-1">
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Support Tickets</h1>
          <p className="text-[18px] leading-7 ">
            Manage and respond to all user and vendor inquiries.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {supportSummary.map((item) => (
            <SupportOverviewCard key={item.id} {...item} />
          ))}
        </section>

        <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
          <SupportToolbar />
          <SupportTicketsTable
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            rows={paginatedRows}
            totalItems={totalItems}
          />
        </section>
      </div>
    </>
  );
}
