import { Router } from "express";
import {
  getCurrentAdminController,
  loginAdminController,
} from "../controllers/admin.auth.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
const router = Router();

router.get("/me", requireAdmin, getCurrentAdminController);
router.post("/login", loginAdminController);

export default router;
