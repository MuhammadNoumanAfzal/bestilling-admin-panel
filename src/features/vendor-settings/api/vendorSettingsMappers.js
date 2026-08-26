function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getEdgeNodes(connection) {
  return safeArray(connection?.edges).map((edge) => edge?.node).filter(Boolean);
}

function getCollectionItems(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return getEdgeNodes(value);
}

function normalizeLabel(value) {
  return String(value || "").trim();
}

const ALLOWED_LANGUAGE_DEFINITIONS = [
  { code: "en", label: "English" },
  { code: "no", label: "Norwegian" },
];

const ALLOWED_CURRENCY_DEFINITIONS = [
  { code: "NOK", label: "Norwegian Krone", symbol: "kr" },
];

function mapTaxonomyItem(item, fallbackMeta) {
  return {
    id: item.id || item.slug || item.name,
    name: normalizeLabel(item.name) || normalizeLabel(item.slug),
    meta: item.slug ? `Slug: ${item.slug}` : fallbackMeta,
  };
}

export function mapVendorSettingsTaxonomy(data) {
  const languageItems = getCollectionItems(data?.languages);
  const currencyItems = getCollectionItems(data?.currencies);

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
    languages: ALLOWED_LANGUAGE_DEFINITIONS.map((definition, index) => {
      const matchedItem = languageItems.find(
        (item) => normalizeLabel(item?.code).toLowerCase() === definition.code,
      );

      return {
        id: definition.code,
        name: definition.label,
        meta: `Code: ${definition.code}`,
        raw: {
          code: definition.code,
          label: definition.label,
          isActive: matchedItem?.isActive ?? true,
          sortOrder: matchedItem?.sortOrder ?? index,
        },
      };
    }),
    currencies: ALLOWED_CURRENCY_DEFINITIONS.map((definition, index) => {
      const matchedItem = currencyItems.find(
        (item) => normalizeLabel(item?.code).toUpperCase() === definition.code,
      );

      return {
        id: definition.code,
        name: definition.label,
        meta: [definition.code ? `Code: ${definition.code}` : "", definition.symbol ? `Symbol: ${definition.symbol}` : ""]
          .filter(Boolean)
          .join(" • "),
        raw: {
          code: definition.code,
          label: definition.label,
          symbol: definition.symbol,
          isActive: matchedItem?.isActive ?? true,
          sortOrder: matchedItem?.sortOrder ?? index,
        },
      };
    }),
    timeZones: getCollectionItems(data?.timeZones).map((item) => ({
      id: item.value || item.label,
      name: normalizeLabel(item.label) || normalizeLabel(item.value),
      meta: [item.value ? `Value: ${item.value}` : "", item.utcOffset ? `UTC: ${item.utcOffset}` : ""]
        .filter(Boolean)
        .join(" • "),
      raw: item,
    })),
  };
}
