import { Router } from "express";
import * as auth from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.get("/me", requireAuth, auth.me);
router.patch("/profile", requireAuth, auth.updateProfile);

export default router;
