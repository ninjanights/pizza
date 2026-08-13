import { Router } from "express";
import { requireSession } from "../middleware/session.middleware.js";
import {
  createOrderController,
  getOrderController,
} from "../controllers/order.controller.js";

const router = Router();

router.post(
  "/",
  requireSession,
  createOrderController
);

router.get(
  "/:id",
  requireSession,
  getOrderController
);

export default router;