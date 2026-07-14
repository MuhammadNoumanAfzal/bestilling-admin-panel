import { User } from "lucide-react";

export default function CustomerInfoCard({ order }) {
  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] h-full">
      <header className="mb-4 flex items-center gap-2 border-b border-[#eee4dd] pb-3">
        <User size={18} className="text-[#cf6432]" />
        <h3 className="text-[18px] font-bold text-[#18120f]">Customer Information</h3>
      </header>

      {/* Customer Info row */}
      <div className="flex items-center gap-3 mb-5">
        {order.customerAvatarUrl ? (
          <img
            src={order.customerAvatarUrl}
            alt={order.customer}
            className="h-12 w-12 rounded-full object-cover border border-[#eee4dd]"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6eee8] text-[13px] font-bold text-[#2f241d]">
            {order.customerAvatar}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[16px] font-bold text-[#18120f]">{order.customer}</span>
            <span className="inline-flex rounded-full bg-[#fff0e7] px-2 py-0.5 text-[10px] font-bold text-[#cf6e38]">
              Active
            </span>
          </div>
          <p className="truncate text-[12px] text-[#5a4d46]">{order.customerEmail}</p>
          <p className="text-[12px] text-[#5a4d46]">+47 912 34 567</p>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="space-y-3.5 border-t border-[#f1e9e2] pt-4">
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Customer Since</span>
          <span className="font-bold text-[#18120f]">12 Mar 2026</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Total Orders</span>
          <span className="font-bold text-[#18120f]">6 Orders</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Total Spent</span>
          <span className="font-bold text-[#18120f]">NOK 65,450</span>
        </div>
      </div>
    </article>
  );
}
