import { getCurrentAccessToken } from "../../../app/api/protectedGraphqlClient.js";

const DEFAULT_GRAPHQL_API_URL = "https://api.gocatering.no/graphql/";
const graphQlUrl = import.meta.env.VITE_GRAPHQL_API_URL ?? import.meta.env.VITE_GRAPHQL_URL ?? DEFAULT_GRAPHQL_API_URL;
const uploadUrl = new URL("/uploads/images", graphQlUrl).toString();
const MAX_ICON_SIZE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_ICON_TYPES = new Set(["image/png", "image/webp", "image/jpeg"]);

export async function uploadTaxonomyIcon(file) {
  if (!(file instanceof File)) {
    throw new Error("Choose an image file to upload.");
  }
  if (!ACCEPTED_ICON_TYPES.has(file.type)) {
    throw new Error("Choose a PNG, WebP, or JPEG image.");
  }
  if (file.size > MAX_ICON_SIZE_BYTES) {
    throw new Error("The image must be 2 MB or smaller.");
  }

  const token = getCurrentAccessToken();
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const body = new FormData();
  body.append("file", file);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success || !result?.url) {
    throw new Error(result?.message || "Image upload failed. Please try again.");
  }
  return result.url;
}
