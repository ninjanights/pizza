import prisma from "../config/database.js";
import type { OrderStatus } from "../generated/prisma/enums.js";

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

export async function getOrderById(orderId: string, sessionId: string) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      sessionId,
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });
}

export async function getOrdersBySession(sessionId: string) {
  return prisma.order.findMany({
    where: {
      sessionId,
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function cancelOrder(orderId: string, sessionId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        sessionId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return null;
    }

    if (order.status !== "RECEIVED") {
      throw new Error("Order cannot be cancelled");
    }

    const updatedOrder = await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    // Restore inventory
    for (const item of order.items) {
      await tx.menuItem.update({
        where: {
          id: item.menuItemId,
        },
        data: {
          inventory: {
            increment: item.quantity,
          },
        },
      });
    }

    return updatedOrder;
  });
}

// for admin
export async function getAllOrdersAdmin({
  page = 1,
  limit = 10,
  status,
}: { page?: number; limit?: number; status?: OrderStatus | undefined } = {}) {
  const skip = (page - 1) * limit;
  const where = status
    ? {
        status,
      }
    : {};

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        session: true,
      },
    }),

    prisma.order.count({
      where,
    }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updateOrderStatusAdmin(
  orderId: string,
  status: OrderStatus,
) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    return null;
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });
}

// dashboard admin
export async function getAdminDashboardStats() {
  const orders = await prisma.order.findMany({
    select: {
      status: true,
      total: true,
      deliveryAddress: true,
      deliveryName: true,
      items: {
        select: {
          quantity: true,
          menuItem: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  type StatusStats = {
    orderCount: number;
    revenue: number;
    places: Map<string, number>;
    customers: Map<string, number>;
    items: Map<string, number>;
  };

  const statusMap = new Map<OrderStatus, StatusStats>();
  for (const order of orders) {
    let stats = statusMap.get(order.status);
    if (!stats) {
      stats = {
        orderCount: 0,
        revenue: 0,
        places: new Map(),
        customers: new Map(),
        items: new Map(),
      };
      statusMap.set(order.status, stats);
    }
    // Order count
    stats.orderCount += 1;
    // Revenue
    // Cancelled orders contribute ₹0
    if (order.status !== "CANCELLED") {
      stats.revenue += Number(order.total);
    }
    // Place
    stats.places.set(
      order.deliveryAddress,
      (stats.places.get(order.deliveryAddress) ?? 0) + 1,
    );

    // Customer
    stats.customers.set(
      order.deliveryName,
      (stats.customers.get(order.deliveryName) ?? 0) + 1,
    );

    // Items
    for (const item of order.items) {
      stats.items.set(
        item.menuItem.name,
        (stats.items.get(item.menuItem.name) ?? 0) + item.quantity,
      );
    }
  }

  const statuses = Array.from(statusMap.entries()).map(([status, stats]) => {
    const mostOrderedPlace = Array.from(stats.places.entries()).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const mostOrderedCustomer = Array.from(stats.customers.entries()).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const mostOrderedItem = Array.from(stats.items.entries()).sort(
      (a, b) => b[1] - a[1],
    )[0];

    return {
      status,

      orderCount: stats.orderCount,

      revenue: stats.revenue,

      mostOrderedPlace: mostOrderedPlace
        ? {
            address: mostOrderedPlace[0],
            orderCount: mostOrderedPlace[1],
          }
        : null,

      mostOrderedCustomer: mostOrderedCustomer
        ? {
            name: mostOrderedCustomer[0],
            orderCount: mostOrderedCustomer[1],
          }
        : null,

      mostOrderedItem: mostOrderedItem
        ? {
            name: mostOrderedItem[0],
            quantity: mostOrderedItem[1],
          }
        : null,
    };
  });
  return {
    statuses,
  };
}
