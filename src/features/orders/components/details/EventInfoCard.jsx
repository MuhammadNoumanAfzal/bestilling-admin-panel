import { CalendarRange } from "lucide-react";

export default function EventInfoCard() {
  const details = [
    { label: "Event Type", value: "Wedding" },
    { label: "Event Date", value: "23 May 2026" },
    { label: "Event Time", value: "05:00 PM" },
    { label: "Guest Count", value: "120 Guests" },
    { label: "Location", value: "Oslo, Norway" },
    {
      label: "Special Instructions",
      value: "Please ensure food is delivered 30 minutes before event time.",
      isFullWidth: true,
    },
  ];

  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] h-full">
      <header className="mb-4 flex items-center gap-2 border-b border-[#eee4dd] pb-3">
        <CalendarRange size={18} className="text-[#cf6432]" />
        <h3 className="text-[18px] font-bold text-[#18120f]">Event Information</h3>
      </header>

      {/* Grid Layout of Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
        {details.map((item, idx) => (
          <div
            key={idx}
            className={[
              "space-y-1",
              item.isFullWidth ? "col-span-1 sm:col-span-2 border-t border-[#f1e9e2] pt-3 mt-1.5" : "",
            ].join(" ")}
          >
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
              {item.label}
            </span>
            <span className="block text-[13px] font-semibold text-[#18120f] leading-5">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
