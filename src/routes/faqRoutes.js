import { Router } from "express";
import * as faq from "../controllers/faqController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/public", faq.listPublicFaq);

router.use(requireAuth, requireAdmin);
router.get("/", faq.listFaq);
router.post("/", faq.createFaq);
router.put("/:id", faq.updateFaq);
router.delete("/:id", faq.deleteFaq);

export default router;
