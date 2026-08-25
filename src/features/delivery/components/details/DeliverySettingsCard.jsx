import DeliveryStatusPill from "./DeliveryStatusPill.jsx";

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

export default function DeliverySettingsCard({ area, form, onChange }) {
  return (
    <section className="rounded-[22px] border border-[#ddd4cd] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f1_100%)] p-6 shadow-[0_16px_34px_rgba(55,31,13,0.06)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[24px] font-bold tracking-[-0.03em] text-[#18120f]">General Settings</h2>
          <p className="mt-2 text-[15px] leading-6 text-[#6f645d]">
            Review the main delivery-area details and internal notes for this city.
          </p>
        </div>
        <DeliveryStatusPill status={area.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="City Name" onChange={() => {}} readOnly value={area.city} />
          <TextField label="Region" onChange={() => {}} readOnly value={area.region} />
          <TextField label="Country" onChange={() => {}} readOnly value={area.country} />
          <TextField label="Coverage Type" onChange={() => {}} readOnly value={area.coverageType} />
        </div>

        <div className="rounded-[18px] border border-[#eadfd6] bg-white px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">
            Delivery Overview
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[14px] border border-[#f1e5dd] bg-[#fff9f5] px-3 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39388]">Coverage Type</p>
              <p className="mt-2 text-[14px] font-semibold text-[#18120f]">{area.coverageType}</p>
            </div>
            <div className="rounded-[14px] border border-[#f1e5dd] bg-[#fff9f5] px-3 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39388]">Postal Codes</p>
              <p className="mt-2 text-[14px] font-semibold text-[#18120f]">{area.activePostalCodes}</p>
            </div>
            <div className="rounded-[14px] border border-[#f1e5dd] bg-[#fff9f5] px-3 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39388]">Linked Vendors</p>
              <p className="mt-2 text-[14px] font-semibold text-[#18120f]">{area.linkedVendors.length}</p>
            </div>
          </div>
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
