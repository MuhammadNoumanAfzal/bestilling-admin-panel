function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getEdgeNodes(connection) {
  return safeArray(connection?.edges).map((edge) => edge?.node).filter(Boolean);
}

function normalizeLabel(value) {
  return String(value || "").trim();
}

export function mapVendorSettingsTaxonomy(data) {
  const categories = getEdgeNodes(data?.categories).map((item) => ({
    id: item.id || item.name,
    name: normalizeLabel(item.name),
    meta: "Shown in vendor menu category selectors",
  }));

  const foodTypes = safeArray(data?.foodTypes).map((item) => ({
    id: item.id || item.slug || item.name,
    name: normalizeLabel(item.name) || normalizeLabel(item.slug),
    meta: item.slug ? `Slug: ${item.slug}` : "Shown in vendor food type selectors",
  }));

  const occasions = safeArray(data?.occasions).map((item) => ({
    id: item.id || item.slug || item.name,
    name: normalizeLabel(item.name) || normalizeLabel(item.slug),
    meta: item.slug ? `Slug: ${item.slug}` : "Shown in vendor occasion selectors",
    iconUrl: item.iconUrl || "",
  }));

  const allergens = safeArray(data?.allergens).map((item) => ({
    id: item.id || item.slug || item.name,
    name: normalizeLabel(item.name) || normalizeLabel(item.slug),
    meta: item.slug ? `Slug: ${item.slug}` : "Shown on vendor menu item allergen pickers",
  }));

  const dietaryTagSet = new Set();

  [...getEdgeNodes(data?.vendorMenus), ...getEdgeNodes(data?.vendorAddOns)].forEach((item) => {
    safeArray(item?.dietaryTags).forEach((tag) => {
      const normalized = normalizeLabel(tag);
      if (normalized) {
        dietaryTagSet.add(normalized);
      }
    });
  });

  return {
    categories,
    foodTypes,
    occasions,
    allergens,
    dietaryTags: Array.from(dietaryTagSet).sort((left, right) => left.localeCompare(right)),
  };
}
