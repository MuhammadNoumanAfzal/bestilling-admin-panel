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
        lifecycle {
          paymentReceivedAt
          payoutReleasedAt
          payoutCompletedAt
          cancelledAt
        }
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

export const ADMIN_PAYMENT_FINANCE_CONTRACT_QUERY = `
  query AdminPaymentFinanceContract($id: ID!) {
    adminPaymentFinanceContract(id: $id) {
      id
      invoiceId
      invoiceNumber
      payoutId
      payoutNumber
      settlementNumber
      paymentStatus
      payoutStatus
      settlementStatus
      fundedAt
      readyForPayoutAt
      lockedAt
      adjustedAt
      settledAt
      releasedAt
      paidAt
      paymentReceivedAt
      paymentReportedAt
      paymentApprovedAt
      paymentRejectedAt
      payoutReference
      transferReference
      adjustmentReason
      note
      paymentMethod
      provider
      paymentDate
      receiptUrl
      receiptFileName
      receiptContentType
      rejectionReason
      verificationNote
      appliedRuleLabel
      appliedRuleDescription
      commissionSource
      commissionOverrideName
      order {
        id
        orderNumber
        status
        fulfillmentStatus
        placedAt
        acceptedAt
        preparedAt
        outForDeliveryAt
        deliveredAt
        canceledAt
        eventType
        eventName
        guestCount
        specialInstructions
        deliveryType
        recipientName
        recipientPhone
        createdAt
        updatedAt
        delivery {
          status
          scheduledAt
          deliveredAt
          address
        }
      }
      customer {
        id
        fullName
        firstName
        lastName
        email
        phone
      }
      vendor {
        id
        businessName
        email
        phone
        city
        address
        payoutProfile {
          id
          vendorId
          payoutMethod
          bankDetailsVerified
          verificationStatus
          verificationNote
          accountHolderName
          bankName
          accountNumber
          iban
          swiftBic
          routingNumber
          branchName
          branchCode
          billingAddress
          city
          postalCode
          country
          createdAt
          updatedAt
        }
      }
      grossAmount {
        amount
        currency
        formatted
      }
      subtotalAmount {
        amount
        currency
        formatted
      }
      taxAmount {
        amount
        currency
        formatted
      }
      deliveryFee {
        amount
        currency
        formatted
      }
      serviceFee {
        amount
        currency
        formatted
      }
      tipAmount {
        amount
        currency
        formatted
      }
      discountAmount {
        amount
        currency
        formatted
      }
      refundedAmount {
        amount
        currency
        formatted
      }
      commissionModel
      commissionRate
      grossCommission {
        amount
        currency
        formatted
      }
      fixedFee {
        amount
        currency
        formatted
      }
      vatOnCommission {
        amount
        currency
        formatted
      }
      totalCommission {
        amount
        currency
        formatted
      }
      vendorPayable {
        amount
        currency
        formatted
      }
      vendorReceivable {
        amount
        currency
        formatted
      }
      netAmount {
        amount
        currency
        formatted
      }
      lineItems {
        id
        title
        quantity
        unitPrice {
          amount
          currency
          formatted
        }
        totalPrice {
          amount
          currency
          formatted
        }
      }
      settlementHistory {
        id
        type
        title
        description
        actorType
        actorId
        actorName
        note
        transferReference
        receiptUrl
        paymentDate
        createdAt
      }
    }
  }
`;

export const ADMIN_VENDOR_PAYOUT_PROFILE_QUERY = `
  query AdminVendorPayoutProfile($vendorId: ID!) {
    adminVendorPayoutProfile(vendorId: $vendorId) {
      id
      vendorId
      payoutMethod
      bankDetailsVerified
      verificationStatus
      verificationNote
      accountHolderName
      bankName
      accountNumber
      iban
      swiftBic
      routingNumber
      branchName
      branchCode
      billingAddress
      city
      postalCode
      country
      createdAt
      updatedAt
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
  mutation ApproveInvoicePayment($input: ApproveInvoicePaymentInput!) {
    approveInvoicePayment(input: $input) {
      success
      message
      payment {
        id
        invoiceNumber
        paymentStatus
        settlementStatus
        fundedAt
        paymentApprovedAt
        note
      }
    }
  }
`;

export const REJECT_INVOICE_PAYMENT_MUTATION = `
  mutation RejectInvoicePayment($input: RejectInvoicePaymentInput!) {
    rejectInvoicePayment(input: $input) {
      success
      message
      payment {
        id
        invoiceNumber
        paymentStatus
        paymentRejectedAt
        rejectionReason
        note
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
  mutation ReleaseVendorPayout($input: ReleaseVendorPayoutInput!) {
    releaseVendorPayout(input: $input) {
      success
      message
      payout {
        id
        payoutNumber
        status
        readyForPayoutAt
        releasedAt
        note
      }
    }
  }
`;

export const MARK_VENDOR_PAYOUT_PAID_MUTATION = `
  mutation MarkVendorPayoutPaid($input: MarkVendorPayoutPaidInput!) {
    markVendorPayoutPaid(input: $input) {
      success
      message
      payout {
        id
        payoutNumber
        status
        paidAt
        settledAt
        transferReference
        note
      }
    }
  }
`;

export const APPROVE_VENDOR_PAYOUT_PROFILE_MUTATION = `
  mutation ApproveVendorPayoutProfile($input: ApproveVendorPayoutProfileInput!) {
    approveVendorPayoutProfile(input: $input) {
      success
      message
      payoutProfile {
        id
        vendorId
        bankDetailsVerified
        verificationStatus
        verificationNote
        updatedAt
      }
    }
  }
`;

export const REQUEST_VENDOR_PAYOUT_PROFILE_CHANGES_MUTATION = `
  mutation RequestVendorPayoutProfileChanges($input: RequestVendorPayoutProfileChangesInput!) {
    requestVendorPayoutProfileChanges(input: $input) {
      success
      message
      payoutProfile {
        id
        vendorId
        bankDetailsVerified
        verificationStatus
        verificationNote
        updatedAt
      }
    }
  }
`;
