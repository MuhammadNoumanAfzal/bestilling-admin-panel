import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADD_SUPPORT_INTERNAL_NOTE_MUTATION,
  ADMIN_SUPPORT_SUMMARY_QUERY,
  ADMIN_SUPPORT_TICKET_QUERY,
  ADMIN_SUPPORT_TICKETS_QUERY,
  ASSIGN_SUPPORT_TICKET_MUTATION,
  CREATE_SUPPORT_ATTACHMENT_UPLOAD_URL_MUTATION,
  FINALIZE_SUPPORT_ATTACHMENT_MUTATION,
  REOPEN_SUPPORT_TICKET_MUTATION,
  REPLY_TO_SUPPORT_TICKET_MUTATION,
  RESOLVE_SUPPORT_TICKET_MUTATION,
  SUPPORT_FILTER_OPTIONS_QUERY,
  UPDATE_SUPPORT_TICKET_PRIORITY_MUTATION,
  UPDATE_SUPPORT_TICKET_STATUS_MUTATION,
} from "./supportQueries.js";

function getFirstErrorMessage(result, fallbackMessage) {
  return result?.errors?.find((item) => item?.message)?.message || result?.message || fallbackMessage;
}

function formatDisplayDate(value, options = {}) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: options.compact ? "medium" : "medium",
    timeStyle: options.includeTime === false ? undefined : "short",
  }).format(date);
}

function formatRelativeDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  return formatDisplayDate(value, { includeTime: false });
}

