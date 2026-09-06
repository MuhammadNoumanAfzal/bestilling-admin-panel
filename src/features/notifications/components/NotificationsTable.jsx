import { Archive, Bell, ChevronLeft, ChevronRight, Eye, Mail, MessageSquareText, Smartphone } from "lucide-react";

const audienceClasses = {
  Customers: "bg-[#fff1e8] text-[#d46b36]",
  Vendors: "bg-[#f3f0ff] text-[#6e67d8]",
  "All User": "bg-[#e6f3ff] text-[#3f86d8]",
};

const statusClasses = {
  Unread: "bg-[#fff2ea] text-[#d06734]",
  Read: "bg-[#f6f2ef] text-[#4d433d]",
  Archived: "bg-[#f4f1ef] text-[#8d8178]",
};

const channelMeta = {
  email: {
    icon: Mail,
    label: "Email",
  },
  push: {
    icon: MessageSquareText,
    label: "Push",
  },
  "in-app": {
    icon: Smartphone,
    label: "In-App",
  },
};

function AudienceBadge({ audience }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold leading-none",
        audienceClasses[audience] || audienceClasses.Customers,
      ].join(" ")}
    >
      {audience}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold leading-none",
        statusClasses[status] || statusClasses.Read,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function ChannelDots({ channels }) {
  return (
    <div className="flex items-center gap-2">
      {channels.map((channel) => {
        const meta = channelMeta[channel] || channelMeta.email;
        const Icon = meta.icon;

        return (
          <span
            key={channel}
            className="inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-full border border-[#d8d1cb] bg-[#f6f3f1] px-2 text-[#5b4f47] transition hover:border-[#cf6e38]/35 hover:bg-[#fff2ea] hover:text-[#cf6e38]"
            title={meta.label}
          >
            <Icon size={14} />
          </span>
        );
      })}
    </div>
  );
}

function buildPaginationItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage, "ellipsis-2", totalPages];
}

function PaginationIconButton({ children, disabled = false, onClick }) {
  return (
    <button
      className={[
        "inline-flex h-8 w-8 items-center justify-center rounded-[8px] border text-[#83766f] transition",
        disabled
          ? "cursor-not-allowed border-[#ebe1d9] bg-[#f7f3f0] text-[#c4b8b0]"
          : "border-[#e6dad1] hover:bg-[#faf5f1]",
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function NotificationsTable({
  currentPage,
  onArchive,
  onOpenRow,
  onPageChange,
  onViewDetails,
  pageSize,
  rows,
  totalItems,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <div className="m-2 overflow-hidden rounded-[18px] border border-[#e8ddd4] bg-[linear-gradient(180deg,#fffdfb_0%,#ffffff_100%)] p-4 shadow-[0_10px_24px_rgba(45,31,20,0.05)]">
      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#ddd4cb] bg-white px-6 py-12 text-center text-[15px] font-medium text-[#6f645d]">
            No notifications match the current filters.
          </div>
        ) : (
          rows.map((row, index) => {
            const isUnread = `${row.status || ""}`.toUpperCase() === "UNREAD";

            return (
              <article
                key={row.id}
                className={`grid gap-3 rounded-[22px] border px-4 py-4 transition sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start ${
                  isUnread ? "border-[#f0b79e] bg-[#fff7f2]" : "border-[#ece3db] bg-white"
                }`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isUnread ? "bg-[#ffe8dc] text-[#cf5c2f]" : "bg-[#f6f1eb] text-[#8d7e70]"}`}>
                  <Bell size={20} />
                </div>

                <button className="min-w-0 cursor-pointer text-left" onClick={() => onOpenRow(row)} type="button">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-semibold text-[#978d84]">{(currentPage - 1) * pageSize + index + 1}.</span>
                    <h3 className="truncate text-[15px] font-semibold text-[#1f1f1f]">{row.title}</h3>
                    <AudienceBadge audience={row.audience} />
                    <StatusBadge status={row.statusLabel || row.status} />
                  </div>
                  <p className="mt-2 text-[13px] leading-5 text-[#6a625c]">{row.message || "Open this notification to review the full update."}</p>
                </button>

                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <span className="text-xs font-medium text-[#978d84]">{row.createdAtDisplay || row.scheduledAt}</span>
                  <ChannelDots channels={row.channels || []} />
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-[#fff2eb] px-3 py-1.5 text-[11px] font-semibold text-[#cf6e38]" onClick={() => onViewDetails(row)} type="button">
                      <Eye size={13} /> View
                    </button>
                    {row.status !== "ARCHIVED" ? (
                      <button className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f1eb] px-3 py-1.5 text-[11px] font-semibold text-[#80766d]" onClick={() => onArchive(row)} type="button">
                        <Archive size={13} /> Archive
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-[#eee4dd] px-4 py-4 text-[13px] text-[#6c6058] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] text-[#5b4f47]">
          Showing {start} - {end} of {totalItems} Notifications
        </p>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <PaginationIconButton disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
            <ChevronLeft size={15} />
          </PaginationIconButton>

          {paginationItems.map((item) =>
            String(item).startsWith("ellipsis") ? (
              <span key={item} className="px-1 text-[13px] font-semibold text-[#7a6d66]">
                ...
              </span>
            ) : (
              <PaginationButton key={item} isActive={item === currentPage} onClick={() => onPageChange(item)}>
                {item}
              </PaginationButton>
            ),
          )}

          <PaginationIconButton
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight size={15} />
          </PaginationIconButton>
        </div>
      </div>
    </div>
  );
}

function PaginationButton({ children, isActive = false, onClick }) {
  return (
    <button
      className={[
        "inline-flex h-8 min-w-8 items-center justify-center rounded-[8px] border px-2.5 text-[13px] font-semibold transition",
        "cursor-pointer",
        isActive
          ? "border-[#cf6e38] bg-[#cf6e38] text-white"
          : "border-transparent bg-transparent text-[#635751] hover:border-[#e5d8cf] hover:bg-[#faf6f2]",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
