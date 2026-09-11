import { st, settingsDate, useSettingsLanguage } from "../settingsTranslation.js";
import { Circle } from "lucide-react";
import SettingsShellCard from "./SettingsShellCard.jsx";

export default function SettingsStatusCard({ user }) {
  useSettingsLanguage();
  return (
    <SettingsShellCard className="min-h-[138px] rounded-[12px] border-[#b7cbff] bg-[#333] p-4 shadow-none">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#5c71af]">{st("Platform Status")}</p>
      <div className="mt-2.5 flex items-start gap-2 text-[#d16737]">
        <Circle className="mt-[6px] shrink-0" size={8} fill="currentColor" strokeWidth={0} />
        <p className=" text-[14px] font-medium leading-6">
          {user?.isActive ? st("Connected to Global Node") : st("Account review required")}
        </p>
      </div>
      <div className="mt-2.5 space-y-2 text-[12px] leading-6 text-[#5f687a]">
        <p>{st("Your admin account is ready for operational changes.")}</p>
        <p>{st("Last sign-in: {{date}}", { date: settingsDate(user?.security?.lastLoginAt) })}</p>
        <p>{st("Last password change: {{date}}", { date: settingsDate(user?.security?.lastPasswordChangeAt) })}</p>
      </div>
    </SettingsShellCard>
  );
}
