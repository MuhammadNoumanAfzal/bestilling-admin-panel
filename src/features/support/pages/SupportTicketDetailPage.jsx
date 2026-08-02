import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth.js";
import {
  addSupportInternalNoteRequest,
  assignSupportTicketRequest,
  createSupportAttachmentUploadUrlRequest,
  finalizeSupportAttachmentRequest,
  getAdminSupportTicketRequest,
  getSupportFilterOptionsRequest,
  reopenSupportTicketRequest,
  replyToSupportTicketRequest,
  resolveSupportTicketRequest,
  updateSupportTicketPriorityRequest,
  updateSupportTicketStatusRequest,
  uploadSupportAttachmentFile,
} from "../api/supportApi.js";
import SupportConversationPanel from "../components/details/SupportConversationPanel.jsx";
import SupportCustomerProfileCard from "../components/details/SupportCustomerProfileCard.jsx";
import SupportCustomerProfileModal from "../components/details/SupportCustomerProfileModal.jsx";
import SupportTicketActionsCard from "../components/details/SupportTicketActionsCard.jsx";
import SupportTicketSummaryCard from "../components/details/SupportTicketSummaryCard.jsx";
import { formatStatusLabel } from "../supportUtils.js";

function TicketStatusPill({ status }) {
  const className =
    status === "OPEN"
      ? "bg-[#fff1d8] text-[#d99615]"
      : status === "IN_PROGRESS"
        ? "bg-[#fff3e5] text-[#cf6e38]"
        : status === "CLOSED"
          ? "bg-[#efebe8] text-[#6b5f57]"
          : "bg-[#e9fff0] text-[#219653]";

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${className}`}>{formatStatusLabel(status)}</span>;
}

export default function SupportTicketDetailPage() {
  const { ticketId } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [draftReply, setDraftReply] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [internalNote, setInternalNote] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);

  const fallbackPriorityOptions = useMemo(
    () => [
      { value: "LOW", label: "Low" },
      { value: "MEDIUM", label: "Medium" },
      { value: "HIGH", label: "High" },
      { value: "URGENT", label: "Urgent" },
    ],
    [],
  );

  const activePriorityOptions = priorityOptions.length ? priorityOptions : fallbackPriorityOptions;
  const canAssignToMe = Boolean(user?.id) && ticket?.assignee?.id !== user?.id;

  useEffect(() => {
    let isMounted = true;

    async function loadTicket() {
      setIsLoading(true);
      setLoadError("");

      try {
        const [ticketResult, filterOptionsResult] = await Promise.all([
          getAdminSupportTicketRequest(ticketId),
          getSupportFilterOptionsRequest(),
        ]);

        if (!isMounted) {
          return;
        }

        setTicket(ticketResult);
        setPriorityOptions(filterOptionsResult.priorities || []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Unable to load support ticket.";
        setLoadError(message);
        if (message.toLowerCase().includes("unable to load support ticket")) {
          setShouldRedirect(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTicket();

    return () => {
      isMounted = false;
    };
  }, [ticketId]);

  if (shouldRedirect) {
    return <Navigate replace to="/support" />;
  }

  async function refreshTicket() {
    const result = await getAdminSupportTicketRequest(ticketId);
    setTicket(result);
  }

  async function handleSendReply() {
    const trimmedMessage = draftReply.trim();

    if (!trimmedMessage) {
      await Swal.fire({
        icon: "warning",
        title: internalNote ? "Note is empty" : "Reply is empty",
        text: "Write a message before sending.",
        confirmButtonColor: "#d96834",
      });
      return;
    }

    setIsSending(true);

    try {
      const finalizedAttachments = [];

      for (const file of attachments) {
        const uploadPayload = await createSupportAttachmentUploadUrlRequest(file.name, file.type || "application/octet-stream");
        await uploadSupportAttachmentFile(uploadPayload.uploadUrl, file);
        const attachment = await finalizeSupportAttachmentRequest(uploadPayload.assetKey);
        finalizedAttachments.push(attachment);
      }

      if (internalNote) {
        await addSupportInternalNoteRequest(ticketId, trimmedMessage);
      } else {
        await replyToSupportTicketRequest({
          ticketId,
          message: trimmedMessage,
          attachmentIds: finalizedAttachments.map((item) => item.id),
          internalNote: false,
        });
      }

      await refreshTicket();
      setDraftReply("");
      setAttachments([]);
      setInternalNote(false);

      await Swal.fire({
        icon: "success",
        title: internalNote ? "Internal note saved" : "Reply sent",
        text: internalNote ? "The note was added to the ticket activity." : "The requester reply was sent successfully.",
        confirmButtonColor: "#d96834",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: internalNote ? "Unable to save note" : "Unable to send reply",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#d96834",
      });
    } finally {
      setIsSending(false);
    }
  }

  async function handleStatusUpdate(action) {
    setIsUpdatingStatus(true);

    try {
      if (action === "IN_PROGRESS") {
        await updateSupportTicketStatusRequest(ticketId, "IN_PROGRESS");
      } else if (action === "CLOSED") {
        await updateSupportTicketStatusRequest(ticketId, "CLOSED");
      } else if (action === "RESOLVED") {
        await resolveSupportTicketRequest(ticketId);
      } else if (action === "OPEN") {
        await reopenSupportTicketRequest(ticketId);
      }

      await refreshTicket();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update status",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#d96834",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleAssignment(assigneeId) {
    setIsAssigning(true);

    try {
      await assignSupportTicketRequest(ticketId, assigneeId);
      await refreshTicket();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update assignment",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#d96834",
      });
    } finally {
      setIsAssigning(false);
    }
  }

  async function handlePriorityChange(nextPriority) {
    if (!ticket || nextPriority === ticket.priority) {
      return;
    }

    setIsUpdatingPriority(true);

    try {
      await updateSupportTicketPriorityRequest(ticketId, nextPriority);
      await refreshTicket();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update priority",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#d96834",
      });
    } finally {
      setIsUpdatingPriority(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-[18px] border border-[#e8ddd5] bg-white px-5 py-12 text-center text-[15px] font-medium text-[#6f645d]">
        Loading support ticket...
      </div>
    );
  }

  if (loadError && !ticket) {
    return (
      <div className="rounded-[18px] border border-[#f0d8ce] bg-white px-5 py-12 text-center text-[15px] font-medium text-[#9f4d33]">
        {loadError}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[13px] font-bold text-[#6d6058]">#{ticket.id}</p>
          <TicketStatusPill status={ticket.status} />
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
          attachments={attachments}
          draftReply={draftReply}
          internalNote={internalNote}
          isSending={isSending}
          onAttachmentChange={(event) => {
            const selectedFiles = Array.from(event.target.files || []);
            setAttachments((current) => [...current, ...selectedFiles]);
            event.target.value = "";
          }}
          onDraftReplyChange={setDraftReply}
          onInternalNoteChange={setInternalNote}
          onRemoveAttachment={(index) =>
            setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))
          }
          onSendReply={handleSendReply}
          ticket={ticket}
        />

        <aside className="space-y-4">
          <SupportCustomerProfileCard onViewProfile={() => setIsProfileModalOpen(true)} ticket={ticket} />
          <SupportTicketSummaryCard ticket={ticket} />
          <SupportTicketActionsCard
            assigneeName={ticket.assignee?.fullName || ""}
            canAssignToMe={canAssignToMe}
            isAssigning={isAssigning}
            isUpdatingPriority={isUpdatingPriority}
            isUpdatingStatus={isUpdatingStatus}
            onAssignToMe={() => handleAssignment(user?.id || null)}
            onChangePriority={handlePriorityChange}
            onCloseTicket={() => handleStatusUpdate("CLOSED")}
            onReopen={() => handleStatusUpdate("OPEN")}
            onResolve={() => handleStatusUpdate("RESOLVED")}
            onSetInProgress={() => handleStatusUpdate("IN_PROGRESS")}
            onUnassign={() => handleAssignment(null)}
            priority={ticket.priority}
            priorityOptions={activePriorityOptions}
            status={ticket.status}
          />
        </aside>
      </div>

      <SupportCustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        ticket={ticket}
      />
    </div>
  );
}
