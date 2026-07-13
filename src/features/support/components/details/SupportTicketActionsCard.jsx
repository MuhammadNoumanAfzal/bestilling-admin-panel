function ActionButton({ children, onClick, tone = "default" }) {
  const className =
    tone === "danger"
      ? "border-[#f0b8ab] bg-white text-[#d15b42] hover:bg-[#fff4f1]"
      : tone === "active"
        ? "border-transparent bg-[#cf6e38] text-white hover:bg-[#bc6030]"
        : "border-[#ddd2ca] bg-[#faf6f2] text-[#18120f] hover:border-[#cf6e38]/35 hover:bg-[#fff5ef]";

  return (
    <button
      className={`inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-[10px] border text-[12px] font-bold transition ${className}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function SupportTicketActionsCard({ status, onResolve, onProgress, onClose }) {
  return (
    <section className="rounded-[18px] border border-[#eadcd3] bg-white p-3.5 shadow-[0_8px_20px_rgba(55,31,13,0.05)]">
      <div className="mb-3 rounded-[14px] bg-[linear-gradient(135deg,#fff7f2_0%,#fff4ec_50%,#fffdfa_100%)] px-4 py-3.5">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#9b8f86]">Quick Actions</p>
        <p className="mt-1.5 text-[14px] leading-6 text-[#746861]">
          Keep the ticket moving by updating the status and communicating the next step clearly.
        </p>
      </div>

      <div className="space-y-2">
        <ActionButton onClick={onProgress} tone={status === "In Progress" ? "active" : "default"}>
          Mark In Progress
        </ActionButton>
        <ActionButton onClick={onResolve} tone={status === "Resolved" ? "active" : "default"}>
          Resolve Ticket
        </ActionButton>
        <ActionButton onClick={onClose} tone="danger">
          Reopen Ticket
        </ActionButton>
      </div>
    </section>
  );
}
