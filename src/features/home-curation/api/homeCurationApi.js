import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADMIN_HOME_CURATION_QUERY,
  UPDATE_PRODUCT_HOME_CURATION_MUTATION,
  UPDATE_VENDOR_HOME_CURATION_MUTATION,
} from "./homeCurationQueries.js";

function unwrapMutationResult(result, key, fallbackMessage) {
  const payload = result?.[key];
  const firstValidationError = Array.isArray(payload?.errors)
    ? payload.errors.find((item) => item?.message)
    : null;

  if (!payload?.success) {
    throw new Error(firstValidationError?.message || payload?.message || fallbackMessage);
  }

  return payload;
}

export function getAdminHomeCurationPageRequest() {
  return executeProtectedGraphqlRequest(ADMIN_HOME_CURATION_QUERY, {});
}

export async function updateVendorHomeCurationRequest(id, input) {
  const result = await executeProtectedGraphqlRequest(UPDATE_VENDOR_HOME_CURATION_MUTATION, {
    id,
    input: {
      isPopular: Boolean(input?.isPopular),
      isFeatured: Boolean(input?.isFeatured),
    },
  });

  return unwrapMutationResult(
    result,
    "updateVendorHomeCuration",
    "Unable to update vendor home curation.",
  );
}

export async function updateProductHomeCurationRequest(id, input) {
  const result = await executeProtectedGraphqlRequest(UPDATE_PRODUCT_HOME_CURATION_MUTATION, {
    id,
    input: {
      isPopular: Boolean(input?.isPopular),
    },
  });

  return unwrapMutationResult(
    result,
    "updateProductHomeCuration",
    "Unable to update product home curation.",
  );
}
