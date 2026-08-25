const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function hasAdminUploadConfiguration() {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);
}

export function getAdminUploadConfigurationMessage() {
  return "Avatar uploads are unavailable because Cloudinary is not configured for this environment.";
}

export async function uploadAdminFile(file, resourceType = "image") {
  if (!hasAdminUploadConfiguration()) {
    throw new Error(getAdminUploadConfigurationMessage());
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.secure_url || !payload?.public_id) {
    throw new Error(payload?.error?.message || "Avatar upload failed. Please try again.");
  }

  return {
    photoUrl: payload.secure_url,
    assetKey: payload.public_id,
  };
}

export async function uploadAdminAvatar(file) {
  return uploadAdminFile(file, "image");
}
