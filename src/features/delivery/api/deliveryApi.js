import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADD_DELIVERY_POSTAL_AREA_MUTATION,
  ADMIN_DELIVERY_AREA_QUERY,
  ADMIN_DELIVERY_AREAS_QUERY,
  ADMIN_DELIVERY_SUMMARY_QUERY,
  CREATE_DELIVERY_AREA_MUTATION,
  DELETE_DELIVERY_POSTAL_AREA_MUTATION,
  UPDATE_DELIVERY_AREA_MUTATION,
  UPDATE_DELIVERY_AREA_STATUS_MUTATION,
  UPDATE_DELIVERY_POSTAL_AREA_MUTATION,
} from "./deliveryQueries.js";

function getErrorMessage(result, fallbackMessage) {
  const firstError = result?.errors?.find((item) => item?.message)?.message;
  return firstError || result?.message || fallbackMessage;
}

function normalizeStatus(value) {
  const normalized = `${value ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "INACTIVE":
      return "Inactive";
    case "LIMITED":
      return "Limited";
    default:
      return "Active";
  }
}

function normalizeCoverageType(value) {
  const normalized = `${value ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "SELECTED_POSTAL_CODES_ONLY":
      return "Selected Postal Codes Only";
    case "ALL_CITY_COVERAGE":
      return "All City Coverage";
    default:
      return normalized.replace(/_/g, " ") || "Not configured";
  }
}

function formatDisplayDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `${value}`;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function normalizePostalArea(postalArea) {
  return {
    id: postalArea?.id || "",
    postalCode: `${postalArea?.postalCode ?? ""}`.trim(),
    areaName: postalArea?.areaName || "",
    status: normalizeStatus(postalArea?.status),
    vendors: Number(postalArea?.vendors ?? 0),
    lat: postalArea?.lat == null ? "" : `${postalArea.lat}`,
    lng: postalArea?.lng == null ? "" : `${postalArea.lng}`,
  };
}

function normalizeAreaListItem(item) {
  return {
    id: item?.id || "",
    city: item?.city || "",
    region: item?.region || "",
    country: item?.country || "",
    status: normalizeStatus(item?.status),
    activePostalCodes: Number(item?.activePostalCodes ?? 0),
    vendors: Number(item?.vendors ?? 0),
    updatedAt: formatDisplayDate(item?.updatedAt),
    maxDeliveryRadius: Number(item?.maxDeliveryRadius ?? 0),
    leadTimeDays: Number(item?.leadTimeDays ?? 0),
    coverageType: normalizeCoverageType(item?.coverageType),
  };
}

function normalizeAreaDetail(area) {
  if (!area?.id) {
    return null;
  }

  return {
    id: area.id,
    city: area.city || "",
    region: area.region || "",
    country: area.country || "",
    status: normalizeStatus(area.status),
    rawStatus: `${area.status ?? ""}`.trim().toUpperCase() || "ACTIVE",
    activePostalCodes: Number(area.activePostalCodes ?? 0),
    vendors: Number(area.vendors ?? 0),
    updatedAt: formatDisplayDate(area.updatedAt),
    maxDeliveryRadius: Number(area.maxDeliveryRadius ?? 0),
    leadTimeDays: Number(area.leadTimeDays ?? 0),
    coverageType: normalizeCoverageType(area.coverageType),
    rawCoverageType:
      `${area.settings?.coverageType ?? area.coverageType ?? ""}`.trim().toUpperCase() ||
      "SELECTED_POSTAL_CODES_ONLY",
    settings: {
      maxDeliveryRadius: `${area.settings?.maxDeliveryRadius ?? area.maxDeliveryRadius ?? ""}`,
      leadTimeDays: `${area.settings?.leadTimeDays ?? area.leadTimeDays ?? ""}`,
      coverageType:
        `${area.settings?.coverageType ?? area.coverageType ?? ""}`.trim().toUpperCase() ||
        "SELECTED_POSTAL_CODES_ONLY",
      minimumOrderAmount: `${area.settings?.minimumOrderAmount ?? ""}`,
      deliveryFee: `${area.settings?.deliveryFee ?? ""}`,
      isRestricted: Boolean(area.settings?.isRestricted),
      isExpressEnabled: Boolean(area.settings?.isExpressEnabled),
      notes: area.settings?.notes || "",
    },
    map: {
      center: {
        lat: area.map?.center?.lat ?? null,
        lng: area.map?.center?.lng ?? null,
      },
      zoom: Number(area.map?.zoom ?? 10),
      polygons: Array.isArray(area.map?.polygons) ? area.map.polygons : [],
      markers: Array.isArray(area.map?.markers) ? area.map.markers : [],
    },
    postalAreas: Array.isArray(area.postalAreas)
      ? area.postalAreas.map(normalizePostalArea)
      : [],
  };
}

