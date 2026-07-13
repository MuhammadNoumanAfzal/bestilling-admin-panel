import { ChevronLeft, ChevronRight, Eye, Mail, MessageSquareText, Smartphone } from "lucide-react";

const audienceClasses = {
  Customers: "bg-[#fff1e8] text-[#d46b36]",
  Vendors: "bg-[#f3f0ff] text-[#6e67d8]",
  "All User": "bg-[#e6f3ff] text-[#3f86d8]",
};

const statusClasses = {
  Sent: "bg-[#f6f2ef] text-[#4d433d]",
  Scheduled: "bg-[#fff2ea] text-[#d06734]",
  Draft: "bg-[#f4f1ef] text-[#8d8178]",
  Failed: "bg-[#ffe7e1] text-[#d94d3f]",
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
  sms: {
    icon: Smartphone,
    label: "SMS",
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
        statusClasses[status] || statusClasses.Draft,
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
    <div className="overflow-hidden rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)] m-2">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full border-collapse">
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-4 py-4 text-[13px] font-bold text-[#9b8f86]">
                Notifications Title
              </th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">
                Audience
              </th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">
                Method
              </th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">
                Status
              </th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">
                Scheduled Date
              </th>
              <th className="px-4 py-4 text-right text-[13px] font-bold text-[#9b8f86]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]" colSpan={6}>
                  No notifications match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-[#f1e9e2] last:border-b-0">
                  <td className="px-4 py-4 align-middle">
                    <p className="max-w-[360px] text-[16px] font-semibold leading-6 text-[#18120f]">{row.title}</p>
                  </td>
                  <td className="px-3 py-4 align-middle">
                    <AudienceBadge audience={row.audience} />
                  </td>
                  <td className="px-3 py-4 align-middle">
                    <ChannelDots channels={row.channels} />
                  </td>
                  <td className="px-3 py-4 align-middle">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-4 align-middle text-[15px] font-medium text-[#18120f]">
                    {row.scheduledAt}
                  </td>
                  <td className="px-4 py-4 align-middle text-right">
                    <button
                      className="inline-flex cursor-pointer items-center gap-1.5 text-[15px] font-semibold text-[#18120f] transition hover:text-[#cf6e38]"
                      onClick={() => onViewDetails(row)}
                      type="button"
                    >
                      <Eye size={15} />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
