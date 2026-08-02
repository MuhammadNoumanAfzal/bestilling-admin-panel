# bestilling-admin-panel
Admin dashboard for the Catering Bestilling Norway platform. Manage vendors, orders, customers, delivery settings, payouts, and platform operations.

## Environment

Create a local `.env` from `.env.example`.

```bash
cp .env.example .env
```

Required variables:

- `VITE_GRAPHQL_API_URL`: GraphQL API endpoint for admin auth and protected requests.
- `VITE_ADMIN_AUTH_ROLE`: Role passed to `loginUser` and `passwordResetMail`. Default: `admin`.
- `VITE_ADMIN_ALLOWED_ROLES`: Comma-separated admin roles allowed to access this portal.
- `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name reused from the vendor panel for direct avatar uploads.
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Cloudinary unsigned upload preset reused from the vendor panel.

## Admin authentication

The admin panel now uses the backend admin auth flow:

- `loginUser(email, password, role: "admin")`
- `me`
- `passwordResetMail(email, role: "admin")`
- `verifyResetCode(email, pin)`
- `resetPassword(email, token, password1, password2)`

Supported admin roles:

- `admin`
- `sub-admin`
- `developer`
- `editor`
- `seo-manager`
- `system-manager`

Notes:

- Protected admin requests must send `Authorization: JWT <token>`.
- `loginUser` returns `token` and `refreshToken`; the admin panel currently authenticates with `token`.
- `verifyResetCode` returns the reset `token` used by `resetPassword`.
- Public self-registration is intentionally disabled in the admin UI.
- New administrator creation should use the protected `addNewAdministrator` mutation from an authenticated super-admin workflow.

## Avatar Uploads

The admin settings page uploads avatar images directly to Cloudinary using the same frontend environment variables already used in the vendor panel:

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

After upload, the returned Cloudinary URL and public ID are sent to `updateAdminAvatar(photoUrl, assetKey)`.
