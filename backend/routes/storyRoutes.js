import express from "express";
import {
  getStories,
  getStoryBySlug,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  uploadStoryCover,
} from "../controllers/storyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { attachOptionalAdmin } from "../middleware/optionalAuth.js";

const router = express.Router();

router.get("/", attachOptionalAdmin, getStories);
router.get("/id/:id", protect, adminOnly, getStoryById);
router.get("/:slug", attachOptionalAdmin, getStoryBySlug);

router.post("/", protect, adminOnly, createStory);
router.put("/:id", protect, adminOnly, updateStory);
router.delete("/:id", protect, adminOnly, deleteStory);
router.post("/:id/cover", protect, adminOnly, upload.single("image"), uploadStoryCover);

export default router;
