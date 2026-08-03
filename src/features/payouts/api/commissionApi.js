import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADMIN_COMMISSION_SETTINGS_QUERY,
  COMMISSION_AREA_OPTIONS_QUERY,
  COMMISSION_VENDOR_OPTIONS_QUERY,
  CREATE_AREA_COMMISSION_MUTATION,
  CREATE_VENDOR_COMMISSION_MUTATION,
  DELETE_AREA_COMMISSION_MUTATION,
  DELETE_VENDOR_COMMISSION_MUTATION,
  UPDATE_AREA_COMMISSION_MUTATION,
  UPDATE_GLOBAL_COMMISSION_MUTATION,
  UPDATE_VENDOR_COMMISSION_MUTATION,
} from "./commissionQueries.js";

function getErrorMessage(result, fallbackMessage) {
  const firstError = result?.errors?.find((item) => item?.message)?.message;
  return firstError || result?.message || fallbackMessage;
}

function toInitials(value) {
  return `${value ?? ""}`
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function formatPercentDisplay(value) {
  if (value == null || value === "") {
    return "0%";
  }

  const parsed = Number(`${value}`.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(parsed)) {
    return `${value}`.includes("%") ? `${value}` : `${value}%`;
  }

  const formatted = Number.isInteger(parsed) ? parsed.toFixed(0) : parsed.toFixed(2).replace(/\.?0+$/, "");
  return `${formatted}%`;
}

function formatDateTimeInput(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (part) => `${part}`.padStart(2, "0");
  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

function normalizeOptionArea(area) {
  if (!area?.id) {
    return null;
  }

  return {
    id: area.id,
    label: area.name || "Unnamed area",
    region: area.region || "",
    activeVendorsCount: Number(area.activeVendorsCount ?? 0),
    orderSharePercent: Number(area.orderSharePercent ?? 0),
  };
}

function normalizeVendorOption(option) {
  if (!option?.id) {
    return null;
  }

  return {
    id: option.id,
    label: option.name || "Unnamed vendor",
    avatarUrl: option.avatarUrl || "",
    defaultArea: option.defaultArea
      ? {
          id: option.defaultArea.id,
          label: option.defaultArea.name || "Unnamed area",
        }
      : null,
  };
}

function normalizeCommissionSettings(payload) {
  const globalCommission = payload?.globalCommission || null;

  return {
    globalSettings: {
      id: globalCommission?.id || "",
      label: globalCommission?.label || "Platform Default",
      currentRate: formatPercentDisplay(globalCommission?.rate),
      rawRate: `${globalCommission?.rate ?? ""}`,
      description:
        globalCommission?.description ||
        "This commission is applied to all vendors unless an Area or Vendor-specific commission is configured.",
      updatedAt: globalCommission?.updatedAt || "",
      updatedByEmail: globalCommission?.updatedBy?.email || "",
    },
    vendorRows: Array.isArray(payload?.vendorCommissions)
      ? payload.vendorCommissions
          .filter((row) => row?.isActive !== false)
          .map((row) => ({
            id: row?.id || "",
            vendorId: row?.vendor?.id || "",
            vendor: row?.vendor?.name || "Unnamed vendor",
            areaId: row?.area?.id || "",
            area: row?.area?.name || "Unassigned area",
            currentCommission: formatPercentDisplay(row?.rate),
            rawRate: `${row?.rate ?? ""}`,
            avatar: toInitials(row?.vendor?.name),
            avatarUrl: row?.vendor?.logoUrl || "",
            effectiveFrom: formatDateTimeInput(row?.effectiveFrom),
            effectiveTo: formatDateTimeInput(row?.effectiveTo),
            isActive: Boolean(row?.isActive),
            updatedAt: row?.updatedAt || "",
          }))
      : [],
    areaRows: Array.isArray(payload?.areaCommissions)
      ? payload.areaCommissions
          .filter((row) => row?.isActive !== false)
          .map((row) => ({
            id: row?.id || "",
            areaId: row?.area?.id || "",
            area: row?.area?.name || "Unnamed area",
            region: row?.area?.region || "",
            commissionRate: formatPercentDisplay(row?.rate),
            rawRate: `${row?.rate ?? ""}`,
            activeVendors: String(row?.activeVendorsCount ?? 0),
            orderShare: formatPercentDisplay(row?.orderSharePercent),
            effectiveFrom: formatDateTimeInput(row?.effectiveFrom),
            effectiveTo: formatDateTimeInput(row?.effectiveTo),
            isActive: Boolean(row?.isActive),
            updatedAt: row?.updatedAt || "",
          }))
      : [],
  };
}

function parseRate(value) {
  const normalized = `${value ?? ""}`.trim().replace(/,/g, "").replace(/[^\d.-]/g, "");
  if (!normalized) {
    return "";
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return "";
  }

  return parsed.toFixed(2);
}

function parseDateTimeOrNull(value) {
  const trimmed = `${value ?? ""}`.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

export async function getAdminCommissionSettingsRequest() {
  const data = await executeProtectedGraphqlRequest(ADMIN_COMMISSION_SETTINGS_QUERY, {});
  const response = data?.adminCommissionSettings;

  if (!response?.globalCommission) {
    throw new Error("Unable to load commission settings.");
  }

  return normalizeCommissionSettings(response);
}

export async function getCommissionVendorOptionsRequest(search = "") {
  const data = await executeProtectedGraphqlRequest(COMMISSION_VENDOR_OPTIONS_QUERY, {
    search: search.trim() || null,
  });

  return Array.isArray(data?.commissionVendorOptions)
    ? data.commissionVendorOptions.map(normalizeVendorOption).filter(Boolean)
    : [];
}

export async function getCommissionAreaOptionsRequest(search = "") {
  const data = await executeProtectedGraphqlRequest(COMMISSION_AREA_OPTIONS_QUERY, {
    search: search.trim() || null,
  });

  return Array.isArray(data?.commissionAreaOptions)
    ? data.commissionAreaOptions.map(normalizeOptionArea).filter(Boolean)
    : [];
}

export async function updateGlobalCommissionRequest(input) {
  const data = await executeProtectedGraphqlRequest(UPDATE_GLOBAL_COMMISSION_MUTATION, {
    input: {
      label: `${input?.label ?? ""}`.trim(),
      rate: parseRate(input?.currentRate),
      description: `${input?.description ?? ""}`.trim(),
    },
  });

  const result = data?.updateGlobalCommission;
  if (!result?.success || !result?.globalCommission?.id) {
    throw new Error(getErrorMessage(result, "Unable to update global commission."));
  }

  return {
    message: result.message || "Global commission updated successfully.",
  };
}

export async function createVendorCommissionRequest(input) {
  const data = await executeProtectedGraphqlRequest(CREATE_VENDOR_COMMISSION_MUTATION, {
    input: {
      vendorId: input?.vendorId || null,
      areaId: input?.areaId || null,
      rate: parseRate(input?.currentCommission),
      effectiveFrom: parseDateTimeOrNull(input?.effectiveFrom),
      effectiveTo: parseDateTimeOrNull(input?.effectiveTo),
    },
  });

  const result = data?.createVendorCommission;
  if (!result?.success || !result?.vendorCommission?.id) {
    throw new Error(getErrorMessage(result, "Unable to create vendor commission."));
  }

  return {
    message: result.message || "Vendor commission created successfully.",
  };
}

export async function updateVendorCommissionRequest(id, input) {
  const data = await executeProtectedGraphqlRequest(UPDATE_VENDOR_COMMISSION_MUTATION, {
    id,
    input: {
      rate: parseRate(input?.currentCommission),
      effectiveFrom: parseDateTimeOrNull(input?.effectiveFrom),
      effectiveTo: parseDateTimeOrNull(input?.effectiveTo),
    },
  });

  const result = data?.updateVendorCommission;
  if (!result?.success || !result?.vendorCommission?.id) {
    throw new Error(getErrorMessage(result, "Unable to update vendor commission."));
  }

  return {
    message: result.message || "Vendor commission updated successfully.",
  };
}

export async function deleteVendorCommissionRequest(id) {
  const data = await executeProtectedGraphqlRequest(DELETE_VENDOR_COMMISSION_MUTATION, { id });
  const result = data?.deleteVendorCommission;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to delete vendor commission."));
  }

  return {
    message: result.message || "Vendor commission removed successfully.",
  };
}

export async function createAreaCommissionRequest(input) {
  const data = await executeProtectedGraphqlRequest(CREATE_AREA_COMMISSION_MUTATION, {
    input: {
      areaId: input?.areaId || null,
      rate: parseRate(input?.commissionRate),
      effectiveFrom: parseDateTimeOrNull(input?.effectiveFrom),
      effectiveTo: parseDateTimeOrNull(input?.effectiveTo),
    },
  });

  const result = data?.createAreaCommission;
  if (!result?.success || !result?.areaCommission?.id) {
    throw new Error(getErrorMessage(result, "Unable to create area commission."));
  }

  return {
    message: result.message || "Area commission created successfully.",
  };
}

export async function updateAreaCommissionRequest(id, input) {
  const data = await executeProtectedGraphqlRequest(UPDATE_AREA_COMMISSION_MUTATION, {
    id,
    input: {
      rate: parseRate(input?.commissionRate),
      effectiveFrom: parseDateTimeOrNull(input?.effectiveFrom),
      effectiveTo: parseDateTimeOrNull(input?.effectiveTo),
    },
  });

  const result = data?.updateAreaCommission;
  if (!result?.success || !result?.areaCommission?.id) {
    throw new Error(getErrorMessage(result, "Unable to update area commission."));
  }

  return {
    message: result.message || "Area commission updated successfully.",
  };
}

export async function deleteAreaCommissionRequest(id) {
  const data = await executeProtectedGraphqlRequest(DELETE_AREA_COMMISSION_MUTATION, { id });
  const result = data?.deleteAreaCommission;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to delete area commission."));
  }

  return {
    message: result.message || "Area commission removed successfully.",
  };
}
