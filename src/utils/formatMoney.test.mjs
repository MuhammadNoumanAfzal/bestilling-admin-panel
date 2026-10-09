import assert from "node:assert/strict";
import { test } from "node:test";
import { formatMoney, parseMoney } from "./formatMoney.js";
import { mapHomeCurationPage } from "../features/home-curation/api/homeCurationMappers.js";
import { buildVendorPerformanceViewModel } from "../features/reports/reportsUtils.js";

test("admin money matches client and vendor formatting", () => {
  assert.equal(formatMoney(680), "680,-");
  assert.equal(formatMoney(5000), "5 000,-");
  assert.equal(formatMoney(0), "0,-");
  assert.equal(formatMoney(-680), "-680,-");
  assert.equal(formatMoney(680.5), "680,50");
  assert.equal(formatMoney(652.17), "652,17");
});

test("backend-formatted amounts are normalized accurately", () => {
  for (const value of ["5 000,-", "5\u00a0000,-", "NOK 5,000.00", "kr 5.000,00", { amount: "5000.00" }]) {
    assert.equal(parseMoney(value), 5000);
    assert.equal(formatMoney(value), "5 000,-");
  }
  assert.equal(formatMoney({ formatted: "NOK 680.50" }), "680,50");
  assert.equal(parseMoney("-680,50"), -680.5);
  assert.equal(formatMoney(null), "0,-");
  assert.equal(formatMoney(NaN), "0,-");
});

test("curation menu labels preserve units without duplicate suffixes", () => {
  const labels = ["NOK 680.00 per person", "680,- per person", "680,50 kr per person"];
  const result = mapHomeCurationPage({
    adminHomeCuration: { popularProducts: labels.map((priceLabel) => ({ priceLabel })) },
  });
  assert.deepEqual(result.curated.popularProducts.map((item) => item.priceLabel),
    ["680,- per person", "680,- per person", "680,50 per person"]);
});

test("report vendor revenue uses shared money formatting", () => {
  const report = buildVendorPerformanceViewModel({
    topVendors: [{ revenue: { formatted: "NOK 5,000.00" } }],
  });
  assert.equal(report.vendors[0].revenue, "5 000,-");
});
