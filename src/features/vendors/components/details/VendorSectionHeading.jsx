import { PanelLeft } from "lucide-react";

export default function VendorSectionHeading({ title, danger = false }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <span className={`h-5 w-[3px] rounded-full ${danger ? "bg-[#d83f3f]" : "bg-[#d96834]"}`} />
      <span
        className={[
          "inline-flex h-6 w-6 items-center justify-center rounded-[8px] shadow-sm",
          danger ? "bg-[#fdeded] text-[#d83f3f]" : "bg-[#fff2ea] text-[#d96834]",
        ].join(" ")}
      >
        <PanelLeft size={12} />
      </span>
      <h2 className={`text-[18px] font-extrabold tracking-tight ${danger ? "text-[#d83f3f]" : "text-[#18120f]"}`}>
        {title}
      </h2>
    </div>
  );
}
