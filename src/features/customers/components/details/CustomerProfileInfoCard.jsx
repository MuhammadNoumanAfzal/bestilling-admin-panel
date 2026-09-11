import { ct, useCustomerLanguage, customerDate } from "../../customerTranslation.js";
import { User } from "lucide-react";

export default function CustomerProfileInfoCard({ customer = {} }) {
  useCustomerLanguage();
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 px-1">
        <div className="flex items-center gap-2.5">
          <span className="h-5 w-[3px] bg-[#d96834] rounded-full" />
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834] shadow-sm">
            <User size={14} strokeWidth={2.5} />
          </span>
          <h3 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">{ct("Profile Information")}{" "}</h3>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="rounded-[16px] border border-[#ddd6cf] bg-white p-4 shadow-[0_8px_24px_rgba(53,34,20,0.04)] transition-all duration-300 hover:border-[#cf6e38]/10 hover:shadow-[0_12px_32px_rgba(53,34,20,0.06)] sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
          {/* Column 1 */}
          <div className="space-y-4 sm:space-y-5">
            <div className="rounded-[12px] border border-[#f0eae4]/60 bg-[#faf9f8] p-4 transition duration-200 hover:bg-[#f5f2ef]">
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9a8f86]">{ct("Full Name")}{" "}</span>
              <span className="block text-[15px] font-bold text-[#18120f] mt-1.5 leading-tight">
                {customer.name}
              </span>
            </div>
            <div className="rounded-[12px] bg-[#faf9f8] p-4 transition duration-200 hover:bg-[#f5f2ef] border border-[#f0eae4]/60">
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9a8f86]">{ct("City")}{" "}</span>
              <span className="block text-[15px] font-bold text-[#18120f] mt-1.5 leading-tight">
                {customer.city || ct("Not provided")}
              </span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4 sm:space-y-5">
            <div className="rounded-[12px] border border-[#f0eae4]/60 bg-[#faf9f8] p-4 transition duration-200 hover:bg-[#f5f2ef]">
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9a8f86]">{ct("Email Address")}{" "}</span>
              <span className="block text-[15px] font-bold text-[#18120f] mt-1.5 leading-tight break-all">
                {customer.email || ct("Not provided")}
              </span>
            </div>
            <div className="rounded-[12px] bg-[#faf9f8] p-4 transition duration-200 hover:bg-[#f5f2ef] border border-[#f0eae4]/60">
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9a8f86]">{ct("Preferred Contact")}{" "}</span>
              <span className="block text-[15px] font-bold text-[#18120f] mt-1.5 leading-tight">
                {ct(customer.profile?.preferredContactMethod || "Not specified")}
              </span>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4 sm:space-y-5">
            <div className="rounded-[12px] border border-[#f0eae4]/60 bg-[#faf9f8] p-4 transition duration-200 hover:bg-[#f5f2ef]">
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9a8f86]">{ct("Phone Number")}{" "}</span>
              <span className="block text-[15px] font-bold text-[#18120f] mt-1.5 leading-tight">
                {customer.phone || ct("Not provided")}
              </span>
            </div>
            <div className="rounded-[12px] bg-[#faf9f8] p-4 transition duration-200 hover:bg-[#f5f2ef] border border-[#f0eae4]/60">
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9a8f86]">{ct("Email Verification")}{" "}</span>
              <span className="block text-[15px] font-bold text-[#18120f] mt-1.5 leading-tight">
                {customer.profile?.isEmailVerified ? ct("Verified") : ct("Pending verification")}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-[12px] border border-[#f0eae4]/60 bg-[#faf9f8] p-4 transition duration-200 hover:bg-[#f5f2ef]">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9a8f86]">{ct("Last Login")}{" "}</span>
            <span className="block text-[15px] font-bold text-[#18120f] mt-1.5 leading-tight">
              {customerDate(customer.profile?.lastLoginAt, true)}
            </span>
          </div>
          <div className="rounded-[12px] border border-[#f0eae4]/60 bg-[#faf9f8] p-4 transition duration-200 hover:bg-[#f5f2ef]">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9a8f86]">{ct("Member Since")}{" "}</span>
            <span className="block text-[15px] font-bold text-[#18120f] mt-1.5 leading-tight">
              {customerDate(customer.joinDateValue || customer.joinDate)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
