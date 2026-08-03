import { CircleAlert } from "lucide-react";

function InfoCell({ accent = false, label, value }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9b8f86]">{label}</p>
      <p className={`text-[15px] font-semibold ${accent ? "text-[#cf6e38]" : "text-[#18120f]"}`}>{value}</p>
    </div>
  );
}

export default function PaymentDetailsInfoCard({ payout }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[#ddd4cd] bg-white shadow-[0_12px_30px_rgba(55,31,13,0.05)]">
      <div className="flex flex-col gap-3 border-b border-[#eee5de] bg-[linear-gradient(180deg,#fff8f3_0%,#ffffff_100%)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[#221914]">
          <CircleAlert size={16} className="text-[#cf6e38]" />
          <h2 className="text-[18px] font-bold">Order Information</h2>
        </div>

        <span className="inline-flex items-center self-start rounded-full border border-[#ead8cc] bg-[#fcf8f5] px-3 py-1 text-[12px] font-bold text-[#3b2f29] sm:self-auto">
          {payout.order.id || payout.id}
        </span>
      </div>

      <div className="grid gap-6 px-5 py-5 sm:grid-cols-2 xl:grid-cols-3">
        <InfoCell label="Invoice Number" value={payout.invoiceNumber} />
        <InfoCell label="Customer Name" value={payout.customer.fullName} />
        <InfoCell accent label="Vendor Name" value={payout.vendor.name} />
        <InfoCell label="Vendor Contact" value={payout.vendor.contactName || "Not available"} />
        <InfoCell label="Order Created" value={payout.order.createdAtLabel} />
        <InfoCell label="Last Updated" value={payout.updatedAtLabel} />
        <InfoCell label="Notes" value={payout.notes || "No payment notes added."} />
      </div>
    </section>
  );
}
