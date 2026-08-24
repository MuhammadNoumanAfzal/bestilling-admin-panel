export const ADMIN_ORDERS_QUERY = `
  query AdminOrders($input: AdminOrdersInput!) {
    adminOrders(input: $input) {
      items {
        id
        orderNumber
        status
        paymentStatus
        eventType
        guestCount
        placedAt
        amount {
          currency
          total
        }
        customer {
          id
          fullName
          email
          phone
          avatarUrl
        }
        vendor {
          id
          businessName
          city
          avatarUrl
        }
      }
      summary {
        totalOrders
        paidOrders
        pendingOrders
        refundOrReviewOrders
        deliveredOrders
        totalRevenue
        currency
      }
      filterOptions {
        vendors {
          id
          label
        }
        statuses
        paymentStatuses
      }
    }
  }
`;

export const ADMIN_ORDER_DETAIL_QUERY = `
  query AdminOrderDetail($id: ID!) {
    adminOrder(id: $id) {
      id
      orderNumber
      status
      paymentStatus
      fulfillmentStatus
      placedAt
      acceptedAt
      preparedAt
      outForDeliveryAt
      deliveredAt
      canceledAt
      cancellationReason
      eventDate
      eventTime
      guestCount
      source
      specialInstructions
      orderNotes
      amount {
        currency
        subtotal
        tax
        deliveryFee
        serviceFee
        tip
        discount
        refundAmount
        refunded
        total
        formattedTotal
      }
      customer {
        id
        fullName
        email
        phone
        avatarUrl
        totalOrders
        totalSpent {
          amount
          currency
          formatted
        }
        defaultAddress {
          line1
          line2
          city
          postalCode
          country
        }
      }
      vendor {
        id
        businessName
        email
        phone
        city
        postalCode
        avatarUrl
        rating
        totalOrders
        address {
          city
          country
          line1
          line2
          postalCode
        }
      }
      delivery {
        type
        status
        scheduledAt
        deliveredAt
        recipientName
        recipientPhone
        city
        address {
          line1
          line2
          city
          postalCode
          country
        }
        rider {
          id
          fullName
          phone
        }
      }
      items {
        id
        name
        quantity
        unitPrice
        totalPrice
        notes
        imageUrl
        options {
          name
          value
        }
        addons {
          id
          name
          quantity
          unitPrice
          totalPrice
        }
      }
      payment {
        method
        provider
        transactionId
        providerReference
        capturedAt
        refundedAt
        invoiceUrl
        receiptUrl
      }
      flags {
        canMarkDelivered
        canCancel
        canRefund
        canUpdatePaymentStatus
        canAssignRider
        canReschedule
      }
    }
  }
`;

export const ADMIN_ORDER_STATUS_FALLBACK_QUERY = `
  query AdminOrderStatusFallback($search: String!, $page: Int!, $pageSize: Int!) {
    adminPayments(
      filters: {
        search: $search
      }
      pagination: {
        page: $page
        pageSize: $pageSize
      }
      sort: {
        field: CREATED_AT
        order: DESC
      }
    ) {
      items {
        id
        invoiceNumber
        order {
          id
          status
        }
      }
    }
  }
`;

export const ADMIN_UPDATE_ORDER_STATUS_MUTATION = `
  mutation AdminUpdateOrderStatus($input: AdminUpdateOrderStatusInput!) {
    adminUpdateOrderStatus(input: $input) {
      success
      message
      code
      order {
        id
        status
        deliveredAt
      }
    }
  }
`;

export const ADMIN_UPDATE_PAYMENT_STATUS_MUTATION = `
  mutation AdminUpdatePaymentStatus($input: AdminUpdatePaymentStatusInput!) {
    adminUpdatePaymentStatus(input: $input) {
      success
      message
      code
      order {
        id
        paymentStatus
      }
    }
  }
`;

export const ADMIN_CANCEL_ORDER_MUTATION = `
  mutation CancelOrder($input: CancelOrderInput!) {
    cancelOrder(input: $input) {
      success
      message
      order {
        id
        status
        canceledAt
      }
    }
  }
`;

