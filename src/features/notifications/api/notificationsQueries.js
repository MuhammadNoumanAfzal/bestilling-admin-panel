export const NOTIFICATIONS_QUERY = `
  query Notifications($filter: NotificationFilterInput, $pagination: PaginationInput) {
    notifications(filter: $filter, pagination: $pagination) {
      items {
        id
        code
        title
        message
        audienceType
        audienceId
        actorType
        actorId
        actorName
        entityType
        entityId
        entityCode
        priority
        channelInApp
        channelEmail
        channelSms
        isRead
        isArchived
        actionUrl
        createdAt
        readAt
        metadata
      }
      totalCount
      unreadCount
    }
  }
`;

export const NOTIFICATION_BELL_QUERY = `
  query NotificationBell {
    notificationBell {
      unreadCount
      items {
        id
        title
        message
        entityType
        entityId
        actionUrl
        isRead
        createdAt
      }
    }
  }
`;

export const NOTIFICATION_COUNTS_QUERY = `
  query NotificationCounts {
    notificationCounts {
      total
      unread
      archived
      highPriority
    }
  }
`;

export const MARK_NOTIFICATION_READ_MUTATION = `
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      notification {
        id
        isRead
        readAt
      }
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ_MUTATION = `
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      success
      unreadCount
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

export const UNARCHIVE_NOTIFICATION_MUTATION = `
  mutation UnarchiveNotification($id: ID!) {
    unarchiveNotification(id: $id) {
      id
      isArchived
    }
  }
`;
