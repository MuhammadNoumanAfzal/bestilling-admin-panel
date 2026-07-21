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
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 px-1">
        <span className="h-5 w-[3px] bg-[#d83f3f] rounded-full" />
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-[#fdeded] text-[#d83f3f] shadow-sm">
          <AlertTriangle size={13} strokeWidth={2.5} />
        </span>
        <h3 className="text-[18px] font-extrabold tracking-tight text-[#d83f3f]">
          Administrative Danger Zone
        </h3>
      </div>

      {/* Two side-by-side cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Deactivate & Block */}
        <article className="flex flex-col justify-between space-y-5 rounded-[16px] border border-[#fbcaca] bg-gradient-to-br from-white to-[#fffcfc] p-4 shadow-[0_4px_16px_rgba(216,63,63,0.02)] transition-all duration-300 hover:border-[#d83f3f]/30 hover:shadow-md sm:p-6">
          <div className="space-y-2">
            <h4 className="text-[16px] font-extrabold text-[#18120f]">
              Deactivate & Block Customer
            </h4>
            <p className="text-[13px] text-[#5a4d46] leading-relaxed font-medium">
              Prevents the customer from logging in or placing any future orders. Active orders will be cancelled.
            </p>
          </div>
          <button
            onClick={handleDeactivate}
            type="button"
            className="w-full flex h-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#d83f3f] bg-white text-[13px] font-bold text-[#d83f3f] outline-none transition duration-150 hover:bg-[#fdf2f2] active:scale-98 shadow-sm"
          >
            Block Account
          </button>
        </article>

        {/* Permanently Delete */}
        <article className="flex flex-col justify-between space-y-5 rounded-[16px] border border-[#fbcaca] bg-gradient-to-br from-white to-[#fffcfc] p-4 shadow-[0_4px_16px_rgba(216,63,63,0.02)] transition-all duration-300 hover:border-[#d83f3f]/30 hover:shadow-md sm:p-6">
          <div className="space-y-2">
            <h4 className="text-[16px] font-extrabold text-[#18120f]">
              Permanently Delete Account
            </h4>
            <p className="text-[13px] text-[#5a4d46] leading-relaxed font-medium">
              Removes all PII data from the live database. Historical transactional records are anonymized for legal reporting.
            </p>
          </div>
          <button
            onClick={handleDelete}
            type="button"
            className="w-full flex h-10 cursor-pointer items-center justify-center rounded-[10px] bg-[#d83f3f] text-[13px] font-bold text-white outline-none transition duration-150 hover:bg-[#b03030] shadow-sm shadow-red-100 active:scale-98"
          >
            Delete Account Data
          </button>
        </article>
      </div>
    </section>
  );
}
