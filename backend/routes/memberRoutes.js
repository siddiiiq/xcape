import express from "express";
import { createMember, getMembers, updateMember, deleteMember } from "../controllers/memberController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", createMember);
router.get("/", protect, adminOnly, getMembers);
router.put("/:id", protect, adminOnly, updateMember);
router.delete("/:id", protect, adminOnly, deleteMember);

export default router;
