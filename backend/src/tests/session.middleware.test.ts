import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

import request from "supertest";
import { describe, expect, it } from "vitest";
import { requireSession } from "../middleware/session.middleware.js";
import prisma from "../config/database.js";

const testApp = express();

testApp.use(cookieParser());


testApp.get("/protected", requireSession, (_req, res) => {
  res.status(200).json({
    success: true,
      sessionId: _req.session?.id,
  });
});

describe("requireSession middleware", () => {
  it("should reject requests without a session cookie", async () => {
    const response = await request(testApp).get("/protected");

    expect(response.status).toBe(401);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Session required");
  });

  it("should reject an invalid session", async () => {
    const response = await request(testApp)
      .get("/protected")
      .set("Cookie", "sessionId=invalid-session-id");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid session");
    
  });

  it("should reject an expired session", async () => {
  const session = await prisma.session.create({
    data: {
      expiresAt: new Date(Date.now() - 1000),
    },
  });

  const response = await request(testApp)
    .get("/protected")
    .set("Cookie", `sessionId=${session.id}`);

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Session expired");
});

it("should allow a valid session", async () => {
  const session = await prisma.session.create({
    data: {
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const response = await request(testApp)
    .get("/protected")
    .set("Cookie", `sessionId=${session.id}`);

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);

  expect(response.body.sessionId).toBe(session.id);
});



});