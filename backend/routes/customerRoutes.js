import express from "express";
import {
  registerCustomer,
  loginCustomer,
  getMyProfile,
  updateMyProfile,
  forgotPassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
} from "../controllers/customerController.js";
import { protectCustomer } from "../middleware/customerAuthMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public — this is the "Join Community" endpoint (creates Member + Customer).
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Private (customer)
router.get("/me", protectCustomer, getMyProfile);
router.put("/me", protectCustomer, updateMyProfile);

// Private (admin) — customer management. Declared after /me so "me" is never
// swallowed by the /:id pattern.
router.get("/", protect, adminOnly, getAllCustomers);
router.get("/:id", protect, adminOnly, getCustomerById);
router.delete("/:id", protect, adminOnly, deleteCustomer);

export default router;
