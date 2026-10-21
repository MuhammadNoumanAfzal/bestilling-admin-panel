# Admin Vendor Status Changes

Suspension uses updateVendorStatus(id, status: SUSPENDED, reason).
Soft deactivation uses updateVendorStatus(id, status: DEACTIVATED, reason).
Reactivation uses updateVendorStatus(id, status: ACTIVE, reason).
These operations must not delete the vendor or cancel existing orders.

Required backend policy:
- Only authorized administrators may change these statuses.
- Active orders must not prevent suspension or soft deactivation.
- Hide suspended/deactivated vendors and reject new orders for them server-side.
- Preserve existing orders, invoices, payments, and history; keep their fulfilment
  accessible to the responsible operators. Do not cancel/refund them implicitly.
- Record actor, old/new status, reason, and timestamp in the audit history.
- Apply the same policy to deactivateVendor if retained for older clients.

Verification:
1. Use a vendor with an active order. Suspend it and verify returned SUSPENDED.
2. Reload its admin details; verify status persists and existing order is unchanged.
3. Verify public listings hide it and backend creation rejects new orders.
4. Reactivate; repeat with DEACTIVATED, confirming financial records remain intact.
5. Verify non-admin callers cannot make either change.

Frontend must honor server rejection, not display optimistic success. If the
status mutation rejects active orders, update its backend validation. The backend
source is not included in this workspace.
