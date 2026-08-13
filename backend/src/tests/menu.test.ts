import request from "supertest";
import "dotenv/config";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("GET /api/menu", () => {
  it("should return available menu items", async () => {
    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("should return menu items with required fields", async () => {
    const response = await request(app).get("/api/menu");

    expect(response.status).toBe(200);

    for (const item of response.body.data) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("price");
      expect(item).toHaveProperty("imageUrl");
      expect(item).toHaveProperty("inventory");
      expect(item).toHaveProperty("isAvailable");
    }
  });

  it("should only return available menu items", async () => {
    const response = await request(app).get("/api/menu");

    expect(response.status).toBe(200);

    for (const item of response.body.data) {
      expect(item.isAvailable).toBe(true);
    }
  });
});
