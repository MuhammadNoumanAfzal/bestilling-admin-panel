import { CalendarRange } from "lucide-react";

export default function EventInfoCard({ order }) {
  const details = [
    { label: "Event Type", value: order.eventType },
    { label: "Event Date", value: order.eventDate },
    { label: "Event Time", value: order.eventTime },
    { label: "Guest Count", value: `${order.guestCount} guests` },
    { label: "Order Source", value: order.source },
    { label: "Recipient", value: order.delivery.recipientName },
    { label: "Recipient Phone", value: order.delivery.recipientPhone },
    {
      label: "Special Instructions",
      value: order.specialInstructions,
      isFullWidth: true,
    },
  ];

  return (
    <article className="h-full rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <header className="mb-4 flex items-center gap-2 border-b border-[#eee4dd] pb-3">
        <CalendarRange size={18} className="text-[#cf6432]" />
        <h3 className="text-[18px] font-bold text-[#18120f]">Event Information</h3>
      </header>

      <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
        {details.map((item) => (
          <div
            key={item.label}
            className={[
              "space-y-1",
              item.isFullWidth ? "sm:col-span-2 border-t border-[#f1e9e2] pt-3 mt-1.5" : "",
            ].join(" ")}
          >
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
              {item.label}
            </span>
            <span className="block text-[13px] font-semibold leading-5 text-[#18120f]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
