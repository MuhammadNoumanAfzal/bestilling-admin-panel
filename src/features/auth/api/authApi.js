import { ADMIN_AUTH_ROLE, isAllowedAdminRole } from "../authConfig.js";
import { executeGraphqlRequest } from "./authClient.js";
import {
  ADD_NEW_ADMINISTRATOR_MUTATION,
  CURRENT_ADMIN_QUERY,
  LOGIN_ADMIN_MUTATION,
  PASSWORD_RESET_MAIL_MUTATION,
  RESET_PASSWORD_MUTATION,
  VERIFY_RESET_CODE_MUTATION,
} from "./authQueries.js";

function normalizeAdminUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    avatar: user.avatar
      ? {
          id: user.avatar.id ?? "",
          url: user.avatar.url ?? "",
        }
      : null,
    role: user.role ?? "",
    isAdmin: Boolean(user.isAdmin),
    isStaff: Boolean(user.isStaff),
    isSuperuser: Boolean(user.isSuperuser),
  };
}

function assertValidAdminUser(user) {
  if (!user?.id || !user?.email || !isAllowedAdminRole(user?.role)) {
    throw new Error("This account is not allowed to access the admin portal.");
  }
}

export async function loginAdminRequest({ email, password }) {
  const data = await executeGraphqlRequest(LOGIN_ADMIN_MUTATION, {
    email: String(email || "").trim().toLowerCase(),
    password,
    role: ADMIN_AUTH_ROLE,
  });

  const loginUser = data?.loginUser;

  if (!loginUser?.success || !loginUser?.access || !loginUser?.user) {
    throw new Error("Login failed. Please verify your credentials and try again.");
  }

  const user = normalizeAdminUser(loginUser.user);
  assertValidAdminUser(user);

  return {
    accessToken: loginUser.access,
    user,
  };
}

export async function getCurrentAdminRequest(accessToken) {
  const data = await executeGraphqlRequest(
    CURRENT_ADMIN_QUERY,
    {},
    { accessToken },
  );

  const user = normalizeAdminUser(data?.me);
  assertValidAdminUser(user);
  return user;
}

export async function requestAdminPasswordResetMail({ email }) {
  const data = await executeGraphqlRequest(PASSWORD_RESET_MAIL_MUTATION, {
    email: String(email || "").trim().toLowerCase(),
    role: ADMIN_AUTH_ROLE,
  });

  const result = data?.passwordResetMail;

  if (!result?.success) {
    throw new Error(result?.message || "Unable to send reset code right now.");
  }

  return {
    message: result.message || "OTP has been sent to your email.",
  };
}

export async function verifyAdminPasswordResetCode({ email, pin }) {
  const data = await executeGraphqlRequest(VERIFY_RESET_CODE_MUTATION, {
    email: String(email || "").trim().toLowerCase(),
    pin: String(pin || "").trim(),
  });

  const result = data?.verifyResetCode;

  if (!result?.success) {
    throw new Error(result?.message || "Verification failed. Please try again.");
  }

  return {
    message: result.message || "Code verified successfully.",
    token: result.token || null,
  };
}

export async function resetAdminPasswordRequest({ email, token, password }) {
  const data = await executeGraphqlRequest(RESET_PASSWORD_MUTATION, {
    email: String(email || "").trim().toLowerCase(),
    token: String(token || "").trim(),
    password1: password,
    password2: password,
  });

  const result = data?.resetPassword;

  if (!result?.success) {
    throw new Error(result?.message || "Password reset failed. Please try again.");
  }

  return {
    message: result.message || "Password updated successfully.",
  };
}

export async function addNewAdministratorRequest({ input, accessToken }) {
  const data = await executeGraphqlRequest(
    ADD_NEW_ADMINISTRATOR_MUTATION,
    { input },
    { accessToken },
  );

  const result = data?.addNewAdministrator;

  if (!result?.success) {
    const firstErrorMessage = result?.errors?.find((item) => item?.message)?.message;
    throw new Error(firstErrorMessage || result?.message || "Unable to create the administrator right now.");
  }

  return {
    message: result.message || "Administrator created successfully.",
    user: normalizeAdminUser(result.user),
  };
}
