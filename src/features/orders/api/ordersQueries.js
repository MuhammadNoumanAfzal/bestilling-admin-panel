export const ADMIN_ORDERS_QUERY = `
  query AdminOrders($input: AdminOrdersInput!) {
    adminOrders(input: $input) {
      items {
        id
        orderNumber
        status
        paymentStatus
        fulfillmentStatus
        placedAt
        eventType
        amount {
          currency
          subtotal
          tax
          deliveryFee
          discount
          total
        }
        customer {
          fullName
          email
          phone
        }
        vendor {
          businessName
          phone
        }
        delivery {
        status
        recipientName
        city
        }
        flags {
        canMarkDelivered
        canCancel
        canRefund
        canUpdatePaymentStatus
        }
      }
      pageInfo {
        page
        limit
        totalItems
        totalPages
        hasNextPage
        hasPreviousPage
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
  query AdminOrderDetail($orderId: ID!) {
    adminOrderDetail(orderId: $orderId) {
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
      amount {
        currency
        subtotal
        tax
        deliveryFee
        serviceFee
        discount
        refundAmount
        total
      }
      customer {
        fullName
        email
        phone
      }
      vendor {
        businessName
        email
        phone
        city
        address
      }
      delivery {
        type
        status
        scheduledAt
        deliveredAt
        recipientName
        recipientPhone
        city
      }
      items {
        id
        menuItemId
        name
        quantity
        unitPrice
        totalPrice
        notes
      }
      timeline {
        key
        label
        status
        happenedAt
        description
      }
      payment {
        method
        transactionId
        provider
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
  mutation AdminCancelOrder($input: AdminCancelOrderInput!) {
    adminCancelOrder(input: $input) {
      success
      message
      code
      order {
        id
        status
        canceledAt
        cancellationReason
      }
    }
  }
`;

export const ADMIN_REFUND_ORDER_MUTATION = `
  mutation AdminRefundOrder($input: AdminRefundOrderInput!) {
    adminRefundOrder(input: $input) {
      success
      message
      code
      refund {
        id
        status
        amount
        processedAt
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
