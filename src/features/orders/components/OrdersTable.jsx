import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

const statusClasses = {
  Accepted: "bg-[#fff3d9] text-[#9c6a00]",
  Preparing: "bg-[#fff0e7] text-[#cf6e38]",
  "Out for delivery": "bg-[#edf5ff] text-[#296db8]",
  Delivered: "bg-[#edf8f1] text-[#2b9e62]",
  Canceled: "bg-[#feecec] text-[#d83f3f]",
  Refunded: "bg-[#f3eefb] text-[#7a51b3]",
  Pending: "bg-[#f4efe9] text-[#7a6d66]",
};

const paymentClasses = {
  Paid: "text-[#2b9e62]",
  Failed: "text-[#d83f3f]",
  Refunded: "text-[#7a51b3]",
  "Partially refunded": "text-[#b5751a]",
  Pending: "text-[#8c8077]",
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
        "inline-flex h-8 min-w-8 items-center justify-center rounded-[8px] border px-2.5 text-[13px] font-semibold transition",
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

function PersonCell({ name, src, subtitle, avatar }) {
  return (
    <div className="flex items-center gap-2.5">
      {src ? (
        <img alt={name} className="h-9 w-9 rounded-full border border-[#eee4dd] object-cover" src={src} />
      ) : (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f6eee8] text-[10px] font-bold text-[#2f241d]">
          {avatar}
        </span>
      )}

      <div className="min-w-0">
        <p className="truncate text-[14px] font-bold leading-5 text-[#18120f]">{name}</p>
        <p className="truncate text-[11px] text-[#5a4d46]">{subtitle}</p>
      </div>
    </div>
  );
}

export default function OrdersTable({
  activeActionOrderId = "",
  orders,
  currentPage,
  pageSize,
  totalItems,
  onOrderAction,
  onPageChange,
}) {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState("");

  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  function openOrder(orderId) {
    navigate(`/orders/${encodeURIComponent(orderId)}`);
  }

  function handleOrderAction(row, action) {
    onOrderAction?.(row, action);
    setActiveMenuId("");
  }

  return (
    <div className="overflow-visible rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)] md:overflow-hidden">
      <div className="hidden w-full overflow-x-auto md:block">
        <table className="w-full min-w-[980px] border-collapse">
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Order</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Customer</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Vendor</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Event</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Placed</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Amount</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Status</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Payment</th>
              <th className="w-16 px-3 py-4 text-right text-[13px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]" colSpan={9}>
                  No orders match the current filters.
                </td>
              </tr>
            ) : (
              orders.map((row) => {
                const isMenuOpen = activeMenuId === row.id;

                return (
                  <tr
                    key={row.id}
                    className="border-b border-[#f1e9e2] transition hover:bg-[#faf9f8] last:border-b-0"
                  >
                    <td className="px-3 py-4 align-middle">
                      <button
                        className="text-left"
                        onClick={() => openOrder(row.id)}
                        type="button"
                      >
                        <span className="block text-[14px] font-bold text-[#d96834] hover:underline">
                          {row.orderNumber}
                        </span>
                        <span className="block text-[11px] text-[#7a6d66]">
                          ID {row.id} · {row.guestCount} guests
                        </span>
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
                    <td className="px-3 py-4 align-middle text-[14px] text-[#18120f]">
                      {row.eventType}
                    </td>
                    <td className="px-3 py-4 align-middle text-[14px] text-[#18120f]">
                      {row.dateTime}
                    </td>
                    <td className="px-3 py-4 align-middle text-[14px] font-bold text-[#18120f]">
                      {row.amount}
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          statusClasses[row.status] || statusClasses.Pending
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 align-middle text-[13px] font-bold">
                      <span className={paymentClasses[row.paymentStatus] || paymentClasses.Pending}>
                        {row.paymentStatus}
                      </span>
                    </td>
                    <td className="relative px-3 py-4 text-right align-middle">
                      <button
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#6f655e] transition hover:bg-[#f1e9e2] hover:text-[#1f1711]"
                        onClick={() => setActiveMenuId((current) => (current === row.id ? "" : row.id))}
                        type="button"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {isMenuOpen ? (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId("")} />
                          <div className="absolute right-4 top-10 z-30 w-36 rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)]">
                            <button
                              className="block w-full px-3 py-1.5 text-left text-[12px] font-semibold text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                              onClick={() => {
                                openOrder(row.id);
                                setActiveMenuId("");
                              }}
                              type="button"
                            >
                              View Details
                            </button>
                            {row.actions?.canMarkPaid ? (
                              <button
                                className="block w-full px-3 py-1.5 text-left text-[12px] font-semibold text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                                disabled={activeActionOrderId === row.id}
                                onClick={() => handleOrderAction(row, "markPaid")}
                                type="button"
                              >
                                {activeActionOrderId === row.id ? "Updating..." : "Mark Paid"}
                              </button>
                            ) : null}
                            {row.actions?.canMarkDelivered ? (
                              <button
                                className="block w-full px-3 py-1.5 text-left text-[12px] font-semibold text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                                disabled={activeActionOrderId === row.id}
                                onClick={() => handleOrderAction(row, "markDelivered")}
                                type="button"
                              >
                                {activeActionOrderId === row.id ? "Updating..." : "Mark Delivered"}
                              </button>
                            ) : null}
                            {row.actions?.canRefund ? (
                              <button
                                className="block w-full px-3 py-1.5 text-left text-[12px] font-semibold text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                                disabled={activeActionOrderId === row.id}
                                onClick={() => handleOrderAction(row, "refund")}
                                type="button"
                              >
                                {activeActionOrderId === row.id ? "Updating..." : "Refund"}
                              </button>
                            ) : null}
                            {row.actions?.canCancel ? (
                              <button
                                className="block w-full px-3 py-1.5 text-left text-[12px] font-semibold text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                                disabled={activeActionOrderId === row.id}
                                onClick={() => handleOrderAction(row, "cancel")}
                                type="button"
                              >
                                {activeActionOrderId === row.id ? "Updating..." : "Cancel Order"}
                              </button>
                            ) : null}
                            {row.actions?.canDownloadInvoice ? (
                              <button
                                className="block w-full px-3 py-1.5 text-left text-[12px] font-semibold text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                                disabled={activeActionOrderId === row.id}
                                onClick={() => handleOrderAction(row, "downloadInvoice")}
                                type="button"
                              >
                                {activeActionOrderId === row.id ? "Opening..." : "Download Invoice"}
                              </button>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {orders.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-[#ddd4cb] px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]">
            No orders match the current filters.
          </div>
        ) : (
          orders.map((row) => (
            <article
              key={row.id}
              className="rounded-[18px] border border-[#e8ddd5] bg-[#fcfbfa] p-4 shadow-[0_8px_20px_rgba(56,33,17,0.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <button
                    className="text-left text-[15px] font-bold text-[#d96834] hover:underline"
                    onClick={() => openOrder(row.id)}
                    type="button"
                  >
                    {row.orderNumber}
                  </button>
                  <p className="mt-1 text-[12px] text-[#7a6d66]">ID {row.id} · {row.dateTime}</p>
                </div>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    statusClasses[row.status] || statusClasses.Pending
                  }`}
                >
                  {row.status}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-[13px] text-[#4d423b]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#8c8077]">Customer</span>
                  <span className="text-right font-bold text-[#18120f]">{row.customer}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#8c8077]">Vendor</span>
                  <span className="text-right font-bold text-[#18120f]">{row.vendor}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#8c8077]">Amount</span>
                  <span className="font-bold text-[#18120f]">{row.amount}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#8c8077]">Payment</span>
                  <span className={`font-bold ${paymentClasses[row.paymentStatus] || paymentClasses.Pending}`}>
                    {row.paymentStatus}
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#eee4dd] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-[#7a6d66]">
          Showing <span className="font-semibold text-[#18120f]">{start}</span> -{" "}
          <span className="font-semibold text-[#18120f]">{end}</span> of{" "}
          <span className="font-semibold text-[#18120f]">{totalItems}</span> orders
        </p>

        <div className="flex items-center gap-1.5">
          <PaginationIconButton disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
            <ChevronLeft size={15} />
          </PaginationIconButton>

          {paginationItems.map((item) =>
            String(item).includes("ellipsis") ? (
              <span key={item} className="px-1 text-[#998d82]">
                ...
              </span>
            ) : (
              <PaginationButton
                key={item}
                isActive={currentPage === item}
                onClick={() => onPageChange(item)}
              >
                {item}
              </PaginationButton>
            ),
          )}

          <PaginationIconButton
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight size={15} />
          </PaginationIconButton>
        </div>
      </div>
    </div>
  );
}
