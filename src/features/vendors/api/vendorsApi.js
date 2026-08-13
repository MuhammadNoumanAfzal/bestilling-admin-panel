import { executeProtectedGraphqlRequest } from "../../../app/api/protectedGraphqlClient.js";
import {
  ADMIN_VENDOR_APPLICATION_REVIEW_QUERY,
  ADMIN_VENDOR_DETAIL_QUERY,
  ADMIN_VENDOR_DOCUMENTS_QUERY,
  ADMIN_VENDORS_QUERY,
  APPROVE_VENDOR_APPLICATION_MUTATION,
  DEACTIVATE_VENDOR_MUTATION,
  DELETE_VENDOR_MUTATION,
  REJECT_VENDOR_APPLICATION_MUTATION,
  REQUEST_VENDOR_APPLICATION_CHANGES_MUTATION,
  REVIEW_VENDOR_DOCUMENT_MUTATION,
  UPDATE_VENDOR_STATUS_MUTATION,
  VENDOR_MENU_DETAIL_QUERY,
  VENDOR_DOCUMENT_ACCESS_QUERY,
} from "./vendorsQueries.js";

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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeTime(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `${value}`;
  }

  const now = new Date("2026-08-03T12:00:00Z");
  const diffInDays = Math.max(0, Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)));

  if (diffInDays === 0) {
    return "Today";
  }

  if (diffInDays === 1) {
    return "1 day ago";
  }

  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }

  const diffInMonths = Math.max(1, Math.round(diffInDays / 30));
  return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
}

