import { Router } from "express";
import { createUserSession } from "../controllers/session.controller.js";

const router = Router();

router.post("/", createUserSession);

export default router;