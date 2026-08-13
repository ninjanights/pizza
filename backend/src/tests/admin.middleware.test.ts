import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import "dotenv/config";

import cookieParser from "cookie-parser";
import { requireAdmin } from "../middleware/admin.middleware.js";

const testApp = express();
testApp.use(cookieParser());

testApp.use((req, _res, next) => {
  // test middleware doesn't need anything extra here
  next();
});

testApp.get("/admin", requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    adminId: req.admin?.id,
  });
});

describe("requireAdmin middleware", () => {
  it("should reject a request without an admin token", async () => {
    const response = await request(testApp).get("/admin");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Admin authentication required");
  });

  it("should reject an invalid admin token", async () => {
    const response = await request(testApp)
      .get("/admin")
      .set("Cookie", "adminToken=invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid or expired admin token");
  });

  it("should allow a valid admin token", async () => {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const adminId = "test-admin-id";

    const token = jwt.sign(
      {
        adminId,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const response = await request(testApp)
      .get("/admin")
      .set("Cookie", `adminToken=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.adminId).toBe(adminId);
  });
});