import type { Request, Response, NextFunction } from "express";
import prisma from "../config/database.js";

export const requireSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Session required",
      });
    }

    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid session",
      });
    }

    if (session.expiresAt <= new Date()) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

     req.session = session;

    next();
  } catch (error) {
    console.error("Session validation failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to validate session",
    });
  }
};