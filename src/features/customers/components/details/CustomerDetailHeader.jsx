import { useState } from "react";
import { ArrowLeft, Mail, Ban, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CustomerDetailHeader({ customer: initialCustomer }) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(initialCustomer);
  const isActive = customer.status !== "Blocked";

  const handleContact = () => {
    Swal.fire({
      title: "Contact Customer",
      html: `
        <div class="text-left space-y-2 text-[14px]">
          <p><strong>Name:</strong> ${customer.name}</p>
          <p><strong>Email:</strong> ${customer.email || "eleanor.shellstrop@heaven.com"}</p>
          <p><strong>Phone:</strong> ${customer.phone || "+1 (555) 123-4567"}</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Close",
      confirmButtonColor: "#d96834",
    });
  };

  const handleToggleBlock = () => {
    const isCurrentlyBlocked = customer.status === "Blocked";
    const actionText = isCurrentlyBlocked ? "Unblock" : "Block";

    Swal.fire({
      title: `${actionText} Customer?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} ${customer.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: isCurrentlyBlocked ? "#2b9e62" : "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedStatus = isCurrentlyBlocked ? "Active" : "Blocked";
        setCustomer({ ...customer, status: updatedStatus });
        Swal.fire({
          title: `Customer ${isCurrentlyBlocked ? "Unblocked" : "Blocked"}`,
          text: `${customer.name} is now ${isCurrentlyBlocked ? "Active" : "Blocked"}.`,
          icon: "success",
          confirmButtonColor: "#d96834",
        });
      }
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[14px] border border-[#e8dfd7] bg-white px-5 py-4 shadow-[0_4px_16px_rgba(55,31,13,0.03)]">
      {/* Left: Back Link, Avatar, Name & Metadata */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={() => navigate("/customers")}
          type="button"
          className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#ddd4ca] bg-white text-[#6f655e] transition duration-150 hover:bg-[#fff0e7] hover:text-[#d96834] hover:border-[#f0d4ca] cursor-pointer outline-none shadow-sm"
          title="Back to Customers"
        >
          <ArrowLeft size={16} />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={customer.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80"}
            alt={customer.name}
            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-[0_2px_8px_rgba(55,31,13,0.08)]"
          />
          <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
            isActive ? "bg-[#2b9e62] animate-pulse" : "bg-[#d83f3f]"
          }`} />
        </div>

        {/* Name and Meta */}
        <div className="min-w-0 space-y-0.5">
          <h2 className="text-[20px] font-extrabold tracking-tight text-[#18120f] leading-tight">
            {customer.name}
          </h2>
          <div className="flex items-center gap-2 flex-wrap text-[12px] font-semibold text-[#8d7e72]">
            <span>ID: {customer.id}</span>
            <span className="h-3 w-px bg-[#ddd4ca]" />
            <span>Member since {customer.joinDate || "Jan 12, 2022"}</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
        <button
          onClick={handleContact}
          type="button"
          className="inline-flex h-9.5 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-[#e6dad1] bg-white px-4 text-[12px] font-bold text-[#cf6e38] transition duration-150 hover:bg-[#fff0e7] hover:border-[#f0d4ca] outline-none shadow-sm"
        >
          <Mail size={13} />
          Contact Customer
        </button>
        <button
          onClick={handleToggleBlock}
          type="button"
          className={`inline-flex h-9.5 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border px-4 text-[12px] font-bold transition duration-150 outline-none shadow-sm ${
            isActive
              ? "border-[#fbcaca] bg-white text-[#d83f3f] hover:bg-[#fff5f5]"
              : "border-[#cce4d6] bg-white text-[#2b9e62] hover:bg-[#f3faf6]"
          }`}
        >
          {isActive ? (
            <>
              <Ban size={13} />
              Block
            </>
          ) : (
            <>
              <CheckCircle size={13} />
              Unblock
            </>
          )}
        </button>
      </div>
    </div>
  );
}
