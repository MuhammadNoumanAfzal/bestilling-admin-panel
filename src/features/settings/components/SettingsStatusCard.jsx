import { Circle } from "lucide-react";
import SettingsShellCard from "./SettingsShellCard.jsx";

export default function SettingsStatusCard() {
  return (
    <SettingsShellCard className="min-h-[138px] rounded-[12px] border-[#c7d3fa] bg-[#dce5ff] p-3.5 shadow-none">
      <p className="text-[12px] font-extrabold uppercase tracking-[0.24em] text-[#6071a0]">
        Platform Status
      </p>
      <div className="mt-2.5 flex items-start gap-2 text-[#d16737]">
        <Circle className="mt-[4px] shrink-0" size={8} fill="currentColor" strokeWidth={0} />
        <p className="max-w-[15ch] text-[11px] font-medium leading-4">Connected to Global Node</p>
      </div>
      <p className="mt-2.5 max-w-[24ch] text-[10px] leading-[1.45] text-[#6d7380]">
        Your admin account has full access to the GoCatering core engine. All security updates are current.
      </p>
    </SettingsShellCard>
  );
}
