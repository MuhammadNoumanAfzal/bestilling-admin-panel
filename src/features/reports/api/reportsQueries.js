export const ADMIN_REPORTS_CORE_SNAPSHOT_QUERY = `
  query AdminReportsCoreSnapshot(
    $dateFrom: DateTime
    $dateTo: DateTime
    $preset: String
    $timezone: String
  ) {
    adminReportsSnapshot(
      filters: {
        dateFrom: $dateFrom
        dateTo: $dateTo
        preset: $preset
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
        pendingApprovalsValue {
          amount
          currency
          formatted
        }
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
    }
  }
`;

export const ADMIN_REPORTS_VENDOR_PERFORMANCE_QUERY = `
  query AdminReportsVendorPerformance(
    $dateFrom: DateTime
    $dateTo: DateTime
    $preset: String
    $timezone: String
  ) {
    adminReportsSnapshot(
      filters: {
        dateFrom: $dateFrom
        dateTo: $dateTo
        preset: $preset
        timezone: $timezone
      }
    ) {
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
    }
  }
`;
