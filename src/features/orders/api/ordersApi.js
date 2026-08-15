import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADMIN_ADD_ORDER_NOTE_MUTATION,
  ADMIN_ASSIGN_ORDER_RIDER_MUTATION,
  ADMIN_CANCEL_ORDER_MUTATION,
  ADMIN_EXPORT_ORDERS_MUTATION,
  ADMIN_ORDER_ALLOWED_ACTIONS_QUERY,
  ADMIN_ORDER_AUDIT_LOGS_QUERY,
  ADMIN_ORDER_CATEGORY_BREAKDOWN_QUERY,
  ADMIN_ORDER_DETAIL_QUERY,
  ADMIN_ORDER_INVOICE_QUERY,
  ADMIN_ORDER_PAYMENT_RECONCILIATION_QUERY,
  ADMIN_ORDERS_QUERY,
  ADMIN_REFUND_ORDER_MUTATION,
  ADMIN_UPDATE_DELIVERY_STATUS_MUTATION,
  ADMIN_UPDATE_ORDER_STATUS_MUTATION,
  ADMIN_UPDATE_PAYMENT_STATUS_MUTATION,
} from "./ordersQueries.js";

function getErrorMessage(result, fallbackMessage) {
  const firstError = result?.errors?.find((item) => item?.message)?.message;
  return firstError || result?.message || fallbackMessage;
}

function toInitials(value) {
  return `${value ?? ""}`
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function formatDateLabel(value, options = {}) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `${value}`;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

function formatDateTimeLabel(value) {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `${value}`;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatMoney(value, currency = "NOK") {
  if (value && typeof value === "object") {
    if (value.formatted) {
      return value.formatted;
    }

    return formatMoney(value.amount, value.currency || currency);
  }

  const amount = Number(value ?? 0);
  return `${currency} ${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getMoneyNumber(value) {
  if (value && typeof value === "object") {
    return Number(value.amount ?? 0);
  }

  return Number(value ?? 0);
}

function normalizeStatus(value) {
  const normalized = `${value ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "ACCEPTED":
      return "Accepted";
    case "PREPARING":
      return "Preparing";
    case "OUT_FOR_DELIVERY":
      return "Out for delivery";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
    case "CANCELED":
      return "Canceled";
    case "REFUNDED":
      return "Refunded";
    default:
      return "Pending";
  }
}

function normalizePaymentStatus(value) {
  const normalized = `${value ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "PAID":
      return "Paid";
    case "FAILED":
      return "Failed";
    case "REFUNDED":
      return "Refunded";
    case "PARTIALLY_REFUNDED":
      return "Partially refunded";
    default:
      return "Pending";
  }
}

function normalizeTimelineStatus(value) {
  const normalized = `${value ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "COMPLETED":
      return "completed";
    case "CURRENT":
      return "current";
    case "FAILED":
      return "failed";
    default:
      return "pending";
  }
}

function createTimelineStep(step) {
  return {
    key: step.key,
    label: step.label,
    status: step.status,
    happenedAt: step.happenedAt || "",
    happenedAtLabel: formatDateTimeLabel(step.happenedAt),
    description: step.description,
    actor: step.actor || "",
  };
}

function buildProductionTimeline(order) {
  const rawStatus = `${order?.status ?? ""}`.trim().toUpperCase();
  const rawPaymentStatus = `${order?.paymentStatus ?? ""}`.trim().toUpperCase();

  const placedAt = order?.placedAt || "";
  const acceptedAt = order?.acceptedAt || "";
  const preparedAt = order?.preparedAt || "";
  const outForDeliveryAt = order?.outForDeliveryAt || "";
  const deliveredAt = order?.deliveredAt || "";
  const canceledAt = order?.canceledAt || "";
  const refundedAt = order?.payment?.refundedAt || "";

  const currentStage =
    canceledAt || rawStatus === "CANCELLED" || rawStatus === "CANCELED"
      ? "canceled"
      : rawStatus === "REFUNDED" || rawPaymentStatus === "REFUNDED" || rawPaymentStatus === "PARTIALLY_REFUNDED"
      ? "refunded"
      : deliveredAt || rawStatus === "DELIVERED"
      ? "delivered"
      : outForDeliveryAt || rawStatus === "OUT_FOR_DELIVERY"
      ? "out_for_delivery"
      : preparedAt || rawStatus === "PREPARING"
      ? "preparing"
      : acceptedAt || rawStatus === "ACCEPTED" || rawStatus === "CONFIRMED"
      ? "accepted"
      : "placed";

  const steps = [
    createTimelineStep({
      key: "placed",
      label: "Placed",
      status: "completed",
      happenedAt: placedAt,
      description: "Customer placed the order.",
    }),
    createTimelineStep({
      key: "accepted",
      label: "Accepted",
      status:
        currentStage === "placed"
          ? "pending"
          : ["accepted", "preparing", "out_for_delivery", "delivered", "refunded"].includes(currentStage)
          ? "completed"
          : "failed",
      happenedAt: acceptedAt,
      description: "Vendor accepted and confirmed the order.",
    }),
    createTimelineStep({
      key: "preparing",
      label: "Preparing",
      status:
        currentStage === "preparing"
          ? "current"
          : ["out_for_delivery", "delivered", "refunded"].includes(currentStage)
          ? "completed"
          : currentStage === "canceled"
          ? "failed"
          : "pending",
      happenedAt: preparedAt,
      description: "Kitchen or vendor is preparing the order.",
    }),
    createTimelineStep({
      key: "out_for_delivery",
      label: "Out for delivery",
      status:
        currentStage === "out_for_delivery"
          ? "current"
          : ["delivered", "refunded"].includes(currentStage)
          ? "completed"
          : currentStage === "canceled"
          ? "failed"
          : "pending",
      happenedAt: outForDeliveryAt,
      description: "Order left the vendor and is on the way.",
    }),
    createTimelineStep({
      key: "delivered",
      label: "Delivered",
      status:
        currentStage === "delivered" || currentStage === "refunded"
          ? "completed"
          : currentStage === "canceled"
          ? "failed"
          : "pending",
      happenedAt: deliveredAt,
      description: "Order was delivered successfully.",
    }),
  ];

  if (currentStage === "canceled") {
    steps.push(
      createTimelineStep({
        key: "canceled",
        label: "Canceled",
        status: "failed",
        happenedAt: canceledAt,
        description: order?.cancellationReason
          ? `Order was canceled. Reason: ${order.cancellationReason}`
          : "Order was canceled before completion.",
      }),
    );
  }

  if (currentStage === "refunded") {
    steps.push(
      createTimelineStep({
        key: "refunded",
        label: rawPaymentStatus === "PARTIALLY_REFUNDED" ? "Partially refunded" : "Refunded",
        status: "completed",
        happenedAt: refundedAt,
        description:
          rawPaymentStatus === "PARTIALLY_REFUNDED"
            ? "A partial refund was processed for this order."
            : "The order payment was refunded.",
      }),
    );
  }

  return steps;
}

function buildAddressLabel(address) {
  if (!address) {
    return "Not provided";
  }

  if (typeof address === "string") {
    return address.trim() || "Not provided";
  }

  return [
    address.address,
    address.line1,
    address.line2,
    address.city,
    address.postCode,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ") || "Not provided";
}

function toIsoOrNull(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function buildOrdersInput(filters = {}) {
  const startDate = toIsoOrNull(filters.dateFrom);
  const endDate = toIsoOrNull(filters.dateTo);

  return {
    search: filters.search || null,
    vendorId: filters.vendorId || null,
    status: filters.status || null,
    paymentStatus: filters.paymentStatus || null,
    eventType: filters.eventType || null,
    dateRange: {
      startDate,
      endDate,
    },
    page: Number(filters.page ?? 1),
    limit: Number(filters.limit ?? 10),
    sort: {
      field: filters.sortField || "PLACED_AT",
      direction: filters.sortDirection || "DESC",
    },
  };
}

function buildCategoryBreakdownInput(filters = {}) {
  const startDate = toIsoOrNull(filters.dateFrom);
  const endDate = toIsoOrNull(filters.dateTo);

  return {
    vendorId: filters.vendorId || null,
    dateRange: {
      startDate,
      endDate,
    },
  };
}

function normalizeOrderRow(item) {
  const customerName = item?.customer?.fullName || "Unknown customer";
  const vendorName = item?.vendor?.businessName || "Unknown vendor";
  const currency = item?.amount?.currency || "NOK";

  return {
    id: item?.id || "",
    orderNumber: item?.orderNumber || item?.id || "Not available",
    customer: customerName,
    customerId: item?.customer?.id || "",
    customerEmail: item?.customer?.email || "",
    customerAvatar: toInitials(customerName),
    customerAvatarUrl: item?.customer?.avatarUrl || "",
    vendor: vendorName,
    vendorId: item?.vendor?.id || "",
    vendorCity: item?.vendor?.city || item?.delivery?.city || "",
    vendorAvatar: toInitials(vendorName),
    vendorAvatarUrl: item?.vendor?.avatarUrl || "",
    eventType: item?.eventType || "Not specified",
    guestCount: 0,
    placedAt: item?.placedAt || "",
    dateTime: formatDateTimeLabel(item?.placedAt),
    amount: formatMoney(item?.amount?.total, currency),
    amountValue: getMoneyNumber(item?.amount?.total),
    status: normalizeStatus(item?.status),
    rawStatus: `${item?.status ?? ""}`.trim().toUpperCase(),
    paymentStatus: normalizePaymentStatus(item?.paymentStatus),
    rawPaymentStatus: `${item?.paymentStatus ?? ""}`.trim().toUpperCase(),
    fulfillmentStatus: normalizeStatus(item?.fulfillmentStatus || item?.status),
    rawFulfillmentStatus: `${item?.fulfillmentStatus ?? item?.status ?? ""}`.trim().toUpperCase(),
    deliveryType: "",
    deliveryStatus: normalizeStatus(item?.delivery?.status || item?.status),
    rawDeliveryStatus: `${item?.delivery?.status ?? item?.status ?? ""}`.trim().toUpperCase(),
    scheduledAt: item?.placedAt || "",
    deliveredAt: "",
    flags: {
      canMarkDelivered: Boolean(item?.flags?.canMarkDelivered),
      canCancel: Boolean(item?.flags?.canCancel),
      canRefund: Boolean(item?.flags?.canRefund),
      canUpdatePaymentStatus: Boolean(item?.flags?.canUpdatePaymentStatus),
    },
    actions: {
      canCancel: Boolean(item?.flags?.canCancel),
      canRefund: Boolean(item?.flags?.canRefund),
      canMarkPaid: Boolean(item?.flags?.canUpdatePaymentStatus),
      canMarkDelivered: Boolean(item?.flags?.canMarkDelivered),
      canAssignVendor: false,
      canDownloadInvoice: true,
    },
  };
}

function normalizeSummary(summary) {
  return [
    {
      id: "total",
      title: "Total Orders",
      value: `${Number(summary?.totalOrders ?? 0)}`,
    },
    {
      id: "paid",
      title: "Paid Orders",
      value: `${Number(summary?.paidOrders ?? 0)}`,
    },
    {
      id: "pending",
      title: "Pending Orders",
      value: `${Number(summary?.pendingOrders ?? 0)}`,
    },
    {
      id: "review",
      title: "Refund / Review",
      value: `${Number(summary?.refundOrReviewOrders ?? 0)}`,
    },
    {
      id: "delivered",
      title: "Delivered Orders",
      value: `${Number(summary?.deliveredOrders ?? 0)}`,
    },
    {
      id: "revenue",
      title: "Revenue",
      value: formatMoney(summary?.totalRevenue, summary?.currency || "NOK"),
    },
  ];
}

function normalizeCategoryBreakdown(items) {
  return Array.isArray(items)
    ? items.map((item) => ({
        label: item?.label || "Uncategorized",
        orderCount: Number(item?.orderCount ?? 0),
        percentage: Number(item?.percentage ?? 0),
        revenue: formatMoney(item?.revenue, "NOK"),
      }))
    : [];
}

function normalizeOrderDetail(order) {
  if (!order?.id) {
    return null;
  }

  const currency = order?.amount?.currency || "NOK";
  const customerName = order?.customer?.fullName || "Unknown customer";
  const vendorName = order?.vendor?.businessName || "Unknown vendor";
  const itemCount = Array.isArray(order?.items)
    ? order.items.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0)
    : 0;

  return {
    id: order.id,
    orderNumber: order.orderNumber || order.id,
    status: normalizeStatus(order.status),
    rawStatus: `${order.status ?? ""}`.trim().toUpperCase(),
    paymentStatus: normalizePaymentStatus(order.paymentStatus),
    rawPaymentStatus: `${order.paymentStatus ?? ""}`.trim().toUpperCase(),
    fulfillmentStatus: normalizeStatus(order.fulfillmentStatus),
    placedAt: order.placedAt || "",
    placedAtLabel: formatDateTimeLabel(order.placedAt),
    acceptedAtLabel: formatDateTimeLabel(order.acceptedAt),
    preparedAtLabel: formatDateTimeLabel(order.preparedAt),
    outForDeliveryAtLabel: formatDateTimeLabel(order.outForDeliveryAt),
    deliveredAtLabel: formatDateTimeLabel(order.deliveredAt),
    canceledAtLabel: formatDateTimeLabel(order.canceledAt),
    cancellationReason: order.cancellationReason || "",
    eventType: order.delivery?.type || "Not specified",
    eventDate: order.eventDate ? formatDateLabel(order.eventDate) : "Not scheduled",
    eventTime: order.eventTime || "Not specified",
    guestCount: itemCount,
    source: "Admin order flow",
    specialInstructions: "No special instructions added.",
    amount: {
      subtotal: formatMoney(order?.amount?.subtotal, currency),
      tax: formatMoney(order?.amount?.tax, currency),
      deliveryFee: formatMoney(order?.amount?.deliveryFee, currency),
      serviceFee: formatMoney(order?.amount?.serviceFee, currency),
      discount: formatMoney(order?.amount?.discount, currency),
      refundAmount: formatMoney(order?.amount?.refundAmount, currency),
      total: formatMoney(order?.amount?.total, currency),
      balanceDue: formatMoney(
        Number(order?.amount?.total ?? 0) - Number(order?.amount?.refundAmount ?? 0),
        currency,
      ),
    },
    customer: {
      id: order?.customer?.id || "",
      fullName: customerName,
      email: order?.customer?.email || "",
      phone: order?.customer?.phone || "Not provided",
      avatar: toInitials(customerName),
      avatarUrl: order?.customer?.avatarUrl || "",
      totalOrders: 0,
      totalSpent: formatMoney(0, currency),
      address: "Not provided",
    },
    vendor: {
      id: order?.vendor?.id || "",
      businessName: vendorName,
      email: order?.vendor?.email || "",
      phone: order?.vendor?.phone || "Not provided",
      avatar: toInitials(vendorName),
      avatarUrl: order?.vendor?.avatarUrl || "",
      city: order?.vendor?.city || "Unknown",
      address: buildAddressLabel(order?.vendor?.address),
      totalOrders: 0,
      rating: 0,
    },
    delivery: {
      type: order?.delivery?.type || "DELIVERY",
      status: normalizeStatus(order?.delivery?.status),
      scheduledAt: formatDateTimeLabel(order?.delivery?.scheduledAt),
      deliveredAt: formatDateTimeLabel(order?.delivery?.deliveredAt),
      recipientName: order?.delivery?.recipientName || customerName,
      recipientPhone: order?.delivery?.recipientPhone || order?.customer?.phone || "Not provided",
      city: order?.delivery?.city || order?.delivery?.address?.city || "",
      address: buildAddressLabel(order?.vendor?.address),
      riderName: "Not assigned",
      riderPhone: "Not provided",
    },
    items: Array.isArray(order?.items)
      ? order.items.map((item) => ({
          id: item?.id || "",
          name: item?.name || "Unnamed item",
          imageUrl: "",
          quantity: Number(item?.quantity ?? 0),
          unitPrice: formatMoney(item?.unitPrice, currency),
          totalPrice: formatMoney(item?.totalPrice, currency),
          notes: item?.notes || "",
          addons: [],
        }))
      : [],
    timeline: buildProductionTimeline(order),
    payment: {
      method: order?.payment?.method || "Not specified",
      transactionId: order?.payment?.transactionId || "Not available",
      provider: order?.payment?.provider || "Not specified",
      capturedAt: formatDateTimeLabel(order?.payment?.capturedAt),
      refundedAt: formatDateTimeLabel(order?.payment?.refundedAt),
      invoiceUrl: order?.payment?.invoiceUrl || "",
      receiptUrl: order?.payment?.receiptUrl || "",
    },
    notes: [],
    flags: {
      canCancel: Boolean(order?.flags?.canCancel),
      canRefund: Boolean(order?.flags?.canRefund),
      canMarkPaid: Boolean(order?.flags?.canUpdatePaymentStatus),
      canMarkDelivered: Boolean(order?.flags?.canMarkDelivered),
      canAssignRider: Boolean(order?.flags?.canAssignRider),
      canReschedule: Boolean(order?.flags?.canReschedule),
    },
    actions: {
      canCancel: Boolean(order?.flags?.canCancel),
      canRefund: Boolean(order?.flags?.canRefund),
      canMarkPaid: Boolean(order?.flags?.canUpdatePaymentStatus),
      canMarkDelivered: Boolean(order?.flags?.canMarkDelivered),
      canAssignVendor: Boolean(order?.flags?.canAssignRider),
      canDownloadInvoice: Boolean(order?.payment?.invoiceUrl || order?.payment?.receiptUrl),
    },
    updatedAtLabel: formatDateTimeLabel(
      order?.deliveredAt ||
      order?.outForDeliveryAt ||
      order?.preparedAt ||
      order?.acceptedAt ||
      order?.canceledAt ||
      order?.placedAt,
    ),
  };
}

export async function getAdminOrdersRequest(filters) {
  const data = await executeProtectedGraphqlRequest(ADMIN_ORDERS_QUERY, {
    input: buildOrdersInput(filters),
  });
  const response = data?.adminOrders;

  if (!response) {
    throw new Error("Unable to load orders.");
  }

  return {
    rows: Array.isArray(response.items) ? response.items.map(normalizeOrderRow) : [],
    summaryCards: normalizeSummary(response.summary),
    pageInfo: {
      page: Number(filters?.page ?? 1),
      pageSize: Number(filters?.limit ?? 10),
      totalItems: Number(response?.pageInfo?.totalItems ?? response?.items?.length ?? 0),
      totalPages: Number(response?.pageInfo?.totalPages ?? 1),
      hasNextPage: Boolean(response?.pageInfo?.hasNextPage),
      hasPreviousPage: Boolean(response?.pageInfo?.hasPreviousPage),
    },
    filterOptions: {
      vendors: Array.isArray(response?.filterOptions?.vendors) ? response.filterOptions.vendors : [],
      statuses: Array.isArray(response?.filterOptions?.statuses)
        ? response.filterOptions.statuses.map(normalizeStatus)
        : [],
      paymentStatuses: Array.isArray(response?.filterOptions?.paymentStatuses)
        ? response.filterOptions.paymentStatuses.map(normalizePaymentStatus)
        : [],
      eventTypes: Array.isArray(response?.filterOptions?.eventTypes)
        ? response.filterOptions.eventTypes
        : [],
    },
  };
}

export async function getAdminOrderCategoryBreakdownRequest(filters) {
  const data = await executeProtectedGraphqlRequest(ADMIN_ORDER_CATEGORY_BREAKDOWN_QUERY, {
    input: buildCategoryBreakdownInput(filters),
  });

  return normalizeCategoryBreakdown(data?.adminOrderCategoryBreakdown?.items);
}

export async function getAdminOrderDetailRequest(orderId) {
  const data = await executeProtectedGraphqlRequest(ADMIN_ORDER_DETAIL_QUERY, { orderId });
  const detail = normalizeOrderDetail(data?.adminOrderDetail);

  if (!detail) {
    throw new Error("Unable to load order details.");
  }

  return detail;
}

export async function getAdminOrderAllowedActionsRequest(orderId) {
  const data = await executeProtectedGraphqlRequest(ADMIN_ORDER_ALLOWED_ACTIONS_QUERY, { orderId });
  return data?.adminOrderAllowedActions || null;
}

export async function getAdminOrderAuditLogsRequest(orderId) {
  const data = await executeProtectedGraphqlRequest(ADMIN_ORDER_AUDIT_LOGS_QUERY, { orderId });
  return Array.isArray(data?.adminOrderAuditLogs) ? data.adminOrderAuditLogs : [];
}

export async function getAdminOrderPaymentReconciliationRequest(orderId) {
  const data = await executeProtectedGraphqlRequest(ADMIN_ORDER_PAYMENT_RECONCILIATION_QUERY, { orderId });
  return data?.adminOrderPaymentReconciliation || null;
}

export async function updateOrderStatusRequest(input) {
  const data = await executeProtectedGraphqlRequest(ADMIN_UPDATE_ORDER_STATUS_MUTATION, {
    input,
  });
  const result = data?.adminUpdateOrderStatus;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to update order status."));
  }

  return result;
}

export async function updateOrderPaymentStatusRequest(input) {
  const data = await executeProtectedGraphqlRequest(ADMIN_UPDATE_PAYMENT_STATUS_MUTATION, {
    input,
  });
  const result = data?.adminUpdatePaymentStatus;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to update payment status."));
  }

  return result;
}

export async function cancelOrderRequest(input) {
  const data = await executeProtectedGraphqlRequest(ADMIN_CANCEL_ORDER_MUTATION, {
    input,
  });
  const result = data?.cancelOrder;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to cancel order."));
  }

  return result;
}

