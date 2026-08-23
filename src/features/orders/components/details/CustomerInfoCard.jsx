import { User } from "lucide-react";

function displayValue(value, fallback = "Not available") {
  if (value === null || value === undefined) {
    return fallback;
  }

  const normalized = `${value}`.trim();
  return normalized || fallback;
}

export default function CustomerInfoCard({ customer }) {
  return (
    <article className="h-full rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <header className="mb-4 flex items-center gap-2 border-b border-[#eee4dd] pb-3">
        <User size={18} className="text-[#cf6432]" />
        <h3 className="text-[18px] font-bold text-[#18120f]">Customer Information</h3>
      </header>

      <div className="mb-5 flex items-center gap-3">
        {customer.avatarUrl ? (
          <img
            src={customer.avatarUrl}
            alt={customer.fullName}
            className="h-12 w-12 rounded-full border border-[#eee4dd] object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6eee8] text-[13px] font-bold text-[#2f241d]">
            {customer.avatar}
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[16px] font-bold text-[#18120f]">{customer.fullName}</span>
            <span className="inline-flex rounded-full bg-[#fff0e7] px-2 py-0.5 text-[10px] font-bold text-[#cf6e38]">
              Customer
            </span>
          </div>
          <p className="truncate text-[12px] text-[#5a4d46]">{displayValue(customer.email)}</p>
          <p className="text-[12px] text-[#5a4d46]">{displayValue(customer.phone)}</p>
        </div>
      </div>

      <div className="space-y-3.5 border-t border-[#f1e9e2] pt-4">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Total Orders</span>
          <span className="font-bold text-[#18120f]">{displayValue(customer.totalOrders)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Total Spent</span>
          <span className="font-bold text-[#18120f]">{displayValue(customer.totalSpent)}</span>
        </div>
        <div className="space-y-1 text-[13px]">
          <span className="block font-semibold text-[#8c8077]">Default Address</span>
          <span className="block leading-6 text-[#18120f]">{displayValue(customer.address, "Not provided")}</span>
        </div>
      </div>
    </article>
  );
}
