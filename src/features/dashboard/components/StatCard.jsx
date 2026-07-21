import { ArrowUpRight } from "lucide-react";

export default function StatCard({ title, value, note, icon: Icon }) {
  return (
    <article className="rounded-[14px] border border-[#ece4de] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] flex flex-col gap-4 items-start transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834] shrink-0">
        {Icon ? <Icon size={17} strokeWidth={2.2} /> : <ArrowUpRight size={17} strokeWidth={2.2} />}
      </div>
      
      <div className="space-y-4">
        <p className="text-[13px] font-bold leading-5 text-[#4d423b]">{title}</p>
        <strong className="block text-[28px] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#221914]">
          {value}
        </strong>
        {note ? (
          <p className="text-[12px] leading-5 text-[#7c6f67]">{note}</p>
        ) : null}
      </div>
    </article>
  );
}
