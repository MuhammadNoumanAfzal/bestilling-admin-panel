import { useEffect, useMemo, useState } from "react";
import NotificationDetailsModal from "../components/NotificationDetailsModal.jsx";
import NotificationOverviewCard from "../components/NotificationOverviewCard.jsx";
import NotificationsTable from "../components/NotificationsTable.jsx";
import NotificationsToolbar from "../components/NotificationsToolbar.jsx";
import {
  notificationPagination,
  notificationRows,
  notificationSummary,
} from "../data/notificationData.js";

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const pageSize = notificationPagination.pageSize;

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return notificationRows.filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.title.toLowerCase().includes(normalizedSearch) ||
        row.audience.toLowerCase().includes(normalizedSearch) ||
        row.sentBy.toLowerCase().includes(normalizedSearch) ||
        row.status.toLowerCase().includes(normalizedSearch);

      const matchesAudience = !audienceFilter || row.audience === audienceFilter;
      const matchesMethod = !methodFilter || row.channels.includes(methodFilter);
      const matchesStatus = !statusFilter || row.status === statusFilter;

      return matchesSearch && matchesAudience && matchesMethod && matchesStatus;
    });
  }, [audienceFilter, methodFilter, searchTerm, statusFilter]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, audienceFilter, methodFilter, statusFilter]);

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
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Notifications</h1>
          <p className="text-[18px] leading-7 text-[#6f645d]">
            Create, manage and monitor platform-wide notifications for users and vendors.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {notificationSummary.map((item) => (
            <NotificationOverviewCard key={item.id} {...item} />
          ))}
        </section>

        <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
          <NotificationsToolbar
            audienceFilter={audienceFilter}
            methodFilter={methodFilter}
            onAudienceFilterChange={setAudienceFilter}
            onMethodFilterChange={setMethodFilter}
            onResetFilters={() => {
              setSearchTerm("");
              setAudienceFilter("");
              setMethodFilter("");
              setStatusFilter("");
            }}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
          <NotificationsTable
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onViewDetails={setSelectedNotification}
            pageSize={pageSize}
            rows={paginatedRows}
            totalItems={totalItems}
          />
        </section>
      </div>

      <NotificationDetailsModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </>
  );
}
