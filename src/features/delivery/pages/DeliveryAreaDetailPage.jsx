import { ChevronLeft, MapPin } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import DeliveryMapCard from "../components/details/DeliveryMapCard.jsx";
import DeliveryPostalAreasCard from "../components/details/DeliveryPostalAreasCard.jsx";
import DeliverySettingsCard from "../components/details/DeliverySettingsCard.jsx";
import DeliveryStatusPill from "../components/details/DeliveryStatusPill.jsx";
import { getDeliveryAreaById } from "../data/deliveryData.js";

export default function DeliveryAreaDetailPage() {
  const { areaId } = useParams();
  const area = getDeliveryAreaById(areaId);

  if (!area) {
    return <Navigate replace to="/delivery" />;
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
              type="button"
            >
              Disable Area
            </button>
            <button
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[8px] bg-[#cf6e38] px-3.5 text-[12px] font-bold text-white transition hover:bg-[#bc6030]"
              type="button"
            >
              Save Changes
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <DeliverySettingsCard area={area} />
        <DeliveryMapCard area={area} />
      </div>

      <DeliveryPostalAreasCard area={area} />
    </div>
  );
}
