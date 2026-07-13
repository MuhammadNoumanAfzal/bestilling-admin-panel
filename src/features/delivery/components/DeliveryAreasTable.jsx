import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusClasses = {
  Active: "bg-[#e9fff0] text-[#219653]",
  Inactive: "bg-[#f1eeeb] text-[#7d7068]",
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

function StatusBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold leading-none",
        statusClasses[status] || statusClasses.Active,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

export default function DeliveryAreasTable({ currentPage, onPageChange, pageSize, rows, totalItems }) {
  const navigate = useNavigate();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)] m-2">
      <div className="w-full">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[14%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
            <col className="w-[14%]" />
            <col className="w-[16%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-4 py-5 text-[13px] font-bold text-[#9b8f86]">City</th>
              <th className="px-3 py-5 text-[13px] font-bold text-[#9b8f86]">Region</th>
              <th className="px-3 py-5 text-[13px] font-bold text-[#9b8f86]">Active Postal Codes</th>
              <th className="px-3 py-5 text-[13px] font-bold text-[#9b8f86]">Registered Vendors</th>
              <th className="px-3 py-5 text-[13px] font-bold text-[#9b8f86]">Coverage Status</th>
              <th className="px-3 py-5 text-[13px] font-bold text-[#9b8f86]">Last Updated</th>
              <th className="px-4 py-5 text-right text-[13px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>

          <tbody className="[&_tr:first-child_td]:pt-6">
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#f1e9e2] last:border-b-0">
                <td className="px-4 py-4 text-[13px] font-semibold text-[#2a1e17]">{row.city}</td>
                <td className="px-3 py-4 text-[13px] font-medium text-[#584c45]">{row.region}</td>
                <td className="px-3 py-4 text-[13px] font-medium text-[#584c45]">{row.activePostalCodes}</td>
                <td className="px-3 py-4 text-[13px] font-medium text-[#584c45]">{row.vendors}</td>
                <td className="px-3 py-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-3 py-4 text-[13px] font-medium text-[#584c45]">{row.updatedAt}</td>
                <td className="px-4 py-4 text-right">
                  <button
                    className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[12px] font-bold text-[#cf6e38] transition hover:text-[#b75d31]"
                    onClick={() => navigate(`/delivery/${row.id}`)}
                    type="button"
                  >
                    Manage Area
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#eee4dd] px-4 py-4 text-[13px] text-[#6c6058] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {start} - {end} of {totalItems} Areas
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
