export const ADMIN_SUPPORT_TICKETS_QUERY = `
  query AdminSupportTickets(
    $search: String
    $status: String
    $userType: String
    $dateFrom: DateTime
    $dateTo: DateTime
    $page: Int!
    $pageSize: Int!
    $sortBy: String
    $sortOrder: String
  ) {
    adminSupportTickets(
      filters: {
        search: $search
        status: $status
        userType: $userType
        dateFrom: $dateFrom
        dateTo: $dateTo
      }
      pagination: {
        page: $page
        pageSize: $pageSize
      }
      sort: {
        field: $sortBy
        order: $sortOrder
      }
    ) {
      items {
        id
        subject
        category
        priority
        status
        createdAt
        updatedAt
        assignee {
          id
          fullName
        }
        requester {
          id
          type
          fullName
          email
          phone
          avatarUrl
        }
        orderReference
        lastMessageAt
        unreadAdminCount
      }
      pageInfo {
        page
        pageSize
        totalItems
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const ADMIN_SUPPORT_SUMMARY_QUERY = `
  query AdminSupportSummary(
    $userType: String
    $dateFrom: DateTime
    $dateTo: DateTime
  ) {
    adminSupportSummary(
      filters: {
        userType: $userType
        dateFrom: $dateFrom
        dateTo: $dateTo
      }
    ) {
      total
      open
      inProgress
      resolved
    }
  }
`;

export const ADMIN_SUPPORT_TICKET_QUERY = `
  query AdminSupportTicket($id: ID!) {
    adminSupportTicket(id: $id) {
      id
      subject
      category
      priority
      status
      notes
      createdAt
      updatedAt
      createdBy {
        id
        type
        fullName
        email
      }
      assignee {
        id
        fullName
        email
      }
      orderReference
      requester {
        id
        type
        fullName
        email
        phone
        avatarUrl
        joinedAt
        totalOrders
      }
      conversation {
        id
        author {
          id
          fullName
          role
        }
        side
        message
        createdAt
        attachments {
          id
          fileName
          url
          mimeType
          size
        }
      }
      activityLog {
        id
        action
        actor {
          id
          fullName
        }
        createdAt
        metadata
      }
    }
  }
`;

export const REPLY_TO_SUPPORT_TICKET_MUTATION = `
  mutation ReplyToSupportTicket($input: ReplyToSupportTicketInput!) {
    replyToSupportTicket(input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      reply {
        id
        message
        createdAt
        author {
          id
          fullName
          role
        }
        attachments {
          id
          fileName
          url
        }
      }
    }
  }
`;

export const UPDATE_SUPPORT_TICKET_STATUS_MUTATION = `
  mutation UpdateSupportTicketStatus($ticketId: ID!, $status: String!) {
    updateSupportTicketStatus(ticketId: $ticketId, status: $status) {
      success
      message
      errors {
        field
        message
        code
      }
      ticket {
        id
        status
        updatedAt
      }
    }
  }
`;

export const ASSIGN_SUPPORT_TICKET_MUTATION = `
  mutation AssignSupportTicket($ticketId: ID!, $assigneeId: ID) {
    assignSupportTicket(ticketId: $ticketId, assigneeId: $assigneeId) {
      success
      message
      errors {
        field
        message
        code
      }
      ticket {
        id
        assignee {
          id
          fullName
        }
        updatedAt
      }
    }
  }
`;

export const UPDATE_SUPPORT_TICKET_PRIORITY_MUTATION = `
  mutation UpdateSupportTicketPriority($ticketId: ID!, $priority: String!) {
    updateSupportTicketPriority(ticketId: $ticketId, priority: $priority) {
      success
      message
      errors {
        field
        message
        code
      }
      ticket {
        id
        priority
        updatedAt
      }
    }
  }
`;

export const ADD_SUPPORT_INTERNAL_NOTE_MUTATION = `
  mutation AddSupportInternalNote($ticketId: ID!, $message: String!) {
    addSupportInternalNote(ticketId: $ticketId, message: $message) {
      success
      message
      errors {
        field
        message
        code
      }
      note {
        id
        message
        createdAt
        author {
          id
          fullName
        }
      }
    }
  }
`;

export const RESOLVE_SUPPORT_TICKET_MUTATION = `
  mutation ResolveSupportTicket($ticketId: ID!) {
    resolveSupportTicket(ticketId: $ticketId) {
      success
      message
      ticket {
        id
        status
      }
    }
  }
`;

export const REOPEN_SUPPORT_TICKET_MUTATION = `
  mutation ReopenSupportTicket($ticketId: ID!) {
    reopenSupportTicket(ticketId: $ticketId) {
      success
      message
      ticket {
        id
        status
      }
    }
  }
`;

export const SUPPORT_FILTER_OPTIONS_QUERY = `
  query SupportFilterOptions {
    supportFilterOptions {
      statuses {
        value
        label
      }
      userTypes {
        value
        label
      }
      categories {
        value
        label
      }
      priorities {
        value
        label
      }
    }
  }
`;

export const CREATE_SUPPORT_ATTACHMENT_UPLOAD_URL_MUTATION = `
  mutation CreateSupportAttachmentUploadUrl($fileName: String!, $contentType: String!) {
    createSupportAttachmentUploadUrl(fileName: $fileName, contentType: $contentType) {
      success
      message
      uploadUrl
      fileUrl
      assetKey
    }
  }
`;

export const FINALIZE_SUPPORT_ATTACHMENT_MUTATION = `
  mutation FinalizeSupportAttachment($assetKey: String!) {
    finalizeSupportAttachment(assetKey: $assetKey) {
      success
      message
      attachment {
        id
        fileName
        url
        mimeType
        size
      }
    }
  }
`;
