import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

const statusClasses = {
  Delivered: "bg-[#2b9e62] text-white",
  Pending: "bg-[#ffb300] text-[#1d1713]",
  Canceled: "bg-[#d83f3f] text-white",
};

const paymentClasses = {
  Paid: "text-[#2b9e62] font-bold text-[13px]",
  Pending: "text-[#c8881b] font-bold text-[13px]",
  Refund: "text-[#8d8178] font-bold text-[13px]",
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

function PersonCell({ name, src, subtitle, avatar }) {
  return (
    <div className="flex items-center gap-2.5">
      {src ? (
        <img alt={name} className="h-9 w-9 shrink-0 rounded-full object-cover border border-[#eee4dd]" src={src} />
      ) : (
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f6eee8] text-[10px] font-bold text-[#2f241d]">
          {avatar}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-[15px] font-bold leading-5 text-[#18120f]">{name}</p>
        <p className="truncate text-[11px] text-[#5a4d46]">{subtitle}</p>
      </div>
    </div>
  );
}

export default function OrdersTable({
  orders,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}) {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(orders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)] mt-4">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="w-12 px-3 py-4 text-center">
                <input
                  type="checkbox"
                  checked={orders.length > 0 && selectedIds.length === orders.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-[#d8ccc2] text-[#d96834] focus:ring-[#cf6e38] cursor-pointer"
                />
              </th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Order ID</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Customer</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Vendor</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Event Type</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Date & Time</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Amount</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Status</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Payment</th>
              <th className="w-20 px-4 py-4 text-right text-[13px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]" colSpan={10}>
                  No orders match the current filters.
                </td>
              </tr>
            ) : (
              orders.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                const isMenuOpen = activeMenuId === row.id;

                return (
                  <tr
                    key={row.id}
                    className={`border-b border-[#f1e9e2] last:border-b-0 transition hover:bg-[#faf9f8] ${
                      isSelected ? "bg-[#fffcf8]" : ""
                    }`}
                  >
                    <td className="px-3 py-4 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(row.id)}
                        className="h-4 w-4 rounded border-[#d8ccc2] text-[#d96834] focus:ring-[#cf6e38] cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-4 text-[15px] font-semibold text-[#18120f] align-middle">
                      <button
                        onClick={() => navigate(`/orders/${encodeURIComponent(row.id.replace("#", ""))}`)}
                        className="text-[#d96834] hover:underline cursor-pointer font-bold outline-none text-left"
                      >
                        {row.id}
                      </button>
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <PersonCell
                        avatar={row.customerAvatar}
                        name={row.customer}
                        src={row.customerAvatarUrl}
                        subtitle={row.customerEmail}
                      />
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <PersonCell
                        avatar={row.vendorAvatar}
                        name={row.vendor}
                        src={row.vendorAvatarUrl}
                        subtitle={row.vendorCity}
                      />
                    </td>
                    <td className="px-3 py-4 text-[15px] font-medium text-[#18120f] align-middle">
                      {row.eventType}
                    </td>
                    <td className="px-3 py-4 text-[15px] text-[#18120f] align-middle">
                      {row.dateTime}
                    </td>
                    <td className="px-3 py-4 text-[15px] font-bold text-[#18120f] align-middle">
                      {row.amount}
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <span
                        className={`inline-flex min-w-[76px] justify-center rounded-full px-2.5 py-1 text-[11px] font-bold leading-none ${
                          statusClasses[row.status] || "bg-[#fcfbfa] text-[#6f655e]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <span className={paymentClasses[row.paymentStatus] || "text-[#18120f] font-medium"}>
                        {row.paymentStatus}
                      </span>
                    </td>
                    <td className="relative px-4 py-4 text-right align-middle">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#6f655e] transition hover:bg-[#f1e9e2] hover:text-[#1f1711] cursor-pointer"
                        type="button"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {isMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                          <div className="absolute right-4 top-10 z-30 w-36 rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left">
                            <button
                              onClick={() => {
                                navigate(`/orders/${encodeURIComponent(row.id.replace("#", ""))}`);
                                setActiveMenuId(null);
                              }}
                              className="block w-full px-3 py-1.5 text-[12px] font-semibold text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38] cursor-pointer"
                              type="button"
                            >
                              View Details
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col gap-4 border-t border-[#eee4dd] px-4 py-4 text-[13px] text-[#6c6058] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] text-[#5b4f47]">
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

          <PaginationIconButton disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
            <ChevronRight size={15} />
          </PaginationIconButton>
        </div>
      </div>
    </div>
  );
}
