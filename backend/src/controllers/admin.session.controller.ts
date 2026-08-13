import type { Request, Response } from "express";
import { getAllSessions } from "../services/admin.session.service.js";

export const getAllSessionsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const sessions = await getAllSessions();

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Failed to fetch sessions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
    });
  }
};