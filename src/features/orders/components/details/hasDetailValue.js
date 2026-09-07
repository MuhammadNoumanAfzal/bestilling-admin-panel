export function hasDetailValue(value) {
  if (value === null || value === undefined) return false;
  return !["", "not provided", "not available", "not scheduled", "not specified", "n/a", "no special instructions added."].includes(String(value).trim().toLowerCase());
}
