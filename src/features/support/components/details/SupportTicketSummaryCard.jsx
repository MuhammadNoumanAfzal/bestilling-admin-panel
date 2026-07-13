function SummaryPill({ children, tone = "default" }) {
  const toneClass =
    tone === "warning"
      ? "bg-[#fff0cf] text-[#d99615]"
      : tone === "success"
        ? "bg-[#e8fff1] text-[#1ca24f]"
        : "bg-[#f3f0ff] text-[#7d64d8]";

  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${toneClass}`}>{children}</span>;
}

export default function SupportTicketSummaryCard({ ticket }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[#eadcd3] bg-white shadow-[0_8px_20px_rgba(55,31,13,0.05)]">
      <div className="bg-[linear-gradient(135deg,#fff8f2_0%,#fff2fb_100%)] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#9b8f86]">Ticket Details</p>
          <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#7d7068]">
            #{ticket.id}
          </span>
        </div>
      </div>

      <div className="grid gap-3 p-4 text-[13px] text-[#4f433d]">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[12px] bg-[#fcfaf8] px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#aa9f97]">Category</p>
            <div className="mt-2">
              <SummaryPill>{ticket.category}</SummaryPill>
            </div>
          </div>

          <div className="rounded-[12px] bg-[#fcfaf8] px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#aa9f97]">Priority</p>
            <div className="mt-2">
              <SummaryPill tone="warning">{ticket.priority}</SummaryPill>
            </div>
          </div>
        </div>

        <div className="rounded-[12px] bg-[#fff8f4] px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#aa9f97]">Order Reference</p>
          <p className="mt-1 text-[16px] font-semibold text-[#2a1e17]">{ticket.orderReference}</p>
        </div>

        <div className="rounded-[12px] bg-[#f8fbff] px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#aa9f97]">Assigned To</p>
          <p className="mt-1 text-[16px] font-semibold text-[#2a1e17]">{ticket.assignee}</p>
        </div>

        <div className="rounded-[12px] bg-[#f7fcf8] px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#aa9f97]">Status</p>
          <div className="mt-2">
            <SummaryPill tone="success">{ticket.status}</SummaryPill>
          </div>
        </div>
      </div>
    </section>
  );
}
