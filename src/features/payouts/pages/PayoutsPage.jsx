import { useMemo, useState } from "react";
import CommissionBreakdownCard from "../components/CommissionBreakdownCard.jsx";
import PayoutOverviewCard from "../components/PayoutOverviewCard.jsx";
import PayoutsTable from "../components/PayoutsTable.jsx";
import PayoutToolbar from "../components/PayoutToolbar.jsx";
import {
  payoutsCommissionByRegion,
  payoutsPagination,
  payoutsRows,
  payoutsSummary,
  payoutsTopVendors,
} from "../data/payoutsData.js";

export default function PayoutsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = payoutsPagination.pageSize;
  const totalItems = payoutsRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return payoutsRows.slice(startIndex, endIndex);
  }, [currentPage, pageSize]);

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setCurrentPage(safePage);
  }

  return (
    <div className="space-y-5">
      <section className="space-y-1">
        <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Payments</h1>
        <p className="text-[18px] leading-7">
          Monitor vendor payouts, track platform commission, and manage financial lifecycle.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {payoutsSummary.map((item) => (
          <PayoutOverviewCard key={item.id} {...item} />
        ))}
      </section>

      <section className="space-y-4">
        <div className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
          <PayoutToolbar />
          <PayoutsTable
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            rows={paginatedRows}
            totalItems={totalItems}
          />
        </div>

        <CommissionBreakdownCard regions={payoutsCommissionByRegion} vendors={payoutsTopVendors} />
      </section>
    </div>
  );
}
