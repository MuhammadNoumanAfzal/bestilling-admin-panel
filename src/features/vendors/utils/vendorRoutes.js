export function getVendorSlug(name) {
  return `${name ?? ""}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getVendorDetailPath(vendor) {
  const slug = getVendorSlug(typeof vendor === "string" ? vendor : vendor?.name);
  return slug ? `/vendors/${encodeURIComponent(slug)}` : "/vendors";
}
