import express from "express";
import {
  createBooking,
  verifyPayment,
  getMyBookings,
  getMyBookingById,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { protectCustomer } from "../middleware/customerAuthMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Private (customer) — declared before admin "/" and "/:id" so they can't
// be shadowed by the more general admin routes below.
router.post("/", protectCustomer, createBooking);
router.post("/:id/verify", protectCustomer, verifyPayment);
router.get("/mine", protectCustomer, getMyBookings);
router.get("/mine/:id", protectCustomer, getMyBookingById);

// Private (admin)
router.get("/", protect, adminOnly, getAllBookings);
router.put("/:id", protect, adminOnly, updateBookingStatus);

export default router;
