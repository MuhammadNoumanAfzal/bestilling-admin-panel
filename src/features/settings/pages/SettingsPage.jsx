import { useState } from "react";
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
        "inline-flex h-11 cursor-pointer items-center justify-center rounded-[10px] bg-[#cc6735] px-5 text-[12px] font-bold text-white transition hover:translate-y-[-1px] hover:bg-[#bf5f30]",
        className,
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

function ProfileInformationCard() {
  const [profileForm, setProfileForm] = useState({
    fullName: "Jane Anderson",
    email: "jane.anderson@gocatering.admin",
    phone: "+47 234 56 789",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  function handleFieldChange(field) {
    return (event) => {
      setProfileForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };
  }

  function handleClosePasswordForm() {
    setIsPasswordFormOpen(false);
    setProfileForm((current) => ({
      ...current,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  }

  return (
    <SettingsShellCard className="rounded-[16px] px-5 py-5">
      <h2 className="text-[15px] font-bold text-[#2a1f18]">Profile Information</h2>

      <div className="mt-4 flex flex-col gap-5 md:flex-row">
        <SettingsAvatarUploader />

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <SettingsField
            label="Full Name"
            onChange={handleFieldChange("fullName")}
            value={profileForm.fullName}
          />
          <SettingsField
            autoComplete="email"
            label="Email Address"
            onChange={handleFieldChange("email")}
            value={profileForm.email}
          />
          <SettingsField
            autoComplete="tel"
            className="sm:max-w-[188px]"
            label="Phone Number"
            onChange={handleFieldChange("phone")}
            value={profileForm.phone}
          />

          <div className="flex items-end pb-1">
            <button
              className="inline-flex cursor-pointer items-center gap-2 text-[12px] font-semibold text-[#d16737] transition hover:text-[#b85a2d]"
              onClick={() => setIsPasswordFormOpen((current) => !current)}
              type="button"
            >
              <KeyRound size={12} />
              {isPasswordFormOpen ? "Hide Password Fields" : "Change Password"}
            </button>
          </div>
        </div>
      </div>

      {isPasswordFormOpen ? (
        <div className="mt-5 rounded-[14px] border border-[#efe4dc] bg-[#fcf8f5] p-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-[13px] font-bold text-[#2a1f18]">Update Password</h3>
            <p className="text-[12px] leading-5 text-[#81746b]">
              Enter your current password and choose a strong new password.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SettingsField
              autoComplete="current-password"
              className="sm:col-span-2"
              label="Current Password"
              onChange={handleFieldChange("currentPassword")}
              placeholder="Enter current password"
              type="password"
              value={profileForm.currentPassword}
            />
            <SettingsField
              autoComplete="new-password"
              label="New Password"
              onChange={handleFieldChange("newPassword")}
              placeholder="Enter new password"
              type="password"
              value={profileForm.newPassword}
            />
            <SettingsField
              autoComplete="new-password"
              label="Confirm New Password"
              onChange={handleFieldChange("confirmPassword")}
              placeholder="Confirm new password"
              type="password"
              value={profileForm.confirmPassword}
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#d9d1ca] bg-white px-4 text-[12px] font-bold text-[#3f3530] transition hover:bg-[#faf6f2]"
              onClick={handleClosePasswordForm}
              type="button"
            >
              Cancel
            </button>
            <SaveButton className="h-10 px-4">Update Password</SaveButton>
          </div>
        </div>
      ) : null}

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
          <select className="h-12 cursor-pointer rounded-[10px] border border-[#d9d1ca] bg-[#f6f4f2] px-3.5 text-[13px] text-[#2a1f19] outline-none transition focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]">
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
