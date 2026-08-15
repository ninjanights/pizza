import type { Request, Response } from "express";
import {
  getStoreSettings,
  updateAutoOrderProgression,
} from "../services/storeSettings.service.js";

export async function getSettingsController(
  _req: Request,
  res: Response,
) {
  try {
    const settings = await getStoreSettings();

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get settings failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get store settings",
    });
  }
}

export async function updateAutoProgressionController(
  req: Request,
  res: Response,
) {
  try {
    const { enabled } = req.body;

    if (typeof enabled !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "enabled must be a boolean",
      });
    }

    const settings =
      await updateAutoOrderProgression(enabled);

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Update settings failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update store settings",
    });
  }
}