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
        polygons {
          id
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
        status
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
