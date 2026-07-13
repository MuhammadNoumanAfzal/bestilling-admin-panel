import { Circle } from "lucide-react";
import SettingsShellCard from "./SettingsShellCard.jsx";

export default function SettingsStatusCard() {
  return (
    <SettingsShellCard className="bg-[#dfe7ff] p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#5f6f9f]">
        Platform Status
      </p>
      <div className="mt-3 flex items-center gap-2 text-[#d16737]">
        <Circle size={10} fill="currentColor" strokeWidth={0} />
        <p className="text-[12px] font-semibold">Connected to Global Node</p>
      </div>
      <p className="mt-3 max-w-[26ch] text-[11px] leading-5 text-[#5b6272]">
        Your admin account has full access to the GoCatering core engine. All security updates are current.
      </p>
    </SettingsShellCard>
  );
}
