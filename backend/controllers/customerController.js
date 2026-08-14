import crypto from "crypto";
import Customer from "../models/Customer.js";
import Member from "../models/Member.js";
import Booking from "../models/Booking.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateCustomerToken } from "../utils/generateCustomerToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  customerWelcomeEmailTemplate,
  adminNotificationTemplate,
  passwordResetEmailTemplate,
} from "../utils/emailTemplates.js";

const publicCustomer = (customer) => ({
  id: customer._id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
  status: customer.status,
  createdAt: customer.createdAt,
});

// @route  POST /api/customers/register
// @access Public
// This IS the "Join Community" endpoint now: it creates the community/lead
// record (Member — unchanged model, still fully manageable from the admin's
// existing Members page) AND a Customer account in one step, then logs the
// new customer in immediately. If the email already has an account, neither
// record is touched — the caller is told to sign in instead.
export const registerCustomer = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    confirmPassword,
    phone,
    instagramUsername,
    city,
    age,
    travelInterests,
    reason,
  } = req.body;

  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const normalizedEmail = email.toLowerCase();
  const existing = await Customer.findOne({ email: normalizedEmail });
  if (existing) {
    res.status(409);
    throw new Error("An account already exists with this email. Please sign in to continue.");
  }

  // Reuse a Member record if one already exists for this email (e.g. someone
  // was added as a lead before accounts existed) rather than creating a
  // duplicate community entry — otherwise create a fresh one.
  let member = await Member.findOne({ email: normalizedEmail });
  if (!member) {
    member = await Member.create({
      fullName,
      email: normalizedEmail,
      phone: phone || "",
      instagramUsername: instagramUsername || "",
      city: city || "",
      age: age || undefined,
      travelInterests: travelInterests || "",
      reason: reason || "",
    });
  }

  const customer = await Customer.create({
    name: fullName,
    email: normalizedEmail,
    phone: phone || "",
    passwordHash: password, // hashed by the Customer pre-save hook
    member: member._id,
  });

  await sendEmail({
    to: customer.email,
    subject: "Welcome to the Crew",
    html: customerWelcomeEmailTemplate(customer),
  }).catch((err) => console.error("Failed to send customer welcome email:", err.message));

  if (process.env.NOTIFY_ADMIN_ON_JOIN === "true" && process.env.ADMIN_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New crew application: ${member.fullName}`,
      html: adminNotificationTemplate(member),
    }).catch((err) => console.error("Failed to send admin notification:", err.message));
  }

  res.status(201).json({
    success: true,
    token: generateCustomerToken(customer._id),
    customer: publicCustomer(customer),
  });
});

// @route  POST /api/customers/login
// @access Public
export const loginCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const customer = await Customer.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!customer || !(await customer.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  if (customer.status !== "active") {
    res.status(403);
    throw new Error("This account is inactive. Contact us for help.");
  }

  res.json({
    success: true,
    token: generateCustomerToken(customer._id),
    customer: publicCustomer(customer),
  });
});

// @route  GET /api/customers/me
// @access Private (customer)
export const getMyProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, customer: publicCustomer(req.customer) });
});

// @route  PUT /api/customers/me
// @access Private (customer)
// Explicit allowlist — role, status, email, and password can never be
// changed through this endpoint, regardless of what the request body contains.
export const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if (name !== undefined) req.customer.name = name;
  if (phone !== undefined) req.customer.phone = phone;
  await req.customer.save();
  res.json({ success: true, customer: publicCustomer(req.customer) });
});

// @route  POST /api/customers/forgot-password
// @access Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const customer = await Customer.findOne({ email: (email || "").toLowerCase() });

  // Always return the same response whether or not the email exists, so this
  // endpoint can't be used to discover which emails have accounts.
  const genericResponse = {
    success: true,
    message: "If an account exists for that email, a reset link has been sent.",
  };

  if (!customer) return res.json(genericResponse);

  const rawToken = customer.createPasswordResetToken();
  await customer.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${rawToken}`;

  await sendEmail({
    to: customer.email,
    subject: "Reset your password",
    html: passwordResetEmailTemplate(customer, resetUrl),
  }).catch((err) => console.error("Failed to send password reset email:", err.message));

  res.json(genericResponse);
});

// @route  POST /api/customers/reset-password/:token
// @access Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const customer = await Customer.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetTokenHash +passwordResetExpires");

  if (!customer) {
    res.status(400);
    throw new Error("This reset link is invalid or has expired. Request a new one.");
  }

  customer.passwordHash = password; // re-hashed by pre-save hook
  customer.passwordResetTokenHash = null;
  customer.passwordResetExpires = null;
  await customer.save();

  res.json({ success: true, message: "Password updated. You can now sign in." });
});

// ---- Admin-only customer management ----

// @route  GET /api/customers
// @access Private (admin)
export const getAllCustomers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Customer.countDocuments(filter),
  ]);

  // Attach booking counts/totals in one aggregation rather than N+1 queries.
  const customerIds = customers.map((c) => c._id);
  const stats = await Booking.aggregate([
    { $match: { customer: { $in: customerIds } } },
    { $group: { _id: "$customer", bookingCount: { $sum: 1 }, totalSpent: { $sum: "$totalAmount" } } },
  ]);
  const statsById = Object.fromEntries(stats.map((s) => [String(s._id), s]));

  const enriched = customers.map((c) => ({
    ...c.toObject(),
    bookingCount: statsById[String(c._id)]?.bookingCount || 0,
    totalSpent: statsById[String(c._id)]?.totalSpent || 0,
  }));

  res.json({
    success: true,
    customers: enriched,
    pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
  });
});

// @route  GET /api/customers/:id
// @access Private (admin)
export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id).populate("member");
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const bookings = await Booking.find({ customer: customer._id })
    .sort({ createdAt: -1 })
    .populate("trip", "title destination startDate");

  res.json({ success: true, customer, bookings });
});

// @route  DELETE /api/customers/:id
// @access Private (admin)
export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  await customer.deleteOne();

  res.json({ success: true, message: "Customer deleted" });
});
