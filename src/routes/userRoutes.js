import { Router } from "express";
import * as users from "../controllers/userController.js";
import { requireAuth, requireSuperAdmin } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireSuperAdmin);
router.get("/", users.listUsers);
router.post("/", users.createAdmin);
router.delete("/:id", users.deleteUser);

export default router;
