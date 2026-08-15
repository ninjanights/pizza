import type { Request, Response } from "express";
import { createSession, getSession } from "../services/session.service.js";

const SESSION_COOKIE = "sessionId";

export const createUserSession = async (
  req: Request,
  res: Response,
) => {
  try {
 const existingSessionId = req.cookies[SESSION_COOKIE];

if (existingSessionId) {
  const existingSession = await getSession(existingSessionId);

  if (
    existingSession &&
    existingSession.expiresAt > new Date()
  ) {
    return res.status(200).json({
      success: true,
      data: {
        sessionId: existingSession.id,
        expiresAt: existingSession.expiresAt,
      },
    });
  }
}
    // No session → create one
    const session = await createSession();

    res.cookie(SESSION_COOKIE, session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      expires: session.expiresAt,
        path: "/",

    });

    return res.status(201).json({
      success: true,
      data: {
        sessionId: session.id,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Failed to create session:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create session",
    });
  }
};