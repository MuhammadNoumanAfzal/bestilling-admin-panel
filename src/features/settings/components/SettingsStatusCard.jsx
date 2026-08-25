import { Circle } from "lucide-react";
import SettingsShellCard from "./SettingsShellCard.jsx";

function formatTimestamp(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function SettingsStatusCard({ user }) {
  return (
    <SettingsShellCard className="min-h-[138px] rounded-[12px] border-[#b7cbff] bg-[#333] p-4 shadow-none">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#5c71af]">
        Platform Status
      </p>
      <div className="mt-2.5 flex items-start gap-2 text-[#d16737]">
        <Circle className="mt-[6px] shrink-0" size={8} fill="currentColor" strokeWidth={0} />
        <p className=" text-[14px] font-medium leading-6">
          {user?.isActive ? "Connected to Global Node" : "Account review required"}
        </p>
      </div>
      <div className="mt-2.5 space-y-2 text-[12px] leading-6 text-[#5f687a]">
        <p>Your admin account is ready for operational changes.</p>
        <p>Last sign-in: {formatTimestamp(user?.security?.lastLoginAt)}</p>
        <p>Last password change: {formatTimestamp(user?.security?.lastPasswordChangeAt)}</p>
      </div>
    </SettingsShellCard>
  );
}
