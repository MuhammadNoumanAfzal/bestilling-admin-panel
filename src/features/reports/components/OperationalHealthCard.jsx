import ReportsSectionCard from "./ReportsSectionCard.jsx";

function HealthMetric({ label, value }) {
  return (
    <div className="rounded-[12px] border border-[#d8cdc5] bg-[#f5f1ef] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
      <p className="text-[9px] font-semibold text-[#2f241d]">{label}</p>
      <p className="mt-1 text-[16px] font-extrabold leading-none tracking-[-0.04em] text-[#17110d] sm:text-[17px]">
        {value}
      </p>
    </div>
  );
}

export default function OperationalHealthCard({ items }) {
  return (
    <ReportsSectionCard className="self-start p-3.5">
      <div className="flex flex-col space-y-2.5">
        <div>
          <h2 className="text-[16px] font-extrabold tracking-[-0.04em] text-[#18120f] sm:text-[17px]">
            Operational Health
          </h2>
        </div>

        <div className="space-y-2.5">
          {items.map((item) => (
            <HealthMetric key={item.id} {...item} />
          ))}
        </div>
      </div>
    </ReportsSectionCard>
  );
}
