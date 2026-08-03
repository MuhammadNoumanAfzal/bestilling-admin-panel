import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  createAreaCommissionRequest,
  createVendorCommissionRequest,
  deleteAreaCommissionRequest,
  deleteVendorCommissionRequest,
  getAdminCommissionSettingsRequest,
  getCommissionAreaOptionsRequest,
  getCommissionVendorOptionsRequest,
  updateAreaCommissionRequest,
  updateGlobalCommissionRequest,
  updateVendorCommissionRequest,
} from "../api/commissionApi.js";
import AreaCommissionCard from "../components/settings/AreaCommissionCard.jsx";
import CommissionModal from "../components/settings/CommissionModal.jsx";
import CommissionSettingsHeroCard from "../components/settings/CommissionSettingsHeroCard.jsx";
import DeleteConfirmModal from "../components/settings/DeleteConfirmModal.jsx";
import VendorCommissionCard from "../components/settings/VendorCommissionCard.jsx";

const EMPTY_GLOBAL_FORM = {
  label: "",
  currentRate: "",
  description: "",
};

const EMPTY_VENDOR_FORM = {
  vendorId: "",
  vendorName: "",
  vendorSearch: "",
  areaId: "",
  areaName: "",
  areaSearch: "",
  currentCommission: "",
  effectiveFrom: "",
  effectiveTo: "",
};

const EMPTY_AREA_FORM = {
  areaId: "",
  areaName: "",
  areaSearch: "",
  commissionRate: "",
  effectiveFrom: "",
  effectiveTo: "",
};

function createEmptyCommissionState() {
  return {
    globalSettings: {
      id: "",
      label: "Platform Default",
      currentRate: "0%",
      rawRate: "",
      description: "",
    },
    vendorRows: [],
    areaRows: [],
  };
}

function normalizeRateInput(value) {
  return `${value ?? ""}`.replace(/[^\d.]/g, "");
}

function toOptionValue(option) {
  return {
    value: option.id,
    label: option.label,
  };
}

function mergeSelectedOption(options, selectedOption) {
  if (!selectedOption?.value) {
    return options;
  }

  if (options.some((option) => option.value === selectedOption.value)) {
    return options;
  }

  return [selectedOption, ...options];
}

function getDateRangeError(effectiveFrom, effectiveTo) {
  if (!effectiveFrom || !effectiveTo) {
    return "";
  }

  const start = new Date(effectiveFrom);
  const end = new Date(effectiveTo);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "";
  }

  return end < start ? "The end date must be after the start date." : "";
}

function LoadingBlock() {
  return (
    <div className="space-y-5">
      <section className="space-y-1">
        <div className="h-10 w-72 animate-pulse rounded-[14px] bg-[#efe4dc]" />
        <div className="h-6 w-[420px] animate-pulse rounded-[12px] bg-[#f3ebe4]" />
      </section>

      <div className="h-[190px] animate-pulse rounded-[16px] border border-[#eadfd6] bg-white" />

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="h-[360px] animate-pulse rounded-[16px] border border-[#eadfd6] bg-white" />
        <div className="h-[360px] animate-pulse rounded-[16px] border border-[#eadfd6] bg-white" />
      </section>
    </div>
  );
}

export default function CommissionSettingsPage() {
  const [commissionState, setCommissionState] = useState(createEmptyCommissionState);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmittingGlobal, setIsSubmittingGlobal] = useState(false);
  const [isSubmittingVendor, setIsSubmittingVendor] = useState(false);
  const [isSubmittingArea, setIsSubmittingArea] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [modalState, setModalState] = useState({ type: null, mode: "create", rowId: null });
  const [globalForm, setGlobalForm] = useState(EMPTY_GLOBAL_FORM);
  const [vendorForm, setVendorForm] = useState(EMPTY_VENDOR_FORM);
  const [areaForm, setAreaForm] = useState(EMPTY_AREA_FORM);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [vendorAreaOptions, setVendorAreaOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [isLoadingVendorOptions, setIsLoadingVendorOptions] = useState(false);
  const [isLoadingVendorAreaOptions, setIsLoadingVendorAreaOptions] = useState(false);
  const [isLoadingAreaOptions, setIsLoadingAreaOptions] = useState(false);

  const deleteTarget = useMemo(() => {
    if (!modalState.rowId || !modalState.type?.startsWith("delete")) {
      return null;
    }

    if (modalState.type === "delete-vendor") {
      return commissionState.vendorRows.find((row) => row.id === modalState.rowId) || null;
    }

    return commissionState.areaRows.find((row) => row.id === modalState.rowId) || null;
  }, [commissionState.areaRows, commissionState.vendorRows, modalState.rowId, modalState.type]);

  async function loadCommissionSettings({ silent = false } = {}) {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await getAdminCommissionSettingsRequest();
      setCommissionState(data);
      setLoadError("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load commission settings.";
      setLoadError(message);

      if (!silent) {
        await Swal.fire({
          icon: "error",
          title: "Unable to load commission settings",
          text: message,
          confirmButtonColor: "#cf6e38",
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadCommissionSettings();
  }, []);

  useEffect(() => {
    if (modalState.type !== "vendor") {
      return undefined;
    }

    let isActive = true;
    setIsLoadingVendorOptions(true);

    getCommissionVendorOptionsRequest(vendorForm.vendorSearch)
      .then((options) => {
        if (!isActive) {
          return;
        }

        setVendorOptions(
          mergeSelectedOption(
            options.map(toOptionValue),
            vendorForm.vendorId ? { value: vendorForm.vendorId, label: vendorForm.vendorName } : null,
          ),
        );
      })
      .catch(() => {
        if (isActive) {
          setVendorOptions(
            vendorForm.vendorId ? [{ value: vendorForm.vendorId, label: vendorForm.vendorName }] : [],
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingVendorOptions(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [modalState.type, vendorForm.vendorId, vendorForm.vendorName, vendorForm.vendorSearch]);

  useEffect(() => {
    if (modalState.type !== "vendor") {
      return undefined;
    }

    let isActive = true;
    setIsLoadingVendorAreaOptions(true);

    getCommissionAreaOptionsRequest(vendorForm.areaSearch)
      .then((options) => {
        if (!isActive) {
          return;
        }

        setVendorAreaOptions(
          mergeSelectedOption(
            options.map((option) => toOptionValue(option)),
            vendorForm.areaId ? { value: vendorForm.areaId, label: vendorForm.areaName } : null,
          ),
        );
      })
      .catch(() => {
        if (isActive) {
          setVendorAreaOptions(
            vendorForm.areaId ? [{ value: vendorForm.areaId, label: vendorForm.areaName }] : [],
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingVendorAreaOptions(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [modalState.type, vendorForm.areaId, vendorForm.areaName, vendorForm.areaSearch]);

  useEffect(() => {
    if (modalState.type !== "area") {
      return undefined;
    }

    let isActive = true;
    setIsLoadingAreaOptions(true);

    getCommissionAreaOptionsRequest(areaForm.areaSearch)
      .then((options) => {
        if (!isActive) {
          return;
        }

        setAreaOptions(
          mergeSelectedOption(
            options.map((option) => toOptionValue(option)),
            areaForm.areaId ? { value: areaForm.areaId, label: areaForm.areaName } : null,
          ),
        );
      })
      .catch(() => {
        if (isActive) {
          setAreaOptions(areaForm.areaId ? [{ value: areaForm.areaId, label: areaForm.areaName }] : []);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingAreaOptions(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [areaForm.areaId, areaForm.areaName, areaForm.areaSearch, modalState.type]);

  function closeModal() {
    setModalState({ type: null, mode: "create", rowId: null });
  }

  function openGlobalModal() {
    setGlobalForm({
      label: commissionState.globalSettings.label,
      currentRate: commissionState.globalSettings.rawRate,
      description: commissionState.globalSettings.description,
    });
    setModalState({ type: "global", mode: "edit", rowId: commissionState.globalSettings.id || null });
  }

  function openVendorModal(mode, row = null) {
    setVendorForm(
      row
        ? {
            vendorId: row.vendorId,
            vendorName: row.vendor,
            vendorSearch: row.vendor,
            areaId: row.areaId,
            areaName: row.area,
            areaSearch: row.area,
            currentCommission: row.rawRate,
            effectiveFrom: row.effectiveFrom,
            effectiveTo: row.effectiveTo,
          }
        : EMPTY_VENDOR_FORM,
    );
    setModalState({ type: "vendor", mode, rowId: row?.id ?? null });
  }

  function openAreaModal(mode, row = null) {
    setAreaForm(
      row
        ? {
            areaId: row.areaId,
            areaName: row.area,
            areaSearch: row.area,
            commissionRate: row.rawRate,
            effectiveFrom: row.effectiveFrom,
            effectiveTo: row.effectiveTo,
          }
        : EMPTY_AREA_FORM,
    );
    setModalState({ type: "area", mode, rowId: row?.id ?? null });
  }

  function handleGlobalChange(key, value) {
    setGlobalForm((current) => ({
      ...current,
      [key]: key === "currentRate" ? normalizeRateInput(value) : value,
    }));
  }

  function handleVendorChange(key, value) {
    if (key === "vendorId") {
      const selectedOption = vendorOptions.find((option) => option.value === value);
      setVendorForm((current) => ({
        ...current,
        vendorId: value,
        vendorName: selectedOption?.label || "",
      }));
      return;
    }

    if (key === "areaId") {
      const selectedOption = vendorAreaOptions.find((option) => option.value === value);
      setVendorForm((current) => ({
        ...current,
        areaId: value,
        areaName: selectedOption?.label || "",
      }));
      return;
    }

    setVendorForm((current) => ({
      ...current,
      [key]: key === "currentCommission" ? normalizeRateInput(value) : value,
    }));
  }

  function handleAreaChange(key, value) {
    if (key === "areaId") {
      const selectedOption = areaOptions.find((option) => option.value === value);
      setAreaForm((current) => ({
        ...current,
        areaId: value,
        areaName: selectedOption?.label || "",
      }));
      return;
    }

    setAreaForm((current) => ({
      ...current,
      [key]: key === "commissionRate" ? normalizeRateInput(value) : value,
    }));
  }

  async function handleGlobalSubmit() {
    if (!globalForm.label.trim() || !globalForm.currentRate.trim() || !globalForm.description.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Missing details",
        text: "Please complete the label, rate, and description.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setIsSubmittingGlobal(true);
      const result = await updateGlobalCommissionRequest(globalForm);
      await loadCommissionSettings({ silent: true });
      closeModal();
      await Swal.fire({
        icon: "success",
        title: "Global commission updated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update global commission",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSubmittingGlobal(false);
    }
  }

  async function handleVendorSubmit() {
    if (!vendorForm.vendorId || !vendorForm.areaId || !vendorForm.currentCommission.trim() || !vendorForm.effectiveFrom) {
      await Swal.fire({
        icon: "warning",
        title: "Missing details",
        text: "Please select a vendor, area, commission rate, and effective start date.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    const dateRangeError = getDateRangeError(vendorForm.effectiveFrom, vendorForm.effectiveTo);
    if (dateRangeError) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid date range",
        text: dateRangeError,
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setIsSubmittingVendor(true);
      const result =
        modalState.mode === "edit"
          ? await updateVendorCommissionRequest(modalState.rowId, vendorForm)
          : await createVendorCommissionRequest(vendorForm);
      await loadCommissionSettings({ silent: true });
      closeModal();
      await Swal.fire({
        icon: "success",
        title: modalState.mode === "edit" ? "Vendor commission updated" : "Vendor commission created",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: modalState.mode === "edit" ? "Unable to update vendor commission" : "Unable to create vendor commission",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSubmittingVendor(false);
    }
  }

  async function handleAreaSubmit() {
    if (!areaForm.areaId || !areaForm.commissionRate.trim() || !areaForm.effectiveFrom) {
      await Swal.fire({
        icon: "warning",
        title: "Missing details",
        text: "Please select an area, commission rate, and effective start date.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    const dateRangeError = getDateRangeError(areaForm.effectiveFrom, areaForm.effectiveTo);
    if (dateRangeError) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid date range",
        text: dateRangeError,
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setIsSubmittingArea(true);
      const result =
        modalState.mode === "edit"
          ? await updateAreaCommissionRequest(modalState.rowId, areaForm)
          : await createAreaCommissionRequest(areaForm);
      await loadCommissionSettings({ silent: true });
      closeModal();
      await Swal.fire({
        icon: "success",
        title: modalState.mode === "edit" ? "Area commission updated" : "Area commission created",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: modalState.mode === "edit" ? "Unable to update area commission" : "Unable to create area commission",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSubmittingArea(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget?.id) {
      closeModal();
      return;
    }

    try {
      setIsDeleting(true);
      const result =
        modalState.type === "delete-vendor"
          ? await deleteVendorCommissionRequest(deleteTarget.id)
          : await deleteAreaCommissionRequest(deleteTarget.id);
      await loadCommissionSettings({ silent: true });
      closeModal();
      await Swal.fire({
        icon: "success",
        title: "Commission entry removed",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to remove commission entry",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const vendorDateRangeHelper = getDateRangeError(vendorForm.effectiveFrom, vendorForm.effectiveTo);
  const areaDateRangeHelper = getDateRangeError(areaForm.effectiveFrom, areaForm.effectiveTo);

  if (isLoading) {
    return <LoadingBlock />;
  }

  return (
    <div className="space-y-5">
      <section className="space-y-1">
        <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Commission Settings</h1>
        <p className="text-[18px] leading-7">Manage platform commission rates for all vendors.</p>
        {loadError ? <p className="text-[14px] font-medium text-[#c65736]">{loadError}</p> : null}
        {isRefreshing ? <p className="text-[13px] text-[#8d8077]">Refreshing latest commission data...</p> : null}
      </section>

      <CommissionSettingsHeroCard onEdit={openGlobalModal} settings={commissionState.globalSettings} />

      <section className="grid gap-4 xl:grid-cols-2">
        <VendorCommissionCard
          onAdd={() => openVendorModal("create")}
          onDelete={(row) => setModalState({ type: "delete-vendor", mode: "delete", rowId: row.id })}
          onEdit={(row) => openVendorModal("edit", row)}
          rows={commissionState.vendorRows}
        />
        <AreaCommissionCard
          onAdd={() => openAreaModal("create")}
          onDelete={(row) => setModalState({ type: "delete-area", mode: "delete", rowId: row.id })}
          onEdit={(row) => openAreaModal("edit", row)}
          rows={commissionState.areaRows}
        />
      </section>

      <CommissionModal
        fields={[
          {
            key: "label",
            label: "Label",
            placeholder: "Platform Default",
            value: globalForm.label,
            fullWidth: true,
          },
          {
            key: "currentRate",
            label: "Current Rate",
            placeholder: "12.50",
            value: globalForm.currentRate,
            helperText: "Enter the percentage value only, without the % sign.",
          },
          {
            key: "description",
            label: "Description",
            placeholder: "Describe how this global commission is applied.",
            value: globalForm.description,
            type: "textarea",
            fullWidth: true,
          },
        ]}
        isOpen={modalState.type === "global"}
        isSubmitting={isSubmittingGlobal}
        onChange={handleGlobalChange}
        onClose={closeModal}
        onSubmit={handleGlobalSubmit}
        submitLabel="Save Global Commission"
        title="Edit Global Commission"
      />

      <CommissionModal
        fields={[
          {
            key: "vendorId",
            label: "Vendor",
            value: vendorForm.vendorId,
            type: "search-select",
            placeholder: "Select vendor",
            searchPlaceholder: "Search vendor name",
            searchValue: vendorForm.vendorSearch,
            onSearchChange: (value) => setVendorForm((current) => ({ ...current, vendorSearch: value })),
            options: vendorOptions,
            isLoadingOptions: isLoadingVendorOptions,
            disabled: modalState.mode === "edit",
            helperText:
              modalState.mode === "edit"
                ? "Vendor is locked for existing commission overrides."
                : "Search and choose the vendor to override.",
          },
          {
            key: "areaId",
            label: "Area",
            value: vendorForm.areaId,
            type: "search-select",
            placeholder: "Select area",
            searchPlaceholder: "Search delivery area",
            searchValue: vendorForm.areaSearch,
            onSearchChange: (value) => setVendorForm((current) => ({ ...current, areaSearch: value })),
            options: vendorAreaOptions,
            isLoadingOptions: isLoadingVendorAreaOptions,
            helperText: "Choose the area where this vendor override applies.",
          },
          {
            key: "currentCommission",
            label: "Commission Rate",
            placeholder: "15.00",
            value: vendorForm.currentCommission,
            helperText: "Enter the percentage value only, without the % sign.",
          },
          {
            key: "effectiveFrom",
            label: "Effective From",
            type: "datetime-local",
            value: vendorForm.effectiveFrom,
            helperText: "Required. This override becomes active from this date and time.",
          },
          {
            key: "effectiveTo",
            label: "Effective To",
            type: "datetime-local",
            value: vendorForm.effectiveTo,
            helperText: vendorDateRangeHelper || "Optional. Leave blank to keep the override active until removed.",
          },
        ]}
        isOpen={modalState.type === "vendor"}
        isSubmitting={isSubmittingVendor}
        onChange={handleVendorChange}
        onClose={closeModal}
        onSubmit={handleVendorSubmit}
        submitLabel={modalState.mode === "edit" ? "Save Vendor Commission" : "Add Vendor Commission"}
        title={modalState.mode === "edit" ? "Edit Vendor Commission" : "Assign Vendor Commission"}
      />

      <CommissionModal
        fields={[
          {
            key: "areaId",
            label: "Area",
            value: areaForm.areaId,
            type: "search-select",
            placeholder: "Select area",
            searchPlaceholder: "Search area or region",
            searchValue: areaForm.areaSearch,
            onSearchChange: (value) => setAreaForm((current) => ({ ...current, areaSearch: value })),
            options: areaOptions,
            isLoadingOptions: isLoadingAreaOptions,
            disabled: modalState.mode === "edit",
            helperText:
              modalState.mode === "edit"
                ? "Area is locked for existing commission overrides."
                : "Search and choose the area to override.",
          },
          {
            key: "commissionRate",
            label: "Commission Rate",
            placeholder: "10.00",
            value: areaForm.commissionRate,
            helperText: "Enter the percentage value only, without the % sign.",
          },
          {
            key: "effectiveFrom",
            label: "Effective From",
            type: "datetime-local",
            value: areaForm.effectiveFrom,
            helperText: "Required. This override becomes active from this date and time.",
          },
          {
            key: "effectiveTo",
            label: "Effective To",
            type: "datetime-local",
            value: areaForm.effectiveTo,
            helperText: areaDateRangeHelper || "Optional. Leave blank to keep the override active until removed.",
          },
        ]}
        isOpen={modalState.type === "area"}
        isSubmitting={isSubmittingArea}
        onChange={handleAreaChange}
        onClose={closeModal}
        onSubmit={handleAreaSubmit}
        submitLabel={modalState.mode === "edit" ? "Save Area Commission" : "Add Area Commission"}
        title={modalState.mode === "edit" ? "Edit Area Commission" : "Add Area Commission"}
      />

      <DeleteConfirmModal
        description={
          deleteTarget
            ? `This will deactivate the ${modalState.type === "delete-vendor" ? "vendor" : "area"} commission override for ${
                modalState.type === "delete-vendor" ? deleteTarget.vendor : deleteTarget.area
              }.`
            : ""
        }
        isOpen={modalState.type === "delete-vendor" || modalState.type === "delete-area"}
        isSubmitting={isDeleting}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Commission Entry"
      />
    </div>
  );
}
