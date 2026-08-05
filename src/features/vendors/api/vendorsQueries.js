export const ADMIN_VENDORS_QUERY = `
  query AdminVendors(
    $search: String
    $vendorId: ID
    $city: String
    $minRating: Float
    $status: VendorStatus
    $joinedFrom: DateTime
    $joinedTo: DateTime
    $page: Int!
    $pageSize: Int!
    $sortBy: VendorSortField
    $sortOrder: SortOrder
  ) {
    adminVendors(
      filters: {
        search: $search
        vendorId: $vendorId
        city: $city
        minRating: $minRating
        status: $status
        joinedFrom: $joinedFrom
        joinedTo: $joinedTo
      }
      pagination: { page: $page, pageSize: $pageSize }
      sort: { field: $sortBy, order: $sortOrder }
    ) {
      items {
        id
        name
        businessType
        city
        ordersCount
        revenue {
          amount
          currency
          formatted
        }
        rating
        joinedAt
        status
        avatarUrl
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
        totalVendors
        activeVendors
        pendingApprovalVendors
        suspendedVendors
        totalVendorRevenue {
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
        cities
        statuses
        businessTypes
      }
      sidePanels {
        topPerformers {
          id
          name
          revenue {
            amount
            currency
            formatted
          }
          avatarUrl
        }
        recentRequests {
          id
          name
          city
          submittedAt
          status
          avatarUrl
        }
        statusBreakdown {
          status
          count
        }
      }
    }
  }
`;

export const ADMIN_VENDOR_DETAIL_QUERY = `
  query AdminVendorDetail($id: ID!) {
    adminVendor(id: $id) {
      id
      name
      legalName
      businessType
      status
      avatarUrl
      supportContactLabel
      managerName
      joinedAt
      location
      approvedAt
      updatedAt
      summaryStats {
        id
        label
        value
      }
      overview {
        contact {
          label
          value
        }
        logistics {
          label
          value
        }
      }
      menuTabs {
        label
        value
        count
        active
      }
      publishedMenus {
        id
        title
        category
        price {
          amount
          currency
          formatted
        }
        imageUrl
        status
        badge
        description
      }
      recentOrders {
        id
        customerName
        event
        guests
        deliveryDate
        deliveryTime
        status
      }
      financial {
        chartTitle
        chartSubtitle
        filterLabel
        revenueSeries {
          label
          value
        }
        pendingPayout {
          amount
          currency
          formatted
        }
        payoutStatus
        estimatedPayoutAt
        lastPayoutAt
        payoutNote
        breakdown {
          label
          value {
            amount
            currency
            formatted
          }
          tone
        }
      }
      reviews {
        average
        totalReviews
        starBreakdown {
          stars
          percent
          count
        }
        statCards {
          label
          value
          note
        }
        filterTabs
        activeFilter
        periodFilter
        entries {
          id
          reviewerName
          rating
          reviewReference
          createdAt
          timeAgo
          avatarUrl
          content
          highlighted
        }
      }
      documents {
        id
        title
        subtitle
        status
        fileUrl
        fileName
        mimeType
        uploadedAt
        reviewedAt
      }
      dangerZone {
        suspendTitle
        suspendDescription
        deleteTitle
        deleteDescription
      }
    }
  }
`;

export const ADMIN_VENDOR_APPLICATION_REVIEW_QUERY = `
  query AdminVendorApplicationReview($id: ID!) {
    adminVendorApplicationReview(id: $id) {
      id
      applicationId
      vendorId
      name
      logoUrl
      owner
      submittedAt
      reviewedAt
      location
      applicationStatus
      assets {
        logoUrl
        coverImageUrl
      }
      documents {
        id
        type
        title
        subtitle
        status
        fileUrl
        fileName
        mimeType
        uploadedAt
        reviewedAt
        reviewNote
        rejectionReason
        isRequired
      }
      checklist {
        code
        label
        complete
        blocking
      }
      checklistCompleted
      checklistTotal
      progressPercent
      canApprove
      missingRequirements {
        code
        label
      }
      documentReviewHistory {
        id
        action
        actor {
          id
          fullName
        }
        createdAt
      }
    }
  }
`;

export const APPROVE_VENDOR_APPLICATION_MUTATION = `
  mutation ApproveVendorApplication($id: ID!, $input: ApproveVendorApplicationInput) {
    approveVendorApplication(id: $id, input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      application {
        id
        applicationStatus
        canApprove
      }
    }
  }
`;

export const REJECT_VENDOR_APPLICATION_MUTATION = `
  mutation RejectVendorApplication($id: ID!, $input: RejectVendorApplicationInput!) {
    rejectVendorApplication(id: $id, input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      application {
        id
        applicationStatus
        reviewedAt
      }
    }
  }
`;

export const REQUEST_VENDOR_APPLICATION_CHANGES_MUTATION = `
  mutation RequestVendorApplicationChanges($id: ID!, $input: RequestVendorApplicationChangesInput!) {
    requestVendorApplicationChanges(id: $id, input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      application {
        id
        applicationStatus
        reviewedAt
      }
    }
  }
`;

export const UPDATE_VENDOR_STATUS_MUTATION = `
  mutation UpdateVendorStatus($id: ID!, $status: VendorStatus!, $reason: String) {
    updateVendorStatus(id: $id, status: $status, reason: $reason) {
      success
      message
      errors {
        field
        message
        code
      }
      vendor {
        id
        status
        updatedAt
      }
    }
  }
`;

export const DEACTIVATE_VENDOR_MUTATION = `
  mutation DeactivateVendor($id: ID!, $reason: String) {
    deactivateVendor(id: $id, reason: $reason) {
      success
      message
      errors {
        field
        message
        code
      }
      vendor {
        id
        status
        updatedAt
      }
    }
  }
`;

export const DELETE_VENDOR_MUTATION = `
  mutation DeleteVendor($id: ID!) {
    deleteVendor(id: $id) {
      success
      message
      errors {
        field
        message
        code
      }
    }
  }
`;

export const ADMIN_VENDOR_DOCUMENTS_QUERY = `
  query AdminVendorDocuments($vendorId: ID!) {
    adminVendorDocuments(vendorId: $vendorId) {
      id
      title
      subtitle
      status
      fileUrl
      fileName
      mimeType
      uploadedAt
      reviewedAt
    }
  }
`;

export const REVIEW_VENDOR_DOCUMENT_MUTATION = `
  mutation ReviewVendorDocument($id: ID!, $input: ReviewVendorDocumentInput!) {
    reviewVendorDocument(id: $id, input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      document {
        id
        type
        title
        status
        reviewedAt
        reviewNote
        rejectionReason
        isRequired
      }
    }
  }
`;

export const VENDOR_DOCUMENT_ACCESS_QUERY = `
  query VendorDocumentAccess($id: ID!) {
    vendorDocumentAccess(id: $id) {
      previewUrl
      downloadUrl
      expiresAt
    }
  }
`;
