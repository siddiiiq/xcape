import express from "express";
import { getStats } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getStats);

export default router;
