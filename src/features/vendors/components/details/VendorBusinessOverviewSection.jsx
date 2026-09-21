import { vt, useVendorLanguage } from "../../utils/vendorTranslation.js";
import { BriefcaseBusiness, Gauge, MapPin, PackageCheck, Truck } from "lucide-react";

function OverviewCard({ title, items }) {
  useVendorLanguage();
  return (
    <article className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.05)]">
      <h3 className="mb-4 text-[20px] font-bold text-[#18120f]">{title}</h3>
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[12px] font-medium text-[#8a7f76]">{vt(item.label)}</p>
            <p className="mt-1.5 text-[15px] font-bold leading-6 text-[#1f1711]">{vt(item.value)}</p>
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

function getUniqueListItems(value) {
  const rawValue = `${value ?? ""}`.trim();

  if (!rawValue.includes(",")) {
    return [];
  }

  const seen = new Set();
  return rawValue
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry) => {
      const key = entry.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function LogisticsValue({ value }) {
  const listItems = getUniqueListItems(value);

  if (listItems.length > 1) {
    const visibleItems = listItems.slice(0, 8);
    const hiddenCount = listItems.length - visibleItems.length;

    return (
      <div
        className="flex max-w-[260px] flex-wrap justify-end gap-1.5 text-right"
        title={listItems.join(", ")}
      >
        {visibleItems.map((entry) => (
          <span
            key={entry}
            className="inline-flex max-w-full items-center rounded-full border border-[#ecd8ca] bg-[#fff7f2] px-2.5 py-1 text-[12px] font-bold leading-none text-[#1f1711]"
          >
            {vt(entry)}
          </span>
        ))}
        {hiddenCount > 0 ? (
          <span className="inline-flex items-center rounded-full border border-[#d9c6b8] bg-[#f6eee8] px-2.5 py-1 text-[12px] font-bold leading-none text-[#6d5b51]">
            +{hiddenCount} more
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <span className="max-w-[260px] break-words text-right text-[14px] font-bold leading-6 text-[#1f1711]">
      {vt(value)}
    </span>
  );
}

function LogisticsCard({ title, items }) {
  useVendorLanguage();
  return (
    <article className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.05)]">
      <h3 className="mb-4 text-[20px] font-bold text-[#18120f]">{title}</h3>
      <div className="space-y-0.5">
        {items.map((item, index) => {
          const Icon = logisticsIcons[item.label] || PackageCheck;

          return (
            <div
              key={item.label}
              className={[
                "flex items-start justify-between gap-4 py-3",
                index !== items.length - 1 ? "border-b border-[#e9dfd8]" : "",
              ].join(" ")}
            >
              <div className="flex min-w-0 items-center gap-2.5 text-[#8a7f76]">
                <Icon size={15} className="shrink-0 text-[#d96834]" />
                <span className="text-[13px] font-medium">{vt(item.label)}</span>
              </div>
              <LogisticsValue value={item.value} />
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default function VendorBusinessOverviewSection({ overview }) {
  useVendorLanguage();
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="h-6 w-[4px] rounded-full bg-[#d96834]" />
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#fff2ea] text-[#d96834] shadow-sm">
          <BriefcaseBusiness size={15} />
        </span>
        <h2 className="text-[22px] font-extrabold tracking-tight text-[#18120f]">{vt("Business Overview")}</h2>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,1fr)]">
        <OverviewCard items={overview.contact} title={vt("Contact & Identity")} />
        <LogisticsCard items={overview.logistics} title={vt("Logistics & Capacity")} />
      </div>
    </section>
  );
}
