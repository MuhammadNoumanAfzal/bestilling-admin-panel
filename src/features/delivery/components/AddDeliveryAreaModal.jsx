import { CircleDot, Plus, X } from "lucide-react";
import { useState } from "react";
import AddDeliveryAreaField from "./add-area/AddDeliveryAreaField.jsx";
import AddDeliveryPostalCodesTable from "./add-area/AddDeliveryPostalCodesTable.jsx";

const postalStatusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const initialPostalForm = {
  id: "",
  postalCode: "",
  areaName: "",
  status: "ACTIVE",
};

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

export default function AddDeliveryAreaModal({
  isSubmitting = false,
  onClose,
  onSubmit,
  regionOptions = [],
}) {
  const [form, setForm] = useState({
    country: "Norway",
    region: "",
    city: "",
  });
  const [postalRows, setPostalRows] = useState([]);
  const [postalForm, setPostalForm] = useState(initialPostalForm);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updatePostalField(key, value) {
    setPostalForm((current) => ({ ...current, [key]: value }));
  }

  function resetPostalForm() {
    setPostalForm(initialPostalForm);
  }

  function handleAddPostalCode() {
    const trimmedPostalCode = postalForm.postalCode.trim();
    const trimmedAreaName = postalForm.areaName.trim();

    if (!trimmedPostalCode || !trimmedAreaName) {
      return;
    }

    const nextRow = {
      id: postalForm.id || `postal-${Date.now()}`,
      postalCode: trimmedPostalCode,
      areaName: trimmedAreaName,
      status: postalForm.status,
    };

    if (postalForm.id) {
      setPostalRows((current) =>
        current.map((row) => (row.id === postalForm.id ? nextRow : row)),
      );
    } else {
      setPostalRows((current) => [...current, nextRow]);
    }

    resetPostalForm();
  }

  function handleEditPostalCode(row) {
    setPostalForm({
      id: row.id,
      postalCode: row.postalCode,
      areaName: row.areaName,
      status: row.status,
    });
  }

  function handleDeletePostalCode(id) {
    setPostalRows((current) => current.filter((row) => row.id !== id));

    if (postalForm.id === id) {
      resetPostalForm();
    }
  }

  async function handleSave() {
    await onSubmit({
      city: form.city,
      region: form.region,
      country: form.country,
      postalAreas: postalRows,
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
                  label="Region"
                  onChange={(event) => updateField("region", event.target.value)}
                  placeholder="Enter region"
                  value={form.region}
                />
                <AddDeliveryAreaField
                  label="City Name"
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="Enter city"
                  value={form.city}
                />
              </div>
            </section>

            <section className="rounded-[14px] border border-[#eee3db] bg-white p-3.5">
              <SectionTitle>Postal Codes</SectionTitle>
              <div className="mb-3 grid gap-2.5 sm:grid-cols-3">
                <AddDeliveryAreaField
                  label="Postal Code"
                  onChange={(event) => updatePostalField("postalCode", event.target.value)}
                  placeholder="5003"
                  value={postalForm.postalCode}
                />
                <AddDeliveryAreaField
                  label="Area Name"
                  onChange={(event) => updatePostalField("areaName", event.target.value)}
                  placeholder="Bergen Sentrum"
                  value={postalForm.areaName}
                />
                <AddDeliveryAreaField
                  as="select"
                  label="Status"
                  onChange={(event) => updatePostalField("status", event.target.value)}
                  options={postalStatusOptions}
                  value={postalForm.status}
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
                rows={postalRows.map((row) => ({
                  ...row,
                  status: row.status === "ACTIVE" ? "Active" : "Inactive",
                  vendors: 0,
                }))}
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
                className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[8px] bg-[#cf6e38] px-4 text-[12px] font-bold text-white transition hover:bg-[#bc6030] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                onClick={handleSave}
                type="button"
              >
                {isSubmitting ? "Saving..." : "Save Delivery Area"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
