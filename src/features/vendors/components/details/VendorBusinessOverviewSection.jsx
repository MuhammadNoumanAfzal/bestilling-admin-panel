import { BriefcaseBusiness, Gauge, MapPin, PackageCheck, Truck } from "lucide-react";

function OverviewCard({ title, items }) {
  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)]">
      <h3 className="mb-4 text-[18px] font-bold text-[#18120f]">{title}</h3>
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-medium text-[#8a7f76]">{item.label}</p>
            <p className="mt-1 text-[13px] font-bold leading-5 text-[#1f1711]">{item.value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

const logisticsIcons = {
  "Delivery Radius": Truck,
  "Lead Time": Gauge,
  "Max Capacity": BriefcaseBusiness,
  "Delivery Zones": MapPin,
};

function LogisticsCard({ title, items }) {
  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)]">
      <h3 className="mb-4 text-[18px] font-bold text-[#18120f]">{title}</h3>
      <div className="space-y-0.5">
        {items.map((item, index) => {
          const Icon = logisticsIcons[item.label] || PackageCheck;

          return (
            <div
              key={item.label}
              className={[
                "flex items-center justify-between gap-4 py-3",
                index !== items.length - 1 ? "border-b border-[#e9dfd8]" : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-2.5 text-[#8a7f76]">
                <Icon size={13} className="text-[#d96834]" />
                <span className="text-[12px] font-medium">{item.label}</span>
              </div>
              <span className="text-[12px] font-bold text-[#1f1711]">{item.value}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default function VendorBusinessOverviewSection({ overview }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="h-5 w-[3px] rounded-full bg-[#d96834]" />
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-[#fff2ea] text-[#d96834] shadow-sm">
          <BriefcaseBusiness size={12} />
        </span>
        <h2 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">
          Business Overview
        </h2>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,1fr)]">
        <OverviewCard items={overview.contact} title="Contact & Identity" />
        <LogisticsCard items={overview.logistics} title="Logistics & Capacity" />
      </div>
    </section>
  );
}
