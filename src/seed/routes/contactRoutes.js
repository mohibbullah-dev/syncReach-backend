import { Router } from "express";
import * as contact from "../controllers/contactController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

/** Website contact form */
router.post("/", contact.createContactMessage);

router.use(requireAuth, requireAdmin);
router.get("/", contact.listContactMessages);
router.patch("/:id/read", contact.markContactRead);
router.delete("/:id", contact.deleteContactMessage);

export default router;
