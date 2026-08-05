export const ADMIN_DELIVERY_AREAS_QUERY = `
  query AdminDeliveryAreas(
    $search: String
    $status: String
    $region: String
    $city: String
    $page: Int!
    $pageSize: Int!
    $sortBy: String
    $sortOrder: String
  ) {
    adminDeliveryAreas(
      search: $search
      status: $status
      region: $region
      city: $city
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      items {
        id
        name
        city
        region
        country
        status
        maxDeliveryRadius
        leadTimeDays
        coverageType
        vendors
        activePostalCodes
        updatedAt
        createdAt
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
        regions
        statuses
        countries
      }
    }
  }
`;

export const ADMIN_DELIVERY_SUMMARY_QUERY = `
  query AdminDeliverySummary {
    adminDeliverySummary {
      activeCities
      activePostalCodes
      restrictedAreas
      platformCoveragePercent
      platformCoverageSubtitle
      coveredCities
      totalCities
      coveredPostalCodes
      totalPostalCodes
      coveredMunicipalities
      totalMunicipalities
      calculationMethod
      lastCalculatedAt
    }
  }
`;

export const ADMIN_DELIVERY_AREA_QUERY = `
  query AdminDeliveryArea($id: ID!) {
    adminDeliveryArea(id: $id) {
      id
      name
      city
      region
      country
      status
      maxDeliveryRadius
      leadTimeDays
      coverageType
      vendors
      activePostalCodes
      updatedAt
      createdAt
      settings {
        maxDeliveryRadius
        leadTimeDays
        coverageType
        minimumOrderAmount
        deliveryFee
        isRestricted
        isExpressEnabled
        notes
      }
      map {
        center {
          lat
          lng
        }
        zoom
        bounds {
          north
          south
          east
          west
        }
        polygons {
          id
          label
          points {
            lat
            lng
          }
        }
        markers {
          id
          lat
          lng
          label
          type
        }
      }
      postalAreas {
        id
        postalCode
        areaName
        status
        vendors
        lat
        lng
        deliveryFeeOverride
        minimumOrderAmountOverride
        estimatedDeliveryMinutes
      }
      linkedVendors {
        id
        businessName
        isActive
      }
    }
  }
`;

export const CREATE_DELIVERY_AREA_MUTATION = `
  mutation CreateDeliveryArea($input: CreateDeliveryAreaInput!) {
    createDeliveryArea(input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      deliveryArea {
        id
        city
        region
        country
        status
        coverageType
      }
    }
  }
`;

export const UPDATE_DELIVERY_AREA_MUTATION = `
  mutation UpdateDeliveryArea($id: ID!, $input: UpdateDeliveryAreaInput!) {
    updateDeliveryArea(id: $id, input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      deliveryArea {
        id
        city
        region
        country
        status
        settings {
          maxDeliveryRadius
          leadTimeDays
          coverageType
          minimumOrderAmount
          deliveryFee
          isRestricted
          isExpressEnabled
          notes
        }
        updatedAt
      }
    }
  }
`;

export const DELETE_DELIVERY_AREA_MUTATION = `
  mutation DeleteDeliveryArea($id: ID!) {
    deleteDeliveryArea(id: $id) {
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

export const UPDATE_DELIVERY_AREA_STATUS_MUTATION = `
  mutation UpdateDeliveryAreaStatus($id: ID!, $status: String!) {
    updateDeliveryAreaStatus(id: $id, status: $status) {
      success
      message
      deliveryArea {
        id
        status
      }
    }
  }
`;

export const ADD_DELIVERY_POSTAL_AREA_MUTATION = `
  mutation AddDeliveryPostalArea($deliveryAreaId: ID!, $input: CreatePostalAreaInput!) {
    addDeliveryPostalArea(deliveryAreaId: $deliveryAreaId, input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      postalArea {
        id
        postalCode
        areaName
        status
        vendors
        lat
        lng
        deliveryFeeOverride
        minimumOrderAmountOverride
        estimatedDeliveryMinutes
      }
    }
  }
`;

export const UPDATE_DELIVERY_POSTAL_AREA_MUTATION = `
  mutation UpdateDeliveryPostalArea($id: ID!, $input: UpdatePostalAreaInput!) {
    updateDeliveryPostalArea(id: $id, input: $input) {
      success
      message
      postalArea {
        id
        postalCode
        areaName
        status
        vendors
        lat
        lng
        deliveryFeeOverride
        minimumOrderAmountOverride
        estimatedDeliveryMinutes
      }
    }
  }
`;

export const DELETE_DELIVERY_POSTAL_AREA_MUTATION = `
  mutation DeleteDeliveryPostalArea($id: ID!) {
    deleteDeliveryPostalArea(id: $id) {
      success
      message
    }
  }
`;
