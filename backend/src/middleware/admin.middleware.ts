import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

interface AdminTokenPayload {
  adminId: string;
}

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;

    req.admin = {
      id: decoded.adminId,
    };

    next();
  } catch (error) {
    console.error("Admin authentication failed:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token",
    });
  }
};