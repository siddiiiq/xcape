import express from "express";
import {
  getReels,
  getReelById,
  createReel,
  updateReel,
  deleteReel,
  uploadReelThumbnail,
  uploadReelVideoPreview,
} from "../controllers/reelController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { attachOptionalAdmin } from "../middleware/optionalAuth.js";

const router = express.Router();

router.get("/", attachOptionalAdmin, getReels);
router.get("/id/:id", protect, adminOnly, getReelById);

router.post("/", protect, adminOnly, createReel);
router.put("/:id", protect, adminOnly, updateReel);
router.delete("/:id", protect, adminOnly, deleteReel);

router.post("/:id/thumbnail", protect, adminOnly, upload.single("image"), uploadReelThumbnail);
router.post("/:id/video-preview", protect, adminOnly, upload.single("video"), uploadReelVideoPreview);

export default router;
