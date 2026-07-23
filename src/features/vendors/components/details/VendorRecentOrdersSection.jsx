const statusClasses = {
  Delivered: "bg-[#f3faf6] text-[#2b9e62]",
  Ready: "bg-[#fff7e8] text-[#b97914]",
  Accepted: "bg-[#f1f3ff] text-[#5063d8]",
  "Out for delivery": "bg-[#fff3ec] text-[#cf6e38]",
  Reject: "bg-[#fff0f0] text-[#d83f3f]",
  Canceled: "bg-[#f3f0ee] text-[#6f645d]",
};

export default function VendorRecentOrdersSection({ orders }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="h-5 w-[3px] rounded-full bg-[#d96834]" />
        <h2 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">
          Recent Orders
        </h2>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-[#ddd6cf] bg-white shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
              <tr>
                {["Order ID", "Customer", "Event", "Guests", "Delivery date", "Status"].map((label) => (
                  <th key={label} className="px-4 py-3 text-left text-[12px] font-bold text-[#8c8077]">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#f1e9e2] last:border-b-0">
                  <td className="px-4 py-3 text-[13px] font-bold text-[#1f1711]">{order.id}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#1f1711]">{order.customer}</td>
                  <td className="px-4 py-3 text-[13px] text-[#4d423b]">{order.event}</td>
                  <td className="px-4 py-3 text-[13px] text-[#4d423b]">{order.guests}</td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] font-semibold text-[#1f1711]">{order.deliveryDate}</p>
                    <p className="text-[10px] text-[#8c8077]">{order.deliveryTime}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        statusClasses[order.status] || "bg-[#f3f0ee] text-[#6f645d]"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
