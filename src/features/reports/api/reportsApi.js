import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  buildReportsSnapshotViewModel,
  exportSectionOptions,
} from "../reportsUtils.js";
import {
  ADMIN_REPORTS_SNAPSHOT_QUERY,
  EXPORT_ADMIN_REPORT_MUTATION,
} from "./reportsQueries.js";

const DEFAULT_GRAPHQL_API_URL = "https://api.gocatering.no/graphql/";
const GRAPHQL_API_URL =
  import.meta.env.VITE_GRAPHQL_API_URL ??
  import.meta.env.VITE_GRAPHQL_URL ??
  DEFAULT_GRAPHQL_API_URL;

function getReportsErrorMessage(result, fallbackMessage) {
  return result?.message || result?.errors?.find?.((item) => item?.message)?.message || fallbackMessage;
}

function normalizeExportUrl(exportUrl) {
  const rawValue = `${exportUrl ?? ""}`.trim();

  if (!rawValue) {
    return "";
  }

  try {
    return new URL(rawValue).toString();
  } catch {
    return new URL(rawValue, GRAPHQL_API_URL).toString();
  }
}

export async function getAdminReportsSnapshotRequest(filters) {
  const data = await executeProtectedGraphqlRequest(ADMIN_REPORTS_SNAPSHOT_QUERY, {
    dateFrom: filters?.dateFrom || null,
    dateTo: filters?.dateTo || null,
    timezone: filters?.timezone || "UTC",
  });
  const snapshot = data?.adminReportsSnapshot;

  if (!snapshot) {
    throw new Error("Unable to load reports snapshot.");
  }

  return {
    fallbackMeta: {
      isFallback: false,
      reason: "",
      filterLabel: filters?.filterLabel || "Last 7 days",
    },
    ...buildReportsSnapshotViewModel(snapshot, filters?.filterLabel || "Last 7 days"),
  };
}

export async function exportAdminReportRequest(input) {
  const data = await executeProtectedGraphqlRequest(EXPORT_ADMIN_REPORT_MUTATION, {
    input: {
      dateFrom: input?.dateFrom || null,
      dateTo: input?.dateTo || null,
      timezone: input?.timezone || "UTC",
      format: input?.format || "PDF",
      sections: input?.sections?.length ? input.sections : exportSectionOptions,
    },
  });

  const result = data?.exportAdminReport;
  if (!result?.success || !result?.exportUrl) {
    throw new Error(getReportsErrorMessage(result, "Unable to export report."));
  }

  return {
    ...result,
    exportUrl: normalizeExportUrl(result.exportUrl),
  };
}
