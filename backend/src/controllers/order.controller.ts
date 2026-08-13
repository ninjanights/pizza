import type { Request, Response } from "express";
import { createOrder, getOrderById } from "../services/order.service.js";

type OrderParams = {
  orderId: string;
};

export const getOrderController = async (
  req: Request<OrderParams>,
  res: Response
) => {
  try {
    const { orderId } = req.params;
    const sessionId = req.session!.id;

    const order = await getOrderById(orderId, sessionId);

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
    console.error("Get order failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get order",
    });
  }
};

export const createOrderController = async (
  req: Request,
  res: Response
) => {
  try {
    const sessionId = req.session?.id;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Session required",
      });
    }

    const {
      deliveryName,
      deliveryPhone,
      deliveryAddress,
      items,
    } = req.body;

    // Basic validation
    if (
      !deliveryName ||
      !deliveryPhone ||
      !deliveryAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Delivery information is required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart cannot be empty",
      });
    }

    for (const item of items) {
      if (
        !item.menuItemId ||
        typeof item.quantity !== "number" ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid cart item",
        });
      }
    }

    const order = await createOrder({
      sessionId,
      deliveryName,
      deliveryPhone,
      deliveryAddress,
      items,
    });

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Create order failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create order";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};