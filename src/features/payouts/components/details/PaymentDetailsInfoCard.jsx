function InfoCell({ label, value }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39388]">{label}</p>
      <p className="text-[13px] font-semibold text-[#2a1f19]">{value}</p>
    </div>
  );
}

export default function PaymentDetailsInfoCard({ payout }) {
  return (
    <section className="rounded-[16px] border border-[#ddd4cd] bg-white p-4 shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex rounded-full bg-[#faf7f4] px-3 py-1 text-[11px] font-bold text-[#8d8077]">
          Order Information
        </span>
        <span className="text-[12px] font-bold text-[#2a1e17]">{payout.id}</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCell label="Invoice Number" value={payout.invoiceNumber} />
        <InfoCell label="Customer Name" value={payout.customer} />
        <InfoCell label="Vendor Name" value={payout.vendorName} />
        <InfoCell label="Order Date" value={payout.date} />
      </div>
    </section>
  );
}
