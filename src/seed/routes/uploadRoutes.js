import { Router } from "express";
import * as uploadCtrl from "../controllers/uploadController.js";
import { upload } from "../middleware/upload.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

/** Public status (no secrets) — portal Settings can show “connected”. */
router.get("/status", uploadCtrl.cloudinaryStatus);

/**
 * Uploads go through the server so the API secret never hits the browser.
 * Auth optional when CLOUDINARY_PUBLIC_UPLOAD=true (local CMS before JWT wiring).
 */
function optionalAuth(req, res, next) {
  if (process.env.CLOUDINARY_PUBLIC_UPLOAD === "true") {
    return next();
  }
  return requireAuth(req, res, () => requireAdmin(req, res, next));
}

router.post("/", optionalAuth, upload.single("file"), uploadCtrl.uploadFile);
router.delete("/", optionalAuth, uploadCtrl.deleteFile);

export default router;
