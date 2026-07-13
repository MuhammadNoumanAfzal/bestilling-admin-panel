import { CircleDot, Plus, X } from "lucide-react";
import { useState } from "react";
import AddDeliveryAreaField from "./add-area/AddDeliveryAreaField.jsx";
import AddDeliveryPostalCodesTable from "./add-area/AddDeliveryPostalCodesTable.jsx";

const regionOptions = [
  { value: "ostlandet", label: "Ostlandet" },
  { value: "vestlandet", label: "Vestlandet" },
  { value: "trondelag", label: "Trondelag" },
  { value: "nord-norge", label: "Nord-Norge" },
];

const coverageOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const postalModeOptions = [
  { value: "city", label: "All City Coverage" },
  { value: "selected", label: "Selected Postal Codes Only" },
];

const initialPostalRows = [
  { id: "0590", postalCode: "0590", areaName: "Oslo Sentrum", status: "Active", vendors: 42 },
];

function SectionTitle({ children }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#fff0e7] text-[#cf6e38]">
        <CircleDot size={11} strokeWidth={2.5} />
      </span>
      <p className="text-[12px] font-bold text-[#2f241d]">{children}</p>
    </div>
  );
}

export default function AddDeliveryAreaModal({ onClose }) {
  const [form, setForm] = useState({
    country: "Norway",
    region: "ostlandet",
    cityName: "",
    coverageStatus: "active",
    deliveryRadius: "",
    leadTime: "",
    postalMode: "city",
  });
  const [postalRows, setPostalRows] = useState(initialPostalRows);
  const [postalForm, setPostalForm] = useState({
    id: "",
    postalCode: "",
    areaName: "",
    status: "Active",
    vendors: "",
  });

  function updatePostalField(key, value) {
    setPostalForm((current) => ({ ...current, [key]: value }));
  }

  function resetPostalForm() {
    setPostalForm({
      id: "",
      postalCode: "",
      areaName: "",
      status: "Active",
      vendors: "",
    });
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleAddPostalCode() {
    if (!postalForm.postalCode.trim() || !postalForm.areaName.trim()) {
      return;
    }

    if (postalForm.id) {
      setPostalRows((current) =>
        current.map((row) =>
          row.id === postalForm.id
            ? {
                ...row,
                postalCode: postalForm.postalCode,
                areaName: postalForm.areaName,
                status: postalForm.status,
                vendors: Number(postalForm.vendors || 0),
              }
            : row,
        ),
      );
      resetPostalForm();
      return;
    }

    setPostalRows((current) => [
      ...current,
      {
        id: `code-${current.length + 1}`,
        postalCode: postalForm.postalCode,
        areaName: postalForm.areaName,
        status: postalForm.status,
        vendors: Number(postalForm.vendors || 0),
      },
    ]);
    resetPostalForm();
  }

  function handleDeletePostalCode(id) {
    setPostalRows((current) => current.filter((row) => row.id !== id));

    if (postalForm.id === id) {
      resetPostalForm();
    }
  }

  function handleEditPostalCode(row) {
    setPostalForm({
      id: row.id,
      postalCode: row.postalCode,
      areaName: row.areaName,
      status: row.status,
      vendors: String(row.vendors),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211713]/50 px-4 py-4 backdrop-blur-[4px]">
      <div className="flex max-h-[88vh] w-full max-w-[690px] flex-col overflow-hidden rounded-[22px] border border-[#ecdccf] bg-[linear-gradient(180deg,#fffdfa_0%,#fff8f3_100%)] shadow-[0_30px_80px_rgba(28,18,12,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#f1e2d8] px-5 py-3.5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#cf6e38]">Add New Delivery Area</p>
            <h2 className="mt-1.5 text-[20px] font-bold tracking-[-0.03em] text-[#1d1612]">Add New Delivery Area</h2>
            <p className="mt-1 text-[11px] leading-5 text-[#8d8077]">
              Configure a new delivery area before it becomes available.
            </p>
          </div>

          <button
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#efddd1] bg-white text-[#685b53] transition hover:border-[#cf6e38]/30 hover:bg-[#fff2ea] hover:text-[#cf6e38]"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <div className="space-y-4">
          <section className="rounded-[14px] border border-[#eee3db] bg-white p-3.5">
            <SectionTitle>Basic Information</SectionTitle>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <AddDeliveryAreaField
                label="Country"
                onChange={(event) => updateField("country", event.target.value)}
                value={form.country}
              />
              <AddDeliveryAreaField
                as="select"
                label="Region"
                onChange={(event) => updateField("region", event.target.value)}
                options={regionOptions}
                value={form.region}
              />
              <AddDeliveryAreaField
                label="City Name"
                onChange={(event) => updateField("cityName", event.target.value)}
                placeholder="Enter city"
                value={form.cityName}
              />
              <AddDeliveryAreaField
                as="select"
                label="Coverage Status"
                onChange={(event) => updateField("coverageStatus", event.target.value)}
                options={coverageOptions}
                value={form.coverageStatus}
              />
            </div>
          </section>

          <section className="rounded-[14px] border border-[#eee3db] bg-white p-3.5">
            <SectionTitle>Delivery Coverage</SectionTitle>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <AddDeliveryAreaField
                label="Max Delivery Radius (km)"
                onChange={(event) => updateField("deliveryRadius", event.target.value)}
                placeholder="0"
                type="number"
                value={form.deliveryRadius}
              />
              <AddDeliveryAreaField
                label="Default Lead Time (days)"
                onChange={(event) => updateField("leadTime", event.target.value)}
                placeholder="1"
                type="number"
                value={form.leadTime}
              />
            </div>

            <div className="mt-3">
              <p className="text-[12px] font-bold text-[#2f241d]">Coverage Type</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {postalModeOptions.map((option) => (
                  <label
                    key={option.value}
                    className="inline-flex cursor-pointer items-center gap-2 text-[12px] font-medium text-[#574c45]"
                  >
                    <input
                      checked={form.postalMode === option.value}
                      className="accent-[#cf6e38]"
                      name="postalMode"
                      onChange={() => updateField("postalMode", option.value)}
                      type="radio"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[14px] border border-[#eee3db] bg-white p-3.5">
            <SectionTitle>Postal Codes</SectionTitle>
            <div className="mb-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              <AddDeliveryAreaField
                label="Postal Code"
                onChange={(event) => updatePostalField("postalCode", event.target.value)}
                placeholder="0590"
                value={postalForm.postalCode}
              />
              <AddDeliveryAreaField
                label="Area Name"
                onChange={(event) => updatePostalField("areaName", event.target.value)}
                placeholder="Oslo Sentrum"
                value={postalForm.areaName}
              />
              <AddDeliveryAreaField
                as="select"
                label="Status"
                onChange={(event) => updatePostalField("status", event.target.value)}
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
                value={postalForm.status}
              />
              <AddDeliveryAreaField
                label="Vendors"
                onChange={(event) => updatePostalField("vendors", event.target.value)}
                placeholder="42"
                type="number"
                value={postalForm.vendors}
              />
            </div>

            <div className="mb-3 flex justify-end">
              <button
                className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] bg-[#cf6e38] px-3 text-[12px] font-bold text-white transition hover:bg-[#bc6030]"
                onClick={handleAddPostalCode}
                type="button"
              >
                <Plus size={12} />
                <span>{postalForm.id ? "Update Code" : "Add Code"}</span>
              </button>
            </div>

            <AddDeliveryPostalCodesTable
              onAdd={handleAddPostalCode}
              onDelete={handleDeletePostalCode}
              onEdit={handleEditPostalCode}
              rows={postalRows}
            />
          </section>

          <div className="flex flex-wrap items-center justify-end gap-2.5">
            <button
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[8px] border border-[#d5ccc5] bg-white px-4 text-[12px] font-bold text-[#332822] transition hover:bg-[#faf6f2]"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[8px] bg-[#cf6e38] px-4 text-[12px] font-bold text-white transition hover:bg-[#bc6030]"
              onClick={onClose}
              type="button"
            >
              Save Delivery Area
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
