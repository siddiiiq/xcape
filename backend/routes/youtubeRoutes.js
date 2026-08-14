import express from "express";
import {
  getYouTubeVideos,
  getYouTubeVideoById,
  createYouTubeVideo,
  updateYouTubeVideo,
  deleteYouTubeVideo,
  uploadYouTubeThumbnail,
} from "../controllers/youtubeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { attachOptionalAdmin } from "../middleware/optionalAuth.js";

const router = express.Router();

router.get("/", attachOptionalAdmin, getYouTubeVideos);
router.get("/id/:id", protect, adminOnly, getYouTubeVideoById);

router.post("/", protect, adminOnly, createYouTubeVideo);
router.put("/:id", protect, adminOnly, updateYouTubeVideo);
router.delete("/:id", protect, adminOnly, deleteYouTubeVideo);
router.post("/:id/thumbnail", protect, adminOnly, upload.single("image"), uploadYouTubeThumbnail);

export default router;
