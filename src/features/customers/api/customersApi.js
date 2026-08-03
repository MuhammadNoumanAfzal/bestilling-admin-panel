import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADMIN_CUSTOMERS_QUERY,
  ADMIN_CUSTOMER_DETAIL_QUERY,
  BLOCK_CUSTOMER_MUTATION,
  DEACTIVATE_CUSTOMER_MUTATION,
  UNBLOCK_CUSTOMER_MUTATION,
  UPDATE_CUSTOMER_PROFILE_MUTATION,
} from "./customersQueries.js";

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

function toInitials(name) {
  return `${name ?? ""}`
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function normalizeStatus(status) {
  const normalized = `${status ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "BLOCKED":
      return "Blocked";
    case "INACTIVE":
      return "Inactive";
    default:
      return "Active";
  }
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

function normalizeTicketStatus(status) {
  const normalized = `${status ?? ""}`.trim().toUpperCase();

  return normalized === "RESOLVED" ? "Resolved" : "Open";
}

function normalizeCustomerRow(item) {
  const fullName = item?.fullName || "Unknown customer";

  return {
    id: item?.id || "",
    name: fullName,
    fullName,
    email: item?.email || "",
    phone: item?.phone || "",
    city: item?.city || "Unknown",
    totalOrders: Number(item?.totalOrders ?? 0),
    amount: item?.totalSpend?.formatted || "NOK 0.00",
    averageOrderValue: item?.averageOrderValue?.formatted || "NOK 0.00",
    amountValue: Number(item?.totalSpend?.amount ?? 0),
    status: normalizeStatus(item?.status),
    rawStatus: `${item?.status ?? ""}`.trim().toUpperCase() || "ACTIVE",
    avatar: toInitials(fullName),
    avatarUrl: item?.avatarUrl || "",
    joinDate: formatDateLabel(item?.joinedAt),
    joinDateValue: item?.joinedAt || "",
  };
}

function normalizeCustomerSummary(summary) {
  return [
    {
      id: "total",
      label: "Total Customers",
      value: `${Number(summary?.totalCustomers ?? 0)}`,
      accent: "soft",
    },
    {
      id: "active",
      label: "Active Customers",
      value: `${Number(summary?.activeCustomers ?? 0)}`,
      accent: "warm",
    },
    {
      id: "new",
      label: "New This Month",
      value: `${Number(summary?.newThisMonth ?? 0)}`,
      accent: "neutral",
    },
    {
      id: "orders",
      label: "Total Orders",
      value: `${Number(summary?.totalOrders ?? 0)}`,
      accent: "strong",
    },
    {
      id: "average",
      label: "Avg. Order Value",
      value: summary?.averageOrderValue?.formatted || "NOK 0.00",
      accent: "soft",
    },
    {
      id: "spending",
      label: "Total Spending",
      value: summary?.totalSpending?.formatted || "NOK 0.00",
      accent: "warm",
    },
  ];
}

function normalizeCustomerDetail(customer) {
  if (!customer?.id) {
    return null;
  }

  const fullName = customer.fullName || [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Unknown customer";

  return {
    id: customer.id,
    name: fullName,
    fullName,
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    email: customer.email || "",
    phone: customer.phone || "",
    city: customer.city || "",
    status: normalizeStatus(customer.status),
    rawStatus: `${customer.status ?? ""}`.trim().toUpperCase() || "ACTIVE",
    avatar: toInitials(fullName),
    avatarUrl: customer.avatarUrl || "",
    joinDate: formatDateLabel(customer.joinedAt),
    joinDateValue: customer.joinedAt || "",
    totalOrders: Number(customer.totalOrders ?? 0),
    totalSpend: customer.totalSpend?.formatted || "NOK 0.00",
    averageOrderValue: customer.averageOrderValue?.formatted || "NOK 0.00",
    profile: {
      companyName: customer.profile?.companyName || "",
      preferredContactMethod: customer.profile?.preferredContactMethod || "Not specified",
      lastLoginAt: customer.profile?.lastLoginAt ? formatDateLabel(customer.profile.lastLoginAt, {
        hour: "2-digit",
        minute: "2-digit",
      }) : "Not available",
      isEmailVerified: Boolean(customer.profile?.isEmailVerified),
      notes: customer.profile?.notes || "",
    },
    orderHistory: {
      summary: {
        totalOrders: Number(customer.orderHistory?.summary?.totalOrders ?? 0),
        totalDelivered: Number(customer.orderHistory?.summary?.totalDelivered ?? 0),
        totalCancelled: Number(customer.orderHistory?.summary?.totalCancelled ?? 0),
        totalSpent: customer.orderHistory?.summary?.totalSpent?.formatted || "NOK 0.00",
      },
      items: Array.isArray(customer.orderHistory?.items)
        ? customer.orderHistory.items.map((item) => ({
            id: item?.id || "",
            vendor: item?.vendor?.name || "Unknown vendor",
            vendorId: item?.vendor?.id || "",
            eventType: item?.eventType || "Not specified",
            guests: Number(item?.guestCount ?? 0),
            dateTime: item?.dateTime
              ? new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(item.dateTime))
              : "Not scheduled",
            amount: item?.amount?.formatted || "NOK 0.00",
            amountValue: Number(item?.amount?.amount ?? 0),
            status: normalizeOrderStatus(item?.status),
          }))
        : [],
    },
    reviews: {
      summary: {
        totalReviews: Number(customer.reviews?.summary?.totalReviews ?? 0),
        averageRating: Number(customer.reviews?.summary?.averageRating ?? 0),
      },
      items: Array.isArray(customer.reviews?.items)
        ? customer.reviews.items.map((item) => ({
            id: item?.id || "",
            name: item?.vendor?.name || "Vendor review",
            rating: Number(item?.rating ?? 0),
            orderRef: item?.orderReference || "",
            content: item?.content || "",
            avatarUrl: item?.vendor?.avatarUrl || "",
            createdAt: item?.createdAt ? formatDateLabel(item.createdAt) : "",
          }))
        : [],
    },
    supportTickets: {
      summary: {
        totalTickets: Number(customer.supportTickets?.summary?.totalTickets ?? 0),
        openTickets: Number(customer.supportTickets?.summary?.openTickets ?? 0),
        resolvedTickets: Number(customer.supportTickets?.summary?.resolvedTickets ?? 0),
      },
      items: Array.isArray(customer.supportTickets?.items)
        ? customer.supportTickets.items.map((item) => ({
            id: item?.id || "",
            subject: item?.subject || "",
            status: normalizeTicketStatus(item?.status),
            createdDate: item?.createdAt ? formatDateLabel(item.createdAt) : "Not available",
          }))
        : [],
    },
  };
}

function toIsoOrNull(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

export async function getAdminCustomersRequest(filters) {
  const data = await executeProtectedGraphqlRequest(ADMIN_CUSTOMERS_QUERY, {
    search: filters?.search?.trim() || null,
    status: filters?.status || null,
    city: filters?.city || null,
    registeredFrom: toIsoOrNull(filters?.registeredFrom),
    registeredTo: toIsoOrNull(filters?.registeredTo),
    page: Number(filters?.page || 1),
    pageSize: Number(filters?.pageSize || 10),
    sortBy: filters?.sortBy || "joinedAt",
    sortOrder: filters?.sortOrder || "DESC",
  });

  const response = data?.adminCustomers;
  if (!response) {
    throw new Error("Unable to load customers.");
  }

  return {
    rows: Array.isArray(response.items) ? response.items.map(normalizeCustomerRow) : [],
    pageInfo: {
      page: Number(response.pageInfo?.page ?? filters?.page ?? 1),
      pageSize: Number(response.pageInfo?.pageSize ?? filters?.pageSize ?? 10),
      totalItems: Number(response.pageInfo?.totalItems ?? 0),
      totalPages: Number(response.pageInfo?.totalPages ?? 1),
      hasNextPage: Boolean(response.pageInfo?.hasNextPage),
      hasPreviousPage: Boolean(response.pageInfo?.hasPreviousPage),
    },
    filterOptions: {
      cities: Array.isArray(response.filterOptions?.cities) ? response.filterOptions.cities : [],
      statuses: Array.isArray(response.filterOptions?.statuses) ? response.filterOptions.statuses : [],
    },
    summaryCards: normalizeCustomerSummary(response.summary),
  };
}

export async function getAdminCustomerDetailRequest(id) {
  const data = await executeProtectedGraphqlRequest(ADMIN_CUSTOMER_DETAIL_QUERY, { id });
  const customer = normalizeCustomerDetail(data?.adminCustomer);

  if (!customer?.id) {
    throw new Error("Unable to load this customer.");
  }

  return customer;
}

export async function updateCustomerProfileRequest(id, input) {
  const data = await executeProtectedGraphqlRequest(UPDATE_CUSTOMER_PROFILE_MUTATION, {
    id,
    input: {
      firstName: `${input?.firstName ?? ""}`.trim(),
      lastName: `${input?.lastName ?? ""}`.trim(),
      email: `${input?.email ?? ""}`.trim().toLowerCase(),
      phone: `${input?.phone ?? ""}`.trim(),
      notes: `${input?.notes ?? ""}`.trim(),
    },
  });

  const result = data?.updateCustomerProfile;
  if (!result?.success || !result?.customer?.id) {
    throw new Error(getErrorMessage(result, "Unable to update customer profile."));
  }

  return {
    message: result.message || "Customer profile updated successfully.",
    customer: {
      id: result.customer.id,
      fullName: result.customer.fullName || "",
      email: result.customer.email || "",
      phone: result.customer.phone || "",
      city: result.customer.city || "",
      status: normalizeStatus(result.customer.status),
      rawStatus: `${result.customer.status ?? ""}`.trim().toUpperCase() || "ACTIVE",
    },
  };
}

export async function blockCustomerRequest(id, reason) {
  const data = await executeProtectedGraphqlRequest(BLOCK_CUSTOMER_MUTATION, {
    id,
    reason: `${reason ?? ""}`.trim() || null,
  });

  const result = data?.blockCustomer;
  if (!result?.success || !result?.customer?.id) {
    throw new Error(getErrorMessage(result, "Unable to block this customer."));
  }

  return {
    message: result.message || "Customer blocked successfully.",
    status: normalizeStatus(result.customer.status),
    rawStatus: `${result.customer.status ?? ""}`.trim().toUpperCase() || "BLOCKED",
  };
}

export async function unblockCustomerRequest(id) {
  const data = await executeProtectedGraphqlRequest(UNBLOCK_CUSTOMER_MUTATION, { id });
  const result = data?.unblockCustomer;

  if (!result?.success || !result?.customer?.id) {
    throw new Error(getErrorMessage(result, "Unable to unblock this customer."));
  }

  return {
    message: result.message || "Customer unblocked successfully.",
    status: normalizeStatus(result.customer.status),
    rawStatus: `${result.customer.status ?? ""}`.trim().toUpperCase() || "ACTIVE",
  };
}

export async function deactivateCustomerRequest(id, reason) {
  const data = await executeProtectedGraphqlRequest(DEACTIVATE_CUSTOMER_MUTATION, {
    id,
    reason: `${reason ?? ""}`.trim() || null,
  });

  const result = data?.deactivateCustomer;
  if (!result?.success || !result?.customer?.id) {
    throw new Error(getErrorMessage(result, "Unable to deactivate this customer."));
  }

  return {
    message: result.message || "Customer deactivated successfully.",
    status: normalizeStatus(result.customer.status),
    rawStatus: `${result.customer.status ?? ""}`.trim().toUpperCase() || "INACTIVE",
  };
}
