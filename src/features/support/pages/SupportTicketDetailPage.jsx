import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import SupportConversationPanel from "../components/details/SupportConversationPanel.jsx";
import SupportCustomerProfileCard from "../components/details/SupportCustomerProfileCard.jsx";
import SupportCustomerProfileModal from "../components/details/SupportCustomerProfileModal.jsx";
import SupportTicketActionsCard from "../components/details/SupportTicketActionsCard.jsx";
import SupportTicketSummaryCard from "../components/details/SupportTicketSummaryCard.jsx";
import { getSupportTicketById } from "../data/supportData.js";

function TicketStatusPill({ status }) {
  const className =
    status === "Open"
      ? "bg-[#fff1d8] text-[#d99615]"
      : status === "In Progress"
        ? "bg-[#fff3e5] text-[#cf6e38]"
        : "bg-[#e9fff0] text-[#219653]";

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${className}`}>{status}</span>;
}

export default function SupportTicketDetailPage() {
  const { ticketId } = useParams();
  const ticket = getSupportTicketById(ticketId);
  const [currentStatus, setCurrentStatus] = useState(ticket?.status || "Open");
  const [draftReply, setDraftReply] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (!ticket) {
    return <Navigate replace to="/support" />;
  }

  const ticketWithState = useMemo(
    () => ({
      ...ticket,
      status: currentStatus,
    }),
    [currentStatus, ticket],
  );

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[13px] font-bold text-[#6d6058]">#{ticket.id}</p>
          <TicketStatusPill status={ticketWithState.status} />
        </div>

        <div className="flex items-start gap-3">
          <Link
            className="mt-[6px] inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#7d7068] transition hover:bg-[#fff4ec] hover:text-[#cf6e38]"
            to="/support"
          >
            <ChevronLeft size={16} />
          </Link>

          <div>
            <h1 className="text-[34px] font-bold leading-tight tracking-[-0.04em] text-[#18120f]">{ticket.subject}</h1>
            <p className="mt-2 max-w-[78ch] text-[17px] leading-8 text-[#746861]">
              Review the full conversation, update the ticket status, and keep the requester informed with a clear next step.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SupportConversationPanel
          draftReply={draftReply}
          onDraftReplyChange={setDraftReply}
          onSendReply={() => setDraftReply("")}
          ticket={ticket}
        />

        <aside className="space-y-4">
          <SupportCustomerProfileCard
            onViewProfile={() => setIsProfileModalOpen(true)}
            ticket={ticket}
          />
          <SupportTicketSummaryCard ticket={ticketWithState} />
          <SupportTicketActionsCard
            onClose={() => setCurrentStatus("Open")}
            onProgress={() => setCurrentStatus("In Progress")}
            onResolve={() => setCurrentStatus("Resolved")}
            status={ticketWithState.status}
          />
        </aside>
      </div>

      <SupportCustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        ticket={ticketWithState}
      />
    </div>
  );
}
