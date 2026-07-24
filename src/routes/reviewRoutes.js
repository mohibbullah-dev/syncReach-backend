import { Router } from "express";
import * as reviews from "../controllers/reviewController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/public", reviews.listPublicReviews);

router.use(requireAuth, requireAdmin);
router.get("/", reviews.listReviews);
router.post("/", reviews.createReview);
router.put("/:id", reviews.updateReview);
router.delete("/:id", reviews.deleteReview);

export default router;
