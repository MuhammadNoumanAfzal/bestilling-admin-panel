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

      <div className="mt-4 rounded-[14px] bg-[#f5f6f8] px-4 py-3.5">
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

      <button
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[#ef9f7f] bg-white px-3 text-[13px] font-semibold text-[#cf6e38] transition hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <BadgeCheck size={15} />
        <span>{buttonLabel}</span>
      </button>
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

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PaymentActionCard
        buttonLabel={
          customerStatus === "Paid"
            ? "Already Received"
            : isUpdatingCustomerPayment
              ? "Updating..."
              : "Mark as Received"
        }
        description="Customer pays manually by bank transfer against the invoice reference."
        details={[
          { label: "Invoice", value: payout.invoiceNumber },
          { label: "Customer", value: payout.customer.fullName },
        ]}
        disabled={isUpdatingCustomerPayment || customerStatus === "Paid"}
        icon={FileText}
        onClick={onMarkReceived}
        status={customerStatus}
        title="Customer Payment"
      />
      <PaymentActionCard
        buttonLabel={
          payoutStatus === "Paid"
            ? "Already Paid"
            : isUpdatingVendorPayout
              ? "Updating..."
              : "Mark as Paid"
        }
        description="Admin sends the vendor payout manually after customer payment is confirmed."
        details={[
          { label: "Vendor", value: payout.vendor.name },
          { label: "Payout", value: payout.financials.vendorAmount },
        ]}
        disabled={
          isUpdatingVendorPayout ||
          payoutStatus === "Paid" ||
          customerStatus !== "Paid"
        }
        icon={CreditCard}
        onClick={onMarkPaid}
        status={payoutStatus}
        title="Vendor Payout"
      />
      <PaymentActionCard
        buttonLabel={
          customerStatus === "Reported"
            ? isApprovingInvoice
              ? "Approving..."
              : "Approve Reported Payment"
            : customerStatus === "Paid"
              ? "Already Approved"
              : isMarkingInvoicePaid
                ? "Updating..."
                : "Mark Invoice Paid"
        }
        description="Review the customer payment report or manually confirm the invoice payment from the bank statement."
        details={[
          { label: "Invoice", value: payout.invoiceNumber },
          { label: "Customer status", value: customerStatus },
        ]}
        disabled={
          isApprovingInvoice ||
          isMarkingInvoicePaid ||
          customerStatus === "Paid" ||
          customerStatus === "Rejected"
        }
        icon={BadgeCheck}
        onClick={customerStatus === "Reported" ? onApproveInvoice : onMarkInvoicePaid}
        status={customerStatus}
        title="Invoice Review"
      />
      <PaymentActionCard
        buttonLabel={
          payoutStatus === "Released"
            ? "Already Released"
            : payoutStatus === "Paid"
              ? "Already Paid"
              : isReleasingVendorPayout
                ? "Releasing..."
                : customerStatus === "Reported"
                  ? isRejectingInvoice
                    ? "Rejecting..."
                    : "Reject Invoice Report"
                  : "Release Payout"
        }
        description={
          customerStatus === "Reported"
            ? "Reject the reported customer payment if the transfer proof or reference does not match."
            : "Release the vendor payout once the customer payment has been verified."
        }
        details={[
          { label: customerStatus === "Reported" ? "Invoice" : "Vendor" , value: customerStatus === "Reported" ? payout.invoiceNumber : payout.vendor.name },
          { label: customerStatus === "Reported" ? "Current status" : "Payout", value: customerStatus === "Reported" ? customerStatus : payout.financials.vendorAmount },
        ]}
        disabled={
          customerStatus === "Reported"
            ? isRejectingInvoice || customerStatus === "Paid"
            : isReleasingVendorPayout ||
              payoutStatus === "Released" ||
              payoutStatus === "Paid" ||
              customerStatus !== "Paid"
        }
        icon={CreditCard}
        onClick={customerStatus === "Reported" ? onRejectInvoice : onReleasePayout}
        status={customerStatus === "Reported" ? customerStatus : payoutStatus}
        title={customerStatus === "Reported" ? "Reject Report" : "Release Payout"}
      />
    </div>
  );
}
