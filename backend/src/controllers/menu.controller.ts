import { getMenuItems } from "../services/menu.service.js";
import type { Request, Response } from "express";

export const getMenu = async (_req: Request, res: Response) => {
  try {
    const menuItems = await getMenuItems();
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    console.error("Failed to fetch menu:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch menu",
    });
  }
};
