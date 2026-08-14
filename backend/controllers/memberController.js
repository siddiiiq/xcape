import Member from "../models/Member.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { welcomeEmailTemplate, adminNotificationTemplate } from "../utils/emailTemplates.js";

// @route  POST /api/members
// @access Public
export const createMember = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    res.status(400);
    throw new Error("Full name and email are required");
  }

  const existing = await Member.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("You're already on the list — we've got your details!");
  }

  const member = await Member.create(req.body);

  // Fire-and-forget style, but awaited so failures are logged, not silent.
  await sendEmail({
    to: member.email,
    subject: "Welcome to the Crew",
    html: welcomeEmailTemplate(member),
  }).catch((err) => console.error("Failed to send welcome email:", err.message));

  if (process.env.NOTIFY_ADMIN_ON_JOIN === "true" && process.env.ADMIN_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New crew application: ${member.fullName}`,
      html: adminNotificationTemplate(member),
    }).catch((err) => console.error("Failed to send admin notification:", err.message));
  }

  res.status(201).json({ success: true, member });
});

// @route  GET /api/members
// @access Private
export const getMembers = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
      { instagramUsername: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [members, total] = await Promise.all([
    Member.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Member.countDocuments(filter),
  ]);

  res.json({
    success: true,
    members,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    },
  });
});

// @route  PUT /api/members/:id
// @access Private
export const updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  const { status } = req.body;
  if (status) member.status = status;

  await member.save();
  res.json({ success: true, member });
});

// @route  DELETE /api/members/:id
// @access Private
export const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }
  await member.deleteOne();
  res.json({ success: true, message: "Member deleted" });
});
