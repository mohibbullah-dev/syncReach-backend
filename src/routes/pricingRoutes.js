import { Router } from "express";
import * as pricing from "../controllers/pricingController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/public", pricing.listPublicPricing);

router.use(requireAuth, requireAdmin);
router.get("/", pricing.listPricing);
router.post("/", pricing.createPricingPlan);
router.put("/:id", pricing.updatePricingPlan);
router.delete("/:id", pricing.deletePricingPlan);

export default router;
