import express from "express";
import {
  getFounders,
  getFounderBySlug,
  getFounderById,
  createFounder,
  updateFounder,
  deleteFounder,
  uploadFounderProfileImage,
  uploadFounderGalleryImages,
  deleteFounderGalleryImage,
} from "../controllers/founderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { attachOptionalAdmin } from "../middleware/optionalAuth.js";

const router = express.Router();

router.get("/", attachOptionalAdmin, getFounders);
router.get("/id/:id", protect, adminOnly, getFounderById);
router.get("/:slug", attachOptionalAdmin, getFounderBySlug);

router.post("/", protect, adminOnly, createFounder);
router.put("/:id", protect, adminOnly, updateFounder);
router.delete("/:id", protect, adminOnly, deleteFounder);

router.post("/:id/profile-image", protect, adminOnly, upload.single("image"), uploadFounderProfileImage);
router.post("/:id/gallery", protect, adminOnly, upload.array("images", 20), uploadFounderGalleryImages);
router.delete("/:id/gallery/:imageId", protect, adminOnly, deleteFounderGalleryImage);

export default router;
