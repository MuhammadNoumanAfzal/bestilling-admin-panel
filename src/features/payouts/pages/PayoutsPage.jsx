import { useEffect, useMemo, useState } from "react";
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

function isWithinDays(dateString, days) {
  const currentDate = new Date("2026-07-13T00:00:00");
  const targetDate = new Date(`${dateString}T00:00:00`);
  const diffInMs = currentDate - targetDate;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays <= days;
}

export default function PayoutsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const pageSize = payoutsPagination.pageSize;

  const filteredRows = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return payoutsRows.filter((row) => {
      const matchesSearch =
        !normalizedTerm ||
        row.id.toLowerCase().includes(normalizedTerm) ||
        row.customer.toLowerCase().includes(normalizedTerm) ||
        row.vendor.toLowerCase().includes(normalizedTerm);

      const matchesStatus =
        statusFilter === "all" ||
        row.orderStatus === statusFilter ||
        row.orderPayment === statusFilter ||
        row.payoutStatus === statusFilter;

      const matchesVendor = vendorFilter === "all" || row.vendor === vendorFilter;
      const matchesDate = dateFilter === "all" || isWithinDays(row.createdAt, Number(dateFilter));

      return matchesSearch && matchesStatus && matchesVendor && matchesDate;
    });
  }, [dateFilter, searchTerm, statusFilter, vendorFilter]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredRows.slice(startIndex, endIndex);
  }, [currentPage, filteredRows, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, vendorFilter, dateFilter]);

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setCurrentPage(safePage);
  }

  function handleResetFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setVendorFilter("all");
    setDateFilter("all");
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
          <PayoutToolbar
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            onResetFilters={handleResetFilters}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onVendorFilterChange={setVendorFilter}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            vendorFilter={vendorFilter}
          />
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
