import { MapPinned, Save, X } from "lucide-react";
import AddDeliveryAreaField from "../add-area/AddDeliveryAreaField.jsx";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Limited", label: "Restricted" },
];

export default function DeliveryPostalCodeModal({
  form,
  isOpen,
  isSubmitting,
  mode,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211713]/50 px-4 py-4 backdrop-blur-[4px]">
      <div className="flex max-h-[84vh] w-full max-w-[620px] flex-col overflow-hidden rounded-[24px] border border-[#ecdccf] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f1_100%)] shadow-[0_30px_80px_rgba(28,18,12,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#f1e2d8] px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#cf6e38]">Postal Code</p>
            <h2 className="mt-1 text-[24px] font-bold tracking-[-0.03em] text-[#18120f]">
              {mode === "edit" ? "Edit Postal Code" : "Add Postal Code"}
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#6f645d]">
              Keep this delivery zone complete with clear postal code and area naming.
            </p>
          </div>

          <button
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#efddd1] bg-white text-[#685b53] transition hover:border-[#cf6e38]/30 hover:bg-[#fff2ea] hover:text-[#cf6e38]"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <div className="rounded-[18px] border border-[#eee3db] bg-white p-4 shadow-[0_10px_24px_rgba(55,31,13,0.04)]">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1e7] text-[#cf6e38]">
                <MapPinned size={17} />
              </span>
              <div>
                <p className="text-[16px] font-bold text-[#18120f]">Coverage Details</p>
                <p className="text-[13px] text-[#7b6f68]">Set the postal code, local area, and service status.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <AddDeliveryAreaField
                disabled={mode === "edit"}
                label="Postal Code"
                onChange={(event) => onChange("postalCode", event.target.value)}
                placeholder="0590"
                value={form.postalCode}
              />
              <AddDeliveryAreaField
                label="Area Name"
                onChange={(event) => onChange("areaName", event.target.value)}
                placeholder="Oslo Sentrum"
                value={form.areaName}
              />
              <AddDeliveryAreaField
                as="select"
                label="Status"
                onChange={(event) => onChange("status", event.target.value)}
                options={statusOptions}
                value={form.status}
              />
              <AddDeliveryAreaField
                label="Latitude"
                onChange={(event) => onChange("lat", event.target.value)}
                placeholder="59.9139"
                type="number"
                value={form.lat}
              />
              <AddDeliveryAreaField
                label="Longitude"
                onChange={(event) => onChange("lng", event.target.value)}
                placeholder="10.7522"
                type="number"
                value={form.lng}
              />
            </div>

            <p className="mt-3 text-[12px] leading-5 text-[#8a7d75]">
              Latitude and longitude are required by the backend for each postal area.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-[#f1e2d8] px-5 py-4">
          <button
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#d5ccc5] bg-white px-4 text-[13px] font-semibold text-[#332822] transition hover:bg-[#faf6f2]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#cf6e38] px-4 text-[13px] font-semibold text-white transition hover:bg-[#bc6030] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            onClick={onSubmit}
            type="button"
          >
            <Save size={14} />
            <span>{mode === "edit" ? "Save Changes" : "Add Postal Code"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
