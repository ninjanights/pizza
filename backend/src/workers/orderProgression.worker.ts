import prisma from "../config/database.js";

import type { OrderStatus } from "../generated/prisma/enums.js";

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  RECEIVED: "PREPARING",
  PREPARING: "READY",
  READY: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};
const STATUS_DELAY = 20 * 1000;

export async function processAutomaticOrders() {
  const settings = await prisma.storeSetting.findFirst();

  if (!settings?.autoOrderProgression) {
    return;
  }

  const cutoff = new Date(Date.now() - STATUS_DELAY);

  const orders = await prisma.order.findMany({
    where: {
      statusChangedAt: {
        lte: cutoff,
      },
      status: {
        in: ["RECEIVED", "PREPARING", "READY", "OUT_FOR_DELIVERY"],
      },
    },
  });

  for (const order of orders) {
    const status = nextStatus[order.status];

    if (!status) continue;

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status,
        statusChangedAt: new Date(),
      },
    });

    console.log(`Order ${order.id}: ${order.status} → ${status}`);
  }
}
