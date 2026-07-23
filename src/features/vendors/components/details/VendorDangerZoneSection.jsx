import Swal from "sweetalert2";
import VendorSectionHeading from "./VendorSectionHeading.jsx";

export default function VendorDangerZoneSection({ vendorName, dangerZone }) {
  function handleSuspend() {
    Swal.fire({
      title: "Suspend vendor account?",
      text: `${vendorName} will be hidden from listings and will stop receiving new orders.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d83f3f",
      cancelButtonColor: "#c8b9aa",
      confirmButtonText: "Suspend account",
    });
  }

  function handleDelete() {
    Swal.fire({
      title: "Delete vendor permanently?",
      text: `This action will permanently remove ${vendorName} and cannot be undone.`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d83f3f",
      cancelButtonColor: "#c8b9aa",
      confirmButtonText: "Delete permanently",
    });
  }

  return (
    <section className="space-y-4">
      <VendorSectionHeading danger title="Administrative Danger Zone" />

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[16px] border border-[#fbcaca] bg-gradient-to-br from-white to-[#fffcfc] p-5 shadow-[0_4px_16px_rgba(216,63,63,0.03)]">
          <h3 className="text-[16px] font-extrabold text-[#18120f]">{dangerZone.suspendTitle}</h3>
          <p className="mt-2 text-[13px] leading-6 text-[#5a4d46]">{dangerZone.suspendDescription}</p>
          <button
            className="mt-4 w-full rounded-[10px] border border-[#d83f3f] bg-white px-4 py-2.5 text-[12px] font-bold text-[#d83f3f] transition hover:bg-[#fff5f5]"
            onClick={handleSuspend}
            type="button"
          >
            Suspend Account
          </button>
        </article>

        <article className="rounded-[16px] border border-[#fbcaca] bg-gradient-to-br from-white to-[#fffcfc] p-5 shadow-[0_4px_16px_rgba(216,63,63,0.03)]">
          <h3 className="text-[16px] font-extrabold text-[#18120f]">{dangerZone.deleteTitle}</h3>
          <p className="mt-2 text-[13px] leading-6 text-[#5a4d46]">{dangerZone.deleteDescription}</p>
          <button
            className="mt-4 w-full rounded-[10px] bg-[#d83f3f] px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#b03030]"
            onClick={handleDelete}
            type="button"
          >
            Delete Permanently
          </button>
        </article>
      </div>
    </section>
  );
}
