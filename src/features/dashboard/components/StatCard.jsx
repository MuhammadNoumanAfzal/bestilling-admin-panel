import { ArrowUpRight } from "lucide-react";

export default function StatCard({ title, value, note, accent = "orange", icon: Icon }) {
  const toneClasses = {
    orange: "bg-[#fff4ee] text-[#cf6432]",
    slate: "bg-[#f4f1ee] text-[#4d4138]",
    green: "bg-[#edf8f1] text-[#2b9e62]",
    amber: "bg-[#fff7e7] text-[#c8881b]",
  };

  return (
    <article className="rounded-[12px] border border-[#ddd6cf] bg-white p-4 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#9a7f68]">{title}</p>
          <strong className="block text-[clamp(1.8rem,3vw,2.5rem)] leading-none text-[#1e1712]">
            {value}
          </strong>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-[10px] ${toneClasses[accent] || toneClasses.orange}`}
        >
          {Icon ? <Icon size={20} /> : <ArrowUpRight size={18} />}
        </div>
      </div>
      {note ? <p className="mt-3 text-[13px] leading-6 text-[#6f655e]">{note}</p> : null}
    </article>
  );
}
