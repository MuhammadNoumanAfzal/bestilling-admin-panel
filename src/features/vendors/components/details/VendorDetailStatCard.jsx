import { BookOpen, Clock3, DollarSign, MenuSquare, Star, Truck } from "lucide-react";

const icons = {
  orders: BookOpen,
  revenue: DollarSign,
  rating: Star,
  menus: MenuSquare,
  activeMenus: Truck,
  response: Clock3,
};

export default function VendorDetailStatCard({ id, label, value }) {
  const Icon = icons[id] || BookOpen;

  return (
    <article className="rounded-[14px] border border-[#e8ddd5] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(55,31,13,0.05)]">
      <div className="space-y-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff3ec] text-[#d66b38]">
          <Icon size={14} />
        </span>
        <div>
          <p className="text-[11px] font-semibold text-[#8c7f76]">{label}</p>
          <p className="mt-1 text-[22px] font-extrabold leading-none tracking-[-0.04em] text-[#1d1510]">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}