export async function refundOrderRequest(input) {
  const data = await executeProtectedGraphqlRequest(ADMIN_REFUND_ORDER_MUTATION, {
    input,
  });
  const result = data?.refundOrder;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to refund order."));
  }

  return result;
}

export async function assignOrderRiderRequest(input) {
  const data = await executeProtectedGraphqlRequest(ADMIN_ASSIGN_ORDER_RIDER_MUTATION, {
    input,
  });
  const result = data?.adminAssignOrderRider;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to assign rider."));
  }

  return result;
}

export async function updateDeliveryStatusRequest(input) {
  const data = await executeProtectedGraphqlRequest(ADMIN_UPDATE_DELIVERY_STATUS_MUTATION, {
    input,
  });
  const result = data?.adminUpdateDeliveryStatus;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to update delivery status."));
  }

  return result;
}

export async function addOrderNoteRequest(input) {
  const data = await executeProtectedGraphqlRequest(ADMIN_ADD_ORDER_NOTE_MUTATION, {
    input,
  });
  const result = data?.adminAddOrderNote;

  if (!result?.success || !result?.note) {
    throw new Error(getErrorMessage(result, "Unable to add order note."));
  }

  return {
    message: result.message || "Note added.",
    note: {
      id: result.note.id || "",
      message: result.note.message || "",
      createdAt: result.note.createdAt || "",
      createdAtLabel: formatDateTimeLabel(result.note.createdAt),
      createdBy: result.note.createdBy?.name || "Admin",
    },
  };
}

export async function getAdminOrderInvoiceRequest(orderId) {
  const data = await executeProtectedGraphqlRequest(ADMIN_ORDER_INVOICE_QUERY, { orderId });
  const invoice = data?.adminOrderInvoice;

  if (!invoice) {
    throw new Error("Unable to fetch order invoice.");
  }

  return invoice;
}

export async function exportAdminOrdersRequest(input) {
  const data = await executeProtectedGraphqlRequest(ADMIN_EXPORT_ORDERS_MUTATION, {
    input,
  });
  const result = data?.adminExportOrders;

  if (!result?.success || !result?.fileUrl) {
    throw new Error(getErrorMessage(result, "Unable to export orders."));
  }

  return result;
}
