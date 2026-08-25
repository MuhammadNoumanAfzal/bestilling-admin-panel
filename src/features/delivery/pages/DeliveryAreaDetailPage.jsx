import { ChevronLeft, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  addDeliveryPostalAreaRequest,
  deleteDeliveryAreaRequest,
  deleteDeliveryPostalAreaRequest,
  getAdminDeliveryAreaRequest,
  updateDeliveryAreaRequest,
  updateDeliveryAreaStatusRequest,
  updateDeliveryPostalAreaRequest,
} from "../api/deliveryApi.js";
import DeliveryPostalAreasCard from "../components/details/DeliveryPostalAreasCard.jsx";
import DeliverySettingsCard from "../components/details/DeliverySettingsCard.jsx";
import DeliveryStatusPill from "../components/details/DeliveryStatusPill.jsx";
import { useNavigate } from "react-router-dom";

function createInitialSettingsForm(area) {
  return {
    maxDeliveryRadius: area?.settings?.maxDeliveryRadius || "",
    leadTimeDays: area?.settings?.leadTimeDays || "",
    minimumOrderAmount: area?.settings?.minimumOrderAmount || "",
    deliveryFee: area?.settings?.deliveryFee || "",
    notes: area?.settings?.notes || "",
  };
}

export default function DeliveryAreaDetailPage() {
  const { areaId } = useParams();
  const navigate = useNavigate();
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

  async function handleDeleteArea() {
    if (!area?.id) {
      return;
    }

    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Delete delivery area?",
      text: `This will permanently remove ${area.city} and its linked delivery coverage.`,
      showCancelButton: true,
      confirmButtonColor: "#d15b42",
      cancelButtonColor: "#c8b9aa",
      confirmButtonText: "Delete Area",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      const result = await deleteDeliveryAreaRequest(area.id);
      await Swal.fire({
        icon: "success",
        title: "Delivery area deleted",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
      navigate("/delivery");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to delete delivery area",
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
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[8px] border border-[#f0b8ab] bg-white px-3.5 text-[12px] font-bold text-[#d15b42] transition hover:bg-[#fff4f1]"
              onClick={handleDeleteArea}
              type="button"
            >
              Delete Area
            </button>
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

      <div className="grid gap-4">
        <DeliverySettingsCard area={area} form={settingsForm} onChange={updateSettingsField} />
      </div>

      <section className="rounded-[18px] border border-[#ddd4cd] bg-white p-5 shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[24px] font-bold tracking-[-0.03em] text-[#18120f]">Linked Vendors</h2>
            <p className="mt-2 text-[15px] leading-6 text-[#6f645d]">
              Vendors currently associated with this delivery area.
            </p>
          </div>
          <span className="inline-flex rounded-full bg-[#fff4ea] px-3 py-1.5 text-[12px] font-bold text-[#cf6e38]">
            {area.linkedVendors.length} linked
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {area.linkedVendors.length ? (
            area.linkedVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="rounded-[14px] border border-[#eadfd6] bg-[#fffdfa] px-4 py-3 text-[14px] text-[#18120f]"
              >
                <p className="font-semibold">{vendor.businessName}</p>
                <p className="mt-1 text-[12px] text-[#7a6d66]">
                  {vendor.isActive ? "Active vendor" : "Inactive vendor"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-[14px] text-[#7a6d66]">No vendors are linked to this delivery area yet.</p>
          )}
        </div>
      </section>

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
