export const GET_VENDOR_SETTINGS_TAXONOMY_QUERY = `
  query GetVendorSettingsTaxonomy {
    categories {
      edges {
        node {
          id
          name
        }
      }
    }
    foodTypes {
      id
      name
      slug
    }
    occasions {
      id
      name
      slug
      iconUrl
    }
    allergens {
      id
      name
      slug
    }
    vendorMenus(first: 100) {
      edges {
        node {
          id
          dietaryTags
        }
      }
    }
    vendorAddOns(first: 100) {
      edges {
        node {
          id
          dietaryTags
        }
      }
    }
  }
`;

export const CREATE_VENDOR_CATEGORY_MUTATION = `
  mutation CreateVendorCategory($input: VendorCategoryInput!) {
    vendorCategoryMutation(input: $input) {
      success
      message
      instance {
        id
        name
      }
    }
  }
`;

export const CREATE_FOOD_TYPE_MUTATION = `
  mutation CreateFoodType($input: FoodTypeInput!) {
    foodTypeMutation(input: $input) {
      success
      message
      instance {
        id
        name
        slug
      }
    }
  }
`;

export const CREATE_OCCASION_MUTATION = `
  mutation CreateOccasion(
    $name: String!
    $id: ID
    $slug: String
    $description: String
    $iconUrl: String
    $coverImageUrl: String
    $isActive: Boolean
    $sortOrder: Int
  ) {
    occasionMutation(
      name: $name
      id: $id
      slug: $slug
      description: $description
      iconUrl: $iconUrl
      coverImageUrl: $coverImageUrl
      isActive: $isActive
      sortOrder: $sortOrder
    ) {
      success
      message
      instance {
        id
        name
        slug
        iconUrl
      }
    }
  }
`;

export const CREATE_ALLERGEN_MUTATION = `
  mutation CreateAllergen($input: AllergenInput!) {
    allergenMutation(input: $input) {
      success
      message
      instance {
        id
        name
        slug
      }
    }
  }
`;

export const DELETE_VENDOR_CATEGORY_MUTATION = `
  mutation DeleteVendorCategory($id: ID!) {
    vendorCategoryDelete(id: $id) {
      success
      message
    }
  }
`;

export const DELETE_FOOD_TYPE_MUTATION = `
  mutation DeleteFoodType($id: ID!) {
    foodTypeDelete(id: $id) {
      success
      message
    }
  }
`;

export const DELETE_OCCASION_MUTATION = `
  mutation DeleteOccasion($id: ID!) {
    occasionDelete(id: $id) {
      success
      message
    }
  }
`;
