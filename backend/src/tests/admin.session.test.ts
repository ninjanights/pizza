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

describe("GET /api/admin/sessions", () => {
  it("should reject unauthenticated admin", async () => {
    const response = await request(app)
      .get("/api/admin/sessions");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return all sessions for admin", async () => {
    const token = await createAdminToken();

    const response = await request(app)
      .get("/api/admin/sessions")
      .set("Cookie", `adminToken=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});