function parseNumberOrNull(value) {
  const trimmed = `${value ?? ""}`.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDecimalOrNull(value) {
  const trimmed = `${value ?? ""}`.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.replace(/,/g, "").replace(/[^\d.-]/g, "");
  return normalized || null;
}

function normalizeStatusInput(value) {
  return `${value ?? ""}`.trim().toUpperCase() || "ACTIVE";
}

export async function getAdminDeliverySummaryRequest() {
  const data = await executeProtectedGraphqlRequest(ADMIN_DELIVERY_SUMMARY_QUERY, {});
  const summary = data?.adminDeliverySummary;

  if (!summary) {
    throw new Error("Unable to load delivery summary.");
  }

  return [
    {
      id: "cities",
      label: "Active Cities",
      value: String(summary.activeCities ?? 0),
      accent: "soft",
    },
    {
      id: "postalCodes",
      label: "Active Postal Codes",
      value: String(summary.activePostalCodes ?? 0),
      accent: "warm",
    },
    {
      id: "restricted",
      label: "Restricted Areas",
      value: String(summary.restrictedAreas ?? 0),
      accent: "neutral",
    },
    {
      id: "coverage",
      label: "Platform Coverage",
      value: `${Number(summary.platformCoveragePercent ?? 0)}%`,
      subtitle: summary.platformCoverageSubtitle || "",
      accent: "strong",
    },
  ];
}

export async function getAdminDeliveryAreasRequest(filters) {
  const data = await executeProtectedGraphqlRequest(ADMIN_DELIVERY_AREAS_QUERY, {
    search: filters?.search?.trim() || null,
    status: filters?.status || null,
    region: filters?.region || null,
    city: filters?.city || null,
    page: filters?.page || 1,
    pageSize: filters?.pageSize || 10,
    sortBy: filters?.sortBy || "city",
    sortOrder: filters?.sortOrder || "ASC",
  });

  const response = data?.adminDeliveryAreas;
  if (!response) {
    throw new Error("Unable to load delivery areas.");
  }

  return {
    rows: Array.isArray(response.items) ? response.items.map(normalizeAreaListItem) : [],
    pageInfo: {
      page: Number(response.pageInfo?.page ?? filters?.page ?? 1),
      pageSize: Number(response.pageInfo?.pageSize ?? filters?.pageSize ?? 10),
      totalItems: Number(response.pageInfo?.totalItems ?? 0),
      totalPages: Number(response.pageInfo?.totalPages ?? 1),
      hasNextPage: Boolean(response.pageInfo?.hasNextPage),
      hasPreviousPage: Boolean(response.pageInfo?.hasPreviousPage),
    },
    filterOptions: {
      cities: Array.isArray(response.filterOptions?.cities) ? response.filterOptions.cities : [],
      regions: Array.isArray(response.filterOptions?.regions) ? response.filterOptions.regions : [],
      statuses: Array.isArray(response.filterOptions?.statuses)
        ? response.filterOptions.statuses
        : [],
    },
  };
}

export async function getAdminDeliveryAreaRequest(id) {
  const data = await executeProtectedGraphqlRequest(ADMIN_DELIVERY_AREA_QUERY, { id });
  const area = normalizeAreaDetail(data?.adminDeliveryArea);

  if (!area?.id) {
    throw new Error("Unable to load this delivery area.");
  }

  return area;
}

export async function createDeliveryAreaRequest(input) {
  const data = await executeProtectedGraphqlRequest(CREATE_DELIVERY_AREA_MUTATION, {
    input: {
      city: `${input?.city ?? ""}`.trim(),
      region: `${input?.region ?? ""}`.trim(),
      country: `${input?.country ?? ""}`.trim(),
      coverageType: `${input?.coverageType ?? ""}`.trim(),
      maxDeliveryRadius: parseNumberOrNull(input?.maxDeliveryRadius),
      leadTimeDays: parseNumberOrNull(input?.leadTimeDays),
      postalAreas: Array.isArray(input?.postalAreas)
        ? input.postalAreas.map((area) => ({
            postalCode: `${area?.postalCode ?? ""}`.trim(),
            areaName: `${area?.areaName ?? ""}`.trim(),
            status: normalizeStatusInput(area?.status),
          }))
        : [],
    },
  });

  const result = data?.createDeliveryArea;
  if (!result?.success || !result?.deliveryArea?.id) {
    throw new Error(getErrorMessage(result, "Unable to create delivery area."));
  }

  return {
    message: result.message || "Delivery area created successfully.",
    deliveryArea: {
      id: result.deliveryArea.id,
      city: result.deliveryArea.city || "",
      region: result.deliveryArea.region || "",
      status: normalizeStatus(result.deliveryArea.status),
    },
  };
}

export async function updateDeliveryAreaRequest(id, input) {
  const data = await executeProtectedGraphqlRequest(UPDATE_DELIVERY_AREA_MUTATION, {
    id,
    input: {
      maxDeliveryRadius: parseNumberOrNull(input?.maxDeliveryRadius),
      leadTimeDays: parseNumberOrNull(input?.leadTimeDays),
      coverageType: `${input?.coverageType ?? ""}`.trim() || null,
      minimumOrderAmount: parseDecimalOrNull(input?.minimumOrderAmount),
      deliveryFee: parseDecimalOrNull(input?.deliveryFee),
      isRestricted: Boolean(input?.isRestricted),
      isExpressEnabled: Boolean(input?.isExpressEnabled),
      notes: `${input?.notes ?? ""}`.trim() || null,
    },
  });

  const result = data?.updateDeliveryArea;
  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to update delivery area."));
  }

  return {
    message: result.message || "Delivery area updated successfully.",
    settings: result.deliveryArea?.settings || null,
  };
}

