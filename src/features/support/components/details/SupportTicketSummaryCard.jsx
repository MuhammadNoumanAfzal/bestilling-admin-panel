import { Grid2x2, Store } from "lucide-react";

function SummaryPill({ children, tone = "default" }) {
  const toneClass =
    tone === "warning"
      ? "bg-[#fff0cf] text-[#d99615]"
      : tone === "orange"
        ? "bg-[#fff1e6] text-[#e8842f]"
      : tone === "success"
        ? "bg-[#e8fff1] text-[#1ca24f]"
        : "bg-[#f3f0ff] text-[#7d64d8]";

  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${toneClass}`}>{children}</span>;
}

export default function SupportTicketSummaryCard({ ticket }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-[#8f837a]">
        <Grid2x2 size={15} />
        <p className="text-[16px] font-bold">Ticket Details</p>
      </div>

      <section className="rounded-[18px] border border-[#bdb1aa] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.05)]">
        <div className="space-y-5 text-[#18120f]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39890]">Category</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <SummaryPill tone="orange">{ticket.category}</SummaryPill>
              <SummaryPill tone="warning">{ticket.type}</SummaryPill>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39890]">Priority</p>
            <p className="mt-2 text-[25px] font-bold tracking-[-0.03em] text-[#d45a3c]">{ticket.orderReference}</p>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39890]">Associated Vendor</p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f3f1ef] px-3 py-2 text-[12px] font-semibold text-[#7c7068]">
                <Store size={13} />
                Healthy Bites Catering Co.
              </span>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
