import { useMemo, useState } from "react";
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
  const pageSize = notificationPagination.pageSize;
  const totalItems = notificationRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return notificationRows.slice(startIndex, endIndex);
  }, [currentPage, pageSize]);

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setCurrentPage(safePage);
  }

  return (
    <>
      <div className="space-y-5">
        <section className="space-y-1">
          <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Notifications</h1>
          <p className="text-[18px] leading-7 ">
            Create, manage and monitor platform-wide notifications for users and vendors.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {notificationSummary.map((item) => (
            <NotificationOverviewCard key={item.id} {...item} />
          ))}
        </section>

        <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
          <NotificationsToolbar />
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
