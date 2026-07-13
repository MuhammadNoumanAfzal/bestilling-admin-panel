import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const typeClasses = {
  Vendor: "bg-[#f3f0ff] text-[#6e67d8]",
  Customer: "bg-[#fff1e8] text-[#d46b36]",
};

const statusClasses = {
  Open: "bg-[#e9fff0] text-[#219653]",
  Resolved: "bg-[#e9fff0] text-[#219653]",
  "In Progress": "bg-[#fff4e6] text-[#d46b36]",
};

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

function TypeBadge({ type }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold leading-none",
        typeClasses[type] || typeClasses.Customer,
      ].join(" ")}
    >
      {type}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold leading-none",
        statusClasses[status] || statusClasses.Open,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

export default function SupportTicketsTable({
  currentPage,
  onPageChange,
  pageSize,
  rows,
  totalItems,
}) {
  const navigate = useNavigate();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-[1120px] w-full border-collapse">
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-4 py-4 text-[13px] font-bold text-[#9b8f86]"># Ticket ID</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">User</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">User Type</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Subject</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Category</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Created</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Status</th>
              <th className="px-4 py-4 text-right text-[13px] font-bold text-[#9b8f86]">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#f1e9e2] last:border-b-0">
                <td className="px-4 py-4 text-[13px] font-semibold text-[#2a1e17]">{row.id}</td>
                <td className="px-3 py-4">
                  <div>
                    <p className="text-[13px] font-bold text-[#2a1e17]">{row.user}</p>
                    <p className="text-[11px] text-[#8a7d74]">{row.email}</p>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <TypeBadge type={row.type} />
                </td>
                <td className="px-3 py-4">
                  <p className="max-w-[250px] text-[13px] leading-5 text-[#443933]">{row.subject}</p>
                </td>
                <td className="px-3 py-4 text-[13px] font-medium text-[#584c45]">{row.category}</td>
                <td className="px-3 py-4 text-[13px] font-medium text-[#584c45]">{row.created}</td>
                <td className="px-3 py-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-bold text-[#2a1e17] transition hover:text-[#cf6e38]"
                    onClick={() => navigate(`/support/${row.id}`)}
                    type="button"
                  >
                    <Eye size={14} />
                    <span>View Ticket</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#eee4dd] px-4 py-4 text-[13px] text-[#6c6058] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {start} - {end} of {totalItems} Tickets
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
