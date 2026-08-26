import { BadgeCheck, CreditCard, FileText } from "lucide-react";

function StatusDot({ label }) {
  return (
    <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#cf6e38]">
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[14px] text-[#4f433d]">{label}</span>
      <span className="text-[14px] font-semibold text-[#18120f]">{value}</span>
    </div>
  );
}

function PaymentActionCard({
  buttonLabel,
  description,
  details,
  disabled = false,
  icon: Icon,
  onClick,
  secondaryButtonLabel = "",
  secondaryDisabled = false,
  onSecondaryClick,
  status,
  title,
}) {
  return (
    <section className="rounded-[18px] border border-[#ddd4cd] bg-white p-4 shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-bold text-[#221914]">{title}</h3>
          <p className="mt-1.5 text-[14px] leading-6 text-[#5f534c]">{description}</p>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#f4f7ff] text-[#657aab]">
          <Icon size={18} />
        </span>
      </div>

      <div className="mt-4 rounded-[16px] border border-[#ece5df] bg-[linear-gradient(180deg,#f7f7f8_0%,#fefdfc_100%)] px-4 py-3.5">
        <div className="space-y-2.5">
          {details.map((detail) => (
            <DetailRow key={detail.label} label={detail.label} value={detail.value} />
          ))}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] text-[#4f433d]">Status</span>
            <StatusDot label={status} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[14px] border border-[#ef9f7f] bg-white px-3 text-[13px] font-semibold text-[#cf6e38] transition hover:-translate-y-[1px] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={onClick}
          type="button"
        >
          <BadgeCheck size={15} />
          <span>{buttonLabel}</span>
        </button>
        {secondaryButtonLabel ? (
          <button
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border border-[#eadccd] bg-[#fffaf6] px-3 text-[12px] font-semibold text-[#8a5b16] transition hover:bg-[#fff2e7] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={secondaryDisabled}
            onClick={onSecondaryClick}
            type="button"
          >
            <span>{secondaryButtonLabel}</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default function PaymentStatusCards({
  isApprovingInvoice = false,
  isRejectingInvoice = false,
  isUpdatingCustomerPayment = false,
  isReleasingVendorPayout = false,
  isUpdatingVendorPayout = false,
  onApproveInvoice,
  onRejectInvoice,
  onReleasePayout,
  onMarkPaid,
  onMarkReceived,
  payout,
  onMarkInvoicePaid,
  isMarkingInvoicePaid = false,
}) {
  const customerStatus = payout.statuses.customerPaymentStatus;
  const payoutStatus = payout.statuses.vendorPayoutStatus;
  const payoutProfile = payout.vendor?.payoutProfile;
  const isBankProfileVerified = Boolean(payoutProfile?.bankDetailsVerified);
  const isReported = customerStatus === "Reported";
  const isPaid = customerStatus === "Paid";
  const isRejected = customerStatus === "Rejected";
  const isPendingCustomerPayment = customerStatus === "Pending";
  const canManualMarkInvoicePaid = !isReported && !isPaid && !isRejected && !isPendingCustomerPayment;
  const customerPrimaryLabel = isReported
    ? isApprovingInvoice
      ? "Approving..."
      : "Approve Reported Payment"
    : isPendingCustomerPayment
      ? isUpdatingCustomerPayment
        ? "Updating..."
        : "Mark as Received"
      : isPaid
        ? "Already Paid"
        : isRejected
          ? "Waiting for Resubmission"
          : isMarkingInvoicePaid
            ? "Updating..."
            : "Mark Invoice Paid";
  const customerPrimaryAction = isReported
    ? onApproveInvoice
    : isPendingCustomerPayment
      ? onMarkReceived
      : onMarkInvoicePaid;
  const vendorPrimaryLabel =
    payoutStatus === "Paid"
      ? "Already Paid"
      : payoutStatus === "Released"
        ? isUpdatingVendorPayout
          ? "Updating..."
          : "Mark as Paid"
        : isReleasingVendorPayout
          ? "Releasing..."
          : "Release Payout";
  const vendorPrimaryAction =
    payoutStatus === "Released" || payoutStatus === "Paid" ? onMarkPaid : onReleasePayout;
  const vendorPrimaryDisabled =
    payoutStatus === "Paid"
      ? true
      : payoutStatus === "Released"
        ? isUpdatingVendorPayout
        : isReleasingVendorPayout || !isPaid || !isBankProfileVerified;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PaymentActionCard
        buttonLabel={customerPrimaryLabel}
        description={
          isReported
            ? "Review the reported payment and confirm it against the bank statement."
            : isPendingCustomerPayment
              ? "Customer payment is still waiting for manual confirmation."
              : isRejected
                ? "The reported payment was rejected and is waiting for corrected resubmission."
                : "Use this card to confirm customer-side invoice payment activity."
        }
        details={[
          { label: "Invoice", value: payout.invoiceNumber },
          { label: "Customer", value: payout.customer.fullName },
        ]}
        disabled={
          isReported
            ? isApprovingInvoice
            : isPendingCustomerPayment
              ? isUpdatingCustomerPayment
              : isPaid
                ? true
                : isRejected
                  ? true
                  : isMarkingInvoicePaid || !canManualMarkInvoicePaid
        }
        icon={FileText}
        onClick={customerPrimaryAction}
        onSecondaryClick={isReported ? onRejectInvoice : undefined}
        secondaryButtonLabel={isReported ? (isRejectingInvoice ? "Rejecting..." : "Reject Report") : ""}
        secondaryDisabled={isRejectingInvoice}
        status={customerStatus}
        title="Customer / Invoice Payment"
      />
      <PaymentActionCard
        buttonLabel={vendorPrimaryLabel}
        description={
          payoutStatus === "Released"
            ? "The payout is already released. Use this to confirm the outbound transfer is completed."
            : "Release the vendor payout after customer payment is approved, then mark it paid once the transfer is sent."
        }
        details={[
          { label: "Vendor", value: payout.vendor.name },
          { label: "Payout", value: payout.financials.vendorAmount },
        ]}
        disabled={vendorPrimaryDisabled}
        icon={CreditCard}
        onClick={vendorPrimaryAction}
        status={payoutStatus}
        title="Vendor Payout"
      />
    </div>
  );
}
