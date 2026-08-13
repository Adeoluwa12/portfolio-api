import { v2 as cloudinary } from "cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

export function validateCloudinaryConfig() {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn(
      "Cloudinary credentials missing — image/video uploads will fail until .env is configured."
    );
    return false;
  }

  if (CLOUDINARY_API_SECRET.length < 20) {
    console.warn(
      "CLOUDINARY_API_SECRET looks incomplete — copy the full API secret from Cloudinary Dashboard → Settings → API Keys."
    );
    return false;
  }

  return true;
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;