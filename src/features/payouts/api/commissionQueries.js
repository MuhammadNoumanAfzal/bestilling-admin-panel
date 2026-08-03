export const ADMIN_COMMISSION_SETTINGS_QUERY = `
  query AdminCommissionSettings {
    adminCommissionSettings {
      globalCommission {
        id
        label
        rate
        description
        updatedAt
        updatedBy {
          id
          email
        }
      }
      vendorCommissions {
        id
        vendor {
          id
          name
          logoUrl
        }
        area {
          id
          name
        }
        rate
        effectiveFrom
        effectiveTo
        isActive
        updatedAt
      }
      areaCommissions {
        id
        area {
          id
          name
          region
        }
        rate
        activeVendorsCount
        orderSharePercent
        effectiveFrom
        effectiveTo
        isActive
        updatedAt
      }
    }
  }
`;

export const COMMISSION_VENDOR_OPTIONS_QUERY = `
  query CommissionVendorOptions($search: String) {
    commissionVendorOptions(search: $search) {
      id
      name
      avatarUrl
      defaultArea {
        id
        name
      }
    }
  }
`;

export const COMMISSION_AREA_OPTIONS_QUERY = `
  query CommissionAreaOptions($search: String) {
    commissionAreaOptions(search: $search) {
      id
      name
      region
      activeVendorsCount
      orderSharePercent
    }
  }
`;

export const UPDATE_GLOBAL_COMMISSION_MUTATION = `
  mutation UpdateGlobalCommission($input: UpdateGlobalCommissionInput!) {
    updateGlobalCommission(input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      globalCommission {
        id
        label
        rate
        description
        updatedAt
      }
    }
  }
`;

export const CREATE_VENDOR_COMMISSION_MUTATION = `
  mutation CreateVendorCommission($input: CreateVendorCommissionInput!) {
    createVendorCommission(input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      vendorCommission {
        id
        rate
        isActive
        vendor {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_VENDOR_COMMISSION_MUTATION = `
  mutation UpdateVendorCommission($id: ID!, $input: UpdateVendorCommissionInput!) {
    updateVendorCommission(id: $id, input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      vendorCommission {
        id
        rate
        isActive
      }
    }
  }
`;

export const DELETE_VENDOR_COMMISSION_MUTATION = `
  mutation DeleteVendorCommission($id: ID!) {
    deleteVendorCommission(id: $id) {
      success
      message
    }
  }
`;

export const CREATE_AREA_COMMISSION_MUTATION = `
  mutation CreateAreaCommission($input: CreateAreaCommissionInput!) {
    createAreaCommission(input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      areaCommission {
        id
        rate
        isActive
        area {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_AREA_COMMISSION_MUTATION = `
  mutation UpdateAreaCommission($id: ID!, $input: UpdateAreaCommissionInput!) {
    updateAreaCommission(id: $id, input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      areaCommission {
        id
        rate
        isActive
      }
    }
  }
`;

export const DELETE_AREA_COMMISSION_MUTATION = `
  mutation DeleteAreaCommission($id: ID!) {
    deleteAreaCommission(id: $id) {
      success
      message
    }
  }
`;
