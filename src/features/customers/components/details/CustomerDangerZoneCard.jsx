import { AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";

export default function CustomerDangerZoneCard({ customerName }) {
  const handleDeactivate = () => {
    Swal.fire({
      title: "Deactivate & Block Customer?",
      text: `Are you sure you want to deactivate ${customerName}? Active orders will be cancelled.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, block account",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Account Blocked",
          text: `Customer ${customerName} has been blocked successfully.`,
          icon: "success",
          confirmButtonColor: "#d96834",
        });
      }
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Delete account permanently?",
      text: `This will scrub all PII data for ${customerName}. This action is permanent and cannot be undone.`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, delete account data",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Account Data Deleted",
          text: `Customer database record anonymized successfully.`,
          icon: "success",
          confirmButtonColor: "#d96834",
        });
      }
    });
  };

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1">
        <span className="h-4.5 w-[3px] bg-[#d83f3f] rounded-full" />
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-[6px] bg-[#fdeded] text-[#d83f3f]">
          <AlertTriangle size={13} strokeWidth={2.5} />
        </span>
        <h3 className="text-[18px] font-bold text-[#d83f3f]">
          Administrative Danger Zone
        </h3>
      </div>

      {/* Two side-by-side cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Deactivate & Block */}
        <article className="flex flex-col justify-between rounded-[14px] border border-[#fbcaca] bg-[#fffcfc] p-5 shadow-[0_6px_16px_rgba(216,63,63,0.03)] space-y-4">
          <div className="space-y-1.5">
            <h4 className="text-[15px] font-bold text-[#18120f]">
              Deactivate & Block Customer
            </h4>
            <p className="text-[12px] text-[#5a4d46] leading-relaxed">
              Prevents the customer from logging in or placing any future orders. Active orders will be cancelled.
            </p>
          </div>
          <button
            onClick={handleDeactivate}
            type="button"
            className="w-full flex h-9.5 cursor-pointer items-center justify-center rounded-[10px] border border-[#d83f3f] bg-white text-[12px] font-bold text-[#d83f3f] outline-none transition duration-150 hover:bg-[#fdf2f2]"
          >
            Block Account
          </button>
        </article>

        {/* Permanently Delete */}
        <article className="flex flex-col justify-between rounded-[14px] border border-[#fbcaca] bg-[#fffcfc] p-5 shadow-[0_6px_16px_rgba(216,63,63,0.03)] space-y-4">
          <div className="space-y-1.5">
            <h4 className="text-[15px] font-bold text-[#18120f]">
              Permanently Delete Account
            </h4>
            <p className="text-[12px] text-[#5a4d46] leading-relaxed">
              Removes all PII data from the live database. Historical transactional records are anonymized for legal reporting.
            </p>
          </div>
          <button
            onClick={handleDelete}
            type="button"
            className="w-full flex h-9.5 cursor-pointer items-center justify-center rounded-[10px] bg-[#d83f3f] text-[12px] font-bold text-white outline-none transition duration-150 hover:bg-[#b03030] shadow-sm shadow-red-200"
          >
            Delete Account Data
          </button>
        </article>
      </div>
    </section>
  );
}
