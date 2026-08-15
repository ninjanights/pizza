import { Router } from "express";
import {
  getSettingsController,
  updateAutoProgressionController,
} from "../controllers/admin.settings.controller.js";



import { requireAdmin } from "../middleware/admin.middleware.js";
const router = Router();

router.get("/", requireAdmin, getSettingsController);

router.patch(
  "/auto-progression", 
  requireAdmin,
  updateAutoProgressionController,
);

export default router;