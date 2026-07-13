import CommissionSettingsHeroCard from "../components/settings/CommissionSettingsHeroCard.jsx";
import AreaCommissionCard from "../components/settings/AreaCommissionCard.jsx";
import VendorCommissionCard from "../components/settings/VendorCommissionCard.jsx";
import {
  areaCommissionRows,
  globalCommissionSettings,
  vendorCommissionRows,
} from "../data/payoutsData.js";

export default function CommissionSettingsPage() {
  return (
    <div className="space-y-5">
      <section className="space-y-1">
        <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Commission Settings</h1>
        <p className="text-[14px] leading-6 text-[#6f645d]">
          Manage platform commission rates for all vendors.
        </p>
      </section>

      <CommissionSettingsHeroCard settings={globalCommissionSettings} />

      <section className="grid gap-4 xl:grid-cols-2">
        <VendorCommissionCard rows={vendorCommissionRows} />
        <AreaCommissionCard rows={areaCommissionRows} />
      </section>
    </div>
  );
}
