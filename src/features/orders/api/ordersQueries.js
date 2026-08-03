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
        guestCount
        amount {
          currency
          subtotal
          tax
          deliveryFee
          serviceFee
          discount
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
        delivery {
          type
          scheduledAt
          city
        }
        flags {
          hasRefund
          needsReview
          hasDispute
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
        eventTypes
      }
    }
  }
`;

export const ADMIN_ORDER_DETAIL_QUERY = `
  query AdminOrderDetail($orderId: ID!) {
    adminOrder(orderId: $orderId) {
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
      eventType
      eventDate
      eventTime
      guestCount
      specialInstructions
      source
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
        id
        fullName
        email
        phone
        avatarUrl
        totalOrders
        totalSpent
        defaultAddress {
          line1
          line2
          city
          postalCode
        }
      }
      vendor {
        id
        businessName
        email
        phone
        avatarUrl
        city
        address {
          line1
          line2
          city
          postalCode
        }
        totalOrders
        rating
      }
      delivery {
        type
        status
        scheduledAt
        deliveredAt
        recipientName
        recipientPhone
        address {
          line1
          line2
          city
          postalCode
        }
        rider {
          id
          name
          phone
        }
      }
      items {
        id
        menuItemId
        name
        imageUrl
        quantity
        unitPrice
        totalPrice
        notes
        addons {
          id
          name
          price
        }
      }
      timeline {
        key
        label
        status
        happenedAt
        description
        actor {
          id
          name
          role
        }
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
      notes {
        id
        message
        createdAt
        createdBy {
          id
          name
        }
      }
      actions {
        canCancel
        canRefund
        canMarkPaid
        canMarkDelivered
        canAssignVendor
        canDownloadInvoice
      }
      updatedAt
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
        fulfillmentStatus
        updatedAt
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
        updatedAt
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
      order {
        id
        paymentStatus
      }
    }
  }
`;

export const ADMIN_ASSIGN_ORDER_VENDOR_MUTATION = `
  mutation AdminAssignOrderVendor($input: AdminAssignOrderVendorInput!) {
    adminAssignOrderVendor(input: $input) {
      success
      message
      code
      order {
        id
        vendor {
          id
          businessName
        }
      }
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
