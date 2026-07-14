import { useState } from "react";
import { ArrowLeft, Mail, Ban, CheckCircle, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CustomerDetailHeader({ customer: initialCustomer }) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(initialCustomer);
  const [copied, setCopied] = useState(false);
  const isActive = customer.status !== "Blocked";

  const handleCopyId = () => {
    navigator.clipboard.writeText(customer.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContact = () => {
    Swal.fire({
      title: "Contact Customer",
      html: `
        <div class="text-left space-y-3.5 text-[14px] p-3.5 bg-[#faf9f8] rounded-2xl border border-[#eee4dd] shadow-inner">
          <p class="flex items-center gap-2"><strong class="text-[#8d7e72]">Name:</strong> <span class="font-bold text-[#18120f]">${customer.name}</span></p>
          <p class="flex items-center gap-2"><strong class="text-[#8d7e72]">Email:</strong> <span class="font-bold text-[#18120f]">${customer.email || "eleanor.shellstrop@heaven.com"}</span></p>
          <p class="flex items-center gap-2"><strong class="text-[#8d7e72]">Phone:</strong> <span class="font-bold text-[#18120f]">${customer.phone || "+1 (555) 123-4567"}</span></p>
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
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-[16px] border border-[#ddd6cf] bg-gradient-to-br from-white via-white to-[#fffbf9] px-6 py-5 shadow-[0_8px_30px_rgba(53,34,20,0.04)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(53,34,20,0.06)] hover:border-[#cf6e38]/20">
      {/* Left: Back Link, Avatar, Name & Metadata */}
      <div className="flex items-center gap-4.5 min-w-0 w-full md:w-auto">
        <button
          onClick={() => navigate("/customers")}
          type="button"
          className="group shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#ddd4ca] bg-white text-[#6f655e] transition duration-200 hover:bg-[#fff0e7] hover:text-[#d96834] hover:border-[#f0d4ca] hover:scale-105 active:scale-95 cursor-pointer outline-none shadow-sm"
          title="Back to Customers"
        >
          <ArrowLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
        </button>

        {/* Avatar Container */}
        <div className="relative shrink-0">
          <img
            src={customer.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80"}
            alt={customer.name}
            className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-[0_6px_16px_rgba(53,34,20,0.08)] transition duration-300 hover:rotate-3 hover:scale-105"
          />
          <span className="absolute bottom-0 right-0 flex h-4.5 w-4.5">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${isActive ? "bg-[#2b9e62]" : "bg-[#d83f3f]"}`} />
            <span className={`relative inline-flex h-4.5 w-4.5 rounded-full border-2 border-white ${isActive ? "bg-[#2b9e62]" : "bg-[#d83f3f]"}`} />
          </span>
        </div>

        {/* Name and Meta */}
        <div className="min-w-0 space-y-1.5">
          <h2 className="text-[24px] font-extrabold tracking-tight text-[#18120f] leading-none">
            {customer.name}
          </h2>
          <div className="flex items-center gap-3 flex-wrap text-[13px] font-bold text-[#8d7e72]">
            <button
              onClick={handleCopyId}
              type="button"
              className="group inline-flex items-center gap-1.5 rounded-[6px] bg-[#f7f5f3] hover:bg-[#eeebe8] px-2 py-0.5.5 text-[12px] font-bold text-[#6f655e] cursor-pointer border-none transition duration-150 active:scale-95"
              title="Copy Customer ID"
            >
              <span>ID: {customer.id}</span>
              {copied ? (
                <Check size={11} className="text-[#2b9e62]" />
              ) : (
                <Copy size={11} className="text-[#a89f97] transition-colors group-hover:text-[#cf6e38]" />
              )}
            </button>
            <span className="h-3 w-px bg-[#e6dad1]" />
            <span className="flex items-center gap-1">
              Member since {customer.joinDate || "Jan 12, 2022"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
        <button
          onClick={handleContact}
          type="button"
          className="inline-flex h-10.5 cursor-pointer items-center justify-center gap-2 rounded-[11px] border border-[#e6dad1] bg-white px-5 text-[13px] font-bold text-[#cf6e38] transition duration-200 hover:bg-[#fff0e7] hover:border-[#f0d4ca] hover:scale-102 active:scale-98 outline-none shadow-sm"
        >
          <Mail size={14} className="text-[#cf6e38]" />
          Contact Customer
        </button>
        <button
          onClick={handleToggleBlock}
          type="button"
          className={`inline-flex h-10.5 cursor-pointer items-center justify-center gap-2 rounded-[11px] border px-5 text-[13px] font-bold transition duration-200 outline-none shadow-sm hover:scale-102 active:scale-98 ${
            isActive
              ? "border-[#fbcaca] bg-white text-[#d83f3f] hover:bg-[#fff5f5]"
              : "border-[#cce4d6] bg-white text-[#2b9e62] hover:bg-[#f3faf6]"
          }`}
        >
          {isActive ? (
            <>
              <Ban size={14} />
              Block Account
            </>
          ) : (
            <>
              <CheckCircle size={14} />
              Unblock Account
            </>
          )}
        </button>
      </div>
    </div>
  );
}
