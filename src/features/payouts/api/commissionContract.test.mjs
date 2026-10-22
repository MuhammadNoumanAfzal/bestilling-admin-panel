import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { COMMISSION_AREA_OPTIONS_QUERY, CREATE_VENDOR_COMMISSION_MUTATION } from "./commissionQueries.js";

const source = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("area options use the paginated hierarchy contract", () => {
  for (const field of ["commissionAreaOptionsPage", "$areaType", "$page", "$pageSize", "parentArea", "coverage", "postalCodeCount", "hasNextPage"]) {
    assert.ok(COMMISSION_AREA_OPTIONS_QUERY.includes(field), field);
  }
  assert.ok(CREATE_VENDOR_COMMISSION_MUTATION.includes("CreateVendorCommissionInput!"));
});

test("new vendor rules are vendor-wide while edits preserve legacy area scope", () => {
  const api = source("./commissionApi.js");
  const create = api.split("export async function createVendorCommissionRequest")[1].split("export async function updateVendorCommissionRequest")[0];
  const update = api.split("export async function updateVendorCommissionRequest")[1].split("export async function deleteVendorCommissionRequest")[0];
  assert.match(create, /areaId: null/);
  assert.doesNotMatch(update, /areaId:/);
  assert.match(api, /All delivery areas/);
});

test("vendor form requires no area or start date and keeps legacy scope read-only", () => {
  const page = source("../pages/CommissionSettingsPage.jsx");
  const validation = page.split("async function handleVendorSubmit()")[1].split("const dateRangeError")[0];
  assert.doesNotMatch(validation, /vendorForm\.areaId|vendorForm\.effectiveFrom/);
  assert.match(page, /label: "Legacy area",[\s\S]*?readOnly: true/);
  assert.match(page, /page: areaPage/);
});

test("historical payout display never recomputes commission from current settings", () => {
  const api = source("./paymentsApi.js");
  assert.match(api, /function applyCommissionDisplayFallback\(record\)\s*{\s*return record;/);
  assert.match(api, /function applyCommissionDisplayFallbackToPaymentList\(result\)\s*{\s*return result;/);
  assert.doesNotMatch(api, /resolveConfiguredCommissionRate|function applyCommissionFallback/);
});
