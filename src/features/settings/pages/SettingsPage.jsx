import { BadgeCent, KeyRound } from "lucide-react";
import SettingsAvatarUploader from "../components/SettingsAvatarUploader.jsx";
import SettingsField from "../components/SettingsField.jsx";
import SettingsSectionHeader from "../components/SettingsSectionHeader.jsx";
import SettingsShellCard from "../components/SettingsShellCard.jsx";
import SettingsStatusCard from "../components/SettingsStatusCard.jsx";

function SaveButton({ children, className = "" }) {
  return (
    <button
      className={[
        "inline-flex h-11 items-center justify-center rounded-[10px] bg-[#cc6735] px-5 text-[12px] font-bold text-white transition hover:translate-y-[-1px] hover:bg-[#bf5f30]",
        className,
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

function ProfileInformationCard() {
  return (
    <SettingsShellCard>
      <h2 className="text-[14px] font-bold text-[#2a1f18]">Profile Information</h2>

      <div className="mt-4 flex flex-col gap-5 lg:flex-row">
        <SettingsAvatarUploader />

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <SettingsField label="Full Name" value="Jane Anderson" />
          <SettingsField label="Email Address" value="jane.anderson@gocatering.admin" />
          <SettingsField className="sm:max-w-[180px]" label="Phone Number" value="+47 234 56 789" />

          <div className="flex items-end pb-1">
            <button
              className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#d16737] transition hover:text-[#b85a2d]"
              type="button"
            >
              <KeyRound size={12} />
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end border-t border-[#eee5de] pt-4">
        <SaveButton>Save Changes</SaveButton>
      </div>
    </SettingsShellCard>
  );
}

function CurrencySettingsCard() {
  return (
    <SettingsShellCard>
      <SettingsSectionHeader icon={BadgeCent} title="Currency Settings" />

      <div className="max-w-[420px]">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-[#2f241d]">Default Currency</span>
          <select className="h-11 rounded-[10px] border border-[#d9d1ca] bg-[#f6f4f2] px-3 text-[12px] text-[#2a1f19] outline-none transition focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]">
            <option>NOK - Norwegian Krone</option>
            <option>EUR - Euro</option>
            <option>USD - US Dollar</option>
          </select>
        </label>

        <p className="mt-2 text-[11px] leading-5 text-[#9c9087]">
          This currency will be used across the platform for orders, invoices, commissions, reports, and
          payments.
        </p>

        <SaveButton className="mt-6 px-6">Update Currency</SaveButton>
      </div>
    </SettingsShellCard>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[42px] font-extrabold tracking-[-0.04em] text-[#18120f]">Settings</h1>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_180px]">
        <ProfileInformationCard />
        <SettingsStatusCard />
      </div>

      <div className="max-w-[760px]">
        <CurrencySettingsCard />
      </div>
    </div>
  );
}
