function StatusPill({ label, tone = "default" }) {
  const toneClass =
    tone === "warning"
      ? "bg-[#fff1ea] text-[#d15b42]"
      : "bg-[#eefbf2] text-[#249f56]";

  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${toneClass}`}>{label}</span>;
}

function StatusActionCard({ title, description, buttonLabel, amount, statusLabel, tone = "default" }) {
  const toneClass =
    tone === "warning"
      ? "border-[#f3d2bf] bg-[#fffaf6]"
      : "border-[#d7e7ff] bg-[#f8fbff]";

  const buttonTone =
    tone === "warning"
      ? "border-[#f0b8ab] text-[#d15b42] hover:bg-[#fff4f1]"
      : "border-[#ddd2ca] text-[#2f241d] hover:bg-[#faf6f2]";

  return (
    <section className={`rounded-[18px] border p-5 shadow-[0_10px_24px_rgba(55,31,13,0.05)] ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-bold text-[#221914]">{title}</h3>
          <p className="mt-2 text-[13px] leading-6 text-[#6f645d]">{description}</p>
        </div>
        <StatusPill label={statusLabel} tone={tone} />
      </div>

      <div className="mt-4 rounded-[14px] border border-white/70 bg-white/80 px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39388]">Amount</p>
        <p className="mt-1 text-[20px] font-bold tracking-[-0.03em] text-[#241914]">{amount}</p>
      </div>

      <button
        className={`mt-4 inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-[8px] border bg-white px-3 text-[12px] font-bold transition ${buttonTone}`}
        type="button"
      >
        {buttonLabel}
      </button>
    </section>
  );
}

export default function PaymentStatusCards({ payout }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatusActionCard
        amount={payout.orderAmount}
        buttonLabel="Mark as Received"
        description="Confirm buyer successfully received the order and payment."
        statusLabel={payout.orderPayment}
        title="Customer Payment"
      />
      <StatusActionCard
        amount={payout.vendorAmount}
        buttonLabel="Mark as Paid"
        description="Record that the vendor payment for this order has been completed."
        statusLabel={payout.payoutStatus}
        title="Vendor Payout"
        tone="warning"
      />
    </div>
  );
}
