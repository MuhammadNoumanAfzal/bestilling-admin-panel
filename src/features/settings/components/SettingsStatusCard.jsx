import { Circle } from "lucide-react";
import SettingsShellCard from "./SettingsShellCard.jsx";

export default function SettingsStatusCard() {
  return (
    <SettingsShellCard className="min-h-[138px] rounded-[12px] border-[#b7cbff] bg-[#333] p-4 shadow-none">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#5c71af]">
        Platform Status
      </p>
      <div className="mt-2.5 flex items-start gap-2 text-[#d16737]">
        <Circle className="mt-[6px] shrink-0" size={8} fill="currentColor" strokeWidth={0} />
        <p className=" text-[14px] font-medium leading-6">Connected to Global Node</p>
      </div>
      <p className="mt-2.5 text-[12px] leading-6 text-[#5f687a]">
        Your admin account has full access to the GoCatering core engine. All security updates are current.
      </p>
    </SettingsShellCard>
  );
}
