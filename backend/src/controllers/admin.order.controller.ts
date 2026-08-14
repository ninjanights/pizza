import type { Request, Response } from "express";
import {
  getAdminDashboardStats,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../services/order.service.js";
import type { OrderStatus } from "../generated/prisma/enums.js";

const validStatuses: OrderStatus[] = [
  "RECEIVED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];
export const getAllOrdersController = async (_req: Request, res: Response) => {
  try {
    // Default page = 1
    const page = Math.max(Number(_req.query.page) || 1, 1);

    // Default status = ALL
    const rawStatus = String(_req.query.status ?? "ALL");
    // Validate status
    if (
      rawStatus !== "ALL" &&
      !validStatuses.includes(rawStatus as OrderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const status = rawStatus === "ALL" ? undefined : (rawStatus as OrderStatus);

    const result = await getAllOrdersAdmin({
      page,
      limit: 10,
      status,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to fetch admin orders:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const updateOrderStatusController = async (
  req: Request<{ orderId: string }>,
  res: Response,
) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const order = await updateOrderStatusAdmin(orderId, status);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Failed to update order status:", error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update order status",
    });
  }
};

export const getAdminDashboardController = async (
  req: Request,
  res: Response,
) => {
  try {
    const stats = await getAdminDashboardStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};
