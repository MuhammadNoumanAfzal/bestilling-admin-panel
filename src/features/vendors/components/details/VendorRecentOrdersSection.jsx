import { ClipboardList, Users } from "lucide-react";

const statusClasses = {
  Delivered: "border-[#bfe5cc] bg-[#f3fbf6] text-[#228653]",
  Ready: "border-[#c7d5ff] bg-[#f3f6ff] text-[#4861d1]",
  Accepted: "border-[#d8cef8] bg-[#f7f4ff] text-[#6b4ed7]",
  "Out for delivery": "border-[#f4cfb7] bg-[#fff5ef] text-[#cf6e38]",
  Reject: "border-[#f1bcbc] bg-[#fff4f4] text-[#c53b3b]",
  Canceled: "border-[#d8d2cc] bg-[#f7f4f2] text-[#6f645d]",
};

export default function VendorRecentOrdersSection({ orders }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="h-5 w-[3px] rounded-full bg-[#d96834]" />
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-[#fff2ea] text-[#d96834] shadow-sm">
          <ClipboardList size={12} />
        </span>
        <h2 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">
          Recent Orders
        </h2>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-[#cfc4bb] bg-white shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead className="border-b border-[#ddd6cf] bg-[#fcfbfa]">
              <tr>
                {["Order ID", "Customer", "Event", "Guests", "Delivery date", "Status"].map((label) => (
                  <th key={label} className="px-5 py-4 text-left text-[12px] font-bold text-[#1f1711]">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={`${order.id}-${order.customer}-${order.event}`} className="border-b border-[#ece4dd] last:border-b-0">
                  <td className="px-5 py-3.5 text-[14px] font-extrabold text-[#1f1711]">{order.id}</td>
                  <td className="px-5 py-3.5 text-[14px] font-medium text-[#1f1711]">{order.customer}</td>
                  <td className="px-5 py-3.5 text-[14px] font-medium text-[#1f1711]">{order.event}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1f1711]">
                      <Users size={13} className="text-[#9d928a]" />
                      {order.guests}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[11px] font-semibold text-[#1f1711]">{order.deliveryDate}</p>
                    <p className="mt-0.5 text-[9px] font-medium text-[#8c8077]">{order.deliveryTime}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex min-w-[96px] justify-center rounded-full border px-2.5 py-1 text-[10px] font-bold shadow-[0_1px_2px_rgba(53,34,20,0.04)] ${
                        statusClasses[order.status] || "border-[#d8d2cc] bg-[#f7f4f2] text-[#6f645d]"
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
