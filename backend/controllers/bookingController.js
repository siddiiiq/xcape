import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateBookingReference } from "../utils/generateBookingReference.js";
import { getRazorpayInstance, isPaymentGatewayConfigured, verifyPaymentSignature } from "../config/paymentGateway.js";
import { sendEmail } from "../utils/sendEmail.js";
import { bookingConfirmationEmailTemplate, adminBookingNotificationTemplate } from "../utils/emailTemplates.js";

const sendBookingEmails = async (booking, trip, customer) => {
  await sendEmail({
    to: customer.email,
    subject: `Booking Confirmed — ${booking.bookingReference}`,
    html: bookingConfirmationEmailTemplate(booking, trip, customer),
  }).catch((err) => console.error("Failed to send booking confirmation email:", err.message));

  if (process.env.NOTIFY_ADMIN_ON_JOIN === "true" && process.env.ADMIN_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New booking: ${booking.bookingReference}`,
      html: adminBookingNotificationTemplate(booking, trip, customer),
    }).catch((err) => console.error("Failed to send admin booking notification:", err.message));
  }
};

// @route  POST /api/bookings
// @access Private (customer)
// The only place a booking is created. Price, seat availability, and the
// customer's identity are always derived server-side — none of it is ever
// taken from the request body at face value.
export const createBooking = asyncHandler(async (req, res) => {
  const { tripId, seats, paymentMethod } = req.body;

  if (!tripId || !Number.isInteger(seats) || seats < 1) {
    res.status(400);
    throw new Error("tripId and a positive integer seat count are required");
  }
  if (!["UPI", "CARD", "COD"].includes(paymentMethod)) {
    res.status(400);
    throw new Error("paymentMethod must be UPI, CARD or COD");
  }

  const trip = await Trip.findById(tripId);
  if (!trip || !trip.published) {
    res.status(404);
    throw new Error("Trip not found");
  }
  if (trip.endDate < new Date()) {
    res.status(400);
    throw new Error("This trip has already ended");
  }

  // Fail before touching seat availability if online payment isn't usable —
  // no point holding seats hostage for a checkout that can't open.
  if (paymentMethod !== "COD" && !isPaymentGatewayConfigured()) {
    res.status(503);
    throw new Error(
      "Online payments aren't configured yet. Choose Cash on Delivery (COD) to test the booking flow, or try again once payment credentials are added."
    );
  }

  // Atomic check-and-decrement — the $gte guard means two simultaneous
  // requests can never both succeed past the seats actually available.
  const updatedTrip = await Trip.findOneAndUpdate(
    { _id: tripId, availableSeats: { $gte: seats } },
    { $inc: { availableSeats: -seats } },
    { new: true }
  );
  if (!updatedTrip) {
    res.status(409);
    throw new Error(`Only ${trip.availableSeats} seat(s) left on this trip`);
  }

  const pricePerSeat = trip.price;
  const totalAmount = pricePerSeat * seats;
  const bookingReference = await generateBookingReference();

  let booking;
  try {
    booking = await Booking.create({
      bookingReference,
      customer: req.customer._id,
      trip: trip._id,
      seats,
      pricePerSeat,
      totalAmount,
      paymentMethod,
      paymentStatus: "PENDING",
      // COD is confirmed immediately (payment collected later); online
      // methods stay PENDING until /verify confirms the signature.
      bookingStatus: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
      customerSnapshot: { name: req.customer.name, email: req.customer.email, phone: req.customer.phone },
    });

    if (paymentMethod === "COD") {
      await sendBookingEmails(booking, trip, req.customer);
      return res.status(201).json({ success: true, booking, requiresPayment: false });
    }

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // paise
      currency: "INR",
      receipt: bookingReference,
    });

    booking.paymentOrderId = order.id;
    await booking.save();

    return res.status(201).json({
      success: true,
      booking,
      requiresPayment: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
      // The key ID is the public/publishable half of the credential pair —
      // safe to send to the frontend. The key secret never leaves the server.
      keyId: process.env.PAYMENT_GATEWAY_KEY_ID,
    });
  } catch (error) {
    // Roll back the seat hold on any failure past this point so a gateway
    // error never permanently loses seats.
    await Trip.findByIdAndUpdate(tripId, { $inc: { availableSeats: seats } });
    if (booking?._id) await Booking.findByIdAndDelete(booking._id);
    throw error;
  }
});

// @route  POST /api/bookings/:id/verify
// @access Private (customer)
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (String(booking.customer) !== String(req.customer._id)) {
    res.status(403);
    throw new Error("Not authorized to modify this booking");
  }

  // Idempotent: a duplicate/retried callback for an already-verified booking
  // is a no-op success, not an error.
  if (booking.paymentStatus === "PAID") {
    return res.json({ success: true, booking, message: "Payment already verified" });
  }
  if (booking.paymentOrderId !== razorpayOrderId) {
    res.status(400);
    throw new Error("Order reference mismatch");
  }

  const isValid = verifyPaymentSignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) {
    booking.paymentStatus = "FAILED";
    await booking.save();
    res.status(400);
    throw new Error("Payment verification failed");
  }

  booking.paymentStatus = "PAID";
  booking.bookingStatus = "CONFIRMED";
  booking.paymentTransactionId = razorpayPaymentId;
  await booking.save();

  const trip = await Trip.findById(booking.trip);
  await sendBookingEmails(booking, trip, req.customer);

  res.json({ success: true, booking });
});

// @route  GET /api/bookings/mine
// @access Private (customer)
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.customer._id })
    .sort({ createdAt: -1 })
    .populate("trip", "title slug destination startDate endDate coverImage");
  res.json({ success: true, bookings });
});

// @route  GET /api/bookings/mine/:id
// @access Private (customer)
// Ownership is checked server-side — a customer can never view another
// customer's booking by guessing/changing the id in the URL.
export const getMyBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("trip");
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (String(booking.customer) !== String(req.customer._id)) {
    res.status(403);
    throw new Error("Not authorized to view this booking");
  }
  res.json({ success: true, booking });
});

// @route  GET /api/bookings
// @access Private (admin)
export const getAllBookings = asyncHandler(async (req, res) => {
  const { search, tripId, paymentStatus, bookingStatus, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (tripId) filter.trip = tripId;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (bookingStatus) filter.bookingStatus = bookingStatus;
  if (search) {
    filter.$or = [
      { bookingReference: { $regex: search, $options: "i" } },
      { "customerSnapshot.name": { $regex: search, $options: "i" } },
      { "customerSnapshot.email": { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("trip", "title destination startDate")
      .populate("customer", "name email phone"),
    Booking.countDocuments(filter),
  ]);

  res.json({
    success: true,
    bookings,
    pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
  });
});

// @route  PUT /api/bookings/:id
// @access Private (admin)
// Used for marking a COD payment as received, or cancelling a booking.
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const { paymentStatus, bookingStatus } = req.body;

  // Cancelling a booking that was holding seats releases them back to the trip.
  if (bookingStatus === "CANCELLED" && booking.bookingStatus !== "CANCELLED") {
    await Trip.findByIdAndUpdate(booking.trip, { $inc: { availableSeats: booking.seats } });
  }

  if (paymentStatus) booking.paymentStatus = paymentStatus;
  if (bookingStatus) booking.bookingStatus = bookingStatus;
  await booking.save();

  res.json({ success: true, booking });
});
