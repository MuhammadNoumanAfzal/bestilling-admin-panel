export const ADMIN_REPORTS_SNAPSHOT_QUERY = `
  query AdminReportsSnapshot(
    $dateFrom: DateTime
    $dateTo: DateTime
    $timezone: String!
  ) {
    adminReportsSnapshot(
      filters: {
        dateFrom: $dateFrom
        dateTo: $dateTo
        timezone: $timezone
      }
    ) {
      summary {
        totalRevenue {
          amount
          currency
          formatted
        }
        totalOrders
        activeVendors
        activeCustomers
        pendingApprovals
        averageOrderValue {
          amount
          currency
          formatted
        }
      }
      revenueAnalytics {
        title
        subtitle
        currency
        scale
        bars {
          label
          value
        }
      }
      orderAnalytics {
        title
        subtitle
        scale
        bars {
          label
          value
        }
      }
      customerAnalytics {
        stats {
          id
          label
          value
          note
        }
        satisfaction {
          score
          note
        }
      }
      categoryPerformance {
        id
        label
        value
        color
      }
      operationalHealth {
        id
        label
        value
      }
      vendorPerformance {
        registration {
          count
          note
        }
        topVendors {
          id
          name
          region
          revenue {
            amount
            currency
            formatted
          }
          orders
          avatarUrl
        }
      }
    }
  }
`;

export const EXPORT_ADMIN_REPORT_MUTATION = `
  mutation ExportAdminReport($input: ExportAdminReportInput!) {
    exportAdminReport(input: $input) {
      success
      message
      exportUrl
      fileName
      contentType
      expiresAt
      generatedAt
    }
  }
`;
