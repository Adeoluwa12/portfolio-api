import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for images
});

function handleMulterUpload(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large (max 10MB)" });
    }
    return res.status(400).json({ error: err.message || "Invalid file upload" });
  });
}

router.post("/", requireAdmin, handleMulterUpload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ error: "Only image uploads are supported" });
  }

  const uploadFromBuffer = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "oluferanmi-sec-portfolio" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

  try {
    const result = await uploadFromBuffer();
    res.status(201).json({ url: result.secure_url, resourceType: "image" });
  } catch (err) {
    console.error("Cloudinary upload failed:", err.message);

    const isAuthError =
      err.http_code === 401 ||
      /invalid api key|unknown api key|api secret/i.test(err.message || "");

    const message = isAuthError
      ? "Cloudinary credentials are invalid. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env."
      : err.message || "Upload failed";

    res.status(500).json({ error: message });
  }
});

export default router;