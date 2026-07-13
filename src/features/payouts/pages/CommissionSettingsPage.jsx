import { useMemo, useState } from "react";
import AreaCommissionCard from "../components/settings/AreaCommissionCard.jsx";
import CommissionModal from "../components/settings/CommissionModal.jsx";
import CommissionSettingsHeroCard from "../components/settings/CommissionSettingsHeroCard.jsx";
import DeleteConfirmModal from "../components/settings/DeleteConfirmModal.jsx";
import VendorCommissionCard from "../components/settings/VendorCommissionCard.jsx";
import {
  areaCommissionRows,
  globalCommissionSettings,
  vendorCommissionRows,
} from "../data/payoutsData.js";

const vendorFieldTemplate = [
  { key: "vendor", label: "Vendor Name", placeholder: "Enter vendor name", fullWidth: true },
  { key: "area", label: "Area", placeholder: "Enter area" },
  { key: "currentCommission", label: "Commission Rate", placeholder: "12%" },
];

const areaFieldTemplate = [
  { key: "area", label: "Area Name", placeholder: "Enter area" },
  { key: "commissionRate", label: "Commission Rate", placeholder: "10%" },
  { key: "activeVendors", label: "Active Vendors", placeholder: "8" },
  { key: "orderShare", label: "Order Share", placeholder: "15%" },
];

