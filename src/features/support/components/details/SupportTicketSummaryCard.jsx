function SummaryPill({ children, tone = "default" }) {
  const toneClass =
    tone === "warning"
      ? "bg-[#fff1d6] text-[#d99615]"
      : tone === "success"
        ? "bg-[#e9fff0] text-[#219653]"
        : "bg-[#f1eeeb] text-[#7d7068]";

  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${toneClass}`}>{children}</span>;
}

export default function SupportTicketSummaryCard({ ticket }) {
  return (
    <section className="rounded-[16px] border border-[#ddd4cd] bg-white p-4 shadow-[0_8px_20px_rgba(55,31,13,0.05)]">
      <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#9b8f86]">Ticket Details</p>

      <div className="mt-4 space-y-4 text-[13px] text-[#4f433d]">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa9f97]">Category</p>
          <div className="mt-2">
            <SummaryPill>{ticket.category}</SummaryPill>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa9f97]">Priority</p>
          <div className="mt-2">
            <SummaryPill tone="warning">{ticket.priority}</SummaryPill>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa9f97]">Order Reference</p>
          <p className="mt-1 font-semibold text-[#2a1e17]">{ticket.orderReference}</p>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa9f97]">Assigned To</p>
          <p className="mt-1 font-semibold text-[#2a1e17]">{ticket.assignee}</p>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa9f97]">Status</p>
          <div className="mt-2">
            <SummaryPill tone="success">{ticket.status}</SummaryPill>
          </div>
        </div>
      </div>
    </section>
  );
}
