import { Router } from "express";
import * as gallery from "../controllers/galleryController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/public", gallery.listPublicGallery);

router.use(requireAuth, requireAdmin);
router.get("/", gallery.listGallery);
router.post("/", gallery.createGalleryItem);
router.put("/:id", gallery.updateGalleryItem);
router.delete("/:id", gallery.deleteGalleryItem);

export default router;
