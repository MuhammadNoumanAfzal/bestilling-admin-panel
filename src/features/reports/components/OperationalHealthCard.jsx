import ReportsSectionCard from "./ReportsSectionCard.jsx";

function HealthMetric({ label, value }) {
  return (
    <div className="rounded-[14px] border border-[#d9cec6] bg-[#f5f1ef] px-5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
      <p className="text-[10px] font-semibold text-[#2f241d]">{label}</p>
      <p className="mt-1 text-[17px] font-extrabold leading-none tracking-[-0.04em] text-[#17110d] sm:text-[18px]">
        {value}
      </p>
    </div>
  );
}

export default function OperationalHealthCard({ items }) {
  return (
    <ReportsSectionCard className="h-full p-4">
      <div className="flex h-full flex-col space-y-3">
        <div>
          <h2 className="text-[18px] font-extrabold tracking-[-0.04em] text-[#18120f] sm:text-[20px]">
            Operational Health
          </h2>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <HealthMetric key={item.id} {...item} />
          ))}
        </div>
      </div>
    </ReportsSectionCard>
  );
}
