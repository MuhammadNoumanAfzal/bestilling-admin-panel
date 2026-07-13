import { ChevronLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import SupportConversationPanel from "../components/details/SupportConversationPanel.jsx";
import SupportCustomerProfileCard from "../components/details/SupportCustomerProfileCard.jsx";
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

  if (!ticket) {
    return <Navigate replace to="/support" />;
  }

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <Link
          className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-[#7d7068] transition hover:text-[#cf6e38]"
          to="/support"
        >
          <ChevronLeft size={15} />
          <span>Back to Support</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[13px] font-bold text-[#6d6058]">#{ticket.id}</p>
          <TicketStatusPill status={ticket.status} />
        </div>

        <h1 className="text-[34px] font-bold leading-tight tracking-[-0.04em] text-[#18120f]">{ticket.subject}</h1>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <SupportConversationPanel ticket={ticket} />

        <aside className="space-y-4">
          <SupportCustomerProfileCard ticket={ticket} />
          <SupportTicketSummaryCard ticket={ticket} />
          <SupportTicketActionsCard />
        </aside>
      </div>
    </div>
  );
}
