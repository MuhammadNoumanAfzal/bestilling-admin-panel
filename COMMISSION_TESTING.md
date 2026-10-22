# Commission acceptance testing

Run against approved test vendors and test orders only.
Backend migrations core.0017 and sales.0039 must be deployed first.

## Setup

- Global commission: 5%.
- Oslo area commission: 15%.
- Vendor A vendor-wide commission: 10%, with no area or dates required.
- Vendor B: no vendor override.
- Preserve a test legacy vendor+area rule at 12% for Vendor C in Oslo.

## Settings

1. Open Payouts > Commission Settings > Add Vendor Commission.
2. Select Vendor A, enter 10 and save without an area or dates.
3. Reload: the row must say All delivery areas (Alle leveringsområder).
4. Edit the percentage to 11, save/reload, then restore 10.
5. Open the Area Commission dialog. Filter by Region or County, search,
   and use next/previous pages if available.
6. Select a large test area and save a rule. Test delivery postal codes
   inside different child areas and one outside its coverage.
7. Edit Vendor C's legacy rule: area must remain read-only, with no silent
   conversion into a vendor-wide commission.

## Resolution

For new test orders, inspect the admin order Commission Preview and backend
commissionPreviewForOrder response. Compare ratePercent, appliedRuleSource,
appliedRuleId and appliedRuleLabel against the configured rule.

| Scenario | Expected rate |
| --- | --- |
| Vendor A, Oslo delivery | 10% |
| Vendor A, outside Oslo | 10% |
| Vendor B, Oslo delivery | 15% |
| Vendor B, outside all area rules | 5% |
| Vendor C, Oslo, legacy matching rule | 12% |
| Vendor C, outside legacy area and all area rules | 5% |

- Add a vendor-wide override for Vendor C: it must take priority over legacy.
- Remove it: legacy matching must work again for new orders.
- Where a region and a smaller area overlap, the most-specific matching rule
  must win unless a vendor-wide or matching legacy vendor-area rule exists.
- Match by the customer's delivery postal code, not the vendor address.
- Compare monetary amounts with backend preview/snapshots, including its
  commission base and VAT policy; do not assume totalCommission equals
  grossOrderAmount multiplied by the rate.

## Validation and History

- Invalid rates below 0 or above 100 must fail.
- Overlapping active rules and end dates before start dates must fail.
- Future/expired rules must follow backend effective-date semantics.
- Non-admin queries/mutations must be rejected by the backend.
- Record existing order/payout amounts, change current commission settings,
  and reload those records: historical snapshot amounts must stay unchanged.
- Delete test rules and restore original settings after testing.

Local unit tests/build do not substitute for these authenticated API checks.