function getInitials(name) {
  return String(name || "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function normalizeRequester(requester) {
  return {
    id: requester?.id ?? "",
    type: requester?.type ?? "",
    fullName: requester?.fullName ?? "Unknown requester",
    email: requester?.email ?? "",
    phone: requester?.phone ?? "",
    avatarUrl: requester?.avatarUrl ?? "",
    joinedAt: requester?.joinedAt ?? "",
    totalOrders: requester?.totalOrders ?? 0,
  };
}

function normalizeSupportTicketListItem(item) {
  const requester = normalizeRequester(item?.requester);

  return {
    id: item?.id ?? "",
    subject: item?.subject ?? "",
    category: item?.category ?? "",
    priority: item?.priority ?? "MEDIUM",
    status: item?.status ?? "OPEN",
    createdAt: item?.createdAt ?? "",
    updatedAt: item?.updatedAt ?? "",
    created: formatRelativeDate(item?.createdAt),
    lastMessageAt: item?.lastMessageAt ?? "",
    unreadAdminCount: item?.unreadAdminCount ?? 0,
    assignee: item?.assignee
      ? {
          id: item.assignee.id ?? "",
          fullName: item.assignee.fullName ?? "",
        }
      : null,
    requester,
    user: requester.fullName,
    email: requester.email,
    type: requester.type,
    phone: requester.phone,
    avatarUrl: requester.avatarUrl,
    avatarInitials: getInitials(requester.fullName),
    orderReference: item?.orderReference ?? "",
  };
}

function normalizeConversationItem(message) {
  return {
    id: message?.id ?? "",
    author: {
      id: message?.author?.id ?? "",
      fullName: message?.author?.fullName ?? "Unknown",
      role: message?.author?.role ?? "",
    },
    side: message?.side ?? "client",
    message: message?.message ?? "",
    createdAt: message?.createdAt ?? "",
    time: formatDisplayDate(message?.createdAt),
    attachments: (message?.attachments || []).map((attachment) => ({
      id: attachment?.id ?? "",
      fileName: attachment?.fileName ?? "Attachment",
      url: attachment?.url ?? "",
      mimeType: attachment?.mimeType ?? "",
      size: attachment?.size ?? 0,
    })),
  };
}

function normalizeActivityItem(item) {
  return {
    id: item?.id ?? "",
    action: item?.action ?? "",
    actor: {
      id: item?.actor?.id ?? "",
      fullName: item?.actor?.fullName ?? "System",
    },
    createdAt: item?.createdAt ?? "",
    createdAtLabel: formatDisplayDate(item?.createdAt),
    metadata: item?.metadata ?? "",
  };
}

function normalizeSupportTicketDetail(ticket) {
  const requester = normalizeRequester(ticket?.requester);

  return {
    id: ticket?.id ?? "",
    subject: ticket?.subject ?? "",
    category: ticket?.category ?? "",
    priority: ticket?.priority ?? "MEDIUM",
    status: ticket?.status ?? "OPEN",
    notes: ticket?.notes ?? "",
    createdAt: ticket?.createdAt ?? "",
    updatedAt: ticket?.updatedAt ?? "",
    createdAtExact: formatDisplayDate(ticket?.createdAt),
    updatedAtExact: formatDisplayDate(ticket?.updatedAt),
    createdBy: {
      id: ticket?.createdBy?.id ?? "",
      type: ticket?.createdBy?.type ?? "",
      fullName: ticket?.createdBy?.fullName ?? "",
      email: ticket?.createdBy?.email ?? "",
    },
    assignee: ticket?.assignee
      ? {
          id: ticket.assignee.id ?? "",
          fullName: ticket.assignee.fullName ?? "",
          email: ticket.assignee.email ?? "",
        }
      : null,
    orderReference: ticket?.orderReference ?? "",
    requester,
    user: requester.fullName,
    email: requester.email,
    phone: requester.phone,
    type: requester.type,
    avatarUrl: requester.avatarUrl,
    avatarInitials: getInitials(requester.fullName),
    orderCount: requester.totalOrders,
    joinedDate: formatDisplayDate(requester.joinedAt, { includeTime: false }),
    conversation: (ticket?.conversation || []).map(normalizeConversationItem),
    activityLog: (ticket?.activityLog || []).map(normalizeActivityItem),
  };
}

export async function getAdminSupportTicketsRequest(variables) {
  const data = await executeProtectedGraphqlRequest(ADMIN_SUPPORT_TICKETS_QUERY, variables);
  const result = data?.adminSupportTickets;

  return {
    items: (result?.items || []).map(normalizeSupportTicketListItem),
    pageInfo: {
      page: result?.pageInfo?.page ?? variables.page,
      pageSize: result?.pageInfo?.pageSize ?? variables.pageSize,
      totalItems: result?.pageInfo?.totalItems ?? 0,
      totalPages: result?.pageInfo?.totalPages ?? 1,
      hasNextPage: Boolean(result?.pageInfo?.hasNextPage),
      hasPreviousPage: Boolean(result?.pageInfo?.hasPreviousPage),
    },
  };
}

export async function getAdminSupportSummaryRequest(variables) {
  const data = await executeProtectedGraphqlRequest(ADMIN_SUPPORT_SUMMARY_QUERY, variables);
  const result = data?.adminSupportSummary;

  return {
    total: result?.total ?? 0,
    open: result?.open ?? 0,
    inProgress: result?.inProgress ?? 0,
    resolved: result?.resolved ?? 0,
  };
}

export async function getSupportFilterOptionsRequest() {
  const data = await executeProtectedGraphqlRequest(SUPPORT_FILTER_OPTIONS_QUERY, {});
  const result = data?.supportFilterOptions;

  return {
    statuses: result?.statuses || [],
    userTypes: result?.userTypes || [],
    categories: result?.categories || [],
    priorities: result?.priorities || [],
  };
}

export async function getAdminSupportTicketRequest(id) {
  const data = await executeProtectedGraphqlRequest(ADMIN_SUPPORT_TICKET_QUERY, { id });
  const ticket = data?.adminSupportTicket;

  if (!ticket?.id) {
    throw new Error("Unable to load support ticket.");
  }

  return normalizeSupportTicketDetail(ticket);
}

export async function replyToSupportTicketRequest(input) {
  const data = await executeProtectedGraphqlRequest(REPLY_TO_SUPPORT_TICKET_MUTATION, {
    input: {
      ticketId: input.ticketId,
      message: input.message,
      attachmentIds: input.attachmentIds || [],
      internalNote: Boolean(input.internalNote),
    },
  });

  const result = data?.replyToSupportTicket;
  if (!result?.success || !result?.reply) {
    throw new Error(getFirstErrorMessage(result, "Unable to send reply."));
  }

  return {
    message: result.message || "Reply sent successfully.",
    reply: normalizeConversationItem({
      ...result.reply,
      side: input.internalNote ? "admin" : "admin",
    }),
  };
}

export async function updateSupportTicketStatusRequest(ticketId, status) {
  const data = await executeProtectedGraphqlRequest(UPDATE_SUPPORT_TICKET_STATUS_MUTATION, {
    ticketId,
    status,
  });

  const result = data?.updateSupportTicketStatus;
  if (!result?.success || !result?.ticket) {
    throw new Error(getFirstErrorMessage(result, "Unable to update ticket status."));
  }

  return result.ticket;
}

export async function assignSupportTicketRequest(ticketId, assigneeId) {
  const data = await executeProtectedGraphqlRequest(ASSIGN_SUPPORT_TICKET_MUTATION, {
    ticketId,
    assigneeId: assigneeId || null,
  });

  const result = data?.assignSupportTicket;
  if (!result?.success || !result?.ticket) {
    throw new Error(getFirstErrorMessage(result, "Unable to update ticket assignment."));
  }

  return result.ticket;
}

export async function updateSupportTicketPriorityRequest(ticketId, priority) {
  const data = await executeProtectedGraphqlRequest(UPDATE_SUPPORT_TICKET_PRIORITY_MUTATION, {
    ticketId,
    priority,
  });

  const result = data?.updateSupportTicketPriority;
  if (!result?.success || !result?.ticket) {
    throw new Error(getFirstErrorMessage(result, "Unable to update ticket priority."));
  }

  return result.ticket;
}

export async function addSupportInternalNoteRequest(ticketId, message) {
  const data = await executeProtectedGraphqlRequest(ADD_SUPPORT_INTERNAL_NOTE_MUTATION, {
    ticketId,
    message,
  });

  const result = data?.addSupportInternalNote;
  if (!result?.success || !result?.note) {
    throw new Error(getFirstErrorMessage(result, "Unable to add internal note."));
  }

  return {
    message: result.message || "Internal note added successfully.",
    note: normalizeConversationItem({
      ...result.note,
      author: {
        id: result.note.author?.id,
        fullName: result.note.author?.fullName,
        role: "Admin",
      },
      side: "admin",
      attachments: [],
    }),
  };
}

export async function resolveSupportTicketRequest(ticketId) {
  const data = await executeProtectedGraphqlRequest(RESOLVE_SUPPORT_TICKET_MUTATION, { ticketId });
  const result = data?.resolveSupportTicket;

  if (!result?.success || !result?.ticket) {
    throw new Error(result?.message || "Unable to resolve ticket.");
  }

  return result.ticket;
}

export async function reopenSupportTicketRequest(ticketId) {
  const data = await executeProtectedGraphqlRequest(REOPEN_SUPPORT_TICKET_MUTATION, { ticketId });
  const result = data?.reopenSupportTicket;

  if (!result?.success || !result?.ticket) {
    throw new Error(result?.message || "Unable to reopen ticket.");
  }

  return result.ticket;
}

export async function createSupportAttachmentUploadUrlRequest(fileName, contentType) {
  const data = await executeProtectedGraphqlRequest(CREATE_SUPPORT_ATTACHMENT_UPLOAD_URL_MUTATION, {
    fileName,
    contentType,
  });

  const result = data?.createSupportAttachmentUploadUrl;
  if (!result?.success || !result?.uploadUrl || !result?.assetKey) {
    throw new Error(result?.message || "Unable to prepare attachment upload.");
  }

  return result;
}

export async function uploadSupportAttachmentFile(uploadUrl, file) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Attachment upload failed. Please try again.");
  }
}

export async function finalizeSupportAttachmentRequest(assetKey) {
  const data = await executeProtectedGraphqlRequest(FINALIZE_SUPPORT_ATTACHMENT_MUTATION, {
    assetKey,
  });

  const result = data?.finalizeSupportAttachment;
  if (!result?.success || !result?.attachment) {
    throw new Error(result?.message || "Unable to finalize attachment.");
  }

  return {
    id: result.attachment.id ?? "",
    fileName: result.attachment.fileName ?? "Attachment",
    url: result.attachment.url ?? "",
    mimeType: result.attachment.mimeType ?? "",
    size: result.attachment.size ?? 0,
  };
}
