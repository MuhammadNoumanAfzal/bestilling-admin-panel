function StatusActionCard({ title, description, buttonLabel, tone = "default" }) {
  const toneClass =
    tone === "warning"
      ? "border-[#f3d2bf] bg-[#fffaf6]"
      : "border-[#d7e7ff] bg-[#f8fbff]";

  const buttonTone =
    tone === "warning"
      ? "border-[#f0b8ab] text-[#d15b42] hover:bg-[#fff4f1]"
      : "border-[#ddd2ca] text-[#2f241d] hover:bg-[#faf6f2]";

  return (
    <section className={`rounded-[16px] border p-4 shadow-[0_10px_24px_rgba(55,31,13,0.05)] ${toneClass}`}>
      <h3 className="text-[14px] font-bold text-[#221914]">{title}</h3>
      <p className="mt-2 text-[12px] leading-6 text-[#6f645d]">{description}</p>
      <button
        className={`mt-4 inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-[8px] border bg-white px-3 text-[12px] font-bold transition ${buttonTone}`}
        type="button"
      >
        {buttonLabel}
      </button>
    </section>
  );
}

export default function PaymentStatusCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatusActionCard
        buttonLabel="Mark as Received"
        description="Confirm buyer successfully received the order and payment."
        title="Customer Payment"
      />
      <StatusActionCard
        buttonLabel="Mark as Paid"
        description="Record that the vendor payment for this order has been completed."
        title="Vendor Payout"
        tone="warning"
      />
    </div>
  );
}
