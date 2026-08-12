function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getEdgeNodes(connection) {
  return safeArray(connection?.edges).map((edge) => edge?.node).filter(Boolean);
}

function normalizeLabel(value) {
  return String(value || "").trim();
}

function mapTaxonomyItem(item, fallbackMeta) {
  return {
    id: item.id || item.slug || item.name,
    name: normalizeLabel(item.name) || normalizeLabel(item.slug),
    meta: item.slug ? `Slug: ${item.slug}` : fallbackMeta,
  };
}

export function mapVendorSettingsTaxonomy(data) {
  const categories = getEdgeNodes(data?.categories).map((item) => ({
    id: item.id || item.name,
    name: normalizeLabel(item.name),
    meta: "Shown in vendor menu category selectors",
    raw: {
      id: item.id || "",
      name: normalizeLabel(item.name),
    },
  }));

  const foodTypes = safeArray(data?.foodTypes).map((item) => ({
    ...mapTaxonomyItem(item, "Shown in vendor food type selectors"),
    raw: item,
  }));

  const occasions = safeArray(data?.occasions).map((item) => ({
    ...mapTaxonomyItem(item, "Shown in vendor occasion selectors"),
    iconUrl: item.iconUrl || "",
    raw: item,
  }));

  const allergens = safeArray(data?.allergens).map((item) => ({
    ...mapTaxonomyItem(item, "Shown on vendor menu item allergen pickers"),
    raw: item,
  }));

  return {
    categories,
    foodTypes,
    occasions,
    allergens,
    dietaryTags: safeArray(data?.dietaryTags).map((item) => ({
      ...mapTaxonomyItem(item, "Shown in vendor dietary tag selectors"),
      raw: item,
    })),
    cuisineTypes: safeArray(data?.cuisineTypes).map((item) => ({
      ...mapTaxonomyItem(item, "Shown in vendor operating information"),
      raw: item,
    })),
    businessTypes: safeArray(data?.businessTypes).map((item) => ({
      ...mapTaxonomyItem(item, "Shown in vendor business-type selectors"),
      raw: item,
    })),
    languages: safeArray(data?.languages).map((item) => ({
      id: item.code || item.label,
      name: normalizeLabel(item.label) || normalizeLabel(item.code),
      meta: item.code ? `Code: ${item.code}` : "Shown in vendor language selectors",
      raw: item,
    })),
    currencies: safeArray(data?.currencies).map((item) => ({
      id: item.code || item.label,
      name: normalizeLabel(item.label) || normalizeLabel(item.code),
      meta: [item.code ? `Code: ${item.code}` : "", item.symbol ? `Symbol: ${item.symbol}` : ""]
        .filter(Boolean)
        .join(" • "),
      raw: item,
    })),
    timeZones: safeArray(data?.timeZones).map((item) => ({
      id: item.value || item.label,
      name: normalizeLabel(item.label) || normalizeLabel(item.value),
      meta: [item.value ? `Value: ${item.value}` : "", item.utcOffset ? `UTC: ${item.utcOffset}` : ""]
        .filter(Boolean)
        .join(" • "),
      raw: item,
    })),
  };
}
