import { useMemo, useState } from "react";
import CustomerOverviewCard from "../components/CustomerOverviewCard.jsx";
import CustomersTable from "../components/CustomersTable.jsx";
import CustomersToolbar from "../components/CustomersToolbar.jsx";
import { customerRows, customersPagination, customersSummary } from "../data/customersData.js";

export default function CustomersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = customersPagination.pageSize;
  const totalItems = customerRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return customerRows.slice(startIndex, endIndex);
  }, [currentPage, pageSize]);

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setCurrentPage(safePage);
  }

  return (
    <div className="space-y-5">
      <section className="space-y-1">
        <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Customers</h1>
        <p className="text-[18px] leading-7 ">
          Manage customer accounts, orders, and support activity.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {customersSummary.map((item) => (
          <CustomerOverviewCard key={item.id} {...item} />
        ))}
      </section>

      <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
        <CustomersToolbar />
        <CustomersTable
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          rows={paginatedRows}
          totalItems={totalItems}
        />
      </section>
    </div>
  );
}
