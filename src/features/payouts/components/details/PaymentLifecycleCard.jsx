function FlowNode({ label, value, tone = "default" }) {
  const toneClass =
    tone === "orange"
      ? "bg-[#fff0e7] text-[#cf6e38]"
      : tone === "blue"
        ? "bg-[#eef4ff] text-[#4b74c6]"
        : "bg-[#f4f2ef] text-[#7c6f67]";

  return (
    <div className="flex flex-1 flex-col items-center gap-2 text-center">
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${toneClass}`}>•</span>
      <div>
        <p className="text-[11px] font-bold text-[#7d7068]">{label}</p>
        <p className="mt-1 text-[12px] font-bold text-[#2a1e17]">{value}</p>
      </div>
    </div>
  );
}

export default function PaymentLifecycleCard({ payout }) {
  return (
    <section className="rounded-[16px] border border-[#ddd4cd] bg-white p-4 shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.08em] text-[#9b8f86]">Transaction Lifecycle Flow</p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <FlowNode label="Customer Pays" tone="blue" value={payout.orderAmount} />
        <FlowNode label="Commission" tone="orange" value={payout.platformCommission.replace("-", "")} />
        <FlowNode label="Vendor Receives" value={payout.vendorAmount} />
      </div>
    </section>
  );
}
