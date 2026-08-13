import { Router } from "express";
import { requireSession } from "../middleware/session.middleware.js";
import {
    cancelOrderController,
  createOrderController,
  getOrderController,
  getOrdersController,
} from "../controllers/order.controller.js";

const router = Router();

// create
router.post(
  "/",
  requireSession,
  createOrderController
);

// signle order
router.get(
  "/:orderId",
  requireSession,
  getOrderController
);

// list
router.get("/", requireSession, getOrdersController);

// cancel one
router.patch(
  "/:orderId/cancel",
  requireSession,
  cancelOrderController
);


export default router;