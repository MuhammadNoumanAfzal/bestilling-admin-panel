import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADMIN_PAYMENT_DETAIL_QUERY,
  ADMIN_PAYMENT_FINANCE_CONTRACT_QUERY,
  ADMIN_PAYMENTS_QUERY,
  APPROVE_INVOICE_PAYMENT_MUTATION,
  MARK_INVOICE_PAID_MUTATION,
  MARK_CUSTOMER_PAYMENT_RECEIVED_MUTATION,
  MARK_VENDOR_PAYOUT_PAID_MUTATION,
  REJECT_INVOICE_PAYMENT_MUTATION,
  RELEASE_VENDOR_PAYOUT_MUTATION,
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
    case "ACCEPTED":
      return "Accepted";
    case "PREPARING":
    case "READY":
    case "FOOD_READY":
      return "Preparing";
    case "OUT_FOR_DELIVERY":
    case "IN_TRANSIT":
      return "Out for delivery";
    case "DELIVERED":
    case "COMPLETED":
      return "Delivered";
    case "PENDING":
    case "PLACED":
    case "NEW":
    case "DRAFT":
      return "Pending";
    default:
      return "Pending";
  }
}

function normalizePaymentStatus(status) {
  const normalized = `${status ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "PAID":
    case "PAYOUT_PAID":
      return "Paid";
    case "SCHEDULED":
      return "Scheduled";
    case "RELEASED":
    case "PAYOUT_RELEASED":
      return "Released";
    case "PAYMENT_REPORTED":
      return "Reported";
    case "PAYOUT_PENDING":
      return "Pending";
    case "PAYOUT_FAILED":
      return "Failed";
    case "CANCELLED":
    case "CANCELED":
      return "Canceled";
    case "REJECTED":
      return "Rejected";
    default:
      return "Pending";
  }
}

function normalizeInvoiceContractStatus(status) {
  const normalized = `${status ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "PAYMENT_REPORTED":
      return "Reported";
    case "PAID":
      return "Paid";
    case "OVERDUE":
      return "Overdue";
    case "REJECTED":
      return "Rejected";
    case "CANCELLED":
    case "CANCELED":
      return "Canceled";
    default:
      return "Pending";
  }
}

function normalizeSettlementStatus(status) {
  const normalized = `${status ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "SETTLED":
      return "Paid";
    case "INCLUDED_IN_PAYOUT":
      return "Released";
    case "READY_FOR_PAYOUT":
    case "FUNDED":
      return "Pending";
    case "DISPUTED":
      return "Failed";
    case "REFUNDED":
      return "Canceled";
    default:
      return "Pending";
  }
}

function formatMoneyLabel(value, fallback = "NOK 0.00") {
  if (!value) {
    return fallback;
  }

  if (value.formatted) {
    return value.formatted;
  }

  const amount = Number(value.amount ?? 0);
  const currency = value.currency || "NOK";

  if (!Number.isFinite(amount)) {
    return fallback;
  }

  return `${currency} ${amount.toFixed(2)}`;
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

function deriveCustomerPaymentStatus(item) {
  if (item?.lifecycle?.paymentReceivedAt || item?.paidAt) {
    return "Paid";
  }

  return "Pending";
}

function deriveVendorPayoutStatus(item) {
  if (item?.payoutReleasedAt) {
    return "Released";
  }

  return "Pending";
}

function hasActivityMatch(activityLog, patterns) {
  if (!Array.isArray(activityLog) || activityLog.length === 0) {
    return false;
  }

  return activityLog.some((item) => {
    const haystack = [
      item?.type,
      item?.title,
      item?.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toUpperCase();

    return patterns.some((pattern) => haystack.includes(pattern));
  });
}

function deriveCustomerPaymentStatusFromDetail(payment) {
  if (payment?.lifecycle?.paymentReceivedAt) {
    return "Paid";
  }

  if (hasActivityMatch(payment?.activityLog, ["REJECT", "PAYMENT_REJECTED"])) {
    return "Rejected";
  }

  if (
    hasActivityMatch(payment?.activityLog, [
      "PAYMENT_REPORTED",
      "REPORTED PAYMENT",
      "INVOICE_PAYMENT_REPORTED",
      "REPORT INVOICE PAYMENT",
    ])
  ) {
    return "Reported";
  }

  if (payment?.lifecycle?.cancelledAt) {
    return "Canceled";
  }

  return "Pending";
}

function deriveVendorPayoutStatusFromDetail(payment) {
  if (payment?.lifecycle?.payoutCompletedAt) {
    return "Paid";
  }

  if (payment?.lifecycle?.payoutReleasedAt) {
    return "Released";
  }

  if (payment?.lifecycle?.payoutScheduledAt) {
    return "Scheduled";
  }

  if (
    hasActivityMatch(payment?.activityLog, [
      "PAYOUT_FAILED",
      "FAILED PAYOUT",
    ])
  ) {
    return "Failed";
  }

  if (payment?.lifecycle?.cancelledAt) {
    return "Canceled";
  }

  return "Pending";
}

function normalizeContractHistory(items) {
  return Array.isArray(items)
    ? items.map((item) => ({
        id: item?.id || `${item?.action || "history"}-${item?.createdAt || ""}`,
        action: item?.action || "Activity",
        actorType: item?.actorType || "",
        actorId: item?.actorId || "",
        actorName: item?.actorName || "",
        fromStatus: item?.fromStatus || "",
        toStatus: item?.toStatus || "",
        note: item?.note || "",
        createdAt: item?.createdAt || "",
        createdAtLabel: formatDateTimeLabel(item?.createdAt),
      }))
    : [];
}

function normalizeContractInvoice(invoice) {
  if (!invoice?.id) {
    return null;
  }

  const settlement = invoice?.settlement || null;
  const commissionRecord = settlement?.commissionRecord || null;

  return {
    paymentStatus: normalizeInvoiceContractStatus(invoice.paymentStatus),
    paymentStatusRaw: invoice.paymentStatus || "",
    paymentMethod: invoice.paymentMethod || "Not available",
    paymentReference: invoice.paymentReference || invoice.invoiceNumber || "Not available",
    issuedAtLabel: formatDateTimeLabel(invoice.issuedAt),
    dueDateLabel: formatDateLabel(invoice.dueDate),
    paidAtLabel: formatDateTimeLabel(invoice.paidAt),
    verifiedAtLabel: formatDateTimeLabel(invoice.verifiedAt),
    rejectedAtLabel: formatDateTimeLabel(invoice.rejectedAt),
    paymentReport: invoice.paymentReport
      ? {
          paymentDate: invoice.paymentReport.paymentDate || "Not available",
          transferReference: invoice.paymentReport.transferReference || "Not available",
          note: invoice.paymentReport.note || "",
          receiptUrl: invoice.paymentReport.receiptUrl || "Not available",
          reportedAtLabel: formatDateTimeLabel(invoice.paymentReport.reportedAt),
        }
      : null,
    paymentHistory: normalizeContractHistory(invoice.paymentHistory),
    settlement: settlement
      ? {
          id: settlement.id || "",
          settlementNumber: settlement.settlementNumber || "Not available",
          status: settlement.status || "Not available",
          statusLabel: normalizeSettlementStatus(settlement.status),
          grossOrderAmount: formatMoneyLabel(settlement.grossOrderAmount),
          taxAmount: formatMoneyLabel(settlement.taxAmount),
          deliveryFee: formatMoneyLabel(settlement.deliveryFee),
          serviceFee: formatMoneyLabel(settlement.serviceFee),
          vendorPayable: formatMoneyLabel(settlement.vendorPayable),
          fundedAtLabel: formatDateTimeLabel(settlement.fundedAt),
          readyForPayoutAtLabel: formatDateTimeLabel(settlement.readyForPayoutAt),
          settledAtLabel: formatDateTimeLabel(settlement.settledAt),
          payoutId: settlement.payoutId || "",
          history: normalizeContractHistory(settlement.history),
          commission: commissionRecord
            ? {
                id: commissionRecord.id || "",
                status: commissionRecord.status || "Not available",
                model: commissionRecord.commissionModel || "Not available",
                ratePercentLabel:
                  commissionRecord.ratePercent === 0 || commissionRecord.ratePercent
                    ? `${commissionRecord.ratePercent}%`
                    : "Not available",
                grossCommission: formatMoneyLabel(commissionRecord.grossCommission),
                totalCommission: formatMoneyLabel(commissionRecord.totalCommission),
                fixedFee: formatMoneyLabel(commissionRecord.fixedFee),
                vatOnCommission: formatMoneyLabel(commissionRecord.vatOnCommission),
                note: commissionRecord.note || "",
                lockedAtLabel: formatDateTimeLabel(commissionRecord.lockedAt),
                adjustedAtLabel: formatDateTimeLabel(commissionRecord.adjustedAt),
              }
            : null,
        }
      : null,
  };
}

function normalizePaymentRow(item) {
  const customerName = item?.customer?.fullName || "Unknown customer";
  const vendorName = item?.vendor?.name || "Unknown vendor";
  const resolvedOrderStatus =
    item?.order?.delivery?.deliveredAt ||
    item?.order?.deliveredAt
      ? "Delivered"
      : normalizeOrderStatus(
          item?.order?.delivery?.status ||
          item?.order?.fulfillmentStatus ||
          item?.order?.status,
        );

  return {
    id: item?.id || "",
    invoiceNumber: item?.invoiceNumber || "Not available",
    orderId: item?.order?.id || "",
    orderStatus: resolvedOrderStatus,
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
    customerPaymentStatus: deriveCustomerPaymentStatus(item),
    vendorPayoutStatus: deriveVendorPayoutStatus(item),
    createdAt: item?.createdAt || "",
    paidAt: item?.paidAt || "",
    payoutReleasedAt: item?.payoutReleasedAt || "",
    date: formatDateLabel(item?.createdAt),
  };
}

function normalizePaymentDetail(payment, contractInvoice = null) {
  if (!payment?.id) {
    return null;
  }

  const customerName = payment.customer?.fullName || "Unknown customer";
  const vendorName = payment.vendor?.name || "Unknown vendor";
  const customerPaymentStatus =
    contractInvoice?.paymentStatus || deriveCustomerPaymentStatusFromDetail(payment);
  const vendorPayoutStatus =
    contractInvoice?.settlement?.statusLabel || deriveVendorPayoutStatusFromDetail(payment);
  const orderStatus =
    payment.order?.delivery?.deliveredAt ||
    payment.order?.deliveredAt
      ? "Delivered"
      : normalizeOrderStatus(
          payment.order?.delivery?.status ||
          payment.order?.fulfillmentStatus ||
          payment.order?.status,
        );

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
      status: orderStatus,
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
      orderAmount:
        payment.financials?.orderAmount?.formatted ||
        contractInvoice?.settlement?.grossOrderAmount ||
        "NOK 0.00",
      platformCommission:
        payment.financials?.platformCommission?.formatted ||
        contractInvoice?.settlement?.commission?.totalCommission ||
        "NOK 0.00",
      vendorAmount:
        payment.financials?.vendorAmount?.formatted ||
        contractInvoice?.settlement?.vendorPayable ||
        "NOK 0.00",
      refundAmount: payment.financials?.refundAmount?.formatted || "NOK 0.00",
      taxAmount:
        payment.financials?.taxAmount?.formatted ||
        contractInvoice?.settlement?.taxAmount ||
        "NOK 0.00",
    },
    statuses: {
      customerPaymentStatus,
      vendorPayoutStatus,
      orderStatus,
    },
    lifecycle: {
      paymentReceivedAt: payment.lifecycle?.paymentReceivedAt || contractInvoice?.paidAtLabel || "",
      payoutScheduledAt:
        payment.lifecycle?.payoutScheduledAt || contractInvoice?.settlement?.readyForPayoutAtLabel || "",
      payoutReleasedAt:
        payment.lifecycle?.payoutReleasedAt || contractInvoice?.settlement?.readyForPayoutAtLabel || "",
      payoutCompletedAt:
        payment.lifecycle?.payoutCompletedAt || contractInvoice?.settlement?.settledAtLabel || "",
      cancelledAt: payment.lifecycle?.cancelledAt || "",
    },
    contractInvoice,
    settlement: contractInvoice?.settlement || null,
    commission: contractInvoice?.settlement?.commission || null,
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
    activityItems: [
      ...(Array.isArray(payment.activityLog)
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
        : []),
      ...normalizeContractHistory(contractInvoice?.paymentHistory).map((item) => ({
        id: `invoice-history-${item.id}`,
        title: item.action,
        helperText:
          [
            [item.actorName, item.actorType].filter(Boolean).join(" | "),
            item.note,
          ]
            .filter(Boolean)
            .join(" - ") || "Recorded in invoice payment history.",
        timestamp: item.createdAtLabel,
        isComplete: true,
      })),
    ],
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
      statuses: [],
    },
  };
}

export async function getAdminPaymentDetailRequest(id) {
  const [data, contractData] = await Promise.all([
    executeProtectedGraphqlRequest(ADMIN_PAYMENT_DETAIL_QUERY, { id }),
    executeProtectedGraphqlRequest(ADMIN_PAYMENT_FINANCE_CONTRACT_QUERY, { invoiceId: id }).catch(
      () => null,
    ),
  ]);
  const contractInvoice = normalizeContractInvoice(contractData?.invoice);
  const payment = normalizePaymentDetail(data?.adminPayment, contractInvoice);

  if (!payment?.id) {
    throw new Error("Unable to load this payment.");
  }

  return payment;
}

export async function markCustomerPaymentReceivedRequest(id, { reference = "", note = "" } = {}) {
  const data = await executeProtectedGraphqlRequest(MARK_CUSTOMER_PAYMENT_RECEIVED_MUTATION, {
    id,
    reference: reference || null,
    note: note || null,
  });
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

export async function approveInvoicePaymentRequest(id, { note = "" } = {}) {
  const data = await executeProtectedGraphqlRequest(
    APPROVE_INVOICE_PAYMENT_MUTATION,
    {
      invoiceId: id,
      input: {
        note: note || null,
      },
    },
  );
  const result = data?.approveInvoicePayment;

  if (!result?.success || !result?.invoice?.id) {
    throw new Error(getErrorMessage(result, "Unable to approve invoice payment."));
  }

  return {
    message: result.message || "Invoice payment approved.",
    status: normalizePaymentStatus(result.invoice.paymentStatus),
    paidAt: result.invoice.paidAt || "",
    verifiedAt: result.invoice.verifiedAt || "",
  };
}

export async function rejectInvoicePaymentRequest(id, { reason = "" } = {}) {
  const data = await executeProtectedGraphqlRequest(
    REJECT_INVOICE_PAYMENT_MUTATION,
    {
      invoiceId: id,
      input: {
        reason: reason || null,
      },
    },
  );
  const result = data?.rejectInvoicePayment;

  if (!result?.success || !result?.invoice?.id) {
    throw new Error(getErrorMessage(result, "Unable to reject invoice payment."));
  }

  return {
    message: result.message || "Invoice payment rejected.",
    status: normalizePaymentStatus(result.invoice.paymentStatus),
    rejectedAt: result.invoice.rejectedAt || "",
  };
}

export async function markInvoicePaidRequest(id, { note = "" } = {}) {
  const data = await executeProtectedGraphqlRequest(MARK_INVOICE_PAID_MUTATION, {
    invoiceId: id,
    input: {
      note: note || null,
    },
  });
  const result = data?.markInvoicePaid;

  if (!result?.success || !result?.invoice?.id) {
    throw new Error(getErrorMessage(result, "Unable to mark invoice paid."));
  }

  return {
    message: result.message || "Invoice marked as paid.",
    status: normalizePaymentStatus(result.invoice.paymentStatus),
    paidAt: result.invoice.paidAt || "",
    verifiedAt: result.invoice.verifiedAt || "",
  };
}

export async function releaseVendorPayoutRequest(id, { note = "" } = {}) {
  const data = await executeProtectedGraphqlRequest(
    RELEASE_VENDOR_PAYOUT_MUTATION,
    {
      payoutId: id,
      input: {
        note: note || null,
      },
    },
  );
  const result = data?.releaseVendorPayout;

  if (!result?.success || !result?.payout?.id) {
    throw new Error(getErrorMessage(result, "Unable to release vendor payout."));
  }

  return {
    message: result.message || "Vendor payout released.",
    status: normalizePaymentStatus(result.payout.status),
    releasedAt: result.payout.releasedAt || "",
  };
}

export async function markVendorPayoutPaidRequest(id, { reference = "", note = "" } = {}) {
  const data = await executeProtectedGraphqlRequest(
    MARK_VENDOR_PAYOUT_PAID_MUTATION,
    {
      payoutId: id,
      input: {
        payoutReference: reference || null,
        note: note || null,
      },
    },
  );
  const result = data?.markVendorPayoutPaid;

  if (!result?.success || !result?.payout?.id) {
    throw new Error(getErrorMessage(result, "Unable to mark vendor payout paid."));
  }

  return {
    message: result.message || "Vendor payout marked as paid.",
    status: normalizePaymentStatus(result.payout.status),
    payoutCompletedAt: result.payout.paidAt || "",
    payoutReference: result.payout.payoutReference || "",
  };
}
