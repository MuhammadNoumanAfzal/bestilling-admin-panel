import { User } from "lucide-react";

const FALLBACKS = {
  email: "eleanor.shellstrop@heaven.com",
  phone: "+1 (555) 123-4567",
  streetAddress: "123 Arizona Avenue, Suite 4B",
  cityState: "Phoenix, Arizona",
  country: "Norway",
};

export default function CustomerProfileInfoCard({ customer = {} }) {
  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1">
        <span className="h-4.5 w-[3px] bg-[#d96834] rounded-full" />
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-[6px] bg-[#fff0e7] text-[#d96834]">
          <User size={13} strokeWidth={2.5} />
        </span>
        <h3 className="text-[18px] font-bold text-[#18120f]">
          Profile Information
        </h3>
      </div>

      {/* Profile Details Card */}
      <div className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-8">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Full Name
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f] leading-5 mt-0.5">
                {customer.name}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Street Address
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f] leading-5 mt-0.5">
                {customer.streetAddress || FALLBACKS.streetAddress}
              </span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Email Address
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f] leading-5 mt-0.5 break-all">
                {customer.email || FALLBACKS.email}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                City & State
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f] leading-5 mt-0.5">
                {customer.cityState || (customer.city ? `${customer.city}, Norway` : FALLBACKS.cityState)}
              </span>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Phone Number
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f] leading-5 mt-0.5">
                {customer.phone || FALLBACKS.phone}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Country
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f] leading-5 mt-0.5">
                {customer.country || FALLBACKS.country}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
