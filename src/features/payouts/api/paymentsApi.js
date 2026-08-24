import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADMIN_VENDOR_PAYOUT_PROFILE_QUERY,
  ADMIN_PAYMENT_DETAIL_QUERY,
  ADMIN_PAYMENT_FINANCE_CONTRACT_QUERY,
  ADMIN_PAYMENTS_QUERY,
  APPROVE_VENDOR_PAYOUT_PROFILE_MUTATION,
  APPROVE_INVOICE_PAYMENT_MUTATION,
  MARK_INVOICE_PAID_MUTATION,
  MARK_CUSTOMER_PAYMENT_RECEIVED_MUTATION,
  MARK_VENDOR_PAYOUT_PAID_MUTATION,
  REQUEST_VENDOR_PAYOUT_PROFILE_CHANGES_MUTATION,
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

function normalizePayoutProfileStatus(status, isVerified = false) {
  const normalized = `${status ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "VERIFIED":
      return "Verified";
    case "CHANGES_REQUESTED":
      return "Changes requested";
    case "PENDING":
      return "Pending review";
    default:
      return isVerified ? "Verified" : "Pending review";
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

function parseMoneyAmount(value) {
  if (!value) {
    return Number.NaN;
  }

  if (typeof value === "object") {
    const amount = Number(value.amount ?? Number.NaN);
    return Number.isFinite(amount) ? amount : Number.NaN;
  }

  const numeric = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : Number.NaN;
}

function resolvePreferredMoneyLabel(primaryValue, fallbackValue, defaultValue = "NOK 0.00") {
  const primaryAmount = parseMoneyAmount(primaryValue);
  const fallbackAmount = parseMoneyAmount(fallbackValue);

  if (Number.isFinite(fallbackAmount) && fallbackAmount > 0 && (!Number.isFinite(primaryAmount) || primaryAmount <= 0)) {
    return typeof fallbackValue === "string" ? fallbackValue : formatMoneyLabel(fallbackValue, defaultValue);
  }

  if (primaryValue) {
    return typeof primaryValue === "string" ? primaryValue : formatMoneyLabel(primaryValue, defaultValue);
  }

  if (fallbackValue) {
    return typeof fallbackValue === "string" ? fallbackValue : formatMoneyLabel(fallbackValue, defaultValue);
  }

  return defaultValue;
}

function formatComputedMoney(amount, currency = "NOK") {
  return `${currency} ${amount.toFixed(2)}`;
}

function resolveVendorReceivesLabel({
  primaryVendorAmount,
  fallbackVendorPayable,
  orderAmount,
  commissionAmount,
}) {
  const vendorAmount = parseMoneyAmount(primaryVendorAmount);
  const fallbackVendorAmount = parseMoneyAmount(fallbackVendorPayable);
  const grossAmount = parseMoneyAmount(orderAmount);
  const commission = parseMoneyAmount(commissionAmount);

  if (Number.isFinite(fallbackVendorAmount) && fallbackVendorAmount > 0) {
    return typeof fallbackVendorPayable === "string"
      ? fallbackVendorPayable
      : formatMoneyLabel(fallbackVendorPayable, "NOK 0.00");
  }

  const preferredVendorLabel = resolvePreferredMoneyLabel(
    primaryVendorAmount,
    fallbackVendorPayable,
    "",
  );
  const normalizedVendorAmount = vendorAmount;

  if (
    Number.isFinite(grossAmount) &&
    Number.isFinite(commission) &&
    commission > 0 &&
    Number.isFinite(normalizedVendorAmount) &&
    Math.abs(normalizedVendorAmount - grossAmount) < 0.01
  ) {
    const currency =
      fallbackVendorPayable?.currency ||
      primaryVendorAmount?.currency ||
      orderAmount?.currency ||
      commissionAmount?.currency ||
      "NOK";

    return formatComputedMoney(Math.max(grossAmount - commission, 0), currency);
  }

  return preferredVendorLabel || "NOK 0.00";
}

function normalizeSummary(summary, rows = []) {
  const summaryCommissionAmount = parseMoneyAmount(summary?.platformCommission);
  const computedCommissionAmount = Array.isArray(rows)
    ? rows.reduce((sum, row) => sum + (parseMoneyAmount(row?.platformCommission) || 0), 0)
    : 0;
  const shouldUseComputedCommission =
    computedCommissionAmount > 0 &&
    (!Number.isFinite(summaryCommissionAmount) || summaryCommissionAmount <= 0);
  const summaryCommissionCurrency =
    summary?.platformCommission?.currency ||
    "NOK";

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
      value: shouldUseComputedCommission
        ? formatComputedMoney(computedCommissionAmount, summaryCommissionCurrency)
        : summary?.platformCommission?.formatted || "NOK 0.00",
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

function normalizeUnifiedSettlementHistory(items) {
  return Array.isArray(items)
    ? items.map((item) => ({
        id: item?.id || `${item?.type || "history"}-${item?.createdAt || ""}`,
        action: item?.title || item?.type || "Activity",
        actorType: item?.actorType || "",
        actorId: item?.actorId || "",
        actorName: item?.actorName || "",
        fromStatus: "",
        toStatus: "",
        note: item?.note || "",
        createdAt: item?.createdAt || "",
        createdAtLabel: formatDateTimeLabel(item?.createdAt),
        description: item?.description || "",
        transferReference: item?.transferReference || "",
        receiptUrl: item?.receiptUrl || "",
        paymentDate: item?.paymentDate || "",
      }))
    : [];
}

function normalizeContractInvoice(contract) {
  if (!contract?.id) {
    return null;
  }

  const vendorName = contract?.vendor?.businessName || contract?.vendor?.name || "Unknown vendor";
  const settlementHistory = normalizeUnifiedSettlementHistory(contract?.settlementHistory);
  const vendorPayoutProfile = contract?.vendor?.payoutProfile
    ? {
        id: contract.vendor.payoutProfile.id || "",
        vendorId: contract.vendor.payoutProfile.vendorId || contract.vendor.id || "",
        payoutMethod: contract.vendor.payoutProfile.payoutMethod || "BANK_TRANSFER",
        bankDetailsVerified: Boolean(contract.vendor.payoutProfile.bankDetailsVerified),
        verificationStatus: normalizePayoutProfileStatus(
          contract.vendor.payoutProfile.verificationStatus,
          contract.vendor.payoutProfile.bankDetailsVerified,
        ),
        verificationStatusRaw: contract.vendor.payoutProfile.verificationStatus || "",
        verificationNote: contract.vendor.payoutProfile.verificationNote || "",
        accountHolderName: contract.vendor.payoutProfile.accountHolderName || "",
        bankName: contract.vendor.payoutProfile.bankName || "",
        accountNumber: contract.vendor.payoutProfile.accountNumber || "",
        iban: contract.vendor.payoutProfile.iban || "",
        swiftBic: contract.vendor.payoutProfile.swiftBic || "",
        routingNumber: contract.vendor.payoutProfile.routingNumber || "",
        branchName: contract.vendor.payoutProfile.branchName || "",
        branchCode: contract.vendor.payoutProfile.branchCode || "",
        billingAddress: contract.vendor.payoutProfile.billingAddress || "",
        city: contract.vendor.payoutProfile.city || "",
        postalCode: contract.vendor.payoutProfile.postalCode || "",
        country: contract.vendor.payoutProfile.country || "",
        createdAt: contract.vendor.payoutProfile.createdAt || "",
        updatedAt: contract.vendor.payoutProfile.updatedAt || "",
        createdAtLabel: formatDateTimeLabel(contract.vendor.payoutProfile.createdAt),
        updatedAtLabel: formatDateTimeLabel(contract.vendor.payoutProfile.updatedAt),
      }
    : null;

  return {
    id: contract.id || "",
    invoiceId: contract.invoiceId || contract.id || "",
    payoutId: contract.payoutId || "",
    payoutNumber: contract.payoutNumber || "",
    settlementNumber: contract.settlementNumber || "Not available",
    paymentStatus: normalizeInvoiceContractStatus(contract.paymentStatus),
    paymentStatusRaw: contract.paymentStatus || "",
    payoutStatus: normalizePaymentStatus(contract.payoutStatus || contract.settlementStatus),
    settlementStatus: normalizeSettlementStatus(contract.settlementStatus),
    paymentMethod: contract.paymentMethod || "Not available",
    paymentReference: contract.transferReference || contract.invoiceNumber || "Not available",
    issuedAtLabel: formatDateTimeLabel(contract.paymentReportedAt),
    dueDateLabel: "Not available",
    paidAtLabel: formatDateTimeLabel(contract.paidAt),
    verifiedAtLabel: formatDateTimeLabel(contract.paymentApprovedAt),
    rejectedAtLabel: formatDateTimeLabel(contract.paymentRejectedAt),
    appliedRuleLabel: contract.appliedRuleLabel || "",
    appliedRuleDescription: contract.appliedRuleDescription || "",
    paymentReport: contract.receiptUrl || contract.transferReference || contract.paymentDate || contract.verificationNote
      ? {
          paymentDate: contract.paymentDate || "Not available",
          transferReference: contract.transferReference || "Not available",
          note: contract.verificationNote || contract.note || "",
          receiptUrl: contract.receiptUrl || "Not available",
          reportedAtLabel: formatDateTimeLabel(contract.paymentReportedAt),
        }
      : null,
    paymentHistory: settlementHistory,
    settlement: {
      id: contract.id || "",
      settlementNumber: contract.settlementNumber || "Not available",
      status: contract.settlementStatus || "Not available",
      statusLabel: normalizeSettlementStatus(contract.settlementStatus),
      grossOrderAmount: formatMoneyLabel(contract.grossAmount),
      taxAmount: formatMoneyLabel(contract.taxAmount),
      deliveryFee: formatMoneyLabel(contract.deliveryFee),
      serviceFee: formatMoneyLabel(contract.serviceFee),
      vendorPayable: formatMoneyLabel(contract.vendorPayable || contract.netAmount),
      fundedAtLabel: formatDateTimeLabel(contract.fundedAt),
      readyForPayoutAtLabel: formatDateTimeLabel(contract.readyForPayoutAt),
      settledAtLabel: formatDateTimeLabel(contract.settledAt),
      payoutId: contract.payoutId || "",
      history: settlementHistory,
      commission: {
        id: contract.id || "",
        status: contract.commissionSource || contract.settlementStatus || "Not available",
        model: contract.commissionModel || "Not available",
        ratePercentLabel:
          contract.commissionRate === 0 || contract.commissionRate
            ? `${contract.commissionRate}%`
            : "Not available",
        grossCommission: formatMoneyLabel(contract.grossCommission),
        totalCommission: formatMoneyLabel(contract.totalCommission),
        fixedFee: formatMoneyLabel(contract.fixedFee),
        vatOnCommission: formatMoneyLabel(contract.vatOnCommission),
        note: contract.commissionOverrideName || contract.adjustmentReason || contract.note || "",
        lockedAtLabel: formatDateTimeLabel(contract.lockedAt),
        adjustedAtLabel: formatDateTimeLabel(contract.adjustedAt),
      },
    },
    vendorName,
    vendorPayoutProfile,
  };
}

function normalizeAdminVendorPayoutProfile(profile, fallbackVendorId = "") {
  if (!profile?.id) {
    return null;
  }

  return {
    id: profile.id || "",
    vendorId: profile.vendorId || fallbackVendorId || "",
    payoutMethod: profile.payoutMethod || "BANK_TRANSFER",
    bankDetailsVerified: Boolean(profile.bankDetailsVerified),
    verificationStatus: normalizePayoutProfileStatus(
      profile.verificationStatus,
      profile.bankDetailsVerified,
    ),
    verificationStatusRaw: profile.verificationStatus || "",
    verificationNote: profile.verificationNote || "",
    accountHolderName: profile.accountHolderName || "",
    bankName: profile.bankName || "",
    accountNumber: profile.accountNumber || "",
    iban: profile.iban || "",
    swiftBic: profile.swiftBic || "",
    routingNumber: profile.routingNumber || "",
    branchName: profile.branchName || "",
    branchCode: profile.branchCode || "",
    billingAddress: profile.billingAddress || "",
    city: profile.city || "",
    postalCode: profile.postalCode || "",
    country: profile.country || "",
    createdAt: profile.createdAt || "",
    updatedAt: profile.updatedAt || "",
    createdAtLabel: formatDateTimeLabel(profile.createdAt),
    updatedAtLabel: formatDateTimeLabel(profile.updatedAt),
  };
}

function normalizePaymentRow(item, contractInvoice = null) {
  const customerName = item?.customer?.fullName || "Unknown customer";
  const vendorName = item?.vendor?.name || "Unknown vendor";
  const orderAmountSource = item?.orderAmount || contractInvoice?.settlement?.grossOrderAmount;
  const commissionSource =
    item?.platformCommission || contractInvoice?.settlement?.commission?.totalCommission;
  const vendorAmountSource = item?.vendorAmount || contractInvoice?.settlement?.vendorPayable;
  const orderAmountNumber = parseMoneyAmount(orderAmountSource);
  const commissionAmountNumber = parseMoneyAmount(commissionSource);
  const vendorAmountNumber = parseMoneyAmount(item?.vendorAmount);
  const computedVendorNet =
    Number.isFinite(orderAmountNumber) &&
    Number.isFinite(commissionAmountNumber) &&
    commissionAmountNumber > 0
      ? Math.max(orderAmountNumber - commissionAmountNumber, 0)
      : Number.NaN;
  const shouldUseComputedVendorNet =
    Number.isFinite(computedVendorNet) &&
    (!Number.isFinite(vendorAmountNumber) ||
      Math.abs(vendorAmountNumber - orderAmountNumber) < 0.01);
  const rowCurrency =
    item?.vendorAmount?.currency ||
    item?.orderAmount?.currency ||
    item?.platformCommission?.currency ||
    "NOK";
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
    orderAmount:
      resolvePreferredMoneyLabel(item?.orderAmount, contractInvoice?.settlement?.grossOrderAmount) ||
      "NOK 0.00",
    platformCommission:
      resolvePreferredMoneyLabel(
        item?.platformCommission,
        contractInvoice?.settlement?.commission?.totalCommission,
      ) || "NOK 0.00",
    vendorAmount: shouldUseComputedVendorNet
      ? formatComputedMoney(computedVendorNet, rowCurrency)
      : resolvePreferredMoneyLabel(item?.vendorAmount, contractInvoice?.settlement?.vendorPayable) ||
        "NOK 0.00",
    customerPaymentStatus: deriveCustomerPaymentStatus(item),
    vendorPayoutStatus: deriveVendorPayoutStatus(item),
    createdAt: item?.createdAt || "",
    paidAt: item?.paidAt || "",
    payoutReleasedAt: item?.payoutReleasedAt || "",
    date: formatDateLabel(item?.createdAt),
  };
}

function normalizePaymentDetail(payment, contractInvoice = null) {
  if (!payment?.id && !contractInvoice?.id) {
    return null;
  }

  const rawPayment = payment || {};
  const customerName =
    rawPayment.customer?.fullName ||
    contractInvoice?.customerName ||
    "Unknown customer";
  const vendorName =
    rawPayment.vendor?.name ||
    contractInvoice?.vendorName ||
    "Unknown vendor";
  const customerPaymentStatus =
    contractInvoice?.paymentStatus || deriveCustomerPaymentStatusFromDetail(rawPayment);
  const vendorPayoutStatus =
    contractInvoice?.settlement?.statusLabel || deriveVendorPayoutStatusFromDetail(rawPayment);
  const orderStatus =
    rawPayment.order?.delivery?.deliveredAt ||
    rawPayment.order?.deliveredAt
      ? "Delivered"
      : normalizeOrderStatus(
          rawPayment.order?.delivery?.status ||
          rawPayment.order?.fulfillmentStatus ||
          rawPayment.order?.status,
        );

  return {
    id: contractInvoice?.invoiceId || rawPayment.id,
    invoiceId: contractInvoice?.invoiceId || rawPayment.id || "",
    payoutId: contractInvoice?.payoutId || "",
    payoutNumber: contractInvoice?.payoutNumber || "",
    invoiceNumber: rawPayment.invoiceNumber || contractInvoice?.paymentReference || "Not available",
    notes: rawPayment.notes || contractInvoice?.settlement?.commission?.note || "",
    createdAt: rawPayment.createdAt || "",
    updatedAt: rawPayment.updatedAt || contractInvoice?.settlement?.settledAtLabel || "",
    createdAtLabel: formatDateTimeLabel(rawPayment.createdAt || rawPayment.order?.createdAt),
    updatedAtLabel: rawPayment.updatedAt ? formatDateTimeLabel(rawPayment.updatedAt) : formatDateTimeLabel(rawPayment.createdAt || rawPayment.order?.createdAt),
    order: {
      id: rawPayment.order?.id || "",
      status: orderStatus,
      createdAt: rawPayment.order?.createdAt || "",
      createdAtLabel: formatDateTimeLabel(rawPayment.order?.createdAt),
    },
    customer: {
      id: rawPayment.customer?.id || "",
      fullName: customerName,
      email: rawPayment.customer?.email || "",
      avatar: toInitials(customerName),
      avatarUrl: rawPayment.customer?.avatarUrl || "",
    },
    vendor: {
      id: rawPayment.vendor?.id || "",
      name: vendorName,
      city: rawPayment.vendor?.city || "",
      avatar: toInitials(vendorName),
      avatarUrl: rawPayment.vendor?.avatarUrl || "",
      contactName: rawPayment.vendor?.contactName || "",
      payoutProfile: contractInvoice?.vendorPayoutProfile || null,
    },
    financials: {
      orderAmount: resolvePreferredMoneyLabel(
        rawPayment.financials?.orderAmount,
        contractInvoice?.settlement?.grossOrderAmount,
      ) || "NOK 0.00",
      platformCommission: resolvePreferredMoneyLabel(
        rawPayment.financials?.platformCommission,
        contractInvoice?.settlement?.commission?.totalCommission,
      ) || "NOK 0.00",
      vendorAmount:
        resolveVendorReceivesLabel({
          primaryVendorAmount: rawPayment.financials?.vendorAmount,
          fallbackVendorPayable: contractInvoice?.settlement?.vendorPayable,
          orderAmount:
            rawPayment.financials?.orderAmount ||
            contractInvoice?.settlement?.grossOrderAmount,
          commissionAmount:
            rawPayment.financials?.platformCommission ||
            contractInvoice?.settlement?.commission?.totalCommission,
        }) || "NOK 0.00",
      refundAmount: rawPayment.financials?.refundAmount?.formatted || "NOK 0.00",
      taxAmount:
        resolvePreferredMoneyLabel(
          rawPayment.financials?.taxAmount,
          contractInvoice?.settlement?.taxAmount,
        ) ||
        "NOK 0.00",
    },
    statuses: {
      customerPaymentStatus,
      vendorPayoutStatus,
      orderStatus,
    },
    lifecycle: {
      paymentReceivedAt: rawPayment.lifecycle?.paymentReceivedAt || contractInvoice?.paidAtLabel || "",
      payoutScheduledAt:
        rawPayment.lifecycle?.payoutScheduledAt || contractInvoice?.settlement?.readyForPayoutAtLabel || "",
      payoutReleasedAt:
        rawPayment.lifecycle?.payoutReleasedAt || contractInvoice?.settlement?.readyForPayoutAtLabel || "",
      payoutCompletedAt:
        rawPayment.lifecycle?.payoutCompletedAt || contractInvoice?.settlement?.settledAtLabel || "",
      cancelledAt: rawPayment.lifecycle?.cancelledAt || "",
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
        timestamp: formatDateTimeLabel(rawPayment.lifecycle?.paymentReceivedAt || contractInvoice?.paidAtLabel),
        isComplete: Boolean(rawPayment.lifecycle?.paymentReceivedAt || contractInvoice?.paidAtLabel),
      },
      {
        id: "payout-scheduled",
        title: "Vendor Payout Scheduled",
        helperText: payment.lifecycle?.payoutScheduledAt
          ? "Vendor payout has been scheduled."
          : "Vendor payout has not been scheduled yet.",
        timestamp: formatDateTimeLabel(rawPayment.lifecycle?.payoutScheduledAt || contractInvoice?.settlement?.readyForPayoutAtLabel),
        isComplete: Boolean(rawPayment.lifecycle?.payoutScheduledAt || contractInvoice?.settlement?.readyForPayoutAtLabel),
      },
      {
        id: "payout-released",
        title: "Vendor Payout Released",
        helperText: payment.lifecycle?.payoutReleasedAt
          ? "Funds were released for vendor payout."
          : "Funds have not been released yet.",
        timestamp: formatDateTimeLabel(rawPayment.lifecycle?.payoutReleasedAt),
        isComplete: Boolean(rawPayment.lifecycle?.payoutReleasedAt),
      },
      {
        id: "payout-completed",
        title: "Vendor Payout Completed",
        helperText: payment.lifecycle?.payoutCompletedAt
          ? "Vendor payout was marked as completed."
          : "Vendor payout is still pending completion.",
        timestamp: formatDateTimeLabel(rawPayment.lifecycle?.payoutCompletedAt || contractInvoice?.settlement?.settledAtLabel),
        isComplete: Boolean(rawPayment.lifecycle?.payoutCompletedAt || contractInvoice?.settlement?.settledAtLabel),
      },
      ...(rawPayment.lifecycle?.cancelledAt
        ? [
            {
              id: "cancelled",
              title: "Payment Cancelled",
              helperText: "This payment was cancelled and no further transitions are expected.",
              timestamp: formatDateTimeLabel(rawPayment.lifecycle.cancelledAt),
              isComplete: true,
            },
          ]
        : []),
    ],
    activityItems: [
      ...(Array.isArray(rawPayment.activityLog)
        ? rawPayment.activityLog.map((item) => ({
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
      ...normalizeUnifiedSettlementHistory(contractInvoice?.settlement?.history).map((item) => ({
        id: `settlement-history-${item.id}`,
        title: item.action,
        helperText:
          [
            item.description,
            item.transferReference ? `Reference: ${item.transferReference}` : "",
            item.note,
          ]
            .filter(Boolean)
            .join(" - ") || "Recorded in settlement history.",
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

  const contractInvoicesById = new Map();
  const responseItems = Array.isArray(response.items)
    ? response.items
    : Array.isArray(response.edges)
      ? response.edges.map((edge) => edge?.node).filter(Boolean)
      : [];

  await Promise.all(
    responseItems.map(async (item) => {
      const invoiceId = item?.id;

      if (!invoiceId) {
        return;
      }

      try {
        const contractData = await executeProtectedGraphqlRequest(
          ADMIN_PAYMENT_FINANCE_CONTRACT_QUERY,
          { id: invoiceId },
        );
        const contractInvoice = normalizeContractInvoice(contractData?.adminPaymentFinanceContract);

        if (contractInvoice) {
          contractInvoicesById.set(invoiceId, contractInvoice);
        }
      } catch {
        // Keep the list resilient even when a per-row finance contract fails.
      }
    }),
  );

  return {
    rows: responseItems.map((item) =>
      normalizePaymentRow(item, contractInvoicesById.get(item?.id) || null),
    ),
    pageInfo: {
      page: Number(response.pageInfo?.page ?? filters?.page ?? 1),
      pageSize: Number(response.pageInfo?.pageSize ?? filters?.pageSize ?? 10),
      totalItems: Number(response.pageInfo?.totalItems ?? response.totalCount ?? 0),
      totalPages: Number(
        response.pageInfo?.totalPages ??
          Math.max(1, Math.ceil(Number(response.totalCount ?? 0) / Number(filters?.pageSize || 10))),
      ),
      hasNextPage: Boolean(response.pageInfo?.hasNextPage),
      hasPreviousPage: Boolean(response.pageInfo?.hasPreviousPage),
    },
    summaryCards: normalizeSummary(
      response.summary,
      responseItems.map((item) =>
        normalizePaymentRow(item, contractInvoicesById.get(item?.id) || null),
      ),
    ),
    filterOptions: {
      vendors: Array.isArray(response.filterOptions?.vendors)
        ? response.filterOptions.vendors
        : Array.from(
            new Map(
              responseItems
                .filter((item) => item?.vendor?.id)
                .map((item) => [
                  item.vendor.id,
                  {
                    id: item.vendor.id,
                    name: item.vendor.businessName || item.vendor.name || "Unknown vendor",
                  },
                ]),
            ).values(),
          ),
      statuses: [],
    },
  };
}

export async function getAdminPaymentDetailRequest(id) {
  const [data, contractData] = await Promise.all([
    executeProtectedGraphqlRequest(ADMIN_PAYMENT_DETAIL_QUERY, { id }),
    executeProtectedGraphqlRequest(ADMIN_PAYMENT_FINANCE_CONTRACT_QUERY, { id }).catch(
      () => null,
    ),
  ]);
  const contractInvoice = normalizeContractInvoice(contractData?.adminPaymentFinanceContract);
  const vendorId =
    contractData?.adminPaymentFinanceContract?.vendor?.id ||
    data?.adminPayment?.vendor?.id ||
    contractInvoice?.vendorPayoutProfile?.vendorId ||
    "";
  let adminPayoutProfile = null;

  if (vendorId) {
    const payoutProfileData = await executeProtectedGraphqlRequest(
      ADMIN_VENDOR_PAYOUT_PROFILE_QUERY,
      { vendorId },
    ).catch(() => null);
    adminPayoutProfile = normalizeAdminVendorPayoutProfile(
      payoutProfileData?.adminVendorPayoutProfile,
      vendorId,
    );
  }

  const payment = normalizePaymentDetail(data?.adminPayment, contractInvoice);

  if (!payment?.id) {
    throw new Error("Unable to load this payment.");
  }

  if (adminPayoutProfile) {
    payment.vendor = {
      ...payment.vendor,
      payoutProfile: adminPayoutProfile,
    };
  }

  return payment;
}

export async function approveVendorPayoutProfileRequest(vendorId, { verificationNote = "" } = {}) {
  const data = await executeProtectedGraphqlRequest(
    APPROVE_VENDOR_PAYOUT_PROFILE_MUTATION,
    {
      input: {
        vendorId,
        verificationNote: verificationNote || null,
      },
    },
  );
  const result = data?.approveVendorPayoutProfile;

  if (!result?.success || !result?.payoutProfile?.id) {
    throw new Error(getErrorMessage(result, "Unable to approve vendor bank details."));
  }

  return {
    message: result.message || "Vendor bank details approved.",
    payoutProfile: normalizeAdminVendorPayoutProfile(result.payoutProfile, vendorId),
  };
}

export async function requestVendorPayoutProfileChangesRequest(vendorId, { reason = "" } = {}) {
  const data = await executeProtectedGraphqlRequest(
    REQUEST_VENDOR_PAYOUT_PROFILE_CHANGES_MUTATION,
    {
      input: {
        vendorId,
        reason: reason || null,
      },
    },
  );
  const result = data?.requestVendorPayoutProfileChanges;

  if (!result?.success || !result?.payoutProfile?.id) {
    throw new Error(getErrorMessage(result, "Unable to request changes for vendor bank details."));
  }

  return {
    message: result.message || "Requested changes for vendor bank details.",
    payoutProfile: normalizeAdminVendorPayoutProfile(result.payoutProfile, vendorId),
  };
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
      input: {
        invoiceId: id,
        verificationNote: note || null,
      },
    },
  );
  const result = data?.approveInvoicePayment;

  if (!result?.success || !result?.payment?.id) {
    throw new Error(getErrorMessage(result, "Unable to approve invoice payment."));
  }

  return {
    message: result.message || "Invoice payment approved.",
    status: normalizePaymentStatus(result.payment.paymentStatus),
    paidAt: result.payment.fundedAt || "",
    verifiedAt: result.payment.paymentApprovedAt || "",
  };
}

export async function rejectInvoicePaymentRequest(id, { reason = "" } = {}) {
  const data = await executeProtectedGraphqlRequest(
    REJECT_INVOICE_PAYMENT_MUTATION,
    {
      input: {
        invoiceId: id,
        rejectionReason: reason || null,
      },
    },
  );
  const result = data?.rejectInvoicePayment;

  if (!result?.success || !result?.payment?.id) {
    throw new Error(getErrorMessage(result, "Unable to reject invoice payment."));
  }

  return {
    message: result.message || "Invoice payment rejected.",
    status: normalizePaymentStatus(result.payment.paymentStatus),
    rejectedAt: result.payment.paymentRejectedAt || "",
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
      input: {
        payoutId: id,
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
      input: {
        transferReference: reference || null,
        payoutId: id,
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
    payoutReference: result.payout.transferReference || "",
  };
}
