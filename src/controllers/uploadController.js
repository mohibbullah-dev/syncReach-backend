import { configureCloudinary } from "../config/cloudinary.js";

function resourceType(mimetype = "") {
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "video"; // Cloudinary stores audio under video resource type
  return "image";
}

function folderFor(folder) {
  const base = process.env.CLOUDINARY_FOLDER || "syncreach";
  return folder ? `${base}/${folder}` : base;
}

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Use field name \"file\"." });
    }

    const cloudinary = configureCloudinary();
    const folder = folderFor(req.body?.folder || req.query?.folder);
    const type = resourceType(req.file.mimetype);

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: type,
          overwrite: false,
        },
        (err, uploaded) => {
          if (err) reject(err);
          else resolve(uploaded);
        },
      );
      stream.end(req.file.buffer);
    });

    res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      duration: result.duration,
    });
  } catch (err) {
    const cloudMsg = err?.error?.message || err?.message || "";
    if (err?.http_code === 403 || /missing permissions|forbidden/i.test(cloudMsg)) {
      return res.status(403).json({
        message:
          "Cloudinary API key cannot upload (missing create permission). " +
          "In Cloudinary Console → Settings → API Keys, edit/create a key with Upload access, then update CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
        detail: cloudMsg || undefined,
      });
    }
    next(err);
  }
}

export async function deleteFile(req, res, next) {
  try {
    const { publicId, resourceType = "image" } = req.body;
    if (!publicId) {
      return res.status(400).json({ message: "publicId is required." });
    }
    const cloudinary = configureCloudinary();
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    res.json({ ok: true, result });
  } catch (err) {
    next(err);
  }
}

export function cloudinaryStatus(_req, res) {
  const configured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
  res.json({
    configured,
    cloudName: configured ? process.env.CLOUDINARY_CLOUD_NAME : null,
    folder: process.env.CLOUDINARY_FOLDER || "syncreach",
  });
}
