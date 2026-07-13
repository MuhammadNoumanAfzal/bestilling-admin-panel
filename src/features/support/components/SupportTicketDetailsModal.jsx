import { CircleDot, Mail, Tag, UserRound, X } from "lucide-react";

function DetailCard({ label, value }) {
  return (
    <div className="rounded-[14px] border border-[#f0e2d8] bg-[linear-gradient(180deg,#fffdfa_0%,#faf5f0_100%)] px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">{label}</p>
      <p className="mt-1 text-[13px] font-semibold leading-5 text-[#2a1f19]">{value}</p>
    </div>
  );
}

export default function SupportTicketDetailsModal({ ticket, onClose }) {
  if (!ticket) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211713]/48 px-4 py-6 backdrop-blur-[4px]">
      <div className="w-full max-w-[560px] overflow-hidden rounded-[24px] border border-[#f2dfd3] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f2_100%)] shadow-[0_28px_80px_rgba(28,18,12,0.20)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#f1e2d8] px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#cf6e38]">Ticket Details</p>
            <h2 className="mt-2 max-w-[360px] text-[22px] font-bold leading-7 tracking-[-0.03em] text-[#1d1612]">
              {ticket.subject}
            </h2>
          </div>

          <button
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#efddd1] bg-white text-[#685b53] transition hover:border-[#cf6e38]/30 hover:bg-[#fff2ea] hover:text-[#cf6e38]"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="grid gap-3 md:grid-cols-2">
            <DetailCard label="Ticket ID" value={ticket.id} />
            <DetailCard label="Created" value={ticket.created} />
            <DetailCard label="Category" value={ticket.category} />
            <DetailCard label="Assigned To" value={ticket.assignee} />
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff0e7] px-3 py-1.5 text-[12px] font-semibold text-[#cf6e38]">
              <CircleDot size={14} />
              {ticket.status}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f4f1ef] px-3 py-1.5 text-[12px] font-semibold text-[#6c615b]">
              <Tag size={14} />
              {ticket.priority} Priority
            </span>
          </div>

          <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0e7] text-[#d16737]">
                <UserRound size={17} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">User</p>
                <p className="text-[14px] font-semibold text-[#2a1f19]">{ticket.user}</p>
              </div>
            </div>

            <div className="mt-3 inline-flex items-center gap-2 text-[13px] text-[#6c615b]">
              <Mail size={14} />
              <span>{ticket.email}</span>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Notes</p>
            <p className="mt-2 text-[14px] leading-6 text-[#40342e]">{ticket.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
