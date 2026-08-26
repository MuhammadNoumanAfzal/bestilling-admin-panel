export const ADMIN_CUSTOMERS_QUERY = `
  query AdminCustomers(
    $search: String
    $status: String
    $city: String
    $registeredFrom: DateTime
    $registeredTo: DateTime
    $page: Int!
    $pageSize: Int!
    $sortBy: String
    $sortOrder: String
  ) {
    adminCustomers(
      search: $search
      status: $status
      city: $city
      registeredFrom: $registeredFrom
      registeredTo: $registeredTo
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      items {
        id
        fullName
        email
        phone
        city
        defaultAddressCity
        totalOrders
        totalSpend {
          amount
          currency
          formatted
        }
        averageOrderValue {
          amount
          currency
          formatted
        }
        status
        avatarUrl
        joinedAt
      }
      pageInfo {
        page
        pageSize
        totalItems
        totalPages
        hasNextPage
        hasPreviousPage
      }
      filterOptions {
        cities
        statuses
      }
      summary {
        totalCustomers
        activeCustomers
        newThisMonth
        totalOrders
        averageOrderValue {
          amount
          currency
          formatted
        }
        totalSpending {
          amount
          currency
          formatted
        }
      }
    }
  }
`;

export const ADMIN_CUSTOMER_DETAIL_QUERY = `
  query AdminCustomerDetail($id: ID!) {
    adminCustomer(id: $id) {
      id
      fullName
      firstName
      lastName
      email
      phone
      city
      defaultAddressCity
      status
      avatarUrl
      joinedAt
      createdAt
      updatedAt
      isBlocked
      isInactive
      blockedAt
      blockedReason
      deactivatedAt
      deactivationReason
      totalOrders
      totalSpend {
        amount
        currency
        formatted
      }
      averageOrderValue {
        amount
        currency
        formatted
      }
      profile {
        companyName
        preferredContactMethod
        lastLoginAt
        isEmailVerified
        isPhoneVerified
        notes
      }
      orderHistory {
        summary {
          totalOrders
          totalDelivered
          totalCancelled
          totalSpent {
            amount
            currency
            formatted
          }
        }
        items {
          id
          orderReference
          createdAt
          paymentStatus
          deliveryStatus
          vendor {
            id
            name
            avatarUrl
          }
          amount {
            amount
            currency
            formatted
          }
          status
        }
      }
      reviews {
        items {
          id
          rating
          content
          createdAt
          orderReference
          vendor {
            id
            name
            avatarUrl
          }
        }
        summary {
          totalReviews
          averageRating
        }
      }
      supportTickets {
        items {
          id
          subject
          status
          priority
          category
          createdAt
          lastMessageAt
          unreadAdminCount
        }
        summary {
          totalTickets
          openTickets
          resolvedTickets
        }
      }
    }
  }
`;

export const SEND_CUSTOMER_ADMIN_MESSAGE_MUTATION = `
  mutation SendCustomerAdminMessage(
    $customerId: ID!
    $subject: String!
    $message: String!
    $channel: String
  ) {
    sendCustomerAdminMessage(
      customerId: $customerId
      subject: $subject
      message: $message
      channel: $channel
    ) {
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

export const UPDATE_CUSTOMER_PROFILE_MUTATION = `
  mutation UpdateCustomerProfile($id: ID!, $input: UpdateCustomerProfileInput!) {
    updateCustomerProfile(id: $id, input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      customer {
        id
        fullName
        email
        phone
        city
        status
      }
    }
  }
`;

export const BLOCK_CUSTOMER_MUTATION = `
  mutation BlockCustomer($id: ID!, $reason: String) {
    blockCustomer(id: $id, reason: $reason) {
      success
      message
      errors {
        field
        message
        code
      }
      customer {
        id
        status
      }
    }
  }
`;

export const UNBLOCK_CUSTOMER_MUTATION = `
  mutation UnblockCustomer($id: ID!) {
    unblockCustomer(id: $id) {
      success
      message
      errors {
        field
        message
        code
      }
      customer {
        id
        status
      }
    }
  }
`;

export const DEACTIVATE_CUSTOMER_MUTATION = `
  mutation DeactivateCustomer($id: ID!, $reason: String) {
    deactivateCustomer(id: $id, reason: $reason) {
      success
      message
      errors {
        field
        message
        code
      }
      customer {
        id
        status
      }
    }
  }
`;
