import {
  executeProtectedGraphqlRequest,
  getCurrentAccessToken,
} from "../../../app/api/protectedGraphqlClient.js";
import {
  ADD_DELIVERY_POSTAL_AREA_MUTATION,
  ADMIN_DELIVERY_AREA_QUERY,
  ADMIN_DELIVERY_AREAS_QUERY,
  ADMIN_DELIVERY_SUMMARY_QUERY,
  BULK_IMPORT_DELIVERY_POSTAL_AREAS_MUTATION,
  CREATE_DELIVERY_AREA_MUTATION,
  DELETE_DELIVERY_AREA_MUTATION,
  DELETE_DELIVERY_POSTAL_AREA_MUTATION,
  EXTRACT_POSTAL_CODES_FROM_TEXT_MUTATION,
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
    case "RESTRICTED":
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
    case "POLYGON_COVERAGE":
      return "Polygon Coverage";
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

function formatDisplayDateTime(value) {
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatCoveragePercent(value) {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return "0%";
  }

  return Number.isInteger(numericValue) ? `${numericValue}%` : `${numericValue.toFixed(1)}%`;
}

function normalizePostalArea(postalArea) {
  return {
    id: postalArea?.id || "",
    postalCode: `${postalArea?.postalCode ?? ""}`.trim(),
    areaName: postalArea?.areaName || "",
    status: normalizeStatus(postalArea?.status),
    vendors: Number(postalArea?.vendors ?? 0),
    deliveryFeeOverride: `${postalArea?.deliveryFeeOverride ?? ""}`,
    minimumOrderAmountOverride: `${postalArea?.minimumOrderAmountOverride ?? ""}`,
    estimatedDeliveryMinutes: `${postalArea?.estimatedDeliveryMinutes ?? ""}`,
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
    country: item?.country || "",
    maxDeliveryRadius: Number(item?.maxDeliveryRadius ?? 0),
    leadTimeDays: Number(item?.leadTimeDays ?? 0),
    coverageType: normalizeCoverageType(item?.coverageType),
  };
}

function countActivePostalAreas(postalAreas = []) {
  return postalAreas.filter((postalArea) => {
    const status = `${postalArea?.status ?? ""}`.trim().toUpperCase();
    return status !== "INACTIVE";
  }).length;
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
      notes: area.settings?.notes || "",
    },
    postalAreas: Array.isArray(area.postalAreas)
      ? area.postalAreas.map(normalizePostalArea)
      : [],
    linkedVendors: Array.isArray(area.linkedVendors)
      ? area.linkedVendors.map((vendor) => ({
          id: vendor?.id || "",
          businessName: vendor?.businessName || "Vendor",
          isActive: Boolean(vendor?.isActive),
        }))
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

function getDefaultCoverageType(value) {
  return `${value ?? ""}`.trim().toUpperCase() || "SELECTED_POSTAL_CODES_ONLY";
}

function getDefaultDeliveryRadius(value) {
  const parsed = parseNumberOrNull(value);
  return parsed ?? 0;
}

function getDefaultLeadTimeDays(value) {
  const parsed = parseNumberOrNull(value);
  return parsed ?? 0;
}

function getDeliveryRestBaseUrl() {
  const explicitBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (explicitBaseUrl) {
    return explicitBaseUrl.replace(/\/$/, "");
  }

  const graphqlUrl =
    import.meta.env.VITE_GRAPHQL_API_URL ??
    import.meta.env.VITE_GRAPHQL_URL ??
    "https://api.gocatering.no/graphql/";

  return graphqlUrl.replace(/\/graphql\/?$/i, "").replace(/\/$/, "");
}

function normalizeExtractedPostalCodeItem(item) {
  return {
    postalCode: `${item?.postalCode ?? ""}`.trim(),
    name: `${item?.name ?? ""}`.trim(),
    areaName: `${item?.name ?? ""}`.trim(),
    isKnownArea: Boolean(item?.isKnownArea),
    occurrences: Number(item?.occurrences ?? 0),
  };
}

function normalizePostalCodeExtractionResult(result) {
  return {
    success: Boolean(result?.success),
    message: result?.message || "",
    fileName: result?.fileName || "",
    fileType: result?.fileType || "",
    totalFound: Number(result?.totalFound ?? 0),
    uniqueCount: Number(result?.uniqueCount ?? 0),
    postalCodes: Array.isArray(result?.postalCodes)
      ? result.postalCodes.map((code) => `${code ?? ""}`.trim()).filter(Boolean)
      : [],
    items: Array.isArray(result?.items)
      ? result.items.map(normalizeExtractedPostalCodeItem).filter((item) => item.postalCode)
      : [],
    deliveryAreaImportedCount: Number(result?.deliveryAreaImportedCount ?? 0),
    deliveryAreaName: result?.deliveryAreaName || "",
  };
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
      subtitle:
        summary.coveredCities != null && summary.totalCities != null
          ? `${summary.coveredCities}/${summary.totalCities} cities covered`
          : "",
      accent: "soft",
    },
    {
      id: "postalCodes",
      label: "Active Postal Codes",
      value: String(summary.activePostalCodes ?? 0),
      subtitle:
        summary.coveredPostalCodes != null && summary.totalPostalCodes != null
          ? `${summary.coveredPostalCodes}/${summary.totalPostalCodes} postal codes covered`
          : "",
      accent: "warm",
    },
    {
      id: "coverage",
      label: "Platform Coverage",
      value: formatCoveragePercent(summary.platformCoveragePercent),
      subtitle: summary.platformCoverageSubtitle || "",
      detail:
        summary.calculationMethod ||
        "Calculated from active delivery areas vs registered municipalities",
      meta: `Last calculated: ${formatDisplayDateTime(summary.lastCalculatedAt)}`,
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
  });

  const response = data?.adminDeliveryAreas;
  if (!response) {
    throw new Error("Unable to load delivery areas.");
  }

  const baseRows = Array.isArray(response.items)
    ? response.items.map(normalizeAreaListItem)
    : [];

  const rows = await Promise.all(
    baseRows.map(async (row) => {
      if (!row.id) {
        return row;
      }

      try {
        const detailData = await executeProtectedGraphqlRequest(
          ADMIN_DELIVERY_AREA_QUERY,
          { id: row.id },
        );
        const detailArea = detailData?.adminDeliveryArea;

        if (!detailArea?.id) {
          return row;
        }

        const activePostalCodes = countActivePostalAreas(detailArea.postalAreas || []);

        return {
          ...row,
          activePostalCodes,
          coverageType: normalizeCoverageType(
            detailArea?.settings?.coverageType || detailArea?.coverageType,
          ),
        };
      } catch {
        return row;
      }
    }),
  );

  return {
    rows,
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
      countries: Array.isArray(response.filterOptions?.countries)
        ? response.filterOptions.countries
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
      coverageType: getDefaultCoverageType(input?.coverageType),
      maxDeliveryRadius: getDefaultDeliveryRadius(input?.maxDeliveryRadius),
      leadTimeDays: getDefaultLeadTimeDays(input?.leadTimeDays),
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
      coverageType: getDefaultCoverageType(input?.coverageType),
      minimumOrderAmount: parseDecimalOrNull(input?.minimumOrderAmount),
      deliveryFee: parseDecimalOrNull(input?.deliveryFee),
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

export async function deleteDeliveryAreaRequest(id) {
  const data = await executeProtectedGraphqlRequest(DELETE_DELIVERY_AREA_MUTATION, { id });
  const result = data?.deleteDeliveryArea;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to delete delivery area."));
  }

  return {
    message: result.message || "Delivery area deleted successfully.",
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
      deliveryFeeOverride: parseDecimalOrNull(input?.deliveryFeeOverride),
      minimumOrderAmountOverride: parseDecimalOrNull(input?.minimumOrderAmountOverride),
      estimatedDeliveryMinutes: parseNumberOrNull(input?.estimatedDeliveryMinutes),
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
      deliveryFeeOverride: parseDecimalOrNull(input?.deliveryFeeOverride),
      minimumOrderAmountOverride: parseDecimalOrNull(input?.minimumOrderAmountOverride),
      estimatedDeliveryMinutes: parseNumberOrNull(input?.estimatedDeliveryMinutes),
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

export async function extractPostalCodesFromFileRequest(file) {
  if (!(file instanceof File)) {
    throw new Error("Choose a PDF, Excel, CSV, or text file first.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const headers = {};
  const accessToken = getCurrentAccessToken();

  if (accessToken) {
    headers.Authorization = `JWT ${accessToken}`;
  }

  const response = await fetch(`${getDeliveryRestBaseUrl()}/api/extract-postal-codes/`, {
    method: "POST",
    headers,
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "Unable to extract postal codes from this file.");
  }

  return normalizePostalCodeExtractionResult(payload);
}

export async function extractPostalCodesFromTextRequest(text) {
  const trimmedText = `${text ?? ""}`.trim();

  if (!trimmedText) {
    throw new Error("Paste delivery coverage text before extracting postal codes.");
  }

  const data = await executeProtectedGraphqlRequest(
    EXTRACT_POSTAL_CODES_FROM_TEXT_MUTATION,
    { text: trimmedText },
  );
  const result = data?.extractPostalCodesFromText;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to extract postal codes from the pasted text."));
  }

  return normalizePostalCodeExtractionResult(result);
}

export async function bulkImportDeliveryPostalAreasRequest(deliveryAreaId, postalCodes) {
  const normalizedPostalCodes = Array.isArray(postalCodes)
    ? postalCodes.map((code) => `${code ?? ""}`.trim()).filter(Boolean)
    : [];

  if (!deliveryAreaId) {
    throw new Error("Delivery area ID is required for bulk import.");
  }

  if (normalizedPostalCodes.length === 0) {
    throw new Error("No postal codes are available to import.");
  }

  const data = await executeProtectedGraphqlRequest(
    BULK_IMPORT_DELIVERY_POSTAL_AREAS_MUTATION,
    {
      deliveryAreaId,
      postalCodes: normalizedPostalCodes,
    },
  );
  const result = data?.bulkImportDeliveryPostalAreas;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to import postal codes into this delivery area."));
  }

  return {
    message: result.message || "Postal codes imported successfully.",
    importedCount: Number(result?.importedCount ?? 0),
    skippedCount: Number(result?.skippedCount ?? 0),
    postalAreas: Array.isArray(result?.postalAreas)
      ? result.postalAreas.map(normalizePostalArea)
      : [],
  };
}
