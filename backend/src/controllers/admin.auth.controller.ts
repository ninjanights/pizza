import type { Request, Response } from "express";
import { loginAdmin } from "../services/admin.auth.service.js";

export const loginAdminController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginAdmin(email, password);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.cookie("adminToken", result.token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 8 * 60 * 60 * 1000,
    path: "/",

});

    return res.status(200).json({
      success: true,
      data: result.admin,
    });
  } catch (error) {
    console.error("Admin login failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
};

export const getCurrentAdminController = (
  req: Request,
  res: Response
) => {
  return res.status(200).json({
    success: true,
    data: {
      id: req.admin!.id,
    },
  });
};

export const logoutAdminController = (
  _req: Request,
  res: Response
) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
        path: "/",

  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};