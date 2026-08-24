export const FINANCE_NOTIFICATION_FIELDS = `
  id
  type
  audience
  title
  message
  isRead
  createdAt
  invoiceId
  orderId
  payoutId
  paymentStatus
  settlementStatus
  payoutStatus
  actorType
  actorId
  actorName
  note
  rejectionReason
  receiptUrl
  transferReference
  paymentDate
`;

export const ADMIN_FINANCE_NOTIFICATIONS_QUERY = `
  query AdminFinanceNotifications($first: Int, $status: String) {
    adminFinanceNotifications(first: $first, status: $status) {
      edges {
        node {
          ${FINANCE_NOTIFICATION_FIELDS}
        }
      }
      unreadCount
      totalCount
    }
  }
`;

export const FINANCE_NOTIFICATION_DETAIL_QUERY = `
  query FinanceNotificationDetail($id: ID!) {
    financeNotification(id: $id) {
      ${FINANCE_NOTIFICATION_FIELDS}
    }
  }
`;

export const MARK_FINANCE_NOTIFICATION_READ_MUTATION = `
  mutation MarkFinanceNotificationRead($id: ID!) {
    markFinanceNotificationRead(id: $id) {
      success
      message
      notification {
        id
        isRead
      }
    }
  }
`;

export const MARK_ALL_FINANCE_NOTIFICATIONS_READ_MUTATION = `
  mutation MarkAllFinanceNotificationsRead($audience: String!) {
    markAllFinanceNotificationsRead(audience: $audience) {
      success
      message
    }
  }
`;

export const ORDER_NOTIFICATION_FIELDS = `
  id
  type
  audience
  title
  message
  isRead
  createdAt
  orderId
  actorType
  actorId
  actorName
`;

export const ADMIN_ORDER_NOTIFICATIONS_QUERY = `
  query AdminOrderNotifications($first: Int, $status: String) {
    adminOrderNotifications(first: $first, status: $status) {
      edges {
        node {
          ${ORDER_NOTIFICATION_FIELDS}
        }
      }
      unreadCount
      totalCount
    }
  }
`;
