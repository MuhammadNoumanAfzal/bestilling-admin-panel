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
    dietaryTags {
      id
      name
      slug
      isActive
      sortOrder
    }
    cuisineTypes {
      id
      name
      slug
      isActive
      sortOrder
    }
    businessTypes {
      id
      name
      slug
      isActive
      sortOrder
    }
    languages {
      code
      label
      isActive
      sortOrder
    }
    currencies {
      code
      label
      symbol
      isActive
      sortOrder
    }
    timeZones {
      value
      label
      utcOffset
      isActive
      sortOrder
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

export const CREATE_DIETARY_TAG_MUTATION = `
  mutation SaveDietaryTag($input: DietaryTagInput!) {
    dietaryTagMutation(input: $input) {
      success
      message
      instance {
        id
        name
        slug
        isActive
        sortOrder
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CREATE_CUISINE_TYPE_MUTATION = `
  mutation SaveCuisineType($input: CuisineTypeInput!) {
    cuisineTypeMutation(input: $input) {
      success
      message
      instance {
        id
        name
        slug
        isActive
        sortOrder
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CREATE_BUSINESS_TYPE_MUTATION = `
  mutation SaveBusinessType($input: BusinessTypeInput!) {
    businessTypeMutation(input: $input) {
      success
      message
      instance {
        id
        name
        slug
        isActive
        sortOrder
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CREATE_LANGUAGE_MUTATION = `
  mutation SaveLanguage($input: LanguageOptionInput!) {
    languageOptionMutation(input: $input) {
      success
      message
      instance {
        code
        label
        isActive
        sortOrder
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CREATE_CURRENCY_MUTATION = `
  mutation SaveCurrency($input: CurrencyOptionInput!) {
    currencyOptionMutation(input: $input) {
      success
      message
      instance {
        code
        label
        symbol
        isActive
        sortOrder
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CREATE_TIME_ZONE_MUTATION = `
  mutation SaveTimeZone($input: TimeZoneOptionInput!) {
    timeZoneOptionMutation(input: $input) {
      success
      message
      instance {
        value
        label
        utcOffset
        isActive
        sortOrder
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const DELETE_VENDOR_CATEGORY_MUTATION = `
  mutation DeleteVendorCategory($id: ID!) {
    vendorCategoryDeleteMutation(id: $id) {
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

export const DELETE_DIETARY_TAG_MUTATION = `
  mutation DeleteDietaryTag($id: ID!) {
    dietaryTagDelete(id: $id) {
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

export const DELETE_CUISINE_TYPE_MUTATION = `
  mutation DeleteCuisineType($id: ID!) {
    cuisineTypeDelete(id: $id) {
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

export const DELETE_BUSINESS_TYPE_MUTATION = `
  mutation DeleteBusinessType($id: ID!) {
    businessTypeDelete(id: $id) {
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

export const DELETE_LANGUAGE_MUTATION = `
  mutation DeleteLanguage($code: String!) {
    languageOptionDelete(code: $code) {
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

export const DELETE_CURRENCY_MUTATION = `
  mutation DeleteCurrency($code: String!) {
    currencyOptionDelete(code: $code) {
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

export const DELETE_TIME_ZONE_MUTATION = `
  mutation DeleteTimeZone($value: String!) {
    timeZoneOptionDelete(value: $value) {
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
