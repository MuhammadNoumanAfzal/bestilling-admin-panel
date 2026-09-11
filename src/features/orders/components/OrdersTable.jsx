import { ot, useOrderLanguage, orderDate } from "../orderTranslation.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

const statusClasses = {
  Ready: "bg-[#edf8f1] text-[#2b9e62]",
  Accepted: "bg-[#fffbeb] text-[#b45309]",
  Modified: "bg-[#fff4ea] text-[#cb6b2f]",
  Preparing: "bg-[#fff7ed] text-[#c2410c]",
  "Out for delivery": "bg-[#edf5ff] text-[#296db8]",
  Delivered: "bg-[#edf8f1] text-[#2b9e62]",
  Canceled: "bg-[#feecec] text-[#d83f3f]",
  Refunded: "bg-[#f3eefb] text-[#7a51b3]",
  Pending: "bg-[#fffbeb] text-[#b45309]",
};

const paymentClasses = {
  Paid: "text-[#2b9e62]",
  Failed: "text-[#d83f3f]",
  Refunded: "text-[#7a51b3]",
  "Partially refunded": "text-[#b5751a]",
  "Refund pending": "text-[#b45309]",
  Cancelled: "text-[#6f645d]",
  Pending: "text-[#b45309]",
  Reported: "text-[#296db8]",
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
  useOrderLanguage();
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

function PaginationIconButton({ children, disabled = false, onClick, label }) {
  useOrderLanguage();
  return (
    <button
      className={[
        "inline-flex h-8 w-8 items-center justify-center rounded-[8px] border text-[#83766f] transition",
        disabled
          ? "cursor-not-allowed border-[#ebe1d9] bg-[#f7f3f0] text-[#c4b8b0]"
          : "border-[#e6dad1] hover:bg-[#faf5f1]",
      ].join(" ")}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function PersonCell({ name, src, subtitle, avatar }) {
  useOrderLanguage();
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
  useOrderLanguage();
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
    <div className="[&_button:enabled]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_a[href]]:cursor-pointer overflow-visible rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)] md:overflow-hidden">
      <div className="hidden w-full overflow-x-auto md:block">
        <table className="w-full min-w-[980px] border-collapse">
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">{ot("Order")}</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">{ot("Customer")}</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">{ot("Vendor")}</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">{ot("Event")}</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">{ot("Placed")}</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">{ot("Amount")}</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">{ot("Status")}</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">{ot("Payment")}</th>
              <th className="w-16 px-3 py-4 text-right text-[13px] font-bold text-[#9b8f86]">{ot("Actions")}</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]" colSpan={9}>{ot("No orders match the current filters.")}</td>
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
                        <span className="block text-[11px] text-[#7a6d66]">{ot("ID")}{row.id} · {row.guestCount}{ot("guests")}</span>
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
                      {ot(row.eventType)}
                    </td>
                    <td className="px-3 py-4 align-middle text-[14px] text-[#18120f]">
                      {orderDate(row.placedAt || row.dateTime)}
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
                        {ot(row.status)}
                      </span>
                    </td>
                    <td className="px-3 py-4 align-middle text-[13px] font-bold">
                      <span className={paymentClasses[row.paymentStatus] || paymentClasses.Pending}>
                        {ot(row.paymentStatus)}
                      </span>
                    </td>
                    <td className="relative px-3 py-4 text-right align-middle">
                      <button
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#6f655e] transition hover:bg-[#f1e9e2] hover:text-[#1f1711]"
                        aria-label={ot("More actions")}
                        onClick={() => setActiveMenuId((current) => (current === row.id ? "" : row.id))}
                        type="button"
                      >
                        <MoreVertical size={14} aria-label={ot("More actions")} />
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
                            >{ot("View Details")}</button>
                            {row.actions?.canDownloadInvoice ? (
                              <button
                                className="block w-full px-3 py-1.5 text-left text-[12px] font-semibold text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38]"
                                disabled={activeActionOrderId === row.id}
                                onClick={() => handleOrderAction(row, "downloadInvoice")}
                                type="button"
                              >
                                {activeActionOrderId === row.id ? ot("Opening...") : ot("Download Invoice")}
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
          <div className="rounded-[14px] border border-dashed border-[#ddd4cb] px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]">{ot("No orders match the current filters.")}</div>
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
                  <p className="mt-1 text-[12px] text-[#7a6d66]">{ot("ID")}{" "}{row.id} · {orderDate(row.placedAt || row.dateTime)}</p>
                </div>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    statusClasses[row.status] || statusClasses.Pending
                  }`}
                >
                  {ot(row.status)}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-[13px] text-[#4d423b]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#8c8077]">{ot("Customer")}</span>
                  <span className="text-right font-bold text-[#18120f]">{row.customer}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#8c8077]">{ot("Vendor")}</span>
                  <span className="text-right font-bold text-[#18120f]">{row.vendor}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#8c8077]">{ot("Amount")}</span>
                  <span className="font-bold text-[#18120f]">{row.amount}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#8c8077]">{ot("Payment")}</span>
                  <span className={`font-bold ${paymentClasses[row.paymentStatus] || paymentClasses.Pending}`}>
                    {ot(row.paymentStatus)}
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#eee4dd] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-[#7a6d66]">{ot("Showing {{start}} - {{end}} of {{total}} orders", { start, end, total: totalItems })}</p>

        <div className="flex items-center gap-1.5">
          <PaginationIconButton label={ot("Previous page")} disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
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
            label={ot("Next page")}
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
