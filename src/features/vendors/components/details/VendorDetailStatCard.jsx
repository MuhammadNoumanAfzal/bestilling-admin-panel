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
    <article className="rounded-[12px] border border-[#e8ddd5] bg-white px-3.5 py-3 shadow-[0_6px_14px_rgba(55,31,13,0.05)]">
      <div className="space-y-2.5">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fff3ec] text-[#d66b38]">
          <Icon size={12} />
        </span>
        <div>
          <p className="text-[10px] font-semibold text-[#8c7f76]">{label}</p>
          <p className="mt-1 text-[18px] font-extrabold leading-none tracking-[-0.04em] text-[#1d1510]">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}
