import { Store, Star } from "lucide-react";

export default function VendorInfoCard({ order }) {
  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] h-full">
      <header className="mb-4 flex items-center gap-2 border-b border-[#eee4dd] pb-3">
        <Store size={18} className="text-[#cf6432]" />
        <h3 className="text-[18px] font-bold text-[#18120f]">Vendor Information</h3>
      </header>

      {/* Vendor Profile Info */}
      <div className="flex items-center gap-3 mb-5">
        {order.vendorAvatarUrl ? (
          <img
            src={order.vendorAvatarUrl}
            alt={order.vendor}
            className="h-12 w-12 rounded-full object-cover border border-[#eee4dd]"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6eee8] text-[13px] font-bold text-[#2f241d]">
            {order.vendorAvatar}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[16px] font-bold text-[#18120f]">{order.vendor}</span>
            <span className="inline-flex rounded-full bg-[#edf8f1] px-2 py-0.5 text-[10px] font-bold text-[#2b9e62]">
              Approved
            </span>
          </div>
          <p className="truncate text-[12px] text-[#5a4d46]">{order.vendorCity || "Oslo"}, Norway</p>
        </div>
      </div>

      {/* Metrics breakdown table */}
      <div className="space-y-3 border-t border-[#f1e9e2] pt-4 mb-4">
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Vendor Since</span>
          <span className="font-bold text-[#18120f]">10 Jan 2025</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Total Orders</span>
          <span className="font-bold text-[#18120f]">320 Orders</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Rating</span>
          <span className="font-bold text-[#18120f] flex items-center gap-1">
            4.9
            <Star size={13} fill="#ffc107" stroke="none" />
          </span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Performance</span>
          <span className="font-bold text-[#2b9e62]">Excellent</span>
        </div>
      </div>

      {/* View Profile Action */}
      <button
        onClick={() => alert(`Redirecting to ${order.vendor} profile page`)}
        className="w-full rounded-[8px] border border-[#e6dad1] bg-white py-2 text-[12px] font-bold text-[#cf6432] transition hover:bg-[#faf5f1] hover:border-[#cf6432] cursor-pointer outline-none"
        type="button"
      >
        View Profile
      </button>
    </article>
  );
}
