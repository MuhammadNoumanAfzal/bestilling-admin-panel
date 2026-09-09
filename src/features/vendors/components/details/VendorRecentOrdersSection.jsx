import { CalendarDays, ChevronLeft, ChevronRight, ClipboardList, Search, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const statusClasses = {
  Delivered: "border-[#bfe5cc] bg-[#f3fbf6] text-[#228653]",
  Ready: "border-[#c7d5ff] bg-[#f3f6ff] text-[#4861d1]",
  Accepted: "border-[#d8cef8] bg-[#f7f4ff] text-[#6b4ed7]",
  "Out for delivery": "border-[#f4cfb7] bg-[#fff5ef] text-[#cf6e38]",
  Reject: "border-[#f1bcbc] bg-[#fff4f4] text-[#c53b3b]",
  Canceled: "border-[#d8d2cc] bg-[#f7f4f2] text-[#6f645d]",
};

const PAGE_SIZE = 5;

function normalizeDateKey(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function PaginationButton({ children, disabled = false, onClick }) {
  return (
    <button
      className={[
        "inline-flex h-8 min-w-8 items-center justify-center rounded-[8px] border px-2 text-[12px] font-semibold transition",
        disabled
          ? "cursor-not-allowed border-[#ebe1d9] bg-[#f7f3f0] text-[#c4b8b0]"
          : "border-[#e6dad1] bg-white text-[#635751] hover:bg-[#faf6f2]",
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function VendorRecentOrdersSection({ orders = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deliveryDateFilter, setDeliveryDateFilter] = useState("");

  const statusOptions = useMemo(
    () => [...new Set(orders.map((order) => order.status).filter(Boolean))],
    [orders],
  );

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      if (statusFilter && order.status !== statusFilter) {
        return false;
      }

      if (deliveryDateFilter && normalizeDateKey(order.deliveryDate) !== deliveryDateFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchable = [order.id, order.customer, order.event, order.deliveryDate, order.deliveryTime, order.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    });
  }, [deliveryDateFilter, orders, searchTerm, statusFilter]);

  const hasActiveFilters = Boolean(searchTerm || statusFilter || deliveryDateFilter);
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredOrders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [deliveryDateFilter, searchTerm, statusFilter]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  function handleClearFilters() {
    setSearchTerm("");
    setStatusFilter("");
    setDeliveryDateFilter("");
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 px-1 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-6 w-[4px] rounded-full bg-[#d96834]" />
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#fff2ea] text-[#d96834] shadow-sm">
            <ClipboardList size={15} />
          </span>
          <h2 className="text-[22px] font-extrabold tracking-tight text-[#18120f]">
            Orders
          </h2>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <label className="relative min-w-[220px] sm:w-[260px]">
            <span className="sr-only">Search orders</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a7988d]" size={14} />
            <input
              className="h-9 w-full rounded-[8px] border border-[#ddd4cb] bg-white pl-9 pr-3 text-[13px] font-semibold text-[#231913] outline-none transition placeholder:text-[#a99c92] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search order, customer, event..."
              type="search"
              value={searchTerm}
            />
          </label>

          <label className="relative min-w-[160px]">
            <span className="sr-only">Filter by delivery date</span>
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a7988d]" size={14} />
            <input
              className="h-9 w-full rounded-[8px] border border-[#ddd4cb] bg-white pl-9 pr-3 text-[12px] font-semibold text-[#4d423b] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              onChange={(event) => setDeliveryDateFilter(event.target.value)}
              type="date"
              value={deliveryDateFilter}
            />
          </label>

          <label className="min-w-[160px]">
            <span className="sr-only">Filter by order status</span>
            <select
              className="h-9 w-full rounded-[8px] border border-[#ddd4cb] bg-white px-3 text-[12px] font-semibold text-[#4d423b] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              onChange={(event) => setStatusFilter(event.target.value)}
              value={statusFilter}
            >
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          {hasActiveFilters ? (
            <button
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] border border-[#ead7ca] bg-[#fff8f4] px-3 text-[12px] font-bold text-[#cf6e38] transition hover:bg-[#fff1e8]"
              onClick={handleClearFilters}
              type="button"
            >
              <X size={13} />
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-[#cfc4bb] bg-white shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead className="border-b border-[#ddd6cf] bg-[#fcfbfa]">
              <tr>
                {["Order ID", "Customer", "Event", "Guests", "Delivery date", "Status"].map((label) => (
                  <th key={label} className="px-5 py-4 text-left text-[13px] font-bold text-[#1f1711]">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={`${order.id}-${order.customer}-${order.event}`} className="border-b border-[#ece4dd] last:border-b-0">
                    <td className="px-5 py-4 text-[15px] font-extrabold text-[#1f1711]">{order.id}</td>
                    <td className="px-5 py-4 text-[15px] font-medium text-[#1f1711]">{order.customer}</td>
                    <td className="px-5 py-4 text-[15px] font-medium text-[#1f1711]">{order.event}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#1f1711]">
                        <Users size={14} className="text-[#9d928a]" />
                        {order.guests}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[12px] font-semibold text-[#1f1711]">{order.deliveryDate}</p>
                      <p className="mt-0.5 text-[10px] font-medium text-[#8c8077]">{order.deliveryTime}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex min-w-[104px] justify-center rounded-full border px-3 py-1 text-[11px] font-bold shadow-[0_1px_2px_rgba(53,34,20,0.04)] ${
                          statusClasses[order.status] || "border-[#d8d2cc] bg-[#f7f4f2] text-[#6f645d]"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-5 py-10 text-center text-[14px] font-semibold text-[#6f645d]" colSpan={6}>
                    {hasActiveFilters ? "No orders match the selected filters." : "No orders available yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalItems > PAGE_SIZE ? (
          <div className="flex flex-col gap-3 border-t border-[#ece4dd] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-[#6f645d]">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems} orders
            </p>

            <div className="flex items-center gap-2">
              <PaginationButton disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
                <ChevronLeft size={14} />
              </PaginationButton>
              <span className="inline-flex h-8 items-center justify-center rounded-[8px] bg-[#fff4ec] px-3 text-[12px] font-bold text-[#cf6e38]">
                {currentPage} / {totalPages}
              </span>
              <PaginationButton disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>
                <ChevronRight size={14} />
              </PaginationButton>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}