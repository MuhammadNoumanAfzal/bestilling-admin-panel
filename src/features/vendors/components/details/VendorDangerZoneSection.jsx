import { vt, useVendorLanguage } from "../../utils/vendorTranslation.js";
import Swal from "sweetalert2";
import VendorSectionHeading from "./VendorSectionHeading.jsx";

export default function VendorDangerZoneSection({
  vendorName,
  dangerZone,
  deleteLabel = "Delete Permanently",
  isDeleting = false,
  isSuspending = false,
  onDelete,
  onSuspend,
  suspendLabel = "Suspend Account",
}) {
  useVendorLanguage();
  return (
    <section className="space-y-4">
      <VendorSectionHeading danger title={vt("Administrative Danger Zone")} />

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[16px] border border-[#fbcaca] bg-gradient-to-br from-white to-[#fffcfc] p-5 shadow-[0_4px_16px_rgba(216,63,63,0.03)]">
          <h3 className="text-[18px] font-extrabold text-[#18120f]">{vt(dangerZone.suspendTitle)}</h3>
          <p className="mt-2 text-[14px] leading-6 text-[#5a4d46]">{vt(dangerZone.suspendDescription)}</p>
          <button
            className="mt-4 w-full rounded-[10px] border border-[#d83f3f] bg-white px-4 py-3 text-[13px] font-bold text-[#d83f3f] transition hover:bg-[#fff5f5]"
            disabled={isSuspending}
            onClick={onSuspend}
            type="button"
          >
            {isSuspending ? vt("Updating...") : vt(suspendLabel)}
          </button>
        </article>

        <article className="rounded-[16px] border border-[#fbcaca] bg-gradient-to-br from-white to-[#fffcfc] p-5 shadow-[0_4px_16px_rgba(216,63,63,0.03)]">
          <h3 className="text-[18px] font-extrabold text-[#18120f]">{vt(dangerZone.deleteTitle)}</h3>
          <p className="mt-2 text-[14px] leading-6 text-[#5a4d46]">{vt(dangerZone.deleteDescription)}</p>
          <button
            className="mt-4 w-full rounded-[10px] bg-[#d83f3f] px-4 py-3 text-[13px] font-bold text-white transition hover:bg-[#b03030]"
            disabled={isDeleting}
            onClick={onDelete}
            type="button"
          >
            {isDeleting ? vt("Deleting...") : vt(deleteLabel)}
          </button>
        </article>
      </div>
    </section>
  );
}
