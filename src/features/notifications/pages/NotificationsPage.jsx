import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  archiveNotificationRequest,
  getMyNotificationsRequest,
  markAllNotificationsReadRequest,
  markNotificationReadRequest,
} from "../api/notificationsApi.js";
import NotificationDetailsModal from "../components/NotificationDetailsModal.jsx";
import NotificationOverviewCard from "../components/NotificationOverviewCard.jsx";
import NotificationsTable from "../components/NotificationsTable.jsx";
import NotificationsToolbar from "../components/NotificationsToolbar.jsx";

const PAGE_SIZE = 10;

function resolveNotificationTarget(notification) {
  const actionUrl = String(notification?.actionUrl || "").trim();
  const entityId = String(notification?.entityId || "").trim();
  const entityType = String(notification?.entityType || "").trim().toUpperCase();
  const type = String(notification?.type || "").trim().toUpperCase();

  if (/^https?:\/\//i.test(actionUrl)) {
    return actionUrl;
  }

  if (actionUrl) {
    let normalizedPath = actionUrl.replace(/^\/admin\b/i, "");

    if (entityId && normalizedPath.includes(":id")) {
      normalizedPath = normalizedPath.replace(":id", entityId);
    }

    if (normalizedPath && normalizedPath !== "/" && !normalizedPath.includes(":")) {
      return normalizedPath;
    }
  }

  if (entityType === "SUPPORT_TICKET" || type === "SUPPORT_REPLY" || type === "SUPPORT_TICKET_UPDATED") {
    return entityId ? `/support/${entityId}` : "/support";
  }

  if (entityType === "ORDER" || type === "ORDER_UPDATED" || type === "ORDER_CANCELLED") {
    return entityId ? `/orders/${entityId}` : "/orders";
  }

  if (entityType === "PAYOUT" || type === "PAYOUT_UPDATED") {
    return entityId ? `/payouts/${entityId}` : "/payouts";
  }

  if (entityType === "VENDOR" || type === "VENDOR_APPROVED") {
    return entityId ? `/vendors/${entityId}` : "/vendors";
  }

  return "/notifications";
}

