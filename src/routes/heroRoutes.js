import { Router } from "express";
import * as hero from "../controllers/heroController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/public", hero.getPublicHero);

router.use(requireAuth, requireAdmin);
router.get("/", hero.getHero);
router.put("/", hero.upsertHero);

export default router;
