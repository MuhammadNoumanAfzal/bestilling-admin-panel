import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADMIN_SETTINGS_ME_QUERY,
  CHANGE_ADMIN_PASSWORD_MUTATION,
  UPDATE_ADMIN_AVATAR_MUTATION,
  UPDATE_ADMIN_PROFILE_MUTATION,
  UPDATE_PLATFORM_PREFERENCES_MUTATION,
} from "./settingsQueries.js";

function getFirstErrorMessage(result, fallbackMessage) {
  const firstError = result?.errors?.find((item) => item?.message)?.message;
  return firstError || result?.message || fallbackMessage;
}

function normalizeSettingsUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    fullName: user.fullName ?? "",
    phone: user.phone ?? "",
    role: user.role ?? "",
    isActive: Boolean(user.isActive),
    isVerified: Boolean(user.isVerified),
    avatar: user.avatar
      ? {
          id: user.avatar.id ?? "",
          url: user.avatar.url ?? "",
        }
      : null,
    security: {
      lastPasswordChangeAt: user.security?.lastPasswordChangeAt ?? "",
      lastLoginAt: user.security?.lastLoginAt ?? "",
      twoFactorEnabled: Boolean(user.security?.twoFactorEnabled),
    },
    preferences: {
      defaultCurrency: user.preferences?.defaultCurrency ?? "NOK",
      timezone: user.preferences?.timezone ?? "",
      locale: user.preferences?.locale ?? "",
    },
  };
}

export async function getAdminSettingsRequest() {
  const data = await executeProtectedGraphqlRequest(ADMIN_SETTINGS_ME_QUERY, {});
  const user = normalizeSettingsUser(data?.me);

  if (!user?.id) {
    throw new Error("Unable to load administrator settings right now.");
  }

  return user;
}

export async function updateAdminProfileRequest(input) {
  const data = await executeProtectedGraphqlRequest(UPDATE_ADMIN_PROFILE_MUTATION, {
    input: {
      firstName: String(input?.firstName || "").trim(),
      lastName: String(input?.lastName || "").trim(),
      email: String(input?.email || "").trim().toLowerCase(),
      phone: String(input?.phone || "").trim(),
    },
  });

  const result = data?.updateAdminProfile;

  if (!result?.success || !result?.user) {
    throw new Error(getFirstErrorMessage(result, "Unable to update profile information."));
  }

  return {
    message: result.message || "Profile updated successfully.",
    requiresEmailVerification: Boolean(result.requiresEmailVerification),
    user: normalizeSettingsUser(result.user),
  };
}

export async function changeAdminPasswordRequest(input) {
  const data = await executeProtectedGraphqlRequest(CHANGE_ADMIN_PASSWORD_MUTATION, {
    input: {
      currentPassword: String(input?.currentPassword || ""),
      newPassword: String(input?.newPassword || ""),
      confirmPassword: String(input?.confirmPassword || ""),
    },
  });

  const result = data?.changeAdminPassword;

  if (!result?.success) {
    throw new Error(getFirstErrorMessage(result, "Unable to change password."));
  }

  return {
    message: result.message || "Password updated successfully.",
    logoutOtherSessions: Boolean(result.logoutOtherSessions),
  };
}

export async function updatePlatformPreferencesRequest(input) {
  const data = await executeProtectedGraphqlRequest(UPDATE_PLATFORM_PREFERENCES_MUTATION, {
    input: {
      defaultCurrency: String(input?.defaultCurrency || "").trim(),
    },
  });

  const result = data?.updatePlatformPreferences;

  if (!result?.success || !result?.preferences) {
    throw new Error(getFirstErrorMessage(result, "Unable to update platform preferences."));
  }

  return {
    message: result.message || "Preferences updated successfully.",
    preferences: {
      defaultCurrency: result.preferences.defaultCurrency ?? "NOK",
      timezone: result.preferences.timezone ?? "",
      locale: result.preferences.locale ?? "",
    },
  };
}

export async function updateAdminAvatarRequest({ photoUrl, assetKey }) {
  const data = await executeProtectedGraphqlRequest(UPDATE_ADMIN_AVATAR_MUTATION, {
    photoUrl: photoUrl || null,
    assetKey: assetKey || null,
  });

  const result = data?.updateAdminAvatar;

  if (!result?.success || !result?.user) {
    throw new Error(result?.message || "Unable to update avatar.");
  }

  return {
    message: result.message || "Avatar updated successfully.",
    avatar: result.user.avatar
      ? {
          id: result.user.avatar.id ?? "",
          url: result.user.avatar.url ?? "",
        }
      : null,
  };
}
