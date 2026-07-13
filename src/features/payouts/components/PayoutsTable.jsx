import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        "inline-flex min-w-[74px] justify-center rounded-full px-2.5 py-1 text-[10px] font-bold leading-none",
        classes[status] || classes.Paid,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function Avatar({ label, src }) {
  return (
    <button
      className="inline-flex h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-full transition hover:scale-[1.03]"
      type="button"
    >
      {src ? (
        <img alt={label} className="h-full w-full object-cover" src={src} />
      ) : (
        <span className="inline-flex h-full w-full items-center justify-center bg-[#f6eee8] text-[10px] font-bold text-[#2f241d]">
          {label}
        </span>
      )}
    </button>
  );
}

function PersonCell({ name, src, subtitle, avatar }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar label={avatar} src={src} />
      <div className="min-w-0">
        <p className="truncate text-[15px] font-bold leading-5 text-[#18120f]">{name}</p>
        <p className="truncate text-[11px] text-[#5a4d46]">{subtitle}</p>
      </div>
    </div>
  );
}

export default function PayoutsTable({ currentPage, onPageChange, pageSize, rows, totalItems }) {
  const navigate = useNavigate();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)] m-2">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1320px] w-full border-collapse">
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Order ID</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Customer</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Vendor</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Order Amount</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Order Status</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Platform Comm.</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Order Payment</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Vendor Amount</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Payout Status</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Date</th>
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
              rows.map((row) => (
                <tr key={row.id} className="border-b border-[#f1e9e2] last:border-b-0">
                  <td className="px-3 py-4 text-[15px] font-medium text-[#18120f]">{row.id}</td>
                  <td className="px-3 py-4">
                    <PersonCell
                      avatar={row.customerAvatar}
                      name={row.customer}
                      src={row.customerAvatarUrl}
                      subtitle={row.customerEmail}
                    />
                  </td>
                  <td className="px-3 py-4">
                    <PersonCell
                      avatar={row.vendorAvatar}
                      name={row.vendor}
                      src={row.vendorAvatarUrl}
                      subtitle={row.vendorCity}
                    />
                  </td>
                  <td className="px-3 py-4 text-[15px] font-medium text-[#18120f]">{row.orderAmount}</td>
                  <td className="px-3 py-4">
                    <StatusBadge status={row.orderStatus} />
                  </td>
                  <td className="px-3 py-4 text-[15px] font-semibold text-[#ff2c23]">{row.platformCommission}</td>
                  <td className="px-3 py-4">
                    <StatusBadge status={row.orderPayment} variant="payment" />
                  </td>
                  <td className="px-3 py-4 text-[15px] font-semibold text-[#cf6e38]">{row.vendorAmount}</td>
                  <td className="px-3 py-4">
                    <StatusBadge status={row.payoutStatus} variant="payment" />
                  </td>
                  <td className="px-3 py-4 text-[15px] font-medium text-[#18120f]">{row.date}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-[#18120f] transition hover:text-[#cf6e38]"
                      onClick={() => navigate(`/payouts/${encodeURIComponent(row.id)}`)}
                      type="button"
                    >
                      View Details
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
