import Settings from "../models/Settings.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route  GET /api/settings
// @access Public
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  res.json({ success: true, settings });
});

// @route  PUT /api/settings
// @access Private
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  Object.assign(settings, req.body);
  await settings.save();
  res.json({ success: true, settings });
});
