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
    <SettingsShellCard className="rounded-[16px] px-5 py-5">
      <h2 className="text-[15px] font-bold text-[#2a1f18]">Profile Information</h2>

      <div className="mt-4 flex flex-col gap-5 md:flex-row">
        <SettingsAvatarUploader />

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <SettingsField label="Full Name" value="Jane Anderson" />
          <SettingsField label="Email Address" value="jane.anderson@gocatering.admin" />
          <SettingsField className="sm:max-w-[188px]" label="Phone Number" value="+47 234 56 789" />

          <div className="flex items-end pb-1">
            <button
              className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#d16737] transition hover:text-[#b85a2d]"
              type="button"
            >
              <KeyRound size={12} />
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end border-t border-[#eee5de] pt-4">
        <SaveButton className="h-10 min-w-[120px]">Save Changes</SaveButton>
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
          <span className="text-[12px] font-bold text-[#2f241d]">Default Currency</span>
          <select className="h-12 rounded-[10px] border border-[#d9d1ca] bg-[#f6f4f2] px-3.5 text-[13px] text-[#2a1f19] outline-none transition focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]">
            <option>NOK - Norwegian Krone</option>
            <option>EUR - Euro</option>
            <option>USD - US Dollar</option>
          </select>
        </label>

        <p className="mt-2 text-[11px] leading-5 text-[#9c9087]">
          This currency will be used across the platform for orders, invoices, commissions, reports, and
          payments.
        </p>

        <SaveButton className="mt-6 h-10 px-6">Update Currency</SaveButton>
      </div>
    </SettingsShellCard>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[40px] font-bold tracking-[-0.03em] text-[#18120f]">Settings</h1>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <ProfileInformationCard />
        <SettingsStatusCard />
      </div>

      <div className="max-w-[760px]">
        <CurrencySettingsCard />
      </div>
    </div>
  );
}
