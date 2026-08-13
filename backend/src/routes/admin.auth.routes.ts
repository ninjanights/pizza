import { Router } from "express";
import { loginAdminController } from "../controllers/admin.auth.controller.js";
const router = Router();

router.post("/login", loginAdminController);

export default router;