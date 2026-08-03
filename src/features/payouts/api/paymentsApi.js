import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADMIN_PAYMENT_DETAIL_QUERY,
  ADMIN_PAYMENTS_QUERY,
  MARK_CUSTOMER_PAYMENT_RECEIVED_MUTATION,
  MARK_VENDOR_PAYOUT_PAID_MUTATION,
} from "./paymentsQueries.js";

function getErrorMessage(result, fallbackMessage) {
  const firstError = result?.errors?.find((item) => item?.message)?.message;
  return firstError || result?.message || fallbackMessage;
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
    return "Pending update";
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

function toInitials(name) {
  return `${name ?? ""}`
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function normalizeOrderStatus(status) {
  const normalized = `${status ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "CANCELLED":
    case "CANCELED":
      return "Canceled";
    case "PENDING":
      return "Pending";
    default:
      return "Delivered";
  }
}

function normalizePaymentStatus(status) {
  const normalized = `${status ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "PAID":
      return "Paid";
    case "SCHEDULED":
      return "Scheduled";
    case "RELEASED":
      return "Released";
    case "CANCELLED":
    case "CANCELED":
      return "Canceled";
    default:
      return "Pending";
  }
}

function normalizeSummary(summary) {
  return [
    {
      id: "total",
      label: "Total Revenue",
      value: summary?.totalRevenue?.formatted || "NOK 0.00",
      accent: "soft",
    },
    {
      id: "commission",
      label: "Platform Commission",
      value: summary?.platformCommission?.formatted || "NOK 0.00",
      accent: "warm",
    },
    {
      id: "pending",
      label: "Pending Payouts",
      value: summary?.pendingPayouts?.formatted || "NOK 0.00",
      accent: "neutral",
    },
    {
      id: "completed",
      label: "Completed Payouts",
      value: summary?.completedPayouts?.formatted || "NOK 0.00",
      accent: "strong",
    },
  ];
}

function normalizePaymentRow(item) {
  const customerName = item?.customer?.fullName || "Unknown customer";
  const vendorName = item?.vendor?.name || "Unknown vendor";

  return {
    id: item?.id || "",
    invoiceNumber: item?.invoiceNumber || "Not available",
    orderId: item?.order?.id || "",
    orderStatus: normalizeOrderStatus(item?.order?.status),
    customer: customerName,
    customerEmail: item?.customer?.email || "",
    customerAvatar: toInitials(customerName),
    customerAvatarUrl: item?.customer?.avatarUrl || "",
    vendor: vendorName,
    vendorId: item?.vendor?.id || "",
    vendorCity: item?.vendor?.city || "",
    vendorAvatar: toInitials(vendorName),
    vendorAvatarUrl: item?.vendor?.avatarUrl || "",
    orderAmount: item?.orderAmount?.formatted || "NOK 0.00",
    platformCommission: item?.platformCommission?.formatted || "NOK 0.00",
    vendorAmount: item?.vendorAmount?.formatted || "NOK 0.00",
    customerPaymentStatus: normalizePaymentStatus(item?.customerPaymentStatus),
    vendorPayoutStatus: normalizePaymentStatus(item?.vendorPayoutStatus),
    createdAt: item?.createdAt || "",
    paidAt: item?.paidAt || "",
    payoutReleasedAt: item?.payoutReleasedAt || "",
    date: formatDateLabel(item?.createdAt),
  };
}

function normalizePaymentDetail(payment) {
  if (!payment?.id) {
    return null;
  }

  const customerName = payment.customer?.fullName || "Unknown customer";
  const vendorName = payment.vendor?.name || "Unknown vendor";

  return {
    id: payment.id,
    invoiceNumber: payment.invoiceNumber || "Not available",
    notes: payment.notes || "",
    createdAt: payment.createdAt || "",
    updatedAt: payment.updatedAt || "",
    createdAtLabel: formatDateTimeLabel(payment.createdAt),
    updatedAtLabel: formatDateTimeLabel(payment.updatedAt),
    order: {
      id: payment.order?.id || "",
      status: normalizeOrderStatus(payment.statuses?.orderStatus || payment.order?.status),
      createdAt: payment.order?.createdAt || "",
      createdAtLabel: formatDateTimeLabel(payment.order?.createdAt),
    },
    customer: {
      id: payment.customer?.id || "",
      fullName: customerName,
      email: payment.customer?.email || "",
      avatar: toInitials(customerName),
      avatarUrl: payment.customer?.avatarUrl || "",
    },
    vendor: {
      id: payment.vendor?.id || "",
      name: vendorName,
      city: payment.vendor?.city || "",
      avatar: toInitials(vendorName),
      avatarUrl: payment.vendor?.avatarUrl || "",
      contactName: payment.vendor?.contactName || "",
    },
    financials: {
      orderAmount: payment.financials?.orderAmount?.formatted || "NOK 0.00",
      platformCommission: payment.financials?.platformCommission?.formatted || "NOK 0.00",
      vendorAmount: payment.financials?.vendorAmount?.formatted || "NOK 0.00",
      refundAmount: payment.financials?.refundAmount?.formatted || "NOK 0.00",
      taxAmount: payment.financials?.taxAmount?.formatted || "NOK 0.00",
    },
    statuses: {
      customerPaymentStatus: normalizePaymentStatus(payment.statuses?.customerPaymentStatus),
      vendorPayoutStatus: normalizePaymentStatus(payment.statuses?.vendorPayoutStatus),
      orderStatus: normalizeOrderStatus(payment.statuses?.orderStatus),
    },
    lifecycle: {
      paymentReceivedAt: payment.lifecycle?.paymentReceivedAt || "",
      payoutScheduledAt: payment.lifecycle?.payoutScheduledAt || "",
      payoutReleasedAt: payment.lifecycle?.payoutReleasedAt || "",
      payoutCompletedAt: payment.lifecycle?.payoutCompletedAt || "",
      cancelledAt: payment.lifecycle?.cancelledAt || "",
    },
    timelineItems: [
      {
        id: "payment-received",
        title: "Customer Payment Received",
        helperText: payment.lifecycle?.paymentReceivedAt
          ? "Customer payment has been marked as received."
          : "Waiting for customer payment confirmation.",
        timestamp: formatDateTimeLabel(payment.lifecycle?.paymentReceivedAt),
        isComplete: Boolean(payment.lifecycle?.paymentReceivedAt),
      },
      {
        id: "payout-scheduled",
        title: "Vendor Payout Scheduled",
        helperText: payment.lifecycle?.payoutScheduledAt
          ? "Vendor payout has been scheduled."
          : "Vendor payout has not been scheduled yet.",
        timestamp: formatDateTimeLabel(payment.lifecycle?.payoutScheduledAt),
        isComplete: Boolean(payment.lifecycle?.payoutScheduledAt),
      },
      {
        id: "payout-released",
        title: "Vendor Payout Released",
        helperText: payment.lifecycle?.payoutReleasedAt
          ? "Funds were released for vendor payout."
          : "Funds have not been released yet.",
        timestamp: formatDateTimeLabel(payment.lifecycle?.payoutReleasedAt),
        isComplete: Boolean(payment.lifecycle?.payoutReleasedAt),
      },
      {
        id: "payout-completed",
        title: "Vendor Payout Completed",
        helperText: payment.lifecycle?.payoutCompletedAt
          ? "Vendor payout was marked as completed."
          : "Vendor payout is still pending completion.",
        timestamp: formatDateTimeLabel(payment.lifecycle?.payoutCompletedAt),
        isComplete: Boolean(payment.lifecycle?.payoutCompletedAt),
      },
      ...(payment.lifecycle?.cancelledAt
        ? [
            {
              id: "cancelled",
              title: "Payment Cancelled",
              helperText: "This payment was cancelled and no further transitions are expected.",
              timestamp: formatDateTimeLabel(payment.lifecycle.cancelledAt),
              isComplete: true,
            },
          ]
        : []),
    ],
    activityItems: Array.isArray(payment.activityLog)
      ? payment.activityLog.map((item) => ({
          id: item?.id || `${item?.title || "activity"}-${item?.createdAt || ""}`,
          title: item?.title || "Activity",
          helperText:
            [item?.description, item?.actor?.fullName ? `By ${item.actor.fullName}` : ""]
              .filter(Boolean)
              .join(" ") || "Recorded in the payment system.",
          timestamp: formatDateTimeLabel(item?.createdAt),
          isComplete: true,
        }))
      : [],
  };
}

function toIsoOrNull(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function getAdminPaymentsRequest(filters) {
  const data = await executeProtectedGraphqlRequest(ADMIN_PAYMENTS_QUERY, {
    search: filters?.search?.trim() || null,
    status: filters?.status || null,
    vendorId: filters?.vendorId || null,
    dateFrom: toIsoOrNull(filters?.dateFrom),
    dateTo: toIsoOrNull(filters?.dateTo),
    page: Number(filters?.page || 1),
    pageSize: Number(filters?.pageSize || 10),
    sortBy: filters?.sortBy || "CREATED_AT",
    sortOrder: filters?.sortOrder || "DESC",
  });

  const response = data?.adminPayments;
  if (!response) {
    throw new Error("Unable to load payments.");
  }

  return {
    rows: Array.isArray(response.items) ? response.items.map(normalizePaymentRow) : [],
    pageInfo: {
      page: Number(response.pageInfo?.page ?? filters?.page ?? 1),
      pageSize: Number(response.pageInfo?.pageSize ?? filters?.pageSize ?? 10),
      totalItems: Number(response.pageInfo?.totalItems ?? 0),
      totalPages: Number(response.pageInfo?.totalPages ?? 1),
      hasNextPage: Boolean(response.pageInfo?.hasNextPage),
      hasPreviousPage: Boolean(response.pageInfo?.hasPreviousPage),
    },
    summaryCards: normalizeSummary(response.summary),
    filterOptions: {
      vendors: Array.isArray(response.filterOptions?.vendors) ? response.filterOptions.vendors : [],
      statuses: Array.isArray(response.filterOptions?.statuses) ? response.filterOptions.statuses : [],
    },
  };
}

export async function getAdminPaymentDetailRequest(id) {
  const data = await executeProtectedGraphqlRequest(ADMIN_PAYMENT_DETAIL_QUERY, { id });
  const payment = normalizePaymentDetail(data?.adminPayment);

  if (!payment?.id) {
    throw new Error("Unable to load this payment.");
  }

  return payment;
}

export async function markCustomerPaymentReceivedRequest(id) {
  const data = await executeProtectedGraphqlRequest(MARK_CUSTOMER_PAYMENT_RECEIVED_MUTATION, { id });
  const result = data?.markCustomerPaymentReceived;

  if (!result?.success || !result?.payment?.id) {
    throw new Error(getErrorMessage(result, "Unable to mark customer payment received."));
  }

  return {
    message: result.message || "Customer payment marked as received.",
    status: normalizePaymentStatus(result.payment.statuses?.customerPaymentStatus),
    paymentReceivedAt: result.payment.lifecycle?.paymentReceivedAt || "",
  };
}

export async function markVendorPayoutPaidRequest(id) {
  const data = await executeProtectedGraphqlRequest(MARK_VENDOR_PAYOUT_PAID_MUTATION, { id });
  const result = data?.markVendorPayoutPaid;

  if (!result?.success || !result?.payment?.id) {
    throw new Error(getErrorMessage(result, "Unable to mark vendor payout paid."));
  }

  return {
    message: result.message || "Vendor payout marked as paid.",
    status: normalizePaymentStatus(result.payment.statuses?.vendorPayoutStatus),
    payoutCompletedAt: result.payment.lifecycle?.payoutCompletedAt || "",
  };
}
