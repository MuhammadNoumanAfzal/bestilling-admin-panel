import { formatMoney } from "../../../utils/formatMoney.js";

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function formatPriceLabel(value) {
  if (!value) return "";
  const match = String(value).trim().match(/^(?:NOK|kr)?\s*(-?\d(?:[\d\s.,]*\d)?(?:,-)?)(?:\s*(?:NOK|kr))?(.*)$/i);
  if (!match) return value;
  return [formatMoney(match[1]), match[2].trim()].filter(Boolean).join(" ");
}

function formatRating(value) {
  const nextValue = Number(value ?? 0);
  return Number.isFinite(nextValue) ? nextValue.toFixed(1) : "0.0";
}

function getVendorRating(item) {
  return (
    item?.rating ??
    item?.averageRating ??
    item?.ratingValue ??
    item?.reviewSummary?.averageRating ??
    item?.reviews?.summary?.averageRating ??
    0
  );
}

function mapVendorCard(item) {
  return {
    id: item?.id || "",
    name: item?.name || "Unknown vendor",
    city: item?.city || "Unknown city",
    rating: formatRating(getVendorRating(item)),
    avatarUrl: item?.avatarUrl || "",
    imageUrl: item?.coverPhotoUrl || item?.avatarUrl || "",
    deliveryFeeLabel: formatPriceLabel(item?.deliveryFeeLabel),
    isPopular: Boolean(item?.isPopular),
    isFeatured: Boolean(item?.isFeatured),
  };
}

function mapProductCard(item) {
  return {
    id: item?.id || "",
    name: item?.name || "Untitled product",
    description: item?.description || "",
    priceLabel: formatPriceLabel(item?.priceLabel),
    imageUrl: item?.imageUrl || "",
    isPopular: Boolean(item?.isPopular),
    menuStatus: item?.menuStatus || "",
    vendor: {
      id: item?.vendor?.id || "",
      name: item?.vendor?.name || "Unknown vendor",
      city: item?.vendor?.city || "",
      avatarUrl: item?.vendor?.avatarUrl || "",
    },
  };
}

export function mapHomeCurationPage(data) {
  return {
    curated: {
      popularVendors: safeArray(data?.adminHomeCuration?.popularVendors).map(mapVendorCard),
      featuredVendors: safeArray(data?.adminHomeCuration?.featuredVendors).map(mapVendorCard),
      popularProducts: safeArray(data?.adminHomeCuration?.popularProducts).map(mapProductCard),
    },
    options: {
      vendors: safeArray(data?.adminHomeCurationBootstrap?.vendors).map(mapVendorCard),
      products: safeArray(data?.adminHomeCurationBootstrap?.products).map(mapProductCard),
    },
  };
}
