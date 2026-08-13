import { Router } from "express";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { getAllSessionsController } from "../controllers/admin.session.controller.js";

const router = Router();

router.get(
  "/",
  requireAdmin,
  getAllSessionsController
);

export default router;