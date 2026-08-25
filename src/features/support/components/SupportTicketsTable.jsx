import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  formatPriorityLabel,
  formatReadableDate,
  formatStatusLabel,
  formatUserTypeLabel,
} from "../supportUtils.js";

const statusClasses = {
  OPEN: "bg-[#fff1bf] text-[#e39a00]",
  RESOLVED: "bg-[#18b63f] text-white",
  IN_PROGRESS: "bg-[#bedeff] text-[#2e7cd8]",
  CLOSED: "bg-[#ece6e1] text-[#6b5f57]",
};

const priorityClasses = {
  LOW: "bg-[#eef8ef] text-[#2f8f57]",
  MEDIUM: "bg-[#fff3e8] text-[#cf6e38]",
  HIGH: "bg-[#fff0cf] text-[#d99615]",
  URGENT: "bg-[#ffe9e4] text-[#c44a31]",
};

function PaginationButton({ children, isActive = false, onClick }) {
  return (
    <button
      className={[
        "inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-[8px] border px-2.5 text-[13px] font-semibold transition",
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

function PaginationIconButton({ children, disabled = false, onClick }) {
  return (
    <button
      className={[
        "inline-flex h-8 w-8 items-center justify-center rounded-[8px] border text-[#83766f] transition",
        disabled
          ? "cursor-not-allowed border-[#ebe1d9] bg-[#f7f3f0] text-[#c4b8b0]"
          : "cursor-pointer border-[#e6dad1] hover:bg-[#faf5f1]",
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function Avatar({ label, src }) {
  return (
    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#f4eee9]">
      {src ? (
        <img alt={label} className="h-full w-full object-cover" src={src} />
      ) : (
        <span className="inline-flex h-full w-full items-center justify-center text-[11px] font-bold text-[#2f241d]">
          {label}
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold leading-none",
        statusClasses[status] || statusClasses.OPEN,
      ].join(" ")}
    >
      {formatStatusLabel(status)}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold",
        priorityClasses[priority] || priorityClasses.MEDIUM,
      ].join(" ")}
    >
      {formatPriorityLabel(priority)}
    </span>
  );
}

function MobileTicketCard({ row, onOpen }) {
  return (
    <article
      className="rounded-[18px] border border-[#eaded5] bg-[linear-gradient(180deg,#fffdfa_0%,#fff8f2_100%)] p-4 shadow-[0_10px_22px_rgba(56,33,17,0.05)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar label={row.avatarInitials} src={row.avatarUrl} />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Ticket #{row.id}</p>
            <p className="truncate text-[15px] font-bold text-[#18120f]">{row.user}</p>
            <p className="truncate text-[12px] text-[#7a6d66]">{row.email || "No email"}</p>
          </div>
        </div>
        <StatusBadge status={row.status} />
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Subject</p>
          <p className="mt-1 text-[14px] font-semibold leading-6 text-[#241a15]">{row.subject}</p>
          {row.unreadAdminCount ? (
            <p className="mt-1 text-[11px] font-semibold text-[#cf6e38]">
              {row.unreadAdminCount} unread for admin
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">User Type</p>
            <p className="mt-1 text-[13px] font-semibold text-[#241a15]">{formatUserTypeLabel(row.type)}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Category</p>
            <p className="mt-1 break-words text-[13px] font-semibold text-[#241a15]">{row.category}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Priority</p>
            <div className="mt-1">
              <PriorityBadge priority={row.priority} />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Last Activity</p>
            <p className="mt-1 text-[13px] font-semibold text-[#241a15]">
              {row.lastMessageAt ? formatReadableDate(row.lastMessageAt) : row.created}
            </p>
          </div>
        </div>
      </div>

      <button
        className="mt-4 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-[#e1d3c8] bg-white text-[13px] font-bold text-[#241a15] transition hover:border-[#cf6e38]/40 hover:bg-[#fff8f2] hover:text-[#cf6e38]"
        onClick={onOpen}
        type="button"
      >
        <Eye size={15} />
        View Ticket
      </button>
    </article>
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

export default function SupportTicketsTable({
  currentPage,
  onPageChange,
  pageInfo,
  rows,
}) {
  const navigate = useNavigate();
  const totalItems = pageInfo?.totalItems ?? 0;
  const totalPages = Math.max(1, pageInfo?.totalPages ?? 1);
  const pageSize = pageInfo?.pageSize ?? 10;
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <div className="m-2 overflow-hidden rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="space-y-3 p-3 md:hidden">
        {rows.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-[#e3d7cf] bg-[#fcfaf8] px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]">
            No support tickets match the current filters.
          </div>
        ) : (
          rows.map((row) => (
            <MobileTicketCard
              key={row.id}
              row={row}
              onOpen={() => navigate(`/support/${row.id}`)}
            />
          ))
        )}
      </div>

      <div className="hidden w-full overflow-x-auto md:block lg:overflow-x-visible">
        <table className="w-full table-fixed border-collapse">
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="w-[7%] px-4 py-3 text-[12px] font-bold text-[#9b8f86]">Ticket ID</th>
              <th className="w-[16%] px-2.5 py-3 text-[12px] font-bold text-[#9b8f86]">Requester</th>
              <th className="w-[10%] px-2.5 py-3 text-[12px] font-bold text-[#9b8f86]">Type</th>
              <th className="w-[15%] px-2.5 py-3 text-[12px] font-bold text-[#9b8f86]">Subject</th>
              <th className="w-[9%] px-2.5 py-3 text-[12px] font-bold text-[#9b8f86]">Priority</th>
              <th className="w-[10%] px-2.5 py-3 text-[12px] font-bold text-[#9b8f86]">Category</th>
              <th className="w-[12%] px-2.5 py-3 text-[12px] font-bold text-[#9b8f86]">Last Activity</th>
              <th className="w-[8%] px-2.5 py-3 text-[12px] font-bold text-[#9b8f86]">Status</th>
              <th className="w-[13%] px-4 py-3 text-right text-[12px] font-bold text-[#9b8f86]">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]" colSpan={9}>
                  No support tickets match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-[#f1e9e2] transition hover:bg-[#fffaf6] last:border-b-0"
                  onClick={() => navigate(`/support/${row.id}`)}
                >
                  <td className="px-4 py-3.5 text-[14px] font-medium text-[#18120f]">#{row.id}</td>
                  <td className="px-2.5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar label={row.avatarInitials} src={row.avatarUrl} />
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-bold text-[#18120f]">{row.user}</p>
                        <p className="truncate text-[11px] text-[#5a4d46]">{row.email || "No email"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2.5 py-3.5 text-[14px] font-medium text-[#18120f]">{formatUserTypeLabel(row.type)}</td>
                  <td className="px-2.5 py-3.5">
                    <p className="break-words text-[14px] leading-5 text-[#18120f]">{row.subject}</p>
                    {row.unreadAdminCount ? (
                      <p className="mt-1 text-[11px] font-semibold text-[#cf6e38]">
                        {row.unreadAdminCount} unread for admin
                      </p>
                    ) : null}
                  </td>
                  <td className="px-2.5 py-3.5">
                    <PriorityBadge priority={row.priority} />
                  </td>
                  <td className="px-2.5 py-3.5 text-[14px] font-medium text-[#18120f] break-words">{row.category}</td>
                  <td className="px-2.5 py-3.5 text-[13px] font-medium text-[#18120f]">
                    {row.lastMessageAt ? formatReadableDate(row.lastMessageAt) : row.created}
                  </td>
                  <td className="px-2.5 py-3.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      className="inline-flex min-w-[108px] cursor-pointer items-center justify-end gap-1 whitespace-nowrap text-[14px] font-semibold text-[#18120f] transition hover:text-[#cf6e38]"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/support/${row.id}`);
                      }}
                      type="button"
                    >
                      <Eye size={15} />
                      <span>View Ticket</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#eee4dd] px-4 py-4 text-[13px] text-[#6c6058] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {start} - {end} of {totalItems} Tickets
        </p>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
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

          <PaginationIconButton disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
            <ChevronRight size={15} />
          </PaginationIconButton>
        </div>
      </div>
    </div>
  );
}
