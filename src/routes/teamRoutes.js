import { Router } from "express";
import * as team from "../controllers/teamController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/public", team.listPublicTeam);

router.use(requireAuth, requireAdmin);
router.get("/", team.listTeam);
router.post("/", team.createTeamMember);
router.put("/:id", team.updateTeamMember);
router.delete("/:id", team.deleteTeamMember);

export default router;