function normalizeVendorStatus(value) {
  const normalized = `${value ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "APPROVED":
    case "ACTIVE":
      return "Active";
    case "PENDING_APPROVAL":
    case "REVIEWING":
    case "UNDER_REVIEW":
      return "Pending Approval";
    case "CHANGES_REQUESTED":
      return "Changes Requested";
    case "SUSPENDED":
      return "Suspended";
    case "REJECTED":
      return "Rejected";
    case "DEACTIVATED":
      return "Deactivated";
    case "DELETED":
      return "Deleted";
    case "":
      return "Unknown";
    default:
      return normalized
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function normalizeVendorApprovalState(item) {
  const applicationStatus = `${item?.applicationStatus ?? ""}`.trim().toUpperCase();
  const operationalStatus = `${item?.status ?? ""}`.trim().toUpperCase();

  if (applicationStatus === "PENDING_APPROVAL" || applicationStatus === "REVIEWING") {
    return "Pending Approval";
  }

  if (applicationStatus) {
    return normalizeVendorStatus(applicationStatus);
  }

  return normalizeVendorStatus(operationalStatus);
}

function normalizeDocumentStatus(value) {
  const normalized = `${value ?? ""}`.trim().toUpperCase();

  switch (normalized) {
    case "VERIFIED":
      return "Verified";
    case "REJECTED":
      return "Rejected";
    default:
      return "Pending";
  }
}

function normalizeVendorRow(item) {
  const name = item?.name || "Unknown vendor";
  const applicationStatus = `${item?.applicationStatus ?? ""}`.trim().toUpperCase();
  const operationalStatus = `${item?.status ?? ""}`.trim().toUpperCase() || "ACTIVE";
  const displayStatus = normalizeVendorApprovalState(item);

  return {
    id: item?.id || "",
    name,
    businessType: item?.businessType || "Not specified",
    city: item?.city || "Unknown",
    ordersCount: Number(item?.ordersCount ?? 0),
    revenue: item?.revenue?.formatted || "NOK 0.00",
    revenueValue: Number(item?.revenue?.amount ?? 0),
    rating: Number(item?.rating ?? 0).toFixed(1),
    ratingValue: Number(item?.rating ?? 0),
    joinDate: formatDateLabel(item?.joinedAt),
    joinDateValue: item?.joinedAt || "",
    status: displayStatus,
    rawStatus: displayStatus === "Pending Approval" ? "PENDING_APPROVAL" : operationalStatus,
    applicationStatus: applicationStatus || operationalStatus,
    canApprove: Boolean(item?.canApprove),
    missingRequirements: Array.isArray(item?.missingRequirements)
      ? item.missingRequirements.map((requirement) => ({
          code: requirement?.code || "",
          label: requirement?.label || "",
        }))
      : [],
    avatar: toInitials(name),
    avatarUrl: item?.avatarUrl || "",
  };
}

function normalizeStatusBreakdownItems(items) {
  return Array.isArray(items)
    ? items.map((item) => ({
        status: normalizeVendorStatus(item?.status),
        count: Number(item?.count ?? 0),
      }))
    : [];
}

function normalizeVendorListResponse(response) {
  const rows = Array.isArray(response?.items) ? response.items.map(normalizeVendorRow) : [];
  const summary = response?.summary || {};

  return {
    rows,
    pageInfo: {
      page: Number(response?.pageInfo?.page ?? 1),
      pageSize: Number(response?.pageInfo?.pageSize ?? 10),
      totalItems: Number(response?.pageInfo?.totalItems ?? 0),
      totalPages: Number(response?.pageInfo?.totalPages ?? 1),
      hasNextPage: Boolean(response?.pageInfo?.hasNextPage),
      hasPreviousPage: Boolean(response?.pageInfo?.hasPreviousPage),
    },
    stats: [
      { id: "total", title: "Total Vendor", value: `${Number(summary.totalVendors ?? 0)}` },
      { id: "active", title: "Active Vendor", value: `${Number(summary.activeVendors ?? 0)}` },
      { id: "pending", title: "Pending Approval", value: `${Number(summary.pendingApprovalVendors ?? 0)}` },
      { id: "suspended", title: "Suspended", value: `${Number(summary.suspendedVendors ?? 0)}` },
      {
        id: "revenue",
        title: "Total Vendor Revenue",
        value: summary.totalVendorRevenue?.formatted || "NOK 0.00",
      },
    ],
    filterOptions: {
      vendors: Array.isArray(response?.filterOptions?.vendors) ? response.filterOptions.vendors : [],
      cities: Array.isArray(response?.filterOptions?.cities) ? response.filterOptions.cities : [],
      statuses: Array.isArray(response?.filterOptions?.statuses)
        ? response.filterOptions.statuses.map(normalizeVendorStatus)
        : [],
      businessTypes: Array.isArray(response?.filterOptions?.businessTypes)
        ? response.filterOptions.businessTypes
        : [],
    },
    sidePanels: {
      topPerformers: Array.isArray(response?.sidePanels?.topPerformers)
        ? response.sidePanels.topPerformers.map((item) => ({
            id: item?.id || "",
            name: item?.name || "Unknown vendor",
            revenue: item?.revenue?.formatted || "NOK 0.00",
            revenueValue: Number(item?.revenue?.amount ?? 0),
            avatar: toInitials(item?.name),
            avatarUrl: item?.avatarUrl || "",
          }))
        : [],
      recentRequests: Array.isArray(response?.sidePanels?.recentRequests)
        ? response.sidePanels.recentRequests.map((item) => ({
            id: item?.id || "",
            name: item?.name || "Unknown vendor",
            city: item?.city || "Unknown",
            avatar: toInitials(item?.name),
            avatarUrl: item?.avatarUrl || "",
            joinDateValue: item?.submittedAt || "",
            time: formatRelativeTime(item?.submittedAt),
            status: normalizeVendorStatus(item?.status),
          }))
        : [],
      statusBreakdown: normalizeStatusBreakdownItems(response?.sidePanels?.statusBreakdown),
    },
  };
}

function normalizeVendorDocument(document) {
  const id = document?.id || "";
  const isReviewable = /^\d+$/.test(`${id}`);

  return {
    id,
    type: document?.type || "",
    title: document?.title || "Untitled document",
    subtitle: document?.subtitle || "",
    status: normalizeDocumentStatus(document?.status),
    rawStatus: `${document?.status ?? ""}`.trim().toUpperCase() || "PENDING",
    fileUrl: document?.fileUrl || "",
    fileName: document?.fileName || "",
    mimeType: document?.mimeType || "",
    uploadedAt: document?.uploadedAt || "",
    reviewedAt: document?.reviewedAt || "",
    uploadedAtLabel: formatDateTimeLabel(document?.uploadedAt),
    reviewedAtLabel: formatDateTimeLabel(document?.reviewedAt),
    reviewNote: document?.reviewNote || "",
    rejectionReason: document?.rejectionReason || "",
    isRequired: Boolean(document?.isRequired),
    isReviewable,
  };
}

function normalizeVendorDetail(vendor) {
  if (!vendor?.id) {
    return null;
  }

  return {
    id: vendor.id,
    name: vendor.name || "Unknown vendor",
    legalName: vendor.legalName || "",
    businessType: vendor.businessType || "Not specified",
    status: normalizeVendorStatus(vendor.status),
    rawStatus: `${vendor.status ?? ""}`.trim().toUpperCase() || "ACTIVE",
    avatarUrl: vendor.avatarUrl || "",
    supportContactLabel: vendor.supportContactLabel || "Back to vendors",
    manager: vendor.managerName || "Not assigned",
    joinedLabel: formatDateLabel(vendor.joinedAt),
    joinedAt: vendor.joinedAt || "",
    location: vendor.location || "Unknown",
    approvedAt: vendor.approvedAt || "",
    updatedAt: vendor.updatedAt || "",
    summaryStats: Array.isArray(vendor.summaryStats) ? vendor.summaryStats : [],
    overview: {
      contact: Array.isArray(vendor.overview?.contact) ? vendor.overview.contact : [],
      logistics: Array.isArray(vendor.overview?.logistics) ? vendor.overview.logistics : [],
    },
    menuTabs: Array.isArray(vendor.menuTabs)
      ? vendor.menuTabs.map((tab) => ({
          label: tab?.count != null ? `${tab.label} (${tab.count})` : tab?.label || "",
          value: tab?.value || "",
          count: Number(tab?.count ?? 0),
          active: Boolean(tab?.active),
        }))
      : [],
    publishedMenus: Array.isArray(vendor.publishedMenus)
      ? vendor.publishedMenus.map((menu) => ({
          id: menu?.id || "",
          title: menu?.title || "",
          category: menu?.category || "",
          price: menu?.price?.formatted || "NOK 0.00",
          imageUrl: menu?.imageUrl || "",
          status: normalizeVendorStatus(menu?.status).replace("Pending Approval", "Pending"),
          badge: menu?.badge || "",
          description: menu?.description || "",
        }))
      : [],
    recentOrders: Array.isArray(vendor.recentOrders)
      ? vendor.recentOrders.map((order) => ({
          id: order?.id || "",
          customer: order?.customerName || "",
          event: order?.event || "",
          guests: Number(order?.guests ?? 0),
          deliveryDate: order?.deliveryDate || "",
          deliveryTime: order?.deliveryTime || "",
          status: order?.status || "",
        }))
      : [],
    financial: {
      chartTitle: vendor.financial?.chartTitle || "Revenue",
      chartSubtitle: vendor.financial?.chartSubtitle || "",
      filterLabel: vendor.financial?.filterLabel || "",
      revenueSeries: Array.isArray(vendor.financial?.revenueSeries) ? vendor.financial.revenueSeries : [],
      pendingPayout: vendor.financial?.pendingPayout?.formatted || "NOK 0.00",
      payoutStatus: vendor.financial?.payoutStatus || "Pending",
      estimatedPayout: formatDateLabel(vendor.financial?.estimatedPayoutAt),
      lastPayout: formatDateLabel(vendor.financial?.lastPayoutAt),
      payoutNote: vendor.financial?.payoutNote || "",
      breakdown: Array.isArray(vendor.financial?.breakdown)
        ? vendor.financial.breakdown.map((item) => ({
            label: item?.label || "",
            value: item?.value?.formatted || "NOK 0.00",
            tone: item?.tone || "neutral",
          }))
        : [],
    },
    reviewsSummary: {
      average: Number(vendor.reviews?.average ?? 0).toFixed(1),
      totalReviews: Number(vendor.reviews?.totalReviews ?? 0),
      starBreakdown: Array.isArray(vendor.reviews?.starBreakdown) ? vendor.reviews.starBreakdown : [],
      statCards: Array.isArray(vendor.reviews?.statCards) ? vendor.reviews.statCards : [],
      filterTabs: Array.isArray(vendor.reviews?.filterTabs) ? vendor.reviews.filterTabs : ["All"],
      activeFilter: vendor.reviews?.activeFilter || "All",
      periodFilter: vendor.reviews?.periodFilter || "Last 30 days",
      reviewEntries: Array.isArray(vendor.reviews?.entries)
        ? vendor.reviews.entries.map((entry) => ({
            id: entry?.id || "",
            name: entry?.reviewerName || "Anonymous",
            rating: Number(entry?.rating ?? 0),
            reviewId: entry?.reviewReference || "",
            createdAt: entry?.createdAt || "",
            timeAgo: entry?.timeAgo || formatRelativeTime(entry?.createdAt),
            avatarUrl: entry?.avatarUrl || "",
            content: entry?.content || "",
            highlighted: Boolean(entry?.highlighted),
          }))
        : [],
    },
    documents: Array.isArray(vendor.documents) ? vendor.documents.map(normalizeVendorDocument) : [],
    dangerZone: {
      suspendTitle: vendor.dangerZone?.suspendTitle || "Suspend vendor",
      suspendDescription: vendor.dangerZone?.suspendDescription || "",
      deleteTitle: vendor.dangerZone?.deleteTitle || "Delete vendor",
      deleteDescription: vendor.dangerZone?.deleteDescription || "",
    },
  };
}

function getEdgeNodes(connection) {
  return Array.isArray(connection?.edges)
    ? connection.edges.map((edge) => edge?.node).filter(Boolean)
    : [];
}

function formatVendorMenuStatus(value) {
  const normalized = `${value ?? ""}`.trim().toLowerCase();

  switch (normalized) {
    case "active":
      return "Active";
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    default:
      return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : "Unknown";
  }
}

function formatPricingType(value) {
  const normalized = `${value ?? ""}`.trim();
  if (!normalized) {
    return "";
  }

  return normalized
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeVendorMenuDetail(menu) {
  if (!menu?.id) {
    return null;
  }

  const title = menu.title || menu.name || "Untitled menu";
  const coverImageUrl = menu.coverImage?.fileUrl || "";
  const attachments = getEdgeNodes(menu.attachments)
    .filter((attachment) => attachment?.fileUrl)
    .map((attachment) => ({
      id: attachment.id || "",
      fileUrl: attachment.fileUrl || "",
      fileId: attachment.fileId || "",
      isCover: Boolean(attachment.isCover),
    }));
  const galleryImages = attachments.filter((attachment) => !attachment.isCover);
  const menuItems = Array.isArray(menu.menuItems)
    ? menu.menuItems.map((item) => ({
        id: item?.id || "",
        title: item?.title || "Untitled item",
        description: item?.description || "",
        imageUrl: item?.imageUrl || "",
        fileId: item?.fileId || "",
        order: Number(item?.order ?? 0),
        allergens: Array.isArray(item?.allergens)
          ? item.allergens.map((allergen) => allergen?.name || allergen?.slug || "").filter(Boolean)
          : [],
      }))
    : [];
  const optionalAddOns = Array.isArray(menu.optionalAddOns)
    ? menu.optionalAddOns.map((addOn) => ({
        id: addOn?.id || "",
        name: addOn?.name || "Unnamed add-on",
        options: Array.isArray(addOn?.options)
          ? addOn.options.map((option) => ({
              id: option?.id || "",
              name: option?.name || "Unnamed option",
              price: option?.price || "",
            }))
          : [],
      }))
    : [];

  return {
    id: menu.id,
    title,
    description: menu.description || "",
    category: menu.category?.name || "",
    categoryId: menu.category?.id || "",
    status: formatVendorMenuStatus(menu.menuStatus),
    rawStatus: menu.menuStatus || "",
    badge: menu.category?.name || menu.menuType || "",
    imageUrl: coverImageUrl,
    galleryImages,
    price: menu.priceWithTax ? `kr ${menu.priceWithTax}` : "Not provided",
    basePrice: menu.priceWithTax || "",
    pricingType: formatPricingType(menu.pricingType),
    taxPercent: menu.taxPercent || "",
    minimumGuests: menu.minimumGuests || "",
    minLeadTimeHours: menu.minLeadTimeHours || "",
    minLeadTimeDays: menu.minLeadTimeDays || "",
    availableDays: Array.isArray(menu.availableDays) ? menu.availableDays : [],
    blackoutDates: Array.isArray(menu.blackoutDates) ? menu.blackoutDates : [],
    dietaryTags: Array.isArray(menu.dietaryTags)
      ? menu.dietaryTags.map((tag) => tag?.name || tag?.slug || "").filter(Boolean)
      : [],
    customDietary: menu.customDietary || "",
    contains: menu.contains || "",
    isAdjustableForSingleStaff: Boolean(menu.isAdjustableForSingleStaff),
    isAvailabilityWindowEnabled: Boolean(menu.isAvailabilityWindowEnabled),
    availableFrom: menu.availableFrom || "",
    availableUntil: menu.availableUntil || "",
    menuType: menu.menuType || "",
    foodTypes: Array.isArray(menu.foodTypes)
      ? menu.foodTypes.map((type) => type?.name || type?.slug || "").filter(Boolean)
      : [],
    occasions: Array.isArray(menu.occasions)
      ? menu.occasions.map((occasion) => occasion?.name || occasion?.slug || "").filter(Boolean)
      : [],
    ingredients: getEdgeNodes(menu.ingredients).map((ingredient) => ingredient?.name || "").filter(Boolean),
    menuItems,
    optionalAddOns,
    primaryImageUrl: coverImageUrl || galleryImages[0]?.fileUrl || "",
  };
}

function normalizeVendorApplicationReview(review) {
  if (!review?.id) {
    return null;
  }

  return {
    id: review.id,
    applicationId: review.applicationId || "",
    vendorId: review.vendorId || review.id,
    name: review.name || "Unknown vendor",
    logoUrl: review.logoUrl || "",
    assets: {
      logoUrl: review.assets?.logoUrl || review.logoUrl || "",
      coverImageUrl: review.assets?.coverImageUrl || "",
    },
    owner: review.owner || "Unknown",
    submittedDate: formatDateLabel(review.submittedAt),
    reviewedDate: formatDateLabel(review.reviewedAt),
    submittedAt: review.submittedAt || "",
    reviewedAt: review.reviewedAt || "",
    location: review.location || "",
    applicationStatus: normalizeVendorStatus(review.applicationStatus),
    documents: Array.isArray(review.documents) ? review.documents.map(normalizeVendorDocument) : [],
    checklist: Array.isArray(review.checklist)
      ? review.checklist.map((item) => ({
          code: item?.code || "",
          label: item?.label || "",
          complete: Boolean(item?.complete),
          blocking: Boolean(item?.blocking),
        }))
      : [],
    checklistCompleted: Number(review.checklistCompleted ?? 0),
    checklistTotal: Number(review.checklistTotal ?? review.checklist?.length ?? 0),
    progressPercent: Number(review.progressPercent ?? 0),
    canApprove: Boolean(review.canApprove),
    missingRequirements: Array.isArray(review.missingRequirements) ? review.missingRequirements : [],
    documentReviewHistory: Array.isArray(review.documentReviewHistory)
      ? review.documentReviewHistory.map((item) => ({
          id: item?.id || "",
          action: item?.action || "",
          status: item?.status || "",
          note: item?.note || "",
          actorName: item?.actor?.fullName || "System",
          createdAt: item?.createdAt || "",
          createdAtLabel: formatDateTimeLabel(item?.createdAt),
          metadata: item?.metadata || "",
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

export async function getAdminVendorsRequest(filters) {
  const data = await executeProtectedGraphqlRequest(ADMIN_VENDORS_QUERY, {
    search: filters?.search?.trim() || null,
    vendorId: filters?.vendorId || null,
    city: filters?.city || null,
    minRating: filters?.minRating == null ? null : Number(filters.minRating),
    status: filters?.status || null,
    joinedFrom: toIsoOrNull(filters?.joinedFrom),
    joinedTo: toIsoOrNull(filters?.joinedTo),
    page: Number(filters?.page || 1),
    pageSize: Number(filters?.pageSize || 10),
    sortBy: filters?.sortBy || "JOINED_AT",
    sortOrder: filters?.sortOrder || "DESC",
  });

  const response = data?.adminVendors;
  if (!response) {
    throw new Error("Unable to load vendors.");
  }

  return normalizeVendorListResponse(response);
}

export async function getAdminVendorDetailRequest(id) {
  const data = await executeProtectedGraphqlRequest(ADMIN_VENDOR_DETAIL_QUERY, { id });
  const vendor = normalizeVendorDetail(data?.adminVendor);

  if (!vendor?.id) {
    throw new Error("Unable to load this vendor.");
  }

  return vendor;
}

export async function getAdminVendorMenuDetailRequest(id) {
  const data = await executeProtectedGraphqlRequest(VENDOR_MENU_DETAIL_QUERY, { id });
  const menu = normalizeVendorMenuDetail(data?.vendorMenu);

  if (!menu?.id) {
    throw new Error("Unable to load full menu details for this menu.");
  }

  return menu;
}

export async function getAdminVendorApplicationReviewRequest(id) {
  const data = await executeProtectedGraphqlRequest(ADMIN_VENDOR_APPLICATION_REVIEW_QUERY, { id });
  const review = normalizeVendorApplicationReview(data?.adminVendorApplicationReview);

  if (!review?.id) {
    throw new Error("Unable to load this vendor application.");
  }

  return review;
}

export async function approveVendorApplicationRequest(id, input) {
  const data = await executeProtectedGraphqlRequest(APPROVE_VENDOR_APPLICATION_MUTATION, {
    id,
    input: {
      note: `${input?.note ?? ""}`.trim() || null,
      activateImmediately:
        input?.activateImmediately == null ? true : Boolean(input.activateImmediately),
    },
  });

  const result = data?.approveVendorApplication;
  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to approve this vendor application."));
  }

  return {
    message: result.message || "Vendor application approved successfully.",
    applicationStatus: normalizeVendorStatus(result.application?.applicationStatus),
    canApprove: Boolean(result.application?.canApprove),
  };
}

export async function rejectVendorApplicationRequest(id, input) {
  const data = await executeProtectedGraphqlRequest(REJECT_VENDOR_APPLICATION_MUTATION, {
    id,
    input: {
      reason: `${input?.reason ?? ""}`.trim(),
      note: `${input?.note ?? ""}`.trim() || null,
    },
  });

  const result = data?.rejectVendorApplication;
  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to reject this vendor application."));
  }

  return {
    message: result.message || "Vendor application rejected successfully.",
    applicationStatus: normalizeVendorStatus(result.application?.applicationStatus),
    reviewedAt: result.application?.reviewedAt || "",
  };
}

export async function requestVendorApplicationChangesRequest(id, input) {
  const data = await executeProtectedGraphqlRequest(REQUEST_VENDOR_APPLICATION_CHANGES_MUTATION, {
    id,
    input: {
      message: `${input?.message ?? ""}`.trim(),
      fields: Array.isArray(input?.fields) ? input.fields.filter(Boolean) : [],
    },
  });

  const result = data?.requestVendorApplicationChanges;
  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to request vendor application changes."));
  }

  return {
    message: result.message || "Requested application changes successfully.",
    applicationStatus: normalizeVendorStatus(result.application?.applicationStatus),
    reviewedAt: result.application?.reviewedAt || "",
  };
}

export async function updateVendorStatusRequest(id, status, reason) {
  const data = await executeProtectedGraphqlRequest(UPDATE_VENDOR_STATUS_MUTATION, {
    id,
    status,
    reason: `${reason ?? ""}`.trim() || null,
  });

  const result = data?.updateVendorStatus;
  if (!result?.success || !result?.vendor?.id) {
    throw new Error(getErrorMessage(result, "Unable to update vendor status."));
  }

  return {
    message: result.message || "Vendor status updated successfully.",
    status: normalizeVendorStatus(result.vendor.status),
    rawStatus: `${result.vendor.status ?? ""}`.trim().toUpperCase() || status,
    updatedAt: result.vendor.updatedAt || "",
  };
}

export async function deactivateVendorRequest(id, reason) {
  const data = await executeProtectedGraphqlRequest(DEACTIVATE_VENDOR_MUTATION, {
    id,
    reason: `${reason ?? ""}`.trim() || null,
  });

  const result = data?.deactivateVendor;
  if (!result?.success || !result?.vendor?.id) {
    throw new Error(getErrorMessage(result, "Unable to deactivate this vendor."));
  }

  return {
    message: result.message || "Vendor deactivated successfully.",
    status: normalizeVendorStatus(result.vendor.status),
    rawStatus: `${result.vendor.status ?? ""}`.trim().toUpperCase() || "DEACTIVATED",
    updatedAt: result.vendor.updatedAt || "",
  };
}

export async function deleteVendorRequest(id) {
  const data = await executeProtectedGraphqlRequest(DELETE_VENDOR_MUTATION, { id });
  const result = data?.deleteVendor;

  if (!result?.success) {
    throw new Error(getErrorMessage(result, "Unable to delete this vendor."));
  }

  return {
    message: result.message || "Vendor deleted successfully.",
  };
}

export async function getAdminVendorDocumentsRequest(vendorId) {
  const data = await executeProtectedGraphqlRequest(ADMIN_VENDOR_DOCUMENTS_QUERY, { vendorId });
  return Array.isArray(data?.adminVendorDocuments) ? data.adminVendorDocuments.map(normalizeVendorDocument) : [];
}

export async function reviewVendorDocumentRequest(id, input) {
  const data = await executeProtectedGraphqlRequest(REVIEW_VENDOR_DOCUMENT_MUTATION, {
    id,
    input: {
      status: `${input?.status ?? ""}`.trim().toUpperCase(),
      reviewNote: `${input?.reviewNote ?? ""}`.trim() || null,
      rejectionReason: `${input?.rejectionReason ?? ""}`.trim() || null,
    },
  });

  const result = data?.reviewVendorDocument;
  if (!result?.success || !result?.document?.id) {
    throw new Error(getErrorMessage(result, "Unable to review this vendor document."));
  }

  return {
    message: result.message || "Document reviewed successfully.",
    status: normalizeDocumentStatus(result.document.status),
    reviewedAt: result.document.reviewedAt || "",
    reviewNote: result.document.reviewNote || "",
    rejectionReason: result.document.rejectionReason || "",
    isRequired: Boolean(result.document.isRequired),
  };
}

export async function getVendorDocumentAccessRequest(id) {
  const data = await executeProtectedGraphqlRequest(VENDOR_DOCUMENT_ACCESS_QUERY, { id });
  const access = data?.vendorDocumentAccess;

  if (!access?.previewUrl && !access?.downloadUrl) {
    throw new Error("Unable to access this document right now.");
  }

  return {
    previewUrl: access.previewUrl || "",
    downloadUrl: access.downloadUrl || access.previewUrl || "",
    expiresAt: access.expiresAt || "",
  };
}