export const ADMIN_REFUND_ORDER_MUTATION = `
  mutation RefundOrder($input: RefundOrderInput!) {
    refundOrder(input: $input) {
      success
      message
      refund {
        id
        status
        providerRefundId
        amount {
          amount
          currency
          formatted
        }
      }
      order {
        id
        status
        paymentStatus
      }
      payment {
        id
        status
      }
    }
  }
`;
export const ADMIN_ASSIGN_ORDER_RIDER_MUTATION = `
  mutation AdminAssignOrderRider($input: AdminAssignOrderRiderInput!) {
    adminAssignOrderRider(input: $input) {
      success
      message
      code
      order {
        id
      }
    }
  }
`;

export const ADMIN_UPDATE_DELIVERY_STATUS_MUTATION = `
  mutation AdminUpdateDeliveryStatus($input: AdminUpdateDeliveryStatusInput!) {
    adminUpdateDeliveryStatus(input: $input) {
      success
      message
      code
      order {
        id
        fulfillmentStatus
      }
    }
  }
`;

export const ADMIN_ORDER_ALLOWED_ACTIONS_QUERY = `
  query AdminOrderAllowedActions($orderId: ID!) {
    adminOrderAllowedActions(orderId: $orderId) {
      canMarkDelivered
      canCancel
      canRefund
      canUpdatePaymentStatus
      canAssignRider
      canReschedule
      reasonsBlocked
    }
  }
`;

export const ADMIN_ORDER_AUDIT_LOGS_QUERY = `
  query AdminOrderAuditLogs($orderId: ID!) {
    adminOrderAuditLogs(orderId: $orderId) {
      id
      action
      actorType
      actorId
      actorName
      beforeState
      afterState
      reason
      createdAt
    }
  }
`;

export const ADMIN_ORDER_PAYMENT_RECONCILIATION_QUERY = `
  query AdminOrderPaymentReconciliation($orderId: ID!) {
    adminOrderPaymentReconciliation(orderId: $orderId) {
      paymentId
      provider
      providerReference
      internalStatus
      providerStatus
      amountAuthorized
      amountCaptured
      amountRefunded
      currency
      lastSyncedAt
      mismatchFlag
    }
  }
`;

export const ADMIN_ADD_ORDER_NOTE_MUTATION = `
  mutation AdminAddOrderNote($input: AdminAddOrderNoteInput!) {
    adminAddOrderNote(input: $input) {
      success
      message
      code
      note {
        id
        message
        createdAt
        createdBy {
          id
          name
        }
      }
    }
  }
`;

export const ADMIN_ORDER_INVOICE_QUERY = `
  query AdminOrderInvoice($orderId: ID!) {
    adminOrderInvoice(orderId: $orderId) {
      orderId
      invoiceNumber
      invoiceUrl
      pdfUrl
      issuedAt
    }
  }
`;

export const ADMIN_EXPORT_ORDERS_MUTATION = `
  mutation AdminExportOrders($input: AdminExportOrdersInput!) {
    adminExportOrders(input: $input) {
      success
      message
      fileUrl
      fileName
    }
  }
`;

export const ADMIN_ORDER_CATEGORY_BREAKDOWN_QUERY = `
  query AdminOrderCategoryBreakdown($input: AdminOrderCategoryBreakdownInput!) {
    adminOrderCategoryBreakdown(input: $input) {
      items {
        label
        orderCount
        percentage
        revenue
      }
    }
  }
`;

export const COMMISSION_PREVIEW_FOR_ORDER_QUERY = `
  query CommissionPreviewForOrder($orderId: ID!) {
    commissionPreviewForOrder(orderId: $orderId) {
      orderId
      appliedRuleType
      appliedRuleId
      appliedRuleLabel
      commissionModel
      ratePercent
      grossOrderAmount {
        amount
        currency
        formatted
      }
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
    }
  }
`;
