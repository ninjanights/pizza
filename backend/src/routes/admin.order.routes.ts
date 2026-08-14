import { Router } from "express";
import {
  getAdminDashboardController,
  getAllOrdersController,
  updateOrderStatusController,
} from "../controllers/admin.order.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// Get all orders admin
router.get("/", requireAdmin, getAllOrdersController);

// Update order status admin
router.patch("/:orderId/status", requireAdmin, updateOrderStatusController);
router.get("/dashboard", requireAdmin, getAdminDashboardController);
export default router;
