import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./PayoutsTable.css";

const orderStatusClasses = {
  Delivered: "bg-[#17b84a] text-white",
  Canceled: "bg-[#d80f0f] text-white",
  "In progress": "bg-[#ffe8a6] text-[#b78600]",
  Unknown: "bg-[#f2eeea] text-[#79685b]",
};

const paymentStatusClasses = {
  Paid: "bg-[#17b84a] text-white",
  Canceled: "bg-[#d80f0f] text-white",
  Pending: "bg-[#ffe8a6] text-[#b78600]",
  Scheduled: "bg-[#eef4ff] text-[#4b74c6]",
  Released: "bg-[#e9fff0] text-[#219653]",
  Reported: "bg-[#eef4ff] text-[#4b74c6]",
  Refunded: "bg-[#f3eefb] text-[#7a51b3]",
};

const tableViews = [
  { id: "order", label: "Order Details" },
  { id: "customer", label: "Customer Payment" },
  { id: "vendor", label: "Vendor Payment" },
];

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

function StatusBadge({ status, variant = "order" }) {
  const classes = variant === "payment" ? paymentStatusClasses : orderStatusClasses;
  const label = variant === "order" && ["Awaiting acceptance", "Accepted", "Preparing", "Ready", "Out for delivery"].includes(status)
    ? "In progress"
    : status || "Unknown";

  return (
    <span
      className={[
        "inline-flex min-w-[74px] whitespace-nowrap justify-center rounded-full px-2.5 py-1 text-[11px] font-bold leading-none",
        classes[label] || "bg-[#f2eeea] text-[#79685b]",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function Avatar({ label, src }) {
  return (
    <span className="inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full">
      {src ? (
        <img alt={label} className="h-full w-full object-cover" src={src} />
      ) : (
        <span className="inline-flex h-full w-full items-center justify-center bg-[#f6eee8] text-[10px] font-bold text-[#2f241d]">
          {label}
        </span>
      )}
    </span>
  );
}

function PersonCell({ name, src, subtitle, avatar }) {
  return (
    <div className="flex max-w-[200px] items-center gap-2.5">
      <Avatar label={avatar} src={src} />
      <div className="min-w-0">
        <p className="truncate text-[15px] font-bold leading-5 text-[#18120f]">{name}</p>
        <p className="truncate text-[11px] text-[#5a4d46]">{subtitle}</p>
      </div>
    </div>
  );
}

export default function PayoutsTable({
  activeActionKey = "",
  currentPage,
  onPageChange,
  onQuickAction,
  pageSize,
  rows,
  totalItems,
}) {
  const navigate = useNavigate();
  const [view, setView] = useState("order");
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <div className="payout-table-container m-2 overflow-hidden rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="payout-view-switch flex flex-wrap gap-2 border-b border-[#eee4dd] p-3" role="group" aria-label="Payment record view">
        {tableViews.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={view === option.id}
            onClick={() => setView(option.id)}
            className={`cursor-pointer rounded-lg px-4 py-2 text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-[#cf6e38] ${view === option.id ? "bg-[#cf6e38] text-white" : "text-[#6c6058] hover:bg-[#faf5f1]"}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="w-full overflow-x-auto" role="region" aria-label="Payments table" tabIndex={0}>
        <table className={`payout-table payout-view-${view} w-full border-collapse`}>
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Order ID</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Date</th>
              <th className="payout-order-column payout-customer-column px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Customer</th>
              <th className="payout-order-column payout-vendor-column px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Vendor</th>
              <th className="payout-order-column payout-customer-column px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Order Amount</th>
              <th className="payout-order-column px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Order Status</th>
              <th className="payout-customer-column px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Customer Payment Status</th>
              <th className="payout-vendor-column px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Platform Commission</th>
              <th className="payout-vendor-column px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Vendor Amount</th>
              <th className="payout-vendor-column px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Vendor Payout Status</th>
              <th className="px-4 py-4 text-right text-[13px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]" colSpan={11}>
                  No payment records match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const customerPaymentPaid = row.customerPaymentStatus === "Paid";
                const canApproveReportedPayment = view === "customer" && row.customerPaymentStatus === "Reported" && Boolean(row.invoiceId);
                const canMarkCustomerReceived = view === "customer" && row.customerPaymentStatus === "Pending" && Boolean(row.invoiceId);
                const canMarkVendorPaid = view === "vendor" && customerPaymentPaid && !["Paid", "Canceled"].includes(row.vendorPayoutStatus);
                const showVendorPaymentWaiting = view === "vendor" && !customerPaymentPaid && row.orderStatus !== "Canceled";

                return (
                  <tr key={row.id} className="border-b border-[#f1e9e2] last:border-b-0">
                    <td className="whitespace-nowrap px-3 py-4 text-[15px] font-medium text-[#18120f]">{row.invoiceNumber}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-[13px] font-medium text-[#6c6058]">{row.date}</td>
                    <td className="payout-order-column payout-customer-column px-3 py-4">
                      <PersonCell avatar={row.customerAvatar} name={row.customer} src={row.customerAvatarUrl} subtitle={row.customerEmail} />
                    </td>
                    <td className="payout-order-column payout-vendor-column px-3 py-4">
                      <PersonCell avatar={row.vendorAvatar} name={row.vendor} src={row.vendorAvatarUrl} subtitle={row.vendorCity} />
                    </td>
                    <td className="payout-order-column payout-customer-column whitespace-nowrap px-3 py-4 text-[14px] font-medium tabular-nums text-[#18120f]">{row.orderAmount}</td>
                    <td className="payout-order-column px-3 py-4">
                      <StatusBadge status={row.orderStatus} />
                    </td>
                    <td className="payout-customer-column px-3 py-4">
                      <StatusBadge status={row.customerPaymentStatus} variant="payment" />
                    </td>
                    <td className="payout-vendor-column whitespace-nowrap px-3 py-4 text-[14px] font-semibold tabular-nums text-[#6c6058]">{row.platformCommission}</td>
                    <td className="payout-vendor-column whitespace-nowrap px-3 py-4 text-[14px] font-semibold tabular-nums text-[#cf6e38]">{row.vendorAmount}</td>
                    <td className="payout-vendor-column px-3 py-4">
                      <StatusBadge status={row.vendorPayoutStatus} variant="payment" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="ml-auto flex w-[148px] flex-col items-stretch gap-1.5">
                        {canApproveReportedPayment ? (
                          <button
                            className="inline-flex min-h-[34px] w-full items-center justify-center rounded-[10px] border border-[#cfe6d8] bg-[#edf8f1] px-2.5 text-center text-[10px] font-bold leading-4 text-[#2b9e62] transition hover:bg-[#e2f3e9] disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={activeActionKey === `${row.id}:approveInvoice`}
                            onClick={() => onQuickAction?.(row, "approveInvoice")}
                            type="button"
                          >
                            {activeActionKey === `${row.id}:approveInvoice` ? "Approving..." : "Approve Payment"}
                          </button>
                        ) : null}
                        {canMarkCustomerReceived ? (
                          <button
                            className="inline-flex min-h-[34px] w-full items-center justify-center rounded-[10px] border border-[#eadccd] bg-[#fff8f1] px-2.5 text-center text-[10px] font-bold leading-4 text-[#c8881b] transition hover:bg-[#fff2de] disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={activeActionKey === `${row.id}:markReceived`}
                            onClick={() => onQuickAction?.(row, "markReceived")}
                            type="button"
                          >
                            {activeActionKey === `${row.id}:markReceived` ? "Updating..." : "Mark Received"}
                          </button>
                        ) : null}
                        {canMarkVendorPaid ? (
                          <button
                            className="inline-flex min-h-[34px] w-full items-center justify-center rounded-[10px] border border-[#d8dff0] bg-[#eef4ff] px-2.5 text-center text-[10px] font-bold leading-4 text-[#4b74c6] transition hover:bg-[#e4ecff] disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={activeActionKey === `${row.id}:markVendorPaid`}
                            onClick={() => onQuickAction?.(row, "markVendorPaid")}
                            type="button"
                          >
                            {activeActionKey === `${row.id}:markVendorPaid` ? "Updating..." : "Mark Received"}
                          </button>
                        ) : null}
                        {showVendorPaymentWaiting ? (
                          <span className="inline-flex min-h-[34px] w-full items-center justify-center rounded-[10px] border border-[#eadccd] bg-[#fbf7f3] px-2.5 text-center text-[10px] font-bold leading-4 text-[#9b8f86]">
                            Awaiting Customer Payment
                          </span>
                        ) : null}
                        <button
                          className="inline-flex min-h-[32px] w-full items-center justify-center rounded-[10px] border border-[#e6dad1] bg-white px-2.5 text-center text-[10px] font-bold leading-4 text-[#18120f] transition hover:border-[#efd8ca] hover:bg-[#fff7f2] hover:text-[#cf6e38]"
                          onClick={() => navigate(`/payouts/${encodeURIComponent(row.id)}`)}
                          type="button"
                        >
                          View Details
                        </button>
                        {row.orderId ? (
                          <button
                            className="inline-flex min-h-[32px] w-full items-center justify-center rounded-[10px] border border-[#cfe1f2] bg-[#f1f7ff] px-2.5 text-center text-[10px] font-bold leading-4 text-[#306aa1] transition hover:border-[#9cc6e9] hover:bg-[#e8f3ff]"
                            onClick={() => navigate(`/orders/${encodeURIComponent(row.orderId)}`)}
                            type="button"
                          >
                            View Order
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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