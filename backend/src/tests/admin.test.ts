import request from "supertest";
import "dotenv/config";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("POST /api/admin/login", () => {
  it("should login with correct credentials", async () => {
  const response = await request(app)
    .post("/api/admin/login")
    .send({
      email: "pizza@pizza.com",
      password: "blurrypizza",
    });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);

  expect(response.body.data).toHaveProperty("id");
  expect(response.body.data).toHaveProperty("email");

  const cookies = response.headers["set-cookie"];

  expect(cookies).toBeDefined();

  const cookieString = Array.isArray(cookies)
    ? cookies.join("; ")
    : cookies;

  expect(cookieString).toContain("adminToken=");
  expect(cookieString).toContain("HttpOnly");
});

  it("should reject wrong credentials", async () => {
    const response = await request(app)
      .post("/api/admin/login")
      .send({
        email: "pizza@pizza.com",
        password: "wrong-password",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing email", async () => {
    const response = await request(app)
      .post("/api/admin/login")
      .send({
        password: "blurrypizza",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing password", async () => {
    const response = await request(app)
      .post("/api/admin/login")
      .send({
        email: "pizza@pizza.com",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});