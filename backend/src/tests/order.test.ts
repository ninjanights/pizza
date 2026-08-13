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


});