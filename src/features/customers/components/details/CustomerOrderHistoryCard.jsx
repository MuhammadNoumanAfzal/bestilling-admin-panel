import { useState, useMemo } from "react";
import { ShoppingBag, CheckCircle, XCircle, TrendingUp, Search, Users, ArrowUpRight, Clock } from "lucide-react";
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
      { label: "Total Orders", value: total, icon: ShoppingBag },
      { label: "Completed", value: completed, icon: Clock },
      { label: "Cancelled", value: cancelled, icon: XCircle },
      { label: "Total Spending", value: spending, icon: TrendingUp },
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
      <div className="flex items-center gap-2 px-1">
        <span className="h-4.5 w-[3px] bg-[#d96834] rounded-full" />
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-[6px] bg-[#fff0e7] text-[#d96834]">
          <ShoppingBag size={13} strokeWidth={2.5} />
        </span>
        <h3 className="text-[18px] font-bold text-[#18120f]">
          Order History
        </h3>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3.5 rounded-[12px] border border-[#ddd6cf] bg-white px-4.5 py-3.5 shadow-[0_4px_12px_rgba(53,34,20,0.02)] transition duration-150 hover:border-[#cf6e38]/20"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#cf6432]">
                <Icon size={16} strokeWidth={2.5} />
              </span>
              <div>
                <span className="block text-[12px] font-bold uppercase tracking-wider text-[#9a8f86]">
                  {s.label}
                </span>
                <span className="block text-[18px] font-bold text-[#18120f] leading-none mt-1">
                  {s.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Card Container */}
      <div className="rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)] overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-[#eee4dd] bg-[#faf9f8]">
          <div className="relative max-w-[360px]">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#baaea0]">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Order ID or Vendor..."
              className="h-10 w-full rounded-[8px] border border-[#ddd4cb] bg-white pl-9 pr-3 text-[13px] text-[#231913] outline-none transition duration-150
                         placeholder:text-[#c0b4a8] focus:border-[#cf6e38] focus:shadow-[0_0_0_2px_rgba(207,110,56,0.1)]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
                    className={`px-4 py-3.5 text-[13px] font-bold text-[#9b8f86] ${
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
                  <td colSpan={8} className="py-10 text-center text-[13px] font-semibold text-[#a89f97]">
                    No orders matching your search.
                  </td>
                </tr>
              ) : (
                displayedOrders.map((order, idx) => (
                  <tr
                    key={`${order.id}-${idx}`}
                    className="border-b border-[#f3ece6] last:border-0 transition-colors duration-150 hover:bg-[#faf8f6]"
                  >
                    <td className="px-4 py-3.5 font-bold text-[#cf6432]">{order.id}</td>
                    <td className="px-4 py-3.5 font-bold text-[#18120f]">{order.vendor}</td>
                    <td className="px-4 py-3.5 font-semibold text-[#5a4d46]">{order.eventType}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#5a4d46]">
                        <Users size={12} className="text-[#a89f97] -mt-0.5" />
                        {order.guests}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-[#7a6e66]">{order.dateTime}</td>
                    <td className="px-4 py-3.5 font-bold text-[#18120f]">{order.amount}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase leading-none ${
                        STATUS_BADGE[order.status] || "bg-[#f0ebe6] text-[#6f655e]"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => navigate(`/orders/${order.id.replace("#", "")}`)}
                        type="button"
                        className="inline-flex items-center gap-0.5 text-[13px] font-bold text-[#cf6432] transition hover:text-[#bf5d2d] hover:underline cursor-pointer outline-none bg-transparent border-none"
                      >
                        View Order
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
          <div className="flex justify-center border-t border-[#eee4dd] p-3.5 bg-white">
            <button
              onClick={() => setShowAll(!showAll)}
              type="button"
              className="text-[13px] font-bold text-[#cf6432] transition hover:text-[#bf5d2d] hover:underline cursor-pointer outline-none bg-transparent border-none"
            >
              {showAll ? "View Less" : "View all"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
