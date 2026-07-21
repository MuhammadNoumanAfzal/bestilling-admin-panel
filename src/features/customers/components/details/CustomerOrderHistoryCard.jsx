import { useState, useMemo } from "react";
import { ShoppingBag, XCircle, TrendingUp, Search, Users, ArrowUpRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_BADGE = {
  Delivered: "bg-[#e8f8ef] text-[#1f8c52] border border-[#cce4d6]",
  Canceled: "bg-[#fdeded] text-[#c23b3b] border border-[#fbcaca]",
  Pending: "bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]",
};

export default function CustomerOrderHistoryCard({ ordersData = [] }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const stats = useMemo(() => {
    const total = ordersData.length;
    const completed = ordersData.filter((o) => o.status === "Delivered").length;
    const cancelled = ordersData.filter((o) => o.status === "Canceled").length;
    const rawSpent = ordersData.reduce((s, o) => s + (o.amountValue || 0), 0);
    const spending = new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 2,
    }).format(rawSpent);

    return [
      { label: "Total Orders", value: total, icon: ShoppingBag, color: "text-[#d96834]", bg: "bg-[#fff0e7]" },
      { label: "Completed", value: completed, icon: Clock, color: "text-[#1f8c52]", bg: "bg-[#e8f8ef]" },
      { label: "Cancelled", value: cancelled, icon: XCircle, color: "text-[#c23b3b]", bg: "bg-[#fdeded]" },
      { label: "Total Spending", value: spending, icon: TrendingUp, color: "text-[#4f46e5]", bg: "bg-[#eef2ff]" },
    ];
  }, [ordersData]);

  const filteredOrders = useMemo(() => {
    if (!query.trim()) return ordersData;
    const lq = query.toLowerCase();
    return ordersData.filter(
      (o) =>
        o.id.toLowerCase().includes(lq) ||
        o.vendor.toLowerCase().includes(lq) ||
        o.eventType.toLowerCase().includes(lq)
    );
  }, [ordersData, query]);

  const displayedOrders = useMemo(() => {
    if (showAll) return filteredOrders;
    return filteredOrders.slice(0, 5);
  }, [filteredOrders, showAll]);

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 px-1">
        <span className="h-5 w-[3px] bg-[#d96834] rounded-full" />
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834] shadow-sm">
          <ShoppingBag size={13} strokeWidth={2.5} />
        </span>
        <h3 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">
          Order History
        </h3>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-[14px] border border-[#ddd6cf] bg-white px-3 py-3.5 shadow-[0_4px_16px_rgba(53,34,20,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cf6e38]/15 hover:shadow-md sm:gap-4 sm:px-5 sm:py-4"
            >
              <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] shadow-sm ${s.bg} ${s.color}`}>
                <Icon size={18} strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9a8f86]">
                  {s.label}
                </span>
                <span className="mt-1 block truncate text-[16px] font-extrabold leading-none tracking-tight text-[#18120f] sm:text-[19px]">
                  {s.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Card Container */}
      <div className="overflow-hidden rounded-[16px] border border-[#ddd6cf] bg-white shadow-[0_8px_24px_rgba(53,34,20,0.04)] transition-all duration-300 hover:border-[#cf6e38]/10">
        {/* Search Header */}
        <div className="flex flex-col gap-3 border-b border-[#eee4dd] bg-[#faf9f8] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-[360px]">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#baaea0]">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Order ID or Vendor..."
              className="h-10 w-full rounded-[10px] border border-[#ddd4cb] bg-white pl-9.5 pr-3 text-[13px] text-[#231913] outline-none transition duration-150
                         placeholder:text-[#c0b4a8] focus:border-[#cf6e38] focus:shadow-[0_0_0_2px_rgba(207,110,56,0.1)]"
            />
          </div>
          <span className="text-[12px] font-extrabold text-[#8d7e72] sm:inline-block">
            {filteredOrders.length} orders found
          </span>
        </div>

        <div className="space-y-3 p-3 sm:hidden">
          {displayedOrders.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-[#ddd6cf] px-4 py-10 text-center text-[13px] font-semibold text-[#a89f97]">
              No orders matching your search.
            </div>
          ) : (
            displayedOrders.map((order, idx) => (
              <article
                key={`${order.id}-${idx}`}
                className="rounded-[14px] border border-[#eee4dd] bg-[#fcfbfa] p-4 shadow-[0_4px_16px_rgba(53,34,20,0.03)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-extrabold text-[#cf6432]">{order.id}</p>
                    <p className="mt-1 text-[14px] font-bold text-[#18120f]">{order.vendor}</p>
                  </div>
                  <span className={`inline-block rounded-[6px] px-2.5 py-1 text-[10.5px] font-extrabold uppercase leading-none tracking-wider shadow-sm ${
                    STATUS_BADGE[order.status] || "bg-[#f0ebe6] text-[#6f655e]"
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[12px] bg-white px-3 py-2.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9a8f86]">Event</p>
                    <p className="mt-1.5 text-[13px] font-bold text-[#18120f]">{order.eventType}</p>
                  </div>
                  <div className="rounded-[12px] bg-white px-3 py-2.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9a8f86]">Guests</p>
                    <p className="mt-1.5 text-[13px] font-bold text-[#18120f]">{order.guests}</p>
                  </div>
                  <div className="rounded-[12px] bg-white px-3 py-2.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9a8f86]">Delivery</p>
                    <p className="mt-1.5 text-[13px] font-medium leading-5 text-[#5a4d46]">{order.dateTime}</p>
                  </div>
                  <div className="rounded-[12px] bg-white px-3 py-2.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9a8f86]">Amount</p>
                    <p className="mt-1.5 text-[13px] font-extrabold text-[#18120f]">{order.amount}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/orders/${order.id.replace("#", "")}`)}
                  type="button"
                  className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-[#cf6e38] transition hover:text-[#bf5d2d] hover:underline cursor-pointer outline-none bg-transparent border-none active:scale-95"
                >
                  View
                  <ArrowUpRight size={11} />
                </button>
              </article>
            ))
          )}
        </div>

        {/* Table */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[760px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#faf8f6] text-left border-b border-[#eee4dd]">
                {[
                  { label: "Order ID", width: "12%" },
                  { label: "Vendor", width: "24%" },
                  { label: "Event", width: "18%" },
                  { label: "Guests", width: "10%", align: "text-center" },
                  { label: "Delivery date", width: "18%" },
                  { label: "Amount", width: "12%" },
                  { label: "Status", width: "10%" },
                  { label: "Action", width: "8%", align: "text-center" },
                ].map((th, i) => (
                  <th
                    key={i}
                    style={{ width: th.width }}
                    className={`px-5.5 py-4 text-[12px] font-extrabold uppercase tracking-wider text-[#9b8f86] ${
                      th.align || ""
                    }`}
                  >
                    {th.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[13px] font-semibold text-[#a89f97]">
                    No orders matching your search.
                  </td>
                </tr>
              ) : (
                displayedOrders.map((order, idx) => (
                  <tr
                    key={`${order.id}-${idx}`}
                    className="border-b border-[#f3ece6] last:border-0 transition-colors duration-200 hover:bg-[#fffdfb]/80"
                  >
                    <td className="px-5.5 py-3.5 font-bold text-[#cf6432]">{order.id}</td>
                    <td className="px-5.5 py-3.5 font-bold text-[#18120f]">{order.vendor}</td>
                    <td className="px-5.5 py-3.5 font-semibold text-[#5a4d46]">{order.eventType}</td>
                    <td className="px-5.5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#faf9f8] px-2.5 py-0.5 border border-[#eee4dd] text-[13px] font-bold text-[#5a4d46]">
                        <Users size={12} className="text-[#9a8f86]" />
                        {order.guests}
                      </span>
                    </td>
                    <td className="px-5.5 py-3.5 text-[13px] text-[#7a6e66]">{order.dateTime}</td>
                    <td className="px-5.5 py-3.5 font-extrabold text-[#18120f]">{order.amount}</td>
                    <td className="px-5.5 py-3.5">
                      <span className={`inline-block rounded-[6px] px-2.5 py-0.5 text-[10.5px] font-extrabold tracking-wider uppercase leading-none shadow-sm ${
                        STATUS_BADGE[order.status] || "bg-[#f0ebe6] text-[#6f655e]"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5.5 py-3.5 text-center">
                      <button
                        onClick={() => navigate(`/orders/${order.id.replace("#", "")}`)}
                        type="button"
                        className="inline-flex items-center gap-1 text-[13px] font-bold text-[#cf6e38] transition hover:text-[#bf5d2d] hover:underline cursor-pointer outline-none bg-transparent border-none active:scale-95"
                      >
                        View
                        <ArrowUpRight size={11} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View All Button */}
        {filteredOrders.length > 5 && (
          <div className="flex justify-center border-t border-[#eee4dd] p-4 bg-white">
            <button
              onClick={() => setShowAll(!showAll)}
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#e6dad1] bg-white px-6 text-[13px] font-bold text-[#cf6e38] transition duration-150 hover:bg-[#fff0e7] hover:border-[#f0d4ca] cursor-pointer outline-none shadow-sm active:scale-95"
            >
              {showAll ? "View Less Orders" : "View All Orders"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
