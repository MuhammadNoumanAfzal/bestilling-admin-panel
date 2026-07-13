import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

const statusClasses = {
  Active: "bg-[#18b24b] text-white",
  Blocked: "bg-[#dd1111] text-white",
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
        "inline-flex min-w-[74px] justify-center rounded-full px-3 py-1.5 text-[11px] font-bold leading-none",
        statusClasses[status] || statusClasses.Active,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function Avatar({ label, tone = "orange" }) {
  const toneClass =
    tone === "dark"
      ? "bg-[linear-gradient(135deg,#2f241d_0%,#534038_100%)] text-white"
      : "bg-[linear-gradient(135deg,#f5d4bf_0%,#d87a45_100%)] text-white";

  return (
    <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${toneClass}`}>
      {label}
    </span>
  );
}

export default function CustomersTable({ currentPage, onPageChange, pageSize, rows, totalItems }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <div className="m-2 overflow-hidden rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse">
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-4 py-4 text-[12px] font-bold text-[#9b8f86]">Customer ID</th>
              <th className="px-3 py-4 text-[12px] font-bold text-[#9b8f86]">Customer</th>
              <th className="px-3 py-4 text-[12px] font-bold text-[#9b8f86]">Phone</th>
              <th className="px-3 py-4 text-[12px] font-bold text-[#9b8f86]">City</th>
              <th className="px-3 py-4 text-[12px] font-bold text-[#9b8f86]">Total Orders</th>
              <th className="px-3 py-4 text-[12px] font-bold text-[#9b8f86]">Amount</th>
              <th className="px-3 py-4 text-[12px] font-bold text-[#9b8f86]">Status</th>
              <th className="px-4 py-4 text-right text-[12px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-b border-[#f1e9e2] last:border-b-0">
                <td className={`px-4 py-4 text-[13px] font-semibold text-[#2a1e17] ${index === 0 ? "pt-5" : ""}`}>
                  {row.id}
                </td>
                <td className={`px-3 py-4 ${index === 0 ? "pt-5" : ""}`}>
                  <div className="flex items-center gap-3">
                    <Avatar label={row.avatar} tone={index % 2 === 0 ? "orange" : "dark"} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-[#2a1e17]">{row.name}</p>
                      <p className="truncate text-[11px] text-[#8a7d74]">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className={`px-3 py-4 text-[13px] font-medium text-[#584c45] ${index === 0 ? "pt-5" : ""}`}>
                  {row.phone}
                </td>
                <td className={`px-3 py-4 text-[13px] font-medium text-[#584c45] ${index === 0 ? "pt-5" : ""}`}>
                  {row.city}
                </td>
                <td className={`px-3 py-4 text-[13px] font-medium text-[#584c45] ${index === 0 ? "pt-5" : ""}`}>
                  {row.totalOrders}
                </td>
                <td className={`px-3 py-4 text-[13px] font-semibold text-[#2a1e17] ${index === 0 ? "pt-5" : ""}`}>
                  {row.amount}
                </td>
                <td className={`px-3 py-4 ${index === 0 ? "pt-5" : ""}`}>
                  <StatusBadge status={row.status} />
                </td>
                <td className={`px-4 py-4 text-right ${index === 0 ? "pt-5" : ""}`}>
                  <button
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#2a1e17] transition hover:bg-[#fff4ec] hover:text-[#cf6e38]"
                    type="button"
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center border-t border-[#eee4dd] px-4 py-3">
        <button
          className="inline-flex cursor-pointer items-center justify-center text-[13px] font-semibold text-[#564942] transition hover:text-[#cf6e38]"
          type="button"
        >
          View all
        </button>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#eee4dd] px-4 py-4 text-[13px] text-[#6c6058] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {start} - {end} of {totalItems} Orders
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
