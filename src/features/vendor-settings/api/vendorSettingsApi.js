import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  CREATE_ALLERGEN_MUTATION,
  CREATE_DIETARY_TAG_MUTATION,
  CREATE_FOOD_TYPE_MUTATION,
  CREATE_OCCASION_MUTATION,
  CREATE_VENDOR_CATEGORY_MUTATION,
  DELETE_DIETARY_TAG_MUTATION,
  DELETE_FOOD_TYPE_MUTATION,
  DELETE_OCCASION_MUTATION,
  DELETE_VENDOR_CATEGORY_MUTATION,
  GET_VENDOR_SETTINGS_TAXONOMY_QUERY,
} from "./vendorSettingsQueries.js";

function unwrapSuccessfulResult(result, key, fallbackMessage) {
  const payload = result?.[key];
  const firstValidationError = Array.isArray(payload?.errors)
    ? payload.errors.find((error) => error?.message)
    : null;

  if (!payload?.success) {
    throw new Error(firstValidationError?.message || payload?.message || fallbackMessage);
  }

  return payload;
}

export function getVendorSettingsTaxonomyRequest() {
  return executeProtectedGraphqlRequest(GET_VENDOR_SETTINGS_TAXONOMY_QUERY, {});
}

export async function saveVendorCategoryRequest(input) {
  const variables =
    typeof input === "string"
      ? { name: input }
      : { id: input?.id || null, name: input?.name || "" };

  const result = await executeProtectedGraphqlRequest(CREATE_VENDOR_CATEGORY_MUTATION, {
    input: variables,
  });

  return unwrapSuccessfulResult(
    result,
    "vendorCategoryMutation",
    "Unable to save the vendor category.",
  );
}

export async function saveFoodTypeRequest(input) {
  const variables =
    typeof input === "string"
      ? { name: input }
      : { id: input?.id || null, name: input?.name || "" };

  const result = await executeProtectedGraphqlRequest(CREATE_FOOD_TYPE_MUTATION, {
    input: variables,
  });

  return unwrapSuccessfulResult(result, "foodTypeMutation", "Unable to save the food type.");
}

export async function saveOccasionRequest(input) {
  const variables =
    typeof input === "string"
      ? { name: input }
      : {
          name: input?.name || "",
          id: input?.id || null,
          slug: input?.slug || null,
          description: input?.description || null,
          iconUrl: input?.iconUrl || null,
          coverImageUrl: input?.coverImageUrl || null,
          isActive: typeof input?.isActive === "boolean" ? input.isActive : null,
          sortOrder: Number.isInteger(input?.sortOrder) ? input.sortOrder : null,
        };

  const result = await executeProtectedGraphqlRequest(CREATE_OCCASION_MUTATION, {
    ...variables,
  });

  return unwrapSuccessfulResult(result, "occasionMutation", "Unable to save the occasion.");
}

export async function saveAllergenRequest(input) {
  const variables =
    typeof input === "string"
      ? { name: input }
      : { id: input?.id || null, name: input?.name || "" };

  const result = await executeProtectedGraphqlRequest(CREATE_ALLERGEN_MUTATION, {
    input: variables,
  });

  return unwrapSuccessfulResult(result, "allergenMutation", "Unable to save the allergen.");
}

export async function saveDietaryTagRequest(input) {
  const variables =
    typeof input === "string"
      ? { name: input, isActive: true }
      : {
          id: input?.id || null,
          name: input?.name || "",
          slug: input?.slug || null,
          isActive: typeof input?.isActive === "boolean" ? input.isActive : true,
          sortOrder: Number.isInteger(input?.sortOrder) ? input.sortOrder : null,
        };

  const result = await executeProtectedGraphqlRequest(CREATE_DIETARY_TAG_MUTATION, {
    input: variables,
  });

  return unwrapSuccessfulResult(
    result,
    "dietaryTagMutation",
    "Unable to save the dietary tag.",
  );
}

export async function deleteVendorCategoryRequest(id) {
  const result = await executeProtectedGraphqlRequest(DELETE_VENDOR_CATEGORY_MUTATION, { id });
  return unwrapSuccessfulResult(
    result,
    "vendorCategoryDelete",
    "Unable to delete the vendor category.",
  );
}

export async function deleteFoodTypeRequest(id) {
  const result = await executeProtectedGraphqlRequest(DELETE_FOOD_TYPE_MUTATION, { id });
  return unwrapSuccessfulResult(result, "foodTypeDelete", "Unable to delete the food type.");
}

export async function deleteOccasionRequest(id) {
  const result = await executeProtectedGraphqlRequest(DELETE_OCCASION_MUTATION, { id });
  return unwrapSuccessfulResult(result, "occasionDelete", "Unable to delete the occasion.");
}

export async function deleteDietaryTagRequest(id) {
  const result = await executeProtectedGraphqlRequest(DELETE_DIETARY_TAG_MUTATION, { id });
  return unwrapSuccessfulResult(
    result,
    "dietaryTagDelete",
    "Unable to delete the dietary tag.",
  );
}
