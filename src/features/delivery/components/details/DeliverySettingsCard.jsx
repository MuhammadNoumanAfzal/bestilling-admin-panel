import DeliveryStatusPill from "./DeliveryStatusPill.jsx";

function SettingField({ label, value }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39388]">{label}</p>
      <div className="rounded-[10px] border border-[#e6dbd3] bg-[#f8f4f1] px-3 py-2.5 text-[13px] font-semibold text-[#2a1f19]">
        {value}
      </div>
    </div>
  );
}

export default function DeliverySettingsCard({ area }) {
  return (
    <section className="rounded-[18px] border border-[#ddd4cd] bg-white p-4 shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[#231913]">General Settings</h2>
          <p className="mt-1 text-[12px] leading-5 text-[#8d8077]">Edit city metadata for this delivery area.</p>
        </div>
        <DeliveryStatusPill status={area.status} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
