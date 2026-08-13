import request from "supertest";
import "dotenv/config";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("POST /api/session", () => {
  it("should create a new session", async () => {
    const response = await request(app).post("/api/session");

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("sessionId");
    expect(response.body.data).toHaveProperty("expiresAt");
  });

  it("should set a session cookie", async () => {
    const response = await request(app).post("/api/session");

    expect(response.status).toBe(201);

    const cookies = response.headers["set-cookie"];

    if (!cookies) {
      throw new Error("Session cookie was not set");
    }

    const cookieString = Array.isArray(cookies) ? cookies.join("; ") : cookies;

    expect(cookies).toBeDefined();
    expect(cookieString).toContain("sessionId=");
  });
});
