import { useEffect, useMemo, useState } from "react";
import { BadgeCent, KeyRound, RefreshCcw } from "lucide-react";
import Swal from "sweetalert2";
import { getAdminDisplayName, validateAdminPassword } from "../../auth/authConfig.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import {
  changeAdminPasswordRequest,
  getAdminSettingsRequest,
  updateAdminAvatarRequest,
  updateAdminProfileRequest,
  updatePlatformPreferencesRequest,
} from "../api/settingsApi.js";
import { uploadAdminAvatar } from "../api/settingsUploadApi.js";
import SettingsAvatarUploader from "../components/SettingsAvatarUploader.jsx";
import SettingsField from "../components/SettingsField.jsx";
import SettingsSectionHeader from "../components/SettingsSectionHeader.jsx";
import SettingsShellCard from "../components/SettingsShellCard.jsx";
import SettingsStatusCard from "../components/SettingsStatusCard.jsx";

const CURRENCY_OPTIONS = [
  { value: "NOK", label: "NOK - Norwegian Krone" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "USD", label: "USD - US Dollar" },
];

function SaveButton({ children, className = "", disabled = false, type = "button", onClick }) {
  return (
    <button
      className={[
        "inline-flex h-11 cursor-pointer items-center justify-center rounded-[10px] bg-[#cc6735] px-5 text-[12px] font-bold text-white transition hover:translate-y-[-1px] hover:bg-[#bf5f30] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

function parseName(profile) {
  const firstName = String(profile?.firstName || "").trim();
  const lastName = String(profile?.lastName || "").trim();

  return {
    firstName,
    lastName,
  };
}

function getInitials(user) {
  const displayName = getAdminDisplayName(user);
  return displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function ProfileInformationCard({
  user,
  profileForm,
  passwordForm,
  isPasswordFormOpen,
  isSavingProfile,
  isSavingPassword,
  isUpdatingAvatar,
  onProfileFieldChange,
  onPasswordFieldChange,
  onTogglePasswordForm,
  onClosePasswordForm,
  onSaveProfile,
  onSavePassword,
  onUpdateAvatar,
}) {
  return (
    <SettingsShellCard className="rounded-[16px] px-5 py-5">
      <h2 className="text-[15px] font-bold text-[#2a1f18]">Profile Information</h2>

      <div className="mt-4 flex flex-col gap-5 md:flex-row">
        <SettingsAvatarUploader
          avatarUrl={user?.avatar?.url || ""}
          initials={getInitials(user)}
          isUpdating={isUpdatingAvatar}
          onClick={onUpdateAvatar}
        />

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <SettingsField
            label="First Name"
            onChange={onProfileFieldChange("firstName")}
            value={profileForm.firstName}
          />
          <SettingsField
            label="Last Name"
            onChange={onProfileFieldChange("lastName")}
            value={profileForm.lastName}
          />
          <SettingsField
            autoComplete="email"
            label="Email Address"
            onChange={onProfileFieldChange("email")}
            value={profileForm.email}
          />
          <SettingsField
            autoComplete="tel"
            label="Phone Number"
            onChange={onProfileFieldChange("phone")}
            value={profileForm.phone}
          />

          <SettingsField
            label="Role"
            readOnly
            value={String(user?.role || "").trim() || "Administrator"}
          />
          <div className="flex items-end pb-1">
            <button
              className="inline-flex cursor-pointer items-center gap-2 text-[12px] font-semibold text-[#d16737] transition hover:text-[#b85a2d]"
              onClick={onTogglePasswordForm}
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
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SettingsField
              autoComplete="current-password"
              className="sm:col-span-2"
              label="Current Password"
              onChange={onPasswordFieldChange("currentPassword")}
              placeholder="Enter current password"
              type="password"
              value={passwordForm.currentPassword}
            />
            <SettingsField
              autoComplete="new-password"
              label="New Password"
              onChange={onPasswordFieldChange("newPassword")}
              placeholder="Enter new password"
              type="password"
              value={passwordForm.newPassword}
            />
            <SettingsField
              autoComplete="new-password"
              label="Confirm New Password"
              onChange={onPasswordFieldChange("confirmPassword")}
              placeholder="Confirm new password"
              type="password"
              value={passwordForm.confirmPassword}
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#d9d1ca] bg-white px-4 text-[12px] font-bold text-[#3f3530] transition hover:bg-[#faf6f2]"
              onClick={onClosePasswordForm}
              type="button"
            >
              Cancel
            </button>
            <SaveButton className="h-10 px-4" disabled={isSavingPassword} onClick={onSavePassword}>
              {isSavingPassword ? "Updating..." : "Update Password"}
            </SaveButton>
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-end border-t border-[#eee5de] pt-4">
        <SaveButton className="h-10 min-w-[120px]" disabled={isSavingProfile} onClick={onSaveProfile}>
          {isSavingProfile ? "Saving..." : "Save Changes"}
        </SaveButton>
      </div>
    </SettingsShellCard>
  );
}

function PreferencesCard({
  preferences,
  onCurrencyChange,
  onSave,
  isSaving,
}) {
  return (
    <SettingsShellCard>
      <SettingsSectionHeader icon={BadgeCent} title="Platform Preferences" />

      <div className="max-w-[420px]">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-bold text-[#2f241d]">Default Currency</span>
          <select
            className="h-12 cursor-pointer rounded-[10px] border border-[#d9d1ca] bg-[#f6f4f2] px-3.5 text-[13px] text-[#2a1f19] outline-none transition focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            onChange={onCurrencyChange}
            value={preferences.defaultCurrency}
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <SettingsField label="Timezone" readOnly value={preferences.timezone || "Not configured"} />
          <SettingsField label="Locale" readOnly value={preferences.locale || "Not configured"} />
        </div>

        <p className="mt-2 text-[11px] leading-5 text-[#9c9087]">
          This currency will be used across the platform for orders, invoices, commissions, reports, and payments.
        </p>

        <SaveButton className="mt-6 h-10 px-6" disabled={isSaving} onClick={onSave}>
          {isSaving ? "Updating..." : "Update Preferences"}
        </SaveButton>
      </div>
    </SettingsShellCard>
  );
}

function LoadingCard() {
  return (
    <SettingsShellCard className="rounded-[16px] px-5 py-6">
      <div className="space-y-3">
        <div className="h-4 w-40 animate-pulse rounded bg-[#efe4dc]" />
        <div className="h-12 animate-pulse rounded-[10px] bg-[#f6f1ec]" />
        <div className="h-12 animate-pulse rounded-[10px] bg-[#f6f1ec]" />
        <div className="h-12 animate-pulse rounded-[10px] bg-[#f6f1ec]" />
      </div>
    </SettingsShellCard>
  );
}

export default function SettingsPage() {
  const { updateSessionUser } = useAuth();
  const [settingsUser, setSettingsUser] = useState(null);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [preferencesForm, setPreferencesForm] = useState({
    defaultCurrency: "NOK",
    timezone: "",
    locale: "",
  });
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [avatarInputKey, setAvatarInputKey] = useState(0);

  function syncForms(user) {
    const name = parseName(user);
    setProfileForm({
      firstName: name.firstName,
      lastName: name.lastName,
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setPreferencesForm({
      defaultCurrency: user?.preferences?.defaultCurrency || "NOK",
      timezone: user?.preferences?.timezone || "",
      locale: user?.preferences?.locale || "",
    });
  }

  async function loadSettings({ silent = false } = {}) {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const user = await getAdminSettingsRequest();
      setSettingsUser(user);
      syncForms(user);
      updateSessionUser({
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to load settings",
        text: error?.message || "Please refresh and try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function handleProfileFieldChange(field) {
    return (event) => {
      setProfileForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };
  }

  function handlePasswordFieldChange(field) {
    return (event) => {
      setPasswordForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };
  }

  function handleClosePasswordForm() {
    setIsPasswordFormOpen(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  async function handleSaveProfile() {
    if (
      !profileForm.firstName.trim() ||
      !profileForm.lastName.trim() ||
      !profileForm.email.trim() ||
      !profileForm.phone.trim()
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Missing details",
        text: "Please complete first name, last name, email, and phone.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setIsSavingProfile(true);
      const result = await updateAdminProfileRequest(profileForm);
      setSettingsUser((current) => ({
        ...current,
        ...result.user,
        avatar: result.user.avatar || current?.avatar || null,
      }));
      updateSessionUser({
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        fullName: result.user.fullName,
        email: result.user.email,
        avatar: result.user.avatar,
      });

      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: result.requiresEmailVerification
          ? `${result.message} Please verify the new email address.`
          : result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to save profile",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleSavePassword() {
    if (
      !passwordForm.currentPassword.trim() ||
      !passwordForm.newPassword.trim() ||
      !passwordForm.confirmPassword.trim()
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Missing password",
        text: "Please complete all password fields.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        text: "Please confirm the same new password.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    const passwordValidationError = validateAdminPassword(passwordForm.newPassword);

    if (passwordValidationError) {
      await Swal.fire({
        icon: "warning",
        title: "Weak password",
        text: passwordValidationError,
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setIsSavingPassword(true);
      const result = await changeAdminPasswordRequest(passwordForm);
      handleClosePasswordForm();
      setSettingsUser((current) => ({
        ...current,
        security: {
          ...current?.security,
          lastPasswordChangeAt: new Date().toISOString(),
        },
      }));

      await Swal.fire({
        icon: "success",
        title: "Password updated",
        text: result.logoutOtherSessions
          ? `${result.message} Other active sessions were signed out.`
          : result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to change password",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function handleSavePreferences() {
    try {
      setIsSavingPreferences(true);
      const result = await updatePlatformPreferencesRequest({
        defaultCurrency: preferencesForm.defaultCurrency,
      });
      setSettingsUser((current) => ({
        ...current,
        preferences: result.preferences,
      }));
      setPreferencesForm(result.preferences);
      await Swal.fire({
        icon: "success",
        title: "Preferences updated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update preferences",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSavingPreferences(false);
    }
  }

  async function handleAvatarFileChange(event) {
    const file = event.target.files?.[0];
    setAvatarInputKey((current) => current + 1);

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid file",
        text: "Please choose an image file for the avatar.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setIsUpdatingAvatar(true);
      const upload = await uploadAdminAvatar(file);
      const response = await updateAdminAvatarRequest(upload);
      setSettingsUser((current) => ({
        ...current,
        avatar: response.avatar,
      }));
      updateSessionUser({
        avatar: response.avatar,
      });
      await Swal.fire({
        icon: "success",
        title: "Avatar updated",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update avatar",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsUpdatingAvatar(false);
    }
  }

  const headerSummary = useMemo(() => {
    if (!settingsUser) {
      return "";
    }

    const parts = [
      settingsUser.preferences?.timezone || "No timezone",
      settingsUser.preferences?.locale || "No locale",
      settingsUser.isVerified ? "Verified" : "Verification pending",
    ];

    return parts.join(" • ");
  }, [settingsUser]);

  return (
    <div className="space-y-6">
      <input
        key={avatarInputKey}
        accept="image/*"
        className="hidden"
        id="admin-avatar-upload"
        onChange={handleAvatarFileChange}
        type="file"
      />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[40px] font-bold tracking-[-0.03em] text-[#18120f]">Settings</h1>
          {headerSummary ? (
            <p className="mt-2 text-[13px] text-[#7a6f68]">{headerSummary}</p>
          ) : null}
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-[10px] border border-[#dfd5cd] bg-white px-4 py-2 text-[12px] font-bold text-[#3c312a] transition hover:bg-[#faf6f2]"
          disabled={isRefreshing}
          onClick={() => loadSettings({ silent: true })}
          type="button"
        >
          <RefreshCcw size={14} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        {isLoading ? (
          <LoadingCard />
        ) : (
          <ProfileInformationCard
            isPasswordFormOpen={isPasswordFormOpen}
            isSavingPassword={isSavingPassword}
            isSavingProfile={isSavingProfile}
            isUpdatingAvatar={isUpdatingAvatar}
            onClosePasswordForm={handleClosePasswordForm}
            onPasswordFieldChange={handlePasswordFieldChange}
            onProfileFieldChange={handleProfileFieldChange}
            onSavePassword={handleSavePassword}
            onSaveProfile={handleSaveProfile}
            onTogglePasswordForm={() => setIsPasswordFormOpen((current) => !current)}
            onUpdateAvatar={() => document.getElementById("admin-avatar-upload")?.click()}
            passwordForm={passwordForm}
            profileForm={profileForm}
            user={settingsUser}
          />
        )}
        <SettingsStatusCard user={settingsUser} />
      </div>

      <div className="max-w-[760px]">
        {isLoading ? (
          <LoadingCard />
        ) : (
          <PreferencesCard
            isSaving={isSavingPreferences}
            onCurrencyChange={(event) =>
              setPreferencesForm((current) => ({
                ...current,
                defaultCurrency: event.target.value,
              }))
            }
            onSave={handleSavePreferences}
            preferences={preferencesForm}
          />
        )}
      </div>
    </div>
  );
}
