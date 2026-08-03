export const ADMIN_PAYMENTS_QUERY = `
  query AdminPayments(
    $search: String
    $status: PaymentStatusFilter
    $vendorId: ID
    $dateFrom: DateTime
    $dateTo: DateTime
    $page: Int!
    $pageSize: Int!
    $sortBy: PaymentSortField
    $sortOrder: SortOrder
  ) {
    adminPayments(
      filters: {
        search: $search
        status: $status
        vendorId: $vendorId
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
        invoiceNumber
        order {
          id
          status
        }
        customer {
          id
          fullName
          email
          avatarUrl
        }
        vendor {
          id
          name
          city
          avatarUrl
        }
        orderAmount {
          amount
          currency
          formatted
        }
        platformCommission {
          amount
          currency
          formatted
        }
        vendorAmount {
          amount
          currency
          formatted
        }
        customerPaymentStatus
        vendorPayoutStatus
        createdAt
        paidAt
        payoutReleasedAt
      }
      pageInfo {
        page
        pageSize
        totalItems
        totalPages
        hasNextPage
        hasPreviousPage
      }
      summary {
        totalRevenue {
          amount
          currency
          formatted
        }
        platformCommission {
          amount
          currency
          formatted
        }
        pendingPayouts {
          amount
          currency
          formatted
        }
        completedPayouts {
          amount
          currency
          formatted
        }
      }
      filterOptions {
        vendors {
          id
          name
        }
        statuses
      }
    }
  }
`;

export const ADMIN_PAYMENT_DETAIL_QUERY = `
  query AdminPaymentDetail($id: ID!) {
    adminPayment(id: $id) {
      id
      invoiceNumber
      notes
      createdAt
      updatedAt
      order {
        id
        status
        createdAt
      }
      customer {
        id
        fullName
        email
        avatarUrl
      }
      vendor {
        id
        name
        city
        avatarUrl
        contactName
      }
      financials {
        orderAmount {
          amount
          currency
          formatted
        }
        platformCommission {
          amount
          currency
          formatted
        }
        vendorAmount {
          amount
          currency
          formatted
        }
        refundAmount {
          amount
          currency
          formatted
        }
        taxAmount {
          amount
          currency
          formatted
        }
      }
      statuses {
        customerPaymentStatus
        vendorPayoutStatus
        orderStatus
      }
      lifecycle {
        paymentReceivedAt
        payoutScheduledAt
        payoutReleasedAt
        payoutCompletedAt
        cancelledAt
      }
      activityLog {
        id
        type
        title
        description
        createdAt
        actor {
          id
          fullName
        }
      }
    }
  }
`;

export const MARK_CUSTOMER_PAYMENT_RECEIVED_MUTATION = `
  mutation MarkCustomerPaymentReceived($id: ID!) {
    markCustomerPaymentReceived(id: $id) {
      success
      message
      errors {
        field
        message
        code
      }
      payment {
        id
        statuses {
          customerPaymentStatus
        }
        lifecycle {
          paymentReceivedAt
        }
      }
    }
  }
`;

export const MARK_VENDOR_PAYOUT_PAID_MUTATION = `
  mutation MarkVendorPayoutPaid($id: ID!) {
    markVendorPayoutPaid(id: $id) {
      success
      message
      errors {
        field
        message
        code
      }
      payment {
        id
        statuses {
          vendorPayoutStatus
        }
        lifecycle {
          payoutCompletedAt
        }
      }
    }
  }
`;
