import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: { type: String, required: true, unique: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },

    seats: { type: Number, required: true, min: 1 },
    // Always price-per-seat (at booking time) × seats, computed server-side —
    // never trusted from the client.
    pricePerSeat: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["UPI", "CARD", "COD"], required: true },
    paymentStatus: { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING" },
    bookingStatus: { type: String, enum: ["PENDING", "CONFIRMED", "CANCELLED"], default: "PENDING" },

    // Razorpay (or whichever gateway) identifiers — populated once an order
    // is created / once payment is verified. Never contains secret keys.
    paymentOrderId: { type: String, default: "" },
    paymentTransactionId: { type: String, default: "" },

    // Snapshot of customer contact details at booking time, so historical
    // bookings stay accurate even if the customer later edits their profile.
    customerSnapshot: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

bookingSchema.index({ trip: 1, bookingStatus: 1 });

export default mongoose.model("Booking", bookingSchema);