export async function updateDeliveryAreaStatusRequest(id, status) {
  const data = await executeProtectedGraphqlRequest(UPDATE_DELIVERY_AREA_STATUS_MUTATION, {
    id,
    status,
  });

  const result = data?.updateDeliveryAreaStatus;
  if (!result?.success || !result?.deliveryArea?.id) {
    throw new Error(getErrorMessage(result, "Unable to update area status."));
  }

  return {
    message: result.message || "Area status updated successfully.",
    status: normalizeStatus(result.deliveryArea.status),
    rawStatus: `${result.deliveryArea.status ?? ""}`.trim().toUpperCase() || status,
  };
}

export async function addDeliveryPostalAreaRequest(deliveryAreaId, input) {
  const data = await executeProtectedGraphqlRequest(ADD_DELIVERY_POSTAL_AREA_MUTATION, {
    deliveryAreaId,
    input: {
      postalCode: `${input?.postalCode ?? ""}`.trim(),
      areaName: `${input?.areaName ?? ""}`.trim(),
      status: normalizeStatusInput(input?.status),
      lat: parseNumberOrNull(input?.lat),
      lng: parseNumberOrNull(input?.lng),
    },
  });

  const result = data?.addDeliveryPostalArea;
  if (!result?.success || !result?.postalArea?.id) {
    throw new Error(getErrorMessage(result, "Unable to add postal area."));
  }

  return {
    message: result.message || "Postal area added successfully.",
    postalArea: normalizePostalArea(result.postalArea),
  };
}

export async function updateDeliveryPostalAreaRequest(id, input) {
  const data = await executeProtectedGraphqlRequest(UPDATE_DELIVERY_POSTAL_AREA_MUTATION, {
    id,
    input: {
      postalCode: `${input?.postalCode ?? ""}`.trim(),
      areaName: `${input?.areaName ?? ""}`.trim(),
      status: normalizeStatusInput(input?.status),
      lat: parseNumberOrNull(input?.lat),
      lng: parseNumberOrNull(input?.lng),
    },
  });

  const result = data?.updateDeliveryPostalArea;
  if (!result?.success || !result?.postalArea?.id) {
    throw new Error(getErrorMessage(result, "Unable to update postal area."));
  }

  return {
    message: result.message || "Postal area updated successfully.",
    postalArea: normalizePostalArea(result.postalArea),
  };
}

export async function deleteDeliveryPostalAreaRequest(id) {
  const data = await executeProtectedGraphqlRequest(DELETE_DELIVERY_POSTAL_AREA_MUTATION, { id });
  const result = data?.deleteDeliveryPostalArea;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to delete postal area."));
  }

  return {
    message: result.message || "Postal area deleted successfully.",
  };
}