function buildSummary(pageInfo, visibleCount) {
  return [
    {
      id: "total",
      label: "Total Notifications",
      value: String(pageInfo.totalItems || 0),
      accent: "soft",
    },
    {
      id: "sent",
      label: "Unread Notifications",
      value: String(pageInfo.unreadCount || 0),
      accent: "warm",
    },
    {
      id: "scheduled",
      label: "Visible On Page",
      value: String(visibleCount || 0),
      accent: "neutral",
    },
    {
      id: "drafts",
      label: "Current Page",
      value: `${pageInfo.page || 1}/${pageInfo.totalPages || 1}`,
      accent: "strong",
    },
  ];
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    unreadCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.title.toLowerCase().includes(normalizedSearch) ||
        row.message.toLowerCase().includes(normalizedSearch) ||
        row.audience.toLowerCase().includes(normalizedSearch) ||
        row.sentBy.toLowerCase().includes(normalizedSearch) ||
        row.statusLabel.toLowerCase().includes(normalizedSearch) ||
        row.typeLabel.toLowerCase().includes(normalizedSearch);

      const matchesAudience = !audienceFilter || row.audience === audienceFilter;

      return matchesSearch && matchesAudience;
    });
  }, [audienceFilter, rows, searchTerm]);

  const notificationSummary = useMemo(
    () => buildSummary(pageInfo, filteredRows.length),
    [filteredRows.length, pageInfo],
  );
  const hasLocalFilters = Boolean(searchTerm.trim() || audienceFilter);
  const visibleTotalItems = hasLocalFilters ? filteredRows.length : pageInfo.totalItems;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, audienceFilter, typeFilter, statusFilter]);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      setIsLoading(true);
      setLoadError("");

      try {
        const result = await getMyNotificationsRequest({
          page: currentPage,
          pageSize: PAGE_SIZE,
          status: statusFilter || null,
          type: typeFilter || null,
        });

        if (!isMounted) {
          return;
        }

        setRows(result.items);
        setPageInfo(result.pageInfo);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setRows([]);
        setPageInfo({
          page: 1,
          pageSize: PAGE_SIZE,
          totalItems: 0,
          totalPages: 1,
          unreadCount: 0,
        });
        setLoadError(error instanceof Error ? error.message : "Unable to load notifications.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [currentPage, statusFilter, typeFilter]);

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), pageInfo.totalPages || 1);
    setCurrentPage(safePage);
  }

  async function handleViewDetails(notification) {
    let nextNotification = notification;

    if (notification.status === "UNREAD") {
      try {
        const result = await markNotificationReadRequest(notification.id);

        nextNotification = {
          ...notification,
          ...result,
        };

        setRows((currentRows) =>
          currentRows.map((row) => (row.id === notification.id ? { ...row, ...result } : row)),
        );
        setPageInfo((currentInfo) => ({
          ...currentInfo,
          unreadCount: Math.max(0, (currentInfo.unreadCount || 0) - 1),
        }));
        window.dispatchEvent(new Event("admin-notifications-updated"));
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Unable to update notification",
          text: error instanceof Error ? error.message : "Please try again.",
          confirmButtonColor: "#d96834",
        });
      }
    }

    setSelectedNotification(nextNotification);
  }

  async function handleArchive(notification) {
    const result = await Swal.fire({
      title: "Archive notification?",
      text: "This notification will be removed from the active list.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Archive",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await archiveNotificationRequest(notification.id);

      setRows((currentRows) => currentRows.filter((row) => row.id !== notification.id));
      setPageInfo((currentInfo) => ({
        ...currentInfo,
        totalItems: Math.max(0, (currentInfo.totalItems || 0) - 1),
        unreadCount:
          notification.status === "UNREAD"
            ? Math.max(0, (currentInfo.unreadCount || 0) - 1)
            : currentInfo.unreadCount || 0,
      }));

      if (selectedNotification?.id === notification.id) {
        setSelectedNotification(null);
      }

      window.dispatchEvent(new Event("admin-notifications-updated"));

      await Swal.fire({
        icon: "success",
        title: "Archived",
        text: "The notification has been archived.",
        confirmButtonColor: "#d96834",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Archive failed",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#d96834",
      });
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsReadRequest();

      setRows((currentRows) =>
        currentRows.map((row) =>
          row.status === "UNREAD"
            ? {
                ...row,
                status: "READ",
                statusLabel: "Read",
                readAtDisplay: "Just now",
              }
            : row,
        ),
      );
      setPageInfo((currentInfo) => ({
        ...currentInfo,
        unreadCount: 0,
      }));
      window.dispatchEvent(new Event("admin-notifications-updated"));

      await Swal.fire({
        icon: "success",
        title: "Notifications updated",
        text: "All notifications have been marked as read.",
        confirmButtonColor: "#d96834",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#d96834",
      });
    }
  }

  function handleOpenAction(notification) {
    const target = resolveNotificationTarget(notification);

    if (/^https?:\/\//i.test(target)) {
      window.location.assign(target);
      return;
    }

    navigate(target);
  }

  return (
    <>
      <div className="space-y-5">
        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {notificationSummary.map((item) => (
            <NotificationOverviewCard key={item.id} {...item} />
          ))}
        </section>

        <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white">
          <NotificationsToolbar
            audienceFilter={audienceFilter}
            onAudienceFilterChange={setAudienceFilter}
            onMarkAllRead={handleMarkAllRead}
            onResetFilters={() => {
              setSearchTerm("");
              setAudienceFilter("");
              setTypeFilter("");
              setStatusFilter("");
            }}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onTypeFilterChange={setTypeFilter}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            unreadCount={pageInfo.unreadCount}
          />

          {loadError ? (
            <div className="border-t border-[#eee4dd] px-4 py-10 text-center text-[15px] font-medium text-[#9f4d33]">
              {loadError}
            </div>
          ) : null}

          {isLoading ? (
            <div className="border-t border-[#eee4dd] px-4 py-12 text-center text-[15px] font-medium text-[#6f645d]">
              Loading notifications...
            </div>
          ) : (
            <NotificationsTable
              currentPage={currentPage}
              onArchive={handleArchive}
              onPageChange={handlePageChange}
              onViewDetails={handleViewDetails}
              pageSize={pageInfo.pageSize || PAGE_SIZE}
              rows={filteredRows}
              totalItems={visibleTotalItems}
            />
          )}
        </section>
      </div>

      <NotificationDetailsModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onOpenAction={handleOpenAction}
      />
    </>
  );
}
