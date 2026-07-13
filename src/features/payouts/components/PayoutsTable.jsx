import { ChevronLeft, ChevronRight } from "lucide-react";

const orderStatusClasses = {
  Delivered: "bg-[#17b84a] text-white",
  Canceled: "bg-[#d80f0f] text-white",
  Pending: "bg-[#ffe8a6] text-[#b78600]",
};

const paymentStatusClasses = {
  Paid: "bg-[#17b84a] text-white",
  Canceled: "bg-[#d80f0f] text-white",
  Pending: "bg-[#ffe8a6] text-[#b78600]",
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

function StatusBadge({ status, variant = "order" }) {
  const classes = variant === "payment" ? paymentStatusClasses : orderStatusClasses;

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold leading-none",
        classes[status] || classes.Paid,
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
    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${toneClass}`}>
      {label}
    </span>
  );
}

function PersonCell({ name, subtitle, avatar, tone = "orange" }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar label={avatar} tone={tone} />
      <div className="min-w-0">
        <p className="truncate text-[12px] font-bold text-[#201712]">{name}</p>
        <p className="truncate text-[10px] text-[#8a7d74]">{subtitle}</p>
      </div>
    </div>
  );
}

export default function PayoutsTable({ currentPage, onPageChange, pageSize, rows, totalItems }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1320px] w-full border-collapse">
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Order ID</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Customer</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Vendor</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Order Amount</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Order Status</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Platform Comm.</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Order Payment</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Vendor Amount</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Order Payment</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Date</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#f1e9e2] last:border-b-0">
                <td className="px-3 py-3 text-[12px] font-bold text-[#201712]">{row.id}</td>
                <td className="px-3 py-3">
                  <PersonCell avatar={row.customerAvatar} name={row.customer} subtitle={row.customerEmail} />
                </td>
                <td className="px-3 py-3">
                  <PersonCell avatar={row.vendorAvatar} name={row.vendor} subtitle={row.vendorCity} tone="dark" />
                </td>
                <td className="px-3 py-3 text-[12px] font-semibold text-[#2a1e17]">{row.orderAmount}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={row.orderStatus} />
                </td>
                <td className="px-3 py-3 text-[12px] font-bold text-[#ff2c23]">{row.platformCommission}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={row.orderPayment} variant="payment" />
                </td>
                <td className="px-3 py-3 text-[12px] font-bold text-[#cf6e38]">{row.vendorAmount}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={row.payoutStatus} variant="payment" />
                </td>
                <td className="px-3 py-3 text-[12px] font-medium text-[#584c45]">{row.date}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[11px] font-bold text-[#2a1e17] transition hover:text-[#cf6e38]"
                    type="button"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#eee4dd] px-4 py-4 text-[12px] text-[#6c6058] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {start} - {end} of {totalItems} Orders
        </p>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <PaginationIconButton disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
            <ChevronLeft size={15} />
          </PaginationIconButton>

          {paginationItems.map((item) =>
            String(item).startsWith("ellipsis") ? (
              <span key={item} className="px-1 text-[12px] font-semibold text-[#7a6d66]">
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
