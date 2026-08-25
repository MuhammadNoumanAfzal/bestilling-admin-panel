import { useEffect, useMemo, useState } from "react";
import { BadgeCent, Banknote, Clock3, Globe2, KeyRound, Languages, RefreshCcw, Trash2 } from "lucide-react";
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
import {
  deleteCurrencyRequest,
  deleteLanguageRequest,
  deleteTimeZoneRequest,
  getVendorSettingsTaxonomyRequest,
  saveCurrencyRequest,
  saveLanguageRequest,
  saveTimeZoneRequest,
} from "../../vendor-settings/api/vendorSettingsApi.js";
import { mapVendorSettingsTaxonomy } from "../../vendor-settings/api/vendorSettingsMappers.js";

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

const MASTER_DATA_CONFIG = [
  {
    key: "currencies",
    title: "Currencies",
    singularLabel: "currency",
    icon: Banknote,
    save: saveCurrencyRequest,
    remove: deleteCurrencyRequest,
    deleteKey: "code",
    fields: [
      { key: "code", label: "Code", placeholder: "NOK", required: true },
      { key: "label", label: "Label", placeholder: "Norwegian Krone", required: true },
      { key: "symbol", label: "Symbol", placeholder: "kr", required: false },
      { key: "sortOrder", label: "Sort Order", placeholder: "0", required: false, type: "number" },
      { key: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  {
    key: "languages",
    title: "Locales",
    singularLabel: "locale",
    icon: Languages,
    save: saveLanguageRequest,
    remove: deleteLanguageRequest,
    deleteKey: "code",
    fields: [
      { key: "code", label: "Code", placeholder: "no", required: true },
      { key: "label", label: "Label", placeholder: "Norwegian", required: true },
      { key: "sortOrder", label: "Sort Order", placeholder: "0", required: false, type: "number" },
      { key: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  {
    key: "timeZones",
    title: "Time Zones",
    singularLabel: "time zone",
    icon: Clock3,
    save: saveTimeZoneRequest,
    remove: deleteTimeZoneRequest,
    deleteKey: "value",
    fields: [
      { key: "value", label: "Value", placeholder: "Europe/Oslo", required: true },
      { key: "label", label: "Label", placeholder: "(GMT+01:00) Europe/Oslo", required: true },
      { key: "utcOffset", label: "UTC Offset", placeholder: "+01:00", required: false },
      { key: "sortOrder", label: "Sort Order", placeholder: "0", required: false, type: "number" },
      { key: "isActive", label: "Active", type: "checkbox" },
    ],
  },
];

const MASTER_DATA_MAP = MASTER_DATA_CONFIG.reduce((accumulator, section) => {
  accumulator[section.key] = section;
  return accumulator;
}, {});

function normalizeText(value) {
  return String(value || "").trim();
}

function createEmptyMasterDataDraft(section) {
  return section.fields.reduce((accumulator, field) => {
    accumulator[field.key] = field.type === "checkbox" ? true : "";
    return accumulator;
  }, {});
}

function createMasterDataDraftState() {
  return MASTER_DATA_CONFIG.reduce((accumulator, section) => {
    accumulator[section.key] = createEmptyMasterDataDraft(section);
    return accumulator;
  }, {});
}

function getMasterDataValues(section, item) {
  const raw = item?.raw || {};

  return section.fields.reduce((accumulator, field) => {
    accumulator[field.key] =
      field.type === "checkbox" ? Boolean(raw[field.key]) : raw[field.key] == null ? "" : String(raw[field.key]);
    return accumulator;
  }, {});
}

function validateMasterDataValues(section, values) {
  const missingField = section.fields.find(
    (field) => field.required && field.type !== "checkbox" && !normalizeText(values[field.key]),
  );

  return missingField ? missingField.label : "";
}

function buildMasterDataPayload(section, values, item) {
  const payload = {};

  section.fields.forEach((field) => {
    const rawValue = values[field.key];

    if (field.type === "checkbox") {
      payload[field.key] = Boolean(rawValue);
      return;
    }

    if (field.type === "number") {
      payload[field.key] = normalizeText(rawValue) ? Number(rawValue) : 0;
      return;
    }

    payload[field.key] = normalizeText(rawValue);
  });

  if (item?.raw?.id) {
    payload.id = item.raw.id;
  }

  return payload;
}

function buildSelectOptions(items, type) {
  const normalizedItems = Array.isArray(items) ? items : [];

  if (type === "currencies") {
    return normalizedItems.map((item) => ({
      value: item.raw?.code || "",
      label: [item.raw?.code || "", item.raw?.label || item.name || ""].filter(Boolean).join(" - "),
    }));
  }

  if (type === "languages") {
    return normalizedItems.map((item) => ({
      value: item.raw?.code || "",
      label: item.raw?.code ? `${item.raw?.label || item.name} (${item.raw.code})` : item.raw?.label || item.name,
    }));
  }

  return normalizedItems.map((item) => ({
    value: item.raw?.value || "",
    label: item.raw?.label || item.raw?.value || item.name || "",
  }));
}

function withSelectedFallback(options, value) {
  if (!value || options.some((option) => option.value === value)) {
    return options;
  }

  return [{ value, label: value }, ...options];
}

function parseName(profile) {
  return {
    firstName: String(profile?.firstName || "").trim(),
    lastName: String(profile?.lastName || "").trim(),
  };
}

function getInitials(user) {
  return getAdminDisplayName(user)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function HeaderStatusCard({ icon: Icon, label, value, tone = "neutral" }) {
  const toneClasses = {
    neutral: "bg-white text-[#8b776a]",
    warm: "bg-[#fff4ec] text-[#cf6e38]",
    success: "bg-[#edf8f1] text-[#2f8f57]",
  };

  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-[#eadfd6] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(49,30,19,0.04)]">
      <span
        className={[
          "inline-flex h-10 w-10 items-center justify-center rounded-[12px]",
          toneClasses[tone] || toneClasses.neutral,
        ].join(" ")}
      >
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#9a8677]">
          {label}
        </p>
        <p className="mt-1 truncate text-[13px] font-semibold text-[#241912]">{value}</p>
      </div>
    </div>
  );
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
          <h3 className="text-[13px] font-bold text-[#2a1f18]">Update Password</h3>

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
  currencies,
  locales,
  timeZones,
  onFieldChange,
  onSave,
  isSaving,
}) {
  const currencyOptions = withSelectedFallback(buildSelectOptions(currencies, "currencies"), preferences.defaultCurrency);
  const localeOptions = withSelectedFallback(buildSelectOptions(locales, "languages"), preferences.locale);
  const timeZoneOptions = withSelectedFallback(buildSelectOptions(timeZones, "timeZones"), preferences.timezone);

  return (
    <SettingsShellCard>
      <SettingsSectionHeader icon={BadgeCent} title="Platform Preferences" />

      <div className="max-w-[420px]">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-[12px] font-bold text-[#2f241d]">Default Currency</span>
            <select
              className="h-12 cursor-pointer rounded-[10px] border border-[#d9d1ca] bg-[#f6f4f2] px-3.5 text-[13px] text-[#2a1f19] outline-none transition focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
              disabled={!currencyOptions.length}
              onChange={onFieldChange("defaultCurrency")}
              value={preferences.defaultCurrency}
            >
              <option value="">Select currency</option>
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-bold text-[#2f241d]">Timezone</span>
            <select
              className="h-12 cursor-pointer rounded-[10px] border border-[#d9d1ca] bg-[#f6f4f2] px-3.5 text-[13px] text-[#2a1f19] outline-none transition focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
              disabled={!timeZoneOptions.length}
              onChange={onFieldChange("timezone")}
              value={preferences.timezone}
            >
              <option value="">Select time zone</option>
              {timeZoneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-bold text-[#2f241d]">Locale</span>
            <select
              className="h-12 cursor-pointer rounded-[10px] border border-[#d9d1ca] bg-[#f6f4f2] px-3.5 text-[13px] text-[#2a1f19] outline-none transition focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
              disabled={!localeOptions.length}
              onChange={onFieldChange("locale")}
              value={preferences.locale}
            >
              <option value="">Select locale</option>
              {localeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-2 text-[11px] leading-5 text-[#9c9087]">
          These preferences are saved per administrator and apply to platform defaults like currency, timezone, and locale.
        </p>

        <SaveButton className="mt-6 h-10 px-6" disabled={isSaving} onClick={onSave}>
          {isSaving ? "Updating..." : "Update Preferences"}
        </SaveButton>
      </div>
    </SettingsShellCard>
  );
}

function MasterDataField({ field, value, onChange }) {
  if (field.type === "checkbox") {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-bold text-[#2f241d]">{field.label}</span>
        <label className="flex h-12 items-center justify-between rounded-[10px] border border-[#d9d1ca] bg-[#f6f4f2] px-3.5 text-[13px] font-semibold text-[#2a1f19] transition hover:border-[#ce6938] hover:bg-white">
          <span className="text-[#5f5148]">Enabled</span>
          <input
            checked={Boolean(value)}
            className="h-4 w-4 accent-[#ce6938]"
            onChange={(event) => onChange(field.key, event.target.checked)}
            type="checkbox"
          />
        </label>
      </div>
    );
  }

  return (
    <SettingsField
      label={field.label}
      onChange={(event) => onChange(field.key, event.target.value)}
      placeholder={field.placeholder}
      type={field.type || "text"}
      value={value}
    />
  );
}

function MasterDataManagerCard({
  section,
  items,
  draftValues,
  editingState,
  savingKey,
  onDraftChange,
  onCreate,
  onStartEdit,
  onEditChange,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}) {
  const Icon = section.icon;

  return (
    <SettingsShellCard className="rounded-[18px] border-[#eadfd6] px-5 py-5">
      <SettingsSectionHeader icon={Icon} title={section.title} />
      <div className="grid items-end gap-3 md:grid-cols-2 xl:grid-cols-5">
        {section.fields.map((field) => (
          <MasterDataField
            field={field}
            key={field.key}
            onChange={(fieldKey, value) => onDraftChange(section.key, fieldKey, value)}
            value={draftValues[field.key]}
          />
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <SaveButton
          className="h-11 min-w-[160px] px-5"
          disabled={savingKey === `${section.key}:create`}
          onClick={() => onCreate(section)}
        >
          {savingKey === `${section.key}:create` ? "Saving..." : `Add ${section.singularLabel}`}
        </SaveButton>
      </div>

      <div className="mt-6 space-y-3 border-t border-[#eee5de] pt-5">
        {items.length ? (
          items.map((item) => {
            const isEditing =
              editingState.sectionKey === section.key && editingState.itemId === item.id;

            return (
              <div
                className="rounded-[16px] border border-[#eadfd6] bg-[linear-gradient(180deg,#fffdfa_0%,#fcfaf8_100%)] p-4 shadow-[0_8px_18px_rgba(49,30,19,0.03)]"
                key={item.id}
              >
                {isEditing ? (
                  <>
                    <div className="grid items-end gap-3 md:grid-cols-2 xl:grid-cols-5">
                      {section.fields.map((field) => (
                        <MasterDataField
                          field={field}
                          key={field.key}
                          onChange={onEditChange}
                          value={editingState.values[field.key]}
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <SaveButton
                        className="h-10 px-4"
                        disabled={savingKey === `${section.key}:edit:${item.id}`}
                        onClick={() => onSaveEdit(section, item)}
                      >
                        {savingKey === `${section.key}:edit:${item.id}` ? "Updating..." : "Save"}
                      </SaveButton>
                      <button
                        className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[#d9d1ca] bg-white px-4 text-[12px] font-bold text-[#3f3530] transition hover:bg-[#faf6f2]"
                        onClick={onCancelEdit}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-[#2a1f18]">{item.name}</p>
                      <p className="mt-1 text-[12px] leading-5 text-[#85786f]">
                        {item.meta || "API-managed option"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#d9d1ca] bg-white px-3 text-[12px] font-bold text-[#3f3530] transition hover:bg-[#faf6f2]"
                        onClick={() => onStartEdit(section.key, item)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#f0d6d0] bg-[#fff6f4] text-[#c35d4c] transition hover:bg-[#ffece7] disabled:opacity-60"
                        disabled={savingKey === `${section.key}:delete:${item.id}`}
                        onClick={() => onDelete(section, item)}
                        type="button"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-[12px] border border-dashed border-[#e6d8ce] bg-[#fffcfa] px-4 py-6 text-center text-[13px] text-[#7c6f66]">
            No {section.title.toLowerCase()} configured yet.
          </div>
        )}
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
  const [masterData, setMasterData] = useState({
    currencies: [],
    languages: [],
    timeZones: [],
  });
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
    defaultCurrency: "",
    timezone: "",
    locale: "",
  });
  const [masterDataDrafts, setMasterDataDrafts] = useState(createMasterDataDraftState);
  const [editingMasterData, setEditingMasterData] = useState({
    sectionKey: "",
    itemId: "",
    values: {},
  });
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [masterDataSavingKey, setMasterDataSavingKey] = useState("");
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
      defaultCurrency: user?.preferences?.defaultCurrency || "",
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
      const [user, taxonomyResult] = await Promise.all([
        getAdminSettingsRequest(),
        getVendorSettingsTaxonomyRequest(),
      ]);

      setSettingsUser(user);
      const taxonomy = mapVendorSettingsTaxonomy(taxonomyResult);
      setMasterData({
        currencies: taxonomy.currencies,
        languages: taxonomy.languages,
        timeZones: taxonomy.timeZones,
      });
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

  function updateMasterDataDraft(sectionKey, fieldKey, value) {
    setMasterDataDrafts((current) => ({
      ...current,
      [sectionKey]: {
        ...current[sectionKey],
        [fieldKey]: value,
      },
    }));
  }

  function startMasterDataEdit(sectionKey, item) {
    const section = MASTER_DATA_MAP[sectionKey];

    setEditingMasterData({
      sectionKey,
      itemId: item.id,
      values: getMasterDataValues(section, item),
    });
  }

  function cancelMasterDataEdit() {
    setEditingMasterData({
      sectionKey: "",
      itemId: "",
      values: {},
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
        text: result.message,
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
        timezone: preferencesForm.timezone,
        locale: preferencesForm.locale,
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

  async function handleCreateMasterData(section) {
    const values = masterDataDrafts[section.key];
    const missingField = validateMasterDataValues(section, values);

    if (missingField) {
      await Swal.fire({
        icon: "warning",
        title: "Missing value",
        text: `Please complete ${missingField} before creating a new ${section.singularLabel}.`,
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setMasterDataSavingKey(`${section.key}:create`);
      await section.save(buildMasterDataPayload(section, values));
      setMasterDataDrafts((current) => ({
        ...current,
        [section.key]: createEmptyMasterDataDraft(section),
      }));
      await loadSettings({ silent: true });
      await Swal.fire({
        icon: "success",
        title: `${section.title} updated`,
        text: `The new ${section.singularLabel} is now available through the API.`,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: `Unable to create ${section.singularLabel}`,
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setMasterDataSavingKey("");
    }
  }

  async function handleSaveMasterDataEdit(section, item) {
    const values = editingMasterData.values;
    const missingField = validateMasterDataValues(section, values);

    if (missingField) {
      await Swal.fire({
        icon: "warning",
        title: "Missing value",
        text: `Please complete ${missingField} before saving your changes.`,
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setMasterDataSavingKey(`${section.key}:edit:${item.id}`);
      await section.save(buildMasterDataPayload(section, values, item));
      cancelMasterDataEdit();
      await loadSettings({ silent: true });
      await Swal.fire({
        icon: "success",
        title: "Updated",
        text: `${section.singularLabel} updated successfully.`,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update item",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setMasterDataSavingKey("");
    }
  }

  async function handleDeleteMasterData(section, item) {
    const result = await Swal.fire({
      title: `Delete ${item.name}?`,
      text: "This removes it from future admin and vendor selections.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c6b7aa",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setMasterDataSavingKey(`${section.key}:delete:${item.id}`);
      await section.remove(item?.raw?.[section.deleteKey] || item.id);
      if (editingMasterData.itemId === item.id) {
        cancelMasterDataEdit();
      }
      await loadSettings({ silent: true });
      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: `${item.name} has been removed.`,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to delete item",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setMasterDataSavingKey("");
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
      return [];
    }

    return [
      {
        id: "timezone",
        icon: Clock3,
        label: "Timezone",
        value: settingsUser.preferences?.timezone || "Timezone pending",
        tone: settingsUser.preferences?.timezone ? "success" : "neutral",
      },
      {
        id: "locale",
        icon: Globe2,
        label: "Locale",
        value: settingsUser.preferences?.locale || "Locale pending",
        tone: settingsUser.preferences?.locale ? "success" : "neutral",
      },
    ];
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

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {headerSummary.map((item) => (
            <HeaderStatusCard key={item.id} {...item} />
          ))}
        </div>
        <button
          className="inline-flex cursor-pointer items-center gap-2 rounded-[12px] border border-[#dfd5cd] bg-white px-4 py-2.5 text-[12px] font-bold text-[#3c312a] shadow-[0_10px_22px_rgba(49,30,19,0.04)] transition hover:bg-[#faf6f2] disabled:cursor-not-allowed disabled:opacity-60"
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
            currencies={masterData.currencies}
            isSaving={isSavingPreferences}
            locales={masterData.languages}
            onFieldChange={(field) => (event) =>
              setPreferencesForm((current) => ({
                ...current,
                [field]: event.target.value,
              }))
            }
            onSave={handleSavePreferences}
            preferences={preferencesForm}
            timeZones={masterData.timeZones}
          />
        )}
      </div>

      <div className="grid gap-5">
        {isLoading
          ? MASTER_DATA_CONFIG.map((section) => <LoadingCard key={section.key} />)
          : MASTER_DATA_CONFIG.map((section) => (
              <MasterDataManagerCard
                draftValues={masterDataDrafts[section.key]}
                editingState={editingMasterData}
                items={masterData[section.key]}
                key={section.key}
                onCancelEdit={cancelMasterDataEdit}
                onCreate={handleCreateMasterData}
                onDelete={handleDeleteMasterData}
                onDraftChange={updateMasterDataDraft}
                onEditChange={(fieldKey, value) =>
                  setEditingMasterData((current) => ({
                    ...current,
                    values: {
                      ...current.values,
                      [fieldKey]: value,
                    },
                  }))
                }
                onSaveEdit={handleSaveMasterDataEdit}
                onStartEdit={startMasterDataEdit}
                savingKey={masterDataSavingKey}
                section={section}
              />
            ))}
      </div>
    </div>
  );
}
