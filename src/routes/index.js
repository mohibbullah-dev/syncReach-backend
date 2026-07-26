import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import galleryRoutes from "./galleryRoutes.js";
import teamRoutes from "./teamRoutes.js";
import pricingRoutes from "./pricingRoutes.js";
import faqRoutes from "./faqRoutes.js";
import contactRoutes from "./contactRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "syncreach-api", time: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/reviews", reviewRoutes);
router.use("/gallery", galleryRoutes);
router.use("/team", teamRoutes);
router.use("/pricing", pricingRoutes);
router.use("/faq", faqRoutes);
router.use("/contact", contactRoutes);
router.use("/upload", uploadRoutes);

export default router;
