import prisma from "../config/database.js";

interface CreateOrderData {
  sessionId: string;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
}

export async function createOrder(data: CreateOrderData) {
  return prisma.$transaction(async (tx) => {
    let total = 0;
    const orderItems = [];

    for (const item of data.items) {
      const menuItem = await tx.menuItem.findUnique({
        where: {
          id: item.menuItemId,
        },
      });

      if (!menuItem) {
        throw new Error(`Menu item not found: ${item.menuItemId}`);
      }

      if (!menuItem.isAvailable) {
        throw new Error(`${menuItem.name} is currently unavailable`);
      }

      if (menuItem.inventory < item.quantity) {
        throw new Error(`Insufficient inventory for ${menuItem.name}`);
      }
      const unitPrice = Number(menuItem.price);
      const subtotal = unitPrice * item.quantity;

      total += subtotal;

      orderItems.push({
        menuItemId: menuItem.id,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        subtotal,
      });
    }
    const order = await tx.order.create({
      data: {
        sessionId: data.sessionId,
        deliveryName: data.deliveryName,
        deliveryPhone: data.deliveryPhone,
        deliveryAddress: data.deliveryAddress,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Decrease inventory
    for (const item of data.items) {
      const updated = await tx.menuItem.updateMany({
        where: {
          id: item.menuItemId,
          inventory: {
            gte: item.quantity,
          },
        },
        data: {
          inventory: {
            decrement: item.quantity,
          },
        },
      });

      if (updated.count !== 1) {
        throw new Error(`Insufficient inventory for ${item.menuItemId}`);
      }
    }

    return order;
  });
}
