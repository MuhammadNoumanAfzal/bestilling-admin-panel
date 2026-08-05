export const MY_NOTIFICATIONS_QUERY = `
  query MyNotifications($page: Int!, $pageSize: Int!, $status: String, $type: String) {
    myNotifications(page: $page, pageSize: $pageSize, status: $status, type: $type) {
      items {
        id
        title
        message
        type
        status
        createdAt
        readAt
        actionUrl
        entityId
        entityType
        metadata
      }
      pageInfo {
        page
        pageSize
        totalItems
        totalPages
        unreadCount
      }
    }
  }
`;

export const MY_NOTIFICATION_UNREAD_COUNT_QUERY = `
  query MyNotificationUnreadCount {
    myNotificationUnreadCount {
      count
    }
  }
`;

export const MARK_NOTIFICATION_READ_MUTATION = `
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      success
      message
      notification {
        id
        status
        readAt
      }
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ_MUTATION = `
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      success
      message
      count
    }
  }
`;

export const ARCHIVE_NOTIFICATION_MUTATION = `
  mutation ArchiveNotification($id: ID!) {
    archiveNotification(id: $id) {
      success
      message
    }
  }
`;
