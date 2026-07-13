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
        className="mt-4 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-[#ef9f7f] bg-white px-3 text-[13px] font-semibold text-[#cf6e38] transition hover:bg-[#fff5ef]"
        onClick={onClick}
        type="button"
      >
        <BadgeCheck size={15} />
        <span>{buttonLabel}</span>
      </button>
    </section>
  );
}

export default function PaymentStatusCards({ onMarkPaid, onMarkReceived, payout }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PaymentActionCard
        buttonLabel="Mark as Received"
        description="Customer pays manually via invoice."
        details={[
          { label: "Invoice", value: payout.invoiceNumber },
          { label: "Customer", value: payout.customer },
        ]}
        icon={FileText}
        onClick={onMarkReceived}
        status={payout.orderPayment}
        title="Customer Payment"
      />
      <PaymentActionCard
        buttonLabel="Mark as Paid"
        description="Processed manually after customer payment."
        details={[
          { label: "Vendor", value: payout.vendorName },
          { label: "Payout", value: payout.vendorAmount },
        ]}
        icon={CreditCard}
        onClick={onMarkPaid}
        status={payout.payoutStatus}
        title="Vendor Payout"
      />
    </div>
  );
}
