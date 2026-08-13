import request from "supertest";
import "dotenv/config";
import prisma from "../config/database.js";

import { describe, expect, it } from "vitest";
import app from "../app.js";

const createTestSession = async () => {
  return prisma.session.create({
    data: {
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
};
describe("POST /api/orders", () => {
  it("should reject an order without a session", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        deliveryName: "Abir Das",
        deliveryPhone: "9876543210",
        deliveryAddress: "Kolkata",
        items: [
          {
            menuItemId: "some-id",
            quantity: 2,
          },
        ],
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  // should reject an empty cart
  it("should reject an empty cart", async () => {
    const session = await createTestSession();

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", `sessionId=${session.id}`)
      .send({
        deliveryName: "Abir Das",
        deliveryPhone: "9876543210",
        deliveryAddress: "Kolkata",
        items: [],
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject zero quantity", async () => {
    const session = await createTestSession();

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", `sessionId=${session.id}`)
      .send({
        deliveryName: "Abir Das",
        deliveryPhone: "9876543210",
        deliveryAddress: "Kolkata",
        items: [
          {
            menuItemId: "some-id",
            quantity: 0,
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
  it("should reject negative quantity", async () => {
    const session = await createTestSession();

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", `sessionId=${session.id}`)
      .send({
        deliveryName: "Abir Das",
        deliveryPhone: "9876543210",
        deliveryAddress: "Kolkata",
        items: [
          {
            menuItemId: "some-id",
            quantity: -2,
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
  it("should reject missing delivery information", async () => {
    const session = await createTestSession();

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", `sessionId=${session.id}`)
      .send({
        items: [
          {
            menuItemId: "some-id",
            quantity: 2,
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
  it("should create an order successfully", async () => {
    const session = await createTestSession();

    const menuItem = await prisma.menuItem.findFirst({
      where: {
        isAvailable: true,
        inventory: {
          gt: 0,
        },
      },
    });

    if (!menuItem) {
      throw new Error("No available menu item found for test");
    }

    const quantity = 2;

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", `sessionId=${session.id}`)
      .send({
        deliveryName: "Abir Das",
        deliveryPhone: "9876543210",
        deliveryAddress: "Kolkata",
        items: [
          {
            menuItemId: menuItem.id,
            quantity,
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("orderId");
    expect(response.body.data).toHaveProperty("total");
    expect(response.body.data.status).toBe("RECEIVED");
  });

  // inventory decrease
  it("should decrease inventory after placing an order", async () => {
    const session = await createTestSession();

    const menuItem = await prisma.menuItem.findFirst({
      where: {
        isAvailable: true,
        inventory: {
          gte: 2,
        },
      },
    });

    if (!menuItem) {
      throw new Error("No menu item with enough inventory found");
    }

    const initialInventory = menuItem.inventory;

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", `sessionId=${session.id}`)
      .send({
        deliveryName: "Abir Das",
        deliveryPhone: "9876543210",
        deliveryAddress: "Kolkata",
        items: [
          {
            menuItemId: menuItem.id,
            quantity: 2,
          },
        ],
      });

    expect(response.status).toBe(201);

    const updatedItem = await prisma.menuItem.findUnique({
      where: {
        id: menuItem.id,
      },
    });

    expect(updatedItem?.inventory).toBe(initialInventory - 2);
  });

  it("should reject an order when inventory is insufficient", async () => {
    const session = await createTestSession();

    const menuItem = await prisma.menuItem.findFirst({
      where: {
        isAvailable: true,
      },
    });

    if (!menuItem) {
      throw new Error("No menu item found");
    }

    const requestedQuantity = menuItem.inventory + 1;

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", `sessionId=${session.id}`)
      .send({
        deliveryName: "Abir Das",
        deliveryPhone: "9876543210",
        deliveryAddress: "Kolkata",
        items: [
          {
            menuItemId: menuItem.id,
            quantity: requestedQuantity,
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("inventory");
  });

  // if it doesnt exist
  it("should reject a nonexistent menu item", async () => {
    const session = await createTestSession();

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", `sessionId=${session.id}`)
      .send({
        deliveryName: "Abir Das",
        deliveryPhone: "9876543210",
        deliveryAddress: "Kolkata",
        items: [
          {
            menuItemId: "00000000-0000-0000-0000-000000000000",
            quantity: 1,
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // only a valid/successfull order can be retrieved
  it("should get an order belonging to the current session", async () => {
    const session = await createTestSession();

    const menuItem = await prisma.menuItem.findFirst({
      where: {
        isAvailable: true,
        inventory: {
          gt: 0,
        },
      },
    });

    if (!menuItem) {
      throw new Error("No available menu item found");
    }

    const order = await prisma.order.create({
      data: {
        sessionId: session.id,
        deliveryName: "Abir Das",
        deliveryPhone: "9876543210",
        deliveryAddress: "Kolkata",
        total: menuItem.price,
        items: {
          create: {
            menuItemId: menuItem.id,
            quantity: 1,
            unitPrice: menuItem.price,
            subtotal: menuItem.price,
          },
        },
      },
    });

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", `sessionId=${session.id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.data.id).toBe(order.id);
    expect(response.body.data.status).toBe("RECEIVED");
  });

  // dont allow other session see the order
  it("should not allow another session to access the order", async () => {
    const session = await createTestSession();
    const anotherSession = await createTestSession();

    const menuItem = await prisma.menuItem.findFirst({
      where: {
        isAvailable: true,
      },
    });

    if (!menuItem) {
      throw new Error("No menu item found");
    }

    const order = await prisma.order.create({
      data: {
        sessionId: session.id,
        deliveryName: "Abir Das",
        deliveryPhone: "9876543210",
        deliveryAddress: "Kolkata",
        total: menuItem.price,
        items: {
          create: {
            menuItemId: menuItem.id,
            quantity: 1,
            unitPrice: menuItem.price,
            subtotal: menuItem.price,
          },
        },
      },
    });

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", `sessionId=${anotherSession.id}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  // non-esistant order
  it("should return 404 for a nonexistent order", async () => {
    const session = await createTestSession();

    const response = await request(app)
      .get("/api/orders/00000000-0000-0000-0000-000000000000")
      .set("Cookie", `sessionId=${session.id}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });



  // create order successfully 
  it("should create an order successfully", async () => {
  const session = await createTestSession();

  const menuItem = await prisma.menuItem.findFirst({
    where: {
      isAvailable: true,
      inventory: {
        gt: 0,
      },
    },
  });

  expect(menuItem).not.toBeNull();

  const quantity = 2;

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", `sessionId=${session.id}`)
    .send({
      deliveryName: "Abir Das",
      deliveryPhone: "9876543210",
      deliveryAddress: "Kolkata",
      items: [
        {
          menuItemId: menuItem!.id,
          quantity,
        },
      ],
    });

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);

  expect(response.body.data).toHaveProperty("orderId");
  expect(response.body.data).toHaveProperty("status");
  expect(response.body.data).toHaveProperty("total");
});
});
