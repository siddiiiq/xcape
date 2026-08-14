import express from "express";
import {
  getPlaces,
  getPlaceBySlug,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  uploadCoverImage,
  uploadGalleryImages,
  updateGalleryImage,
  reorderGalleryImages,
  deleteGalleryImage,
} from "../controllers/placeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { attachOptionalAdmin } from "../middleware/optionalAuth.js";

const router = express.Router();

router.get("/", attachOptionalAdmin, getPlaces);
router.get("/id/:id", protect, adminOnly, getPlaceById);
router.get("/:slug", attachOptionalAdmin, getPlaceBySlug);

router.post("/", protect, adminOnly, createPlace);
router.put("/:id", protect, adminOnly, updatePlace);
router.delete("/:id", protect, adminOnly, deletePlace);

router.post("/:id/cover", protect, adminOnly, upload.single("image"), uploadCoverImage);
router.post("/:id/images", protect, adminOnly, upload.array("images", 20), uploadGalleryImages);
router.put("/:id/images/reorder", protect, adminOnly, reorderGalleryImages);
router.put("/:id/images/:imageId", protect, adminOnly, updateGalleryImage);
router.delete("/:id/images/:imageId", protect, adminOnly, deleteGalleryImage);

export default router;
