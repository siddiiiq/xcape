import express from "express";
import {
  getTrips,
  getCampaignTrips,
  getTripBySlug,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  uploadTripCover,
} from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { attachOptionalAdmin } from "../middleware/optionalAuth.js";

const router = express.Router();

router.get("/", attachOptionalAdmin, getTrips);
router.get("/campaign", getCampaignTrips);
router.get("/id/:id", protect, adminOnly, getTripById);
router.get("/:slug", attachOptionalAdmin, getTripBySlug);

router.post("/", protect, adminOnly, createTrip);
router.put("/:id", protect, adminOnly, updateTrip);
router.delete("/:id", protect, adminOnly, deleteTrip);
router.post("/:id/cover", protect, adminOnly, upload.single("image"), uploadTripCover);

export default router;
