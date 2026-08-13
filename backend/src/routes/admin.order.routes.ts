import { Router } from "express";
import {
  getAllOrdersController,
  updateOrderStatusController,
} from "../controllers/admin.order.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// Get all orders admin
router.get("/", requireAdmin, getAllOrdersController);

// Update order status admin
router.patch(
  "/:orderId/status",
  requireAdmin,
  updateOrderStatusController
);

export default router;