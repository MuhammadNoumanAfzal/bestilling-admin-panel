import { useEffect, useMemo, useState } from "react";
import SupportOverviewCard from "../components/SupportOverviewCard.jsx";
import SupportTicketsTable from "../components/SupportTicketsTable.jsx";
import SupportToolbar from "../components/SupportToolbar.jsx";
import { supportPagination, supportTicketRows } from "../data/supportData.js";

function TopFilterSelect({ value, onChange, options }) {
  return (
    <label>
      <select
        className="h-9 cursor-pointer appearance-none rounded-[10px] border border-[#ddd2ca] bg-white px-3.5 pr-9 text-[13px] font-semibold text-[#3f3530] outline-none transition hover:border-[#cf6e38]/50 hover:bg-[#fff9f5] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function getTicketAgeInDays(created) {
  const normalized = created.trim().toLowerCase();

  if (normalized.includes("hour")) {
    return 0;
  }

  if (normalized === "yesterday") {
    return 1;
  }

  const dayMatch = normalized.match(/(\d+)\s+days?\s+ago/);
  if (dayMatch) {
    return Number(dayMatch[1]);
  }

  return 999;
}

export default function SupportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("7");
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const pageSize = supportPagination.pageSize;

  const dateFilteredRows = useMemo(() => {
    if (dateRangeFilter === "all") {
      return supportTicketRows;
    }

    const maxDays = Number(dateRangeFilter);
    return supportTicketRows.filter((row) => getTicketAgeInDays(row.created) <= maxDays);
  }, [dateRangeFilter]);

  const supportSummary = useMemo(
    () => [
      {
        id: "total",
        label: "Total Tickets",
        value: dateFilteredRows.length.toLocaleString(),
        accent: "soft",
      },
      {
        id: "open",
        label: "Open Tickets",
        value: dateFilteredRows.filter((row) => row.status === "Open").length.toLocaleString(),
        accent: "warm",
      },
      {
        id: "progress",
        label: "In Progress",
        value: dateFilteredRows.filter((row) => row.status === "In Progress").length.toLocaleString(),
        accent: "neutral",
      },
      {
        id: "resolved",
        label: "Resolved Today",
        value: dateFilteredRows
          .filter((row) => row.status === "Resolved" && getTicketAgeInDays(row.created) === 0)
          .length.toLocaleString(),
        accent: "strong",
      },
    ],
    [dateFilteredRows],
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return dateFilteredRows.filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.id.toLowerCase().includes(normalizedSearch) ||
        row.user.toLowerCase().includes(normalizedSearch) ||
        row.subject.toLowerCase().includes(normalizedSearch);

      const matchesStatus = !statusFilter || row.status === statusFilter;
      const matchesUser = !userFilter || row.type === userFilter;

      return matchesSearch && matchesStatus && matchesUser;
    });
  }, [dateFilteredRows, searchTerm, statusFilter, userFilter]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, userFilter, dateRangeFilter]);

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
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Support Tickets</h1>
          <p className="text-[18px] leading-7 text-[#6f645d]">
            Manage and respond to all user and vendor inquiries.
          </p>
        </section>

        <div className="flex justify-end">
          <TopFilterSelect
            onChange={setDateRangeFilter}
            options={[
              { label: "Last 7 days", value: "7" },
              { label: "Last 30 days", value: "30" },
              { label: "All time", value: "all" },
            ]}
            value={dateRangeFilter}
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