function buildVendorAvatar(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function CommissionSettingsPage() {
  const [globalSettings, setGlobalSettings] = useState(globalCommissionSettings);
  const [vendorRows, setVendorRows] = useState(vendorCommissionRows);
  const [areaRows, setAreaRows] = useState(areaCommissionRows);
  const [modalState, setModalState] = useState({ type: null, mode: "create", rowId: null });
  const [globalForm, setGlobalForm] = useState({
    label: globalCommissionSettings.label,
    currentRate: globalCommissionSettings.currentRate,
    description: globalCommissionSettings.description,
  });
  const [vendorForm, setVendorForm] = useState({ vendor: "", area: "", currentCommission: "" });
  const [areaForm, setAreaForm] = useState({ area: "", commissionRate: "", activeVendors: "", orderShare: "" });

  const deleteTarget = useMemo(() => {
    if (!modalState.rowId || !modalState.type?.startsWith("delete")) {
      return null;
    }

    if (modalState.type === "delete-vendor") {
      return vendorRows.find((row) => row.id === modalState.rowId) || null;
    }

    return areaRows.find((row) => row.id === modalState.rowId) || null;
  }, [areaRows, modalState.rowId, modalState.type, vendorRows]);

  function closeModal() {
    setModalState({ type: null, mode: "create", rowId: null });
  }

  function openGlobalModal() {
    setGlobalForm({
      label: globalSettings.label,
      currentRate: globalSettings.currentRate,
      description: globalSettings.description,
    });
    setModalState({ type: "global", mode: "edit", rowId: null });
  }

  function openVendorModal(mode, row = null) {
    setVendorForm(
      row
        ? {
            vendor: row.vendor,
            area: row.area,
            currentCommission: row.currentCommission,
          }
        : { vendor: "", area: "", currentCommission: "" },
    );

    setModalState({ type: "vendor", mode, rowId: row?.id ?? null });
  }

  function openAreaModal(mode, row = null) {
    setAreaForm(
      row
        ? {
            area: row.area,
            commissionRate: row.commissionRate,
            activeVendors: row.activeVendors,
            orderShare: row.orderShare,
          }
        : { area: "", commissionRate: "", activeVendors: "", orderShare: "" },
    );

    setModalState({ type: "area", mode, rowId: row?.id ?? null });
  }

  function handleGlobalSubmit() {
    if (!globalForm.currentRate.trim() || !globalForm.description.trim()) {
      return;
    }

    setGlobalSettings({
      label: globalForm.label.trim(),
      currentRate: globalForm.currentRate.trim(),
      description: globalForm.description.trim(),
    });
    closeModal();
  }

  function handleVendorSubmit() {
    if (!vendorForm.vendor.trim() || !vendorForm.area.trim() || !vendorForm.currentCommission.trim()) {
      return;
    }

    const nextRow = {
      id: modalState.rowId || `vendor-row-${Date.now()}`,
      vendor: vendorForm.vendor.trim(),
      area: vendorForm.area.trim(),
      currentCommission: vendorForm.currentCommission.trim(),
      avatar: buildVendorAvatar(vendorForm.vendor),
      avatarUrl: `https://i.pravatar.cc/120?u=${encodeURIComponent(vendorForm.vendor.trim())}`,
    };

    if (modalState.mode === "edit") {
      setVendorRows((current) => current.map((row) => (row.id === modalState.rowId ? nextRow : row)));
    } else {
      setVendorRows((current) => [nextRow, ...current]);
    }

    closeModal();
  }

  function handleAreaSubmit() {
    if (!areaForm.area.trim() || !areaForm.commissionRate.trim()) {
      return;
    }

    const nextRow = {
      id: modalState.rowId || `area-row-${Date.now()}`,
      area: areaForm.area.trim(),
      commissionRate: areaForm.commissionRate.trim(),
      activeVendors: areaForm.activeVendors.trim() || "0",
      orderShare: areaForm.orderShare.trim() || "0%",
    };

    if (modalState.mode === "edit") {
      setAreaRows((current) => current.map((row) => (row.id === modalState.rowId ? nextRow : row)));
    } else {
      setAreaRows((current) => [nextRow, ...current]);
    }

    closeModal();
  }

  function handleDeleteConfirm() {
    if (modalState.type === "delete-vendor") {
      setVendorRows((current) => current.filter((row) => row.id !== modalState.rowId));
    }

    if (modalState.type === "delete-area") {
      setAreaRows((current) => current.filter((row) => row.id !== modalState.rowId));
    }

    closeModal();
  }

  return (
    <div className="space-y-5">
      <section className="space-y-1">
        <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Commission Settings</h1>
        <p className="text-[18px] leading-7">Manage platform commission rates for all vendors.</p>
      </section>

      <CommissionSettingsHeroCard onEdit={openGlobalModal} settings={globalSettings} />

      <section className="grid gap-4 xl:grid-cols-2">
        <VendorCommissionCard
          onAdd={() => openVendorModal("create")}
          onDelete={(row) => setModalState({ type: "delete-vendor", mode: "delete", rowId: row.id })}
          onEdit={(row) => openVendorModal("edit", row)}
          rows={vendorRows}
        />
        <AreaCommissionCard
          onAdd={() => openAreaModal("create")}
          onDelete={(row) => setModalState({ type: "delete-area", mode: "delete", rowId: row.id })}
          onEdit={(row) => openAreaModal("edit", row)}
          rows={areaRows}
        />
      </section>

      <CommissionModal
        fields={[
          { key: "label", label: "Label", placeholder: "Platform Default", value: globalForm.label, fullWidth: true },
          { key: "currentRate", label: "Current Rate", placeholder: "12%", value: globalForm.currentRate },
          {
            key: "description",
            label: "Description",
            placeholder: "Describe how this global commission is applied.",
            value: globalForm.description,
            fullWidth: true,
          },
        ]}
        isOpen={modalState.type === "global"}
        onChange={(key, value) => setGlobalForm((current) => ({ ...current, [key]: value }))}
        onClose={closeModal}
        onSubmit={handleGlobalSubmit}
        submitLabel="Save Global Commission"
        title="Edit Global Commission"
      />

      <CommissionModal
        fields={vendorFieldTemplate.map((field) => ({ ...field, value: vendorForm[field.key] }))}
        isOpen={modalState.type === "vendor"}
        onChange={(key, value) => setVendorForm((current) => ({ ...current, [key]: value }))}
        onClose={closeModal}
        onSubmit={handleVendorSubmit}
        submitLabel={modalState.mode === "edit" ? "Save Vendor Commission" : "Add Vendor Commission"}
        title={modalState.mode === "edit" ? "Edit Vendor Commission" : "Assign Vendor Commission"}
      />

      <CommissionModal
        fields={areaFieldTemplate.map((field) => ({ ...field, value: areaForm[field.key] }))}
        isOpen={modalState.type === "area"}
        onChange={(key, value) => setAreaForm((current) => ({ ...current, [key]: value }))}
        onClose={closeModal}
        onSubmit={handleAreaSubmit}
        submitLabel={modalState.mode === "edit" ? "Save Area Commission" : "Add Area Commission"}
        title={modalState.mode === "edit" ? "Edit Area Commission" : "Add Area Commission"}
      />

      <DeleteConfirmModal
        description={
          deleteTarget
            ? `This will remove ${modalState.type === "delete-vendor" ? deleteTarget.vendor : deleteTarget.area} from the commission settings.`
            : ""
        }
        isOpen={modalState.type === "delete-vendor" || modalState.type === "delete-area"}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Commission Entry"
      />
    </div>
  );
}
