import { useEffect, useMemo, useState } from "react";
import DateFilterDropdown from "../../dashboard/components/DateFilterDropdown.jsx";
import { getDateRangeForFilter } from "../../dashboard/data/dashboardData.js";
import SupportOverviewCard from "../components/SupportOverviewCard.jsx";
import SupportTicketsTable from "../components/SupportTicketsTable.jsx";
import SupportToolbar from "../components/SupportToolbar.jsx";
import { supportPagination, supportTicketRows } from "../data/supportData.js";

function getTicketDate(row) {
  return new Date(row.createdAtIso);
}

export default function SupportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState("Last 7 days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const pageSize = supportPagination.pageSize;

  const dateFilteredRows = useMemo(() => {
    const { start, end } = getDateRangeForFilter(timeframe, customStart, customEnd);

    return supportTicketRows.filter((row) => {
      const ticketDate = getTicketDate(row);
      return ticketDate >= start && ticketDate <= end;
    });
  }, [customEnd, customStart, timeframe]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return dateFilteredRows.filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.id.toLowerCase().includes(normalizedSearch) ||
        row.user.toLowerCase().includes(normalizedSearch) ||
        row.subject.toLowerCase().includes(normalizedSearch) ||
        row.category.toLowerCase().includes(normalizedSearch);

      const matchesStatus = !statusFilter || row.status === statusFilter;
      const matchesUser = !userFilter || row.type === userFilter;

      return matchesSearch && matchesStatus && matchesUser;
    });
  }, [dateFilteredRows, searchTerm, statusFilter, userFilter]);

  const supportSummary = useMemo(
    () => [
      {
        id: "total",
        label: "Total Tickets",
        value: filteredRows.length.toLocaleString(),
        accent: "soft",
      },
      {
        id: "open",
        label: "Open Tickets",
        value: filteredRows.filter((row) => row.status === "Open").length.toLocaleString(),
        accent: "warm",
      },
      {
        id: "progress",
        label: "In Progress",
        value: filteredRows
          .filter((row) => row.status === "In Progress")
          .length.toLocaleString(),
        accent: "neutral",
      },
      {
        id: "resolved",
        label: "Resolved",
        value: filteredRows
          .filter((row) => row.status === "Resolved")
          .length.toLocaleString(),
        accent: "strong",
      },
    ],
    [filteredRows],
  );

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, userFilter, timeframe, customStart, customEnd]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredRows.slice(startIndex, endIndex);
  }, [currentPage, filteredRows, pageSize]);

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setCurrentPage(safePage);
  }

  function handleCustomDateChange(start, end) {
    setCustomStart(start);
    setCustomEnd(end);
  }

  return (
    <>
      <div className="space-y-5">
        <section className="space-y-1">
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Support Tickets</h1>
          <p className="text-[18px] leading-7 text-[#6f645d]">
            Manage and respond to all user and vendor inquiries.
          </p>
        </section>

        <div className="flex justify-end">
          <DateFilterDropdown
            selectedFilter={timeframe}
            onChangeFilter={setTimeframe}
            startDate={customStart}
            endDate={customEnd}
            onCustomDateChange={handleCustomDateChange}
          />
        </div>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {supportSummary.map((item) => (
            <SupportOverviewCard key={item.id} {...item} />
          ))}
        </section>

        <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
          <SupportToolbar
            onResetFilters={() => {
              setSearchTerm("");
              setStatusFilter("");
              setUserFilter("");
              setTimeframe("Last 7 days");
              setCustomStart("");
              setCustomEnd("");
            }}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onUserFilterChange={setUserFilter}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            userFilter={userFilter}
          />
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
