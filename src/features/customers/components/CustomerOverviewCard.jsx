import { UsersRound, UserCheck, UserPlus, ShoppingBag, Wallet, CreditCard } from "lucide-react";

const accentClasses = {
  soft: "bg-[#fff3ec] text-[#d46f3b]",
  warm: "bg-[#fff1ea] text-[#d66a36]",
  neutral: "bg-[#fff5ef] text-[#d97442]",
  strong: "bg-[#fff3ea] text-[#d06f3d]",
};

const summaryIcons = {
  total: UsersRound,
  active: UserCheck,
  new: UserPlus,
  orders: ShoppingBag,
  average: Wallet,
  spending: CreditCard,
};

export default function CustomerOverviewCard({ id, label, value, accent = "soft" }) {
  const Icon = summaryIcons[id] || UsersRound;

  return (
    <article className="rounded-[14px] border border-[#ece4de] bg-white p-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] flex flex-col gap-4 items-start transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]">
      <div className={`flex h-9 w-9 items-center justify-center rounded-[8px] shrink-0 ${accentClasses[accent] || accentClasses.soft}`}>
        <Icon size={17} strokeWidth={2.2} />
      </div>
      
      <div className="space-y-1.5 w-full">
        <p className="text-[13px] font-bold leading-5 text-[#8c8077]">{label}</p>
        <strong className="block text-[24px] font-extrabold leading-none tracking-[-0.03em] text-[#18120f]">
          {value}
        </strong>
      </div>
    </article>
  );
}
