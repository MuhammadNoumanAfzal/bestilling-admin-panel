const DEFAULT_ADMIN_ROLE = "admin";
const DEFAULT_ALLOWED_ADMIN_ROLES = [
  "admin",
  "sub-admin",
  "developer",
  "editor",
  "seo-manager",
  "system-manager",
];

export const ADMIN_AUTH_ROLE = import.meta.env.VITE_ADMIN_AUTH_ROLE || DEFAULT_ADMIN_ROLE;

export const ALLOWED_ADMIN_ROLES = (
  import.meta.env.VITE_ADMIN_ALLOWED_ROLES || DEFAULT_ALLOWED_ADMIN_ROLES.join(",")
)
  .split(",")
  .map((role) => role.trim())
  .filter(Boolean);

export function isAllowedAdminRole(role) {
  return ALLOWED_ADMIN_ROLES.includes(String(role || "").trim());
}

export function getAdminDisplayName(user) {
  const firstName = String(user?.firstName || "").trim();
  const lastName = String(user?.lastName || "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (fullName) {
    return fullName;
  }

  return String(user?.email || "Admin User").trim();
}

export function getAdminRoleLabel(role) {
  const normalizedRole = String(role || "").trim();

  if (!normalizedRole) {
    return "Administrator";
  }

  return normalizedRole
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function validateAdminPassword(password) {
  const value = String(password || "");

  if (value.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!/[A-Z]/.test(value)) {
    return "Password must include at least one uppercase letter.";
  }

  if (!/[a-z]/.test(value)) {
    return "Password must include at least one lowercase letter.";
  }

  if (!/\d/.test(value)) {
    return "Password must include at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    return "Password must include at least one special character.";
  }

  return null;
}
