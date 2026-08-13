import { Router } from "express";
import { requireSession } from "../middleware/session.middleware.js";
import { validateCreateOrder } from "../validations/order.validation.js";
import { createOrder } from "../services/order.service.js";


const router = Router();

router.post("/", requireSession,async (_req, res) => {


  const error = validateCreateOrder(_req.body);
    if (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }

  try  {
    const order = await createOrder({
      sessionId: _req.session!.id,
      deliveryName: _req.body.deliveryName,
      deliveryPhone: _req.body.deliveryPhone,
      deliveryAddress: _req.body.deliveryAddress,
      items: _req.body.items,
    });

    return res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        total: order.total,
      },
    });
    
  } catch (error) {
     console.error("Order creation failed:", error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to create order",
    });
  

  }
});

export default router;