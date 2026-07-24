import { Router } from "express";
import authRoutes from "./authRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import galleryRoutes from "./galleryRoutes.js";
import teamRoutes from "./teamRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "syncreach-api", time: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/reviews", reviewRoutes);
router.use("/gallery", galleryRoutes);
router.use("/team", teamRoutes);
router.use("/upload", uploadRoutes);

export default router;
