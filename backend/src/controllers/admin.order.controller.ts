import type { Request, Response } from "express";
import { getAllOrdersAdmin, updateOrderStatusAdmin } from "../services/order.service.js";

export const getAllOrdersController = async (
  _req: Request,
  res: Response
) => {
  try {
    const orders = await getAllOrdersAdmin();

    return res.status(200).json({
      success: true,
      data: orders,
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
  res: Response
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