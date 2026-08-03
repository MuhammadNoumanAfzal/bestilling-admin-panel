import { ChevronLeft, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  addDeliveryPostalAreaRequest,
  deleteDeliveryPostalAreaRequest,
  getAdminDeliveryAreaRequest,
  updateDeliveryAreaRequest,
  updateDeliveryAreaStatusRequest,
  updateDeliveryPostalAreaRequest,
} from "../api/deliveryApi.js";
import DeliveryMapCard from "../components/details/DeliveryMapCard.jsx";
import DeliveryPostalAreasCard from "../components/details/DeliveryPostalAreasCard.jsx";
import DeliverySettingsCard from "../components/details/DeliverySettingsCard.jsx";
import DeliveryStatusPill from "../components/details/DeliveryStatusPill.jsx";

function createInitialSettingsForm(area) {
  return {
    maxDeliveryRadius: area?.settings?.maxDeliveryRadius || "",
    leadTimeDays: area?.settings?.leadTimeDays || "",
    coverageType: area?.settings?.coverageType || "SELECTED_POSTAL_CODES_ONLY",
    minimumOrderAmount: area?.settings?.minimumOrderAmount || "",
    deliveryFee: area?.settings?.deliveryFee || "",
    isRestricted: Boolean(area?.settings?.isRestricted),
    isExpressEnabled: Boolean(area?.settings?.isExpressEnabled),
    notes: area?.settings?.notes || "",
  };
}

export default function DeliveryAreaDetailPage() {
  const { areaId } = useParams();
  const [area, setArea] = useState(null);
  const [settingsForm, setSettingsForm] = useState(createInitialSettingsForm(null));
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSubmittingPostalArea, setIsSubmittingPostalArea] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadArea() {
      setIsLoading(true);
      setLoadError("");

      try {
        const result = await getAdminDeliveryAreaRequest(areaId);

        if (!isMounted) {
          return;
        }

        setArea(result);
        setSettingsForm(createInitialSettingsForm(result));
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load this delivery area.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadArea();

    return () => {
      isMounted = false;
    };
  }, [areaId]);

  function updateSettingsField(key, value) {
    setSettingsForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSaveChanges() {
    if (!area?.id) {
      return;
    }

    try {
      setIsSaving(true);
      const result = await updateDeliveryAreaRequest(area.id, settingsForm);
      const refreshedArea = await getAdminDeliveryAreaRequest(area.id);
      setArea(refreshedArea);
      setSettingsForm(createInitialSettingsForm(refreshedArea));

      await Swal.fire({
        icon: "success",
        title: "Delivery area updated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to save changes",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleStatus() {
    if (!area?.id) {
      return;
    }

    const nextStatus = area.rawStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      setIsUpdatingStatus(true);
      const result = await updateDeliveryAreaStatusRequest(area.id, nextStatus);
      setArea((current) =>
        current
          ? {
              ...current,
              status: result.status,
              rawStatus: result.rawStatus,
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: "Area status updated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update area status",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleCreatePostalArea(deliveryAreaId, form) {
    try {
      setIsSubmittingPostalArea(true);
      const result = await addDeliveryPostalAreaRequest(deliveryAreaId, form);
      setArea((current) =>
        current
          ? {
              ...current,
              postalAreas: [result.postalArea, ...current.postalAreas],
            }
          : current,
      );
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to add postal area",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
      throw error;
    } finally {
      setIsSubmittingPostalArea(false);
    }
  }

  async function handleUpdatePostalArea(postalAreaId, form) {
    try {
      setIsSubmittingPostalArea(true);
      const result = await updateDeliveryPostalAreaRequest(postalAreaId, form);
      setArea((current) =>
        current
          ? {
              ...current,
              postalAreas: current.postalAreas.map((row) =>
                row.id === postalAreaId ? { ...row, ...result.postalArea } : row,
              ),
            }
          : current,
      );
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update postal area",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
      throw error;
    } finally {
      setIsSubmittingPostalArea(false);
    }
  }

  async function handleDeletePostalArea(postalAreaId) {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Delete postal area?",
      text: "This postal area will be removed from the delivery zone.",
      showCancelButton: true,
      confirmButtonColor: "#d15b42",
      cancelButtonColor: "#c8b9aa",
      confirmButtonText: "Delete",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      await deleteDeliveryPostalAreaRequest(postalAreaId);
      setArea((current) =>
        current
          ? {
              ...current,
              postalAreas: current.postalAreas.filter((row) => row.id !== postalAreaId),
            }
          : current,
      );
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to delete postal area",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    }
  }

  if (!isLoading && loadError && !area) {
    return <Navigate replace to="/delivery" />;
  }

  if (!area) {
    return (
      <div className="rounded-[16px] border border-[#ece4de] bg-white px-5 py-12 text-center text-[15px] font-medium text-[#6f645d]">
        {isLoading ? "Loading delivery area..." : "Unable to load this delivery area."}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <Link
          className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-[#7d7068] transition hover:text-[#cf6e38]"
          to="/delivery"
        >
          <ChevronLeft size={15} />
          <span>Back to Delivery</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4ea] px-3 py-1.5 text-[12px] font-bold text-[#cf6e38]">
            <MapPin size={14} />
            {area.city}
          </span>
          <DeliveryStatusPill status={area.status} />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[38px] font-bold tracking-[-0.04em] text-[#18120f]">{area.city}</h1>
            <p className="text-[18px] leading-7 ">
              View postal code coverage, service controls, and local delivery configuration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[8px] border border-[#f0b8ab] bg-white px-3.5 text-[12px] font-bold text-[#d15b42] transition hover:bg-[#fff4f1] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isUpdatingStatus}
              onClick={handleToggleStatus}
              type="button"
            >
              {isUpdatingStatus
                ? "Updating..."
                : area.rawStatus === "ACTIVE"
                  ? "Disable Area"
                  : "Activate Area"}
            </button>
            <button
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[8px] bg-[#cf6e38] px-3.5 text-[12px] font-bold text-white transition hover:bg-[#bc6030] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={handleSaveChanges}
              type="button"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <DeliverySettingsCard area={area} form={settingsForm} onChange={updateSettingsField} />
        <DeliveryMapCard area={area} />
      </div>

      <DeliveryPostalAreasCard
        areaId={area.id}
        areaName={area.city}
        isSubmitting={isSubmittingPostalArea}
        onCreate={handleCreatePostalArea}
        onDelete={handleDeletePostalArea}
        onUpdate={handleUpdatePostalArea}
        rows={area.postalAreas}
      />
    </div>
  );
}
