export const ADMIN_SETTINGS_ME_QUERY = `
  query AdminSettingsMe {
    me {
      id
      email
      firstName
      lastName
      fullName
      phone
      role
      isActive
      isVerified
      avatar {
        id
        url
      }
      security {
        lastPasswordChangeAt
        lastLoginAt
        twoFactorEnabled
      }
      preferences {
        defaultCurrency
        timezone
        locale
      }
    }
  }
`;

export const UPDATE_ADMIN_PROFILE_MUTATION = `
  mutation UpdateAdminProfile($input: UpdateAdminProfileInput!) {
    updateAdminProfile(input: $input) {
      success
      message
      requiresEmailVerification
      errors {
        field
        message
        code
      }
      user {
        id
        fullName
        firstName
        lastName
        email
        phone
        avatar {
          id
          url
        }
      }
    }
  }
`;

export const CHANGE_ADMIN_PASSWORD_MUTATION = `
  mutation ChangeAdminPassword($input: ChangeAdminPasswordInput!) {
    changeAdminPassword(input: $input) {
      success
      message
      logoutOtherSessions
      errors {
        field
        message
        code
      }
    }
  }
`;

export const UPDATE_PLATFORM_PREFERENCES_MUTATION = `
  mutation UpdatePlatformPreferences($input: UpdatePlatformPreferencesInput!) {
    updatePlatformPreferences(input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      preferences {
        defaultCurrency
        timezone
        locale
      }
    }
  }
`;

export const UPDATE_ADMIN_AVATAR_MUTATION = `
  mutation UpdateAdminAvatar($photoUrl: String, $assetKey: String) {
    updateAdminAvatar(photoUrl: $photoUrl, assetKey: $assetKey) {
      success
      message
      user {
        id
        avatar {
          id
          url
        }
      }
    }
  }
`;
