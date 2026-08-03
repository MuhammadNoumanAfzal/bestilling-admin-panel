export const ADMIN_DASHBOARD_OVERVIEW_QUERY = `
  query AdminDashboardOverview($input: AdminDashboardOverviewInput!) {
    adminDashboardOverview(input: $input) {
      stats {
        id
        title
        value
        rawValue
        currency
        note
        trend {
          direction
          percentage
          label
        }
      }
      chart {
        metricOptions
        defaultMetric
        points {
          label
          startDate
          endDate
          revenue
          orders
        }
      }
      vendorBreakdown {
        active
        pending
        outOfStock
        topRated
      }
      topPerformingVendors {
        id
        name
        rating
        avatarUrl
        totalOrders
        totalRevenue
        completionRate
      }
      approvals {
        id
        vendorId
        vendorName
        avatarUrl
        avatarInitials
        type
        location
        submittedAt
        submittedLabel
        status
        priority
        canApprove
        canReject
        canMarkReviewing
        canMarkPending
      }
      quickActions {
        key
        label
        route
        enabled
        requiredPermission
      }
    }
  }
`;

export const ADMIN_UPDATE_VENDOR_APPROVAL_STATUS_MUTATION = `
  mutation AdminUpdateVendorApprovalStatus($input: AdminUpdateVendorApprovalStatusInput!) {
    adminUpdateVendorApprovalStatus(input: $input) {
      success
      message
      approval {
        id
        status
        updatedAt
      }
    }
  }
`;
