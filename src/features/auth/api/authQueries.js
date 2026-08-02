export const LOGIN_ADMIN_MUTATION = `
  mutation AdminLogin($email: String!, $password: String!, $role: String!) {
    loginUser(email: $email, password: $password, role: $role) {
      success
      access
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export const CURRENT_ADMIN_QUERY = `
  query GetCurrentAdmin {
    me {
      id
      email
      firstName
      lastName
      role
      isAdmin
      isStaff
      isSuperuser
    }
  }
`;

export const PASSWORD_RESET_MAIL_MUTATION = `
  mutation RequestAdminPasswordReset($email: String!, $role: String!) {
    passwordResetMail(email: $email, role: $role) {
      success
      message
    }
  }
`;

export const VERIFY_RESET_CODE_MUTATION = `
  mutation VerifyAdminResetCode($email: String!, $pin: String!) {
    verifyResetCode(email: $email, pin: $pin) {
      success
      message
      token
    }
  }
`;

export const RESET_PASSWORD_MUTATION = `
  mutation ResetAdminPassword(
    $email: String!
    $token: String!
    $password1: String!
    $password2: String!
  ) {
    resetPassword(
      email: $email
      token: $token
      password1: $password1
      password2: $password2
    ) {
      success
      message
    }
  }
`;

export const ADD_NEW_ADMINISTRATOR_MUTATION = `
  mutation AddNewAdministrator($input: AddNewAdministratorInput!) {
    addNewAdministrator(input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      user {
        id
        email
        role
        firstName
        lastName
      }
    }
  }
`;
