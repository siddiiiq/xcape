import express from "express";
import { getMedia, deleteMedia } from "../controllers/mediaController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getMedia);
router.delete("/", protect, adminOnly, deleteMedia);

export default router;
