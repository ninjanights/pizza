import request from "supertest";
import "dotenv/config";
import jwt from "jsonwebtoken";

import { describe, expect, it } from "vitest";
import app from "../app.js";
import prisma from "../config/database.js";

const createAdminToken = async () => {
  const admin = await prisma.admin.findUnique({
    where: {
      email: "pizza@pizza.com",
    },
  });

  if (!admin) {
    throw new Error("Test admin not found");
  }

  return jwt.sign(
    { adminId: admin.id },
    process.env.JWT_SECRET!
  );
};

// Only used to create an Order fixture.
// This is NOT admin authentication.
const createTestOrder = async () => {
  const session = await prisma.session.create({
    data: {
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  return prisma.order.create({
    data: {
      sessionId: session.id,
      deliveryName: "Abir Das",
      deliveryPhone: "9876543210",
      deliveryAddress: "Kolkata",
      total: 299,
    },
  });
};

describe("GET /api/admin/orders", () => {
  it("should reject unauthenticated admin", async () => {
    const response = await request(app)
      .get("/api/admin/orders");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return all orders for an admin", async () => {
    const token = await createAdminToken();

    await createTestOrder();

    const response = await request(app)
      .get("/api/admin/orders")
      .set("Cookie", `adminToken=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe("PATCH /api/admin/orders/:orderId/status", () => {
  it("should reject unauthenticated admin", async () => {
    const response = await request(app)
      .patch("/api/admin/orders/some-order-id/status")
      .send({
        status: "PREPARING",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should update an order status", async () => {
    const token = await createAdminToken();
    const order = await createTestOrder();

    const response = await request(app)
      .patch(`/api/admin/orders/${order.id}/status`)
      .set("Cookie", `adminToken=${token}`)
      .send({
        status: "PREPARING",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("PREPARING");
  });

  it("should return 404 for a nonexistent order", async () => {
    const token = await createAdminToken();

    const response = await request(app)
      .patch(
        "/api/admin/orders/00000000-0000-0000-0000-000000000000/status"
      )
      .set("Cookie", `adminToken=${token}`)
      .send({
        status: "PREPARING",
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("should reject a missing status", async () => {
    const token = await createAdminToken();
    const order = await createTestOrder();

    const response = await request(app)
      .patch(`/api/admin/orders/${order.id}/status`)
      .set("Cookie", `adminToken=${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});