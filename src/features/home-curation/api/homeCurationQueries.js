export const ADMIN_HOME_CURATION_QUERY = `
  query AdminHomeCurationPage {
    adminHomeCuration {
      popularVendors {
        id
        name
        city
        rating
        avatarUrl
        coverPhotoUrl
        deliveryFeeLabel
        isPopular
        isFeatured
      }
      featuredVendors {
        id
        name
        city
        rating
        avatarUrl
        coverPhotoUrl
        deliveryFeeLabel
        isPopular
        isFeatured
      }
      popularProducts {
        id
        name
        description
        priceLabel
        imageUrl
        isPopular
        vendor {
          id
          name
          city
          avatarUrl
        }
      }
    }
    adminHomeCurationBootstrap {
      vendors {
        id
        name
        city
        rating
        avatarUrl
        coverPhotoUrl
        deliveryFeeLabel
        isPopular
        isFeatured
      }
      products {
        id
        name
        description
        priceLabel
        imageUrl
        isPopular
        menuStatus
        vendor {
          id
          name
          city
          avatarUrl
        }
      }
    }
  }
`;

export const UPDATE_VENDOR_HOME_CURATION_MUTATION = `
  mutation UpdateVendorHomeCuration($id: ID!, $input: AdminVendorHomeCurationInput!) {
    updateVendorHomeCuration(id: $id, input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      vendor {
        id
        isPopular
        isFeatured
      }
    }
  }
`;

export const UPDATE_PRODUCT_HOME_CURATION_MUTATION = `
  mutation UpdateProductHomeCuration($id: ID!, $input: AdminProductHomeCurationInput!) {
    updateProductHomeCuration(id: $id, input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      product {
        id
        isPopular
      }
    }
  }
`;
