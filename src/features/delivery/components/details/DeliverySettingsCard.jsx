import DeliveryStatusPill from "./DeliveryStatusPill.jsx";

function SettingField({ label, value }) {
  return (
    <div className="space-y-2">
      <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#a39388]">{label}</p>
      <div className="rounded-[12px] border border-[#e6dbd3] bg-[#f8f4f1] px-4 py-3 text-[15px] font-medium text-[#18120f]">
        {value}
      </div>
    </div>
  );
}

export default function DeliverySettingsCard({ area }) {
  return (
    <section className="rounded-[18px] border border-[#ddd4cd] bg-white p-5 shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[24px] font-bold tracking-[-0.03em] text-[#18120f]">General Settings</h2>
          <p className="mt-2 text-[15px] leading-6 text-[#6f645d]">Edit city metadata for this delivery area.</p>
        </div>
        <DeliveryStatusPill status={area.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SettingField label="City Name" value={area.city} />
        <SettingField label="Region" value={area.region} />
        <SettingField label="Maximum Delivery Radius (km)" value={area.maxDeliveryRadius} />
        <SettingField label="Default Minimum Lead Time (days)" value={area.leadTimeDays} />
        <div className="sm:col-span-2">
          <SettingField label="Coverage Details" value={area.coverageType} />
        </div>
      </div>
    </section>
  );
}
