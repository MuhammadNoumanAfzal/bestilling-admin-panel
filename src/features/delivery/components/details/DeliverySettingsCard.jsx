import DeliveryStatusPill from "./DeliveryStatusPill.jsx";

function ToggleField({ checked, label, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-[12px] border border-[#e6dbd3] bg-[#f8f4f1] px-4 py-3">
      <span className="text-[14px] font-medium text-[#18120f]">{label}</span>
      <input checked={checked} className="h-4 w-4 accent-[#cf6e38]" onChange={onChange} type="checkbox" />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  as = "input",
  options = [],
  readOnly = false,
}) {
  return (
    <label className="space-y-2">
      <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#a39388]">{label}</p>
      {as === "select" ? (
        <select
          className="w-full rounded-[12px] border border-[#e6dbd3] bg-[#f8f4f1] px-4 py-3 text-[15px] font-medium text-[#18120f] outline-none transition focus:border-[#cf6e38] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          disabled={readOnly}
          onChange={onChange}
          value={value}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea
          className="min-h-[110px] w-full rounded-[12px] border border-[#e6dbd3] bg-[#f8f4f1] px-4 py-3 text-[15px] font-medium text-[#18120f] outline-none transition focus:border-[#cf6e38] focus:bg-white"
          onChange={onChange}
          readOnly={readOnly}
          value={value}
        />
      ) : (
        <input
          className="w-full rounded-[12px] border border-[#e6dbd3] bg-[#f8f4f1] px-4 py-3 text-[15px] font-medium text-[#18120f] outline-none transition focus:border-[#cf6e38] focus:bg-white read-only:cursor-default"
          onChange={onChange}
          readOnly={readOnly}
          type={type}
          value={value}
        />
      )}
    </label>
  );
}

const coverageOptions = [
  { value: "ALL_CITY_COVERAGE", label: "All City Coverage" },
  { value: "SELECTED_POSTAL_CODES_ONLY", label: "Selected Postal Codes Only" },
];

export default function DeliverySettingsCard({ area, form, onChange }) {
  return (
    <section className="rounded-[18px] border border-[#ddd4cd] bg-white p-5 shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[24px] font-bold tracking-[-0.03em] text-[#18120f]">General Settings</h2>
          <p className="mt-2 text-[15px] leading-6 text-[#6f645d]">Edit city metadata and service controls for this delivery area.</p>
        </div>
        <DeliveryStatusPill status={area.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="City Name" onChange={() => {}} readOnly value={area.city} />
        <TextField label="Region" onChange={() => {}} readOnly value={area.region} />
        <TextField
          label="Maximum Delivery Radius (km)"
          onChange={(event) => onChange("maxDeliveryRadius", event.target.value)}
          type="number"
          value={form.maxDeliveryRadius}
        />
        <TextField
          label="Default Minimum Lead Time (days)"
          onChange={(event) => onChange("leadTimeDays", event.target.value)}
          type="number"
          value={form.leadTimeDays}
        />
        <TextField
          as="select"
          label="Coverage Type"
          onChange={(event) => onChange("coverageType", event.target.value)}
          options={coverageOptions}
          value={form.coverageType}
        />
        <TextField
          label="Minimum Order Amount"
          onChange={(event) => onChange("minimumOrderAmount", event.target.value)}
          value={form.minimumOrderAmount}
        />
        <TextField
          label="Delivery Fee"
          onChange={(event) => onChange("deliveryFee", event.target.value)}
          value={form.deliveryFee}
        />
        <div className="space-y-4">
          <ToggleField
            checked={form.isRestricted}
            label="Restricted Area"
            onChange={(event) => onChange("isRestricted", event.target.checked)}
          />
          <ToggleField
            checked={form.isExpressEnabled}
            label="Express Delivery Enabled"
            onChange={(event) => onChange("isExpressEnabled", event.target.checked)}
          />
        </div>
        <div className="sm:col-span-2">
          <TextField
            as="textarea"
            label="Internal Notes"
            onChange={(event) => onChange("notes", event.target.value)}
            value={form.notes}
          />
        </div>
      </div>
    </section>
  );
}
