function OverviewCard({ title, items }) {
  return (
    <article className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)]">
      <h3 className="mb-4 text-[18px] font-bold text-[#18120f]">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[12px] font-medium text-[#8a7f76]">{item.label}</p>
            <p className="mt-1 text-[14px] font-bold leading-6 text-[#1f1711]">{item.value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function VendorBusinessOverviewSection({ overview }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="h-5 w-[3px] rounded-full bg-[#d96834]" />
        <h2 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">
          Business Overview
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
        <OverviewCard items={overview.contact} title="Contact & Identity" />
        <OverviewCard items={overview.logistics} title="Logistics & Capacity" />
      </div>
    </section>
  );
}
