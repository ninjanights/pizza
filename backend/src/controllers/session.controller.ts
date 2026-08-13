import type { Request, Response } from "express";
import { createSession } from "../services/session.service.js";

const SESSION_COOKIE = "sessionId";

export const createUserSession = async (
  _req: Request,
  res: Response
) => {
  try {
    const session = await createSession();

    res.cookie(SESSION_COOKIE, session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: session.expiresAt,
    });

    res.status(201).json({
      success: true,
      data: {
        sessionId: session.id,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Failed to create session:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create session",
    });
  }
};