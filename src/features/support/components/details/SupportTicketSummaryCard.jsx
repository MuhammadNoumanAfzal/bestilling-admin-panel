import { Grid2x2, UserRound } from "lucide-react";
import {
  formatMetadataSummary,
  formatPriorityLabel,
  formatReadableDate,
  formatStatusLabel,
  formatUserTypeLabel,
} from "../../supportUtils.js";

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
              <SummaryPill tone="warning">{formatUserTypeLabel(ticket.requester?.type)}</SummaryPill>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[14px] border border-[#f0e4dc] bg-[#fffaf7] px-3 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39890]">Priority</p>
              <p className="mt-2 text-[18px] font-bold text-[#d45a3c]">{formatPriorityLabel(ticket.priority)}</p>
            </div>
            <div className="rounded-[14px] border border-[#f0e4dc] bg-[#fffaf7] px-3 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39890]">Status</p>
              <p className="mt-2 text-[18px] font-bold text-[#2c251f]">{formatStatusLabel(ticket.status)}</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39890]">Assignment</p>
            <div className="mt-3 rounded-[14px] border border-[#f0e4dc] bg-[#fffaf7] px-3 py-3">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#7c7068]">
                <UserRound size={13} />
                {ticket.assignee?.fullName || "Unassigned"}
              </span>
            </div>
          </div>

          <div className="grid gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39890]">Order Reference</p>
              <p className="mt-2 text-[14px] font-semibold text-[#2c251f]">{ticket.orderReference || "No linked order"}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39890]">Created</p>
              <p className="mt-2 text-[14px] font-semibold text-[#2c251f]">{formatReadableDate(ticket.createdAt)}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39890]">Last Updated</p>
              <p className="mt-2 text-[14px] font-semibold text-[#2c251f]">{formatReadableDate(ticket.updatedAt)}</p>
            </div>
          </div>

          {ticket.activityLog?.length ? (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39890]">Recent Activity</p>
              <div className="mt-3 space-y-3">
                {ticket.activityLog.slice(0, 4).map((entry) => (
                  <div key={entry.id} className="rounded-[14px] border border-[#f0e4dc] bg-[#fffaf7] px-3 py-3">
                    <p className="text-[13px] font-bold text-[#2c251f]">{entry.action}</p>
                    <p className="mt-1 text-[12px] text-[#6f645d]">
                      {entry.actor.fullName} • {entry.createdAtLabel}
                    </p>
                    {entry.metadata ? (
                      <p className="mt-1 text-[12px] leading-5 text-[#7b6d65]">{formatMetadataSummary(entry.metadata)}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </section>
  );
}
