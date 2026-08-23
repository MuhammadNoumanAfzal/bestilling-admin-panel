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
  mutation MarkCustomerPaymentReceived($id: ID!, $reference: String, $note: String) {
    markCustomerPaymentReceived(id: $id, reference: $reference, note: $note) {
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

export const APPROVE_INVOICE_PAYMENT_MUTATION = `
  mutation ApproveInvoicePayment($invoiceId: ID!, $input: ApproveInvoicePaymentInput) {
    approveInvoicePayment(invoiceId: $invoiceId, input: $input) {
      success
      message
      invoice {
        id
        invoiceNumber
        paymentStatus
        paidAt
        verifiedAt
      }
    }
  }
`;

export const REJECT_INVOICE_PAYMENT_MUTATION = `
  mutation RejectInvoicePayment($invoiceId: ID!, $input: RejectInvoicePaymentInput!) {
    rejectInvoicePayment(invoiceId: $invoiceId, input: $input) {
      success
      message
      invoice {
        id
        invoiceNumber
        paymentStatus
        rejectedAt
      }
    }
  }
`;

export const MARK_INVOICE_PAID_MUTATION = `
  mutation MarkInvoicePaid($invoiceId: ID!, $input: MarkInvoicePaidInput) {
    markInvoicePaid(invoiceId: $invoiceId, input: $input) {
      success
      message
      invoice {
        id
        invoiceNumber
        paymentStatus
        paidAt
        verifiedAt
      }
    }
  }
`;

export const RELEASE_VENDOR_PAYOUT_MUTATION = `
  mutation ReleaseVendorPayout($payoutId: ID!, $input: ReleaseVendorPayoutInput) {
    releaseVendorPayout(payoutId: $payoutId, input: $input) {
      success
      message
      payout {
        id
        payoutNumber
        status
        releasedAt
      }
    }
  }
`;

export const MARK_VENDOR_PAYOUT_PAID_MUTATION = `
  mutation MarkVendorPayoutPaid($payoutId: ID!, $input: MarkVendorPayoutPaidInput!) {
    markVendorPayoutPaid(payoutId: $payoutId, input: $input) {
      success
      message
      payout {
        id
        payoutNumber
        status
        paidAt
        payoutReference
      }
    }
  }
`;
