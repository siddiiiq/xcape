import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, default: "" },
    passwordHash: { type: String, required: true, select: false },
    // Structurally separate from the Admin collection/JWT entirely, but the
    // explicit role claim is defense-in-depth: it's never settable through
    // any public request body, so a customer can never elevate themselves.
    role: { type: String, enum: ["customer"], default: "customer" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    // Links to the community lead record created at the same time. The
    // Member document (community info: city, interests, etc.) stays the
    // source of truth for "community membership" data; this is the
    // authentication identity that owns bookings.
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: null },

    // Password reset — only the SHA-256 hash of the token is stored, exactly
    // like the token itself never touches the database, mirroring how
    // passwords are hashed. The raw token only ever exists in the emailed link.
    passwordResetTokenHash: { type: String, select: false, default: null },
    passwordResetExpires: { type: Date, select: false, default: null },
  },
  { timestamps: true }
);

customerSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

customerSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

// Generates a reset token, returns the RAW token (to email) while storing
// only its hash — so a leaked database can never be used to reset passwords.
customerSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetTokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return rawToken;
};

export default mongoose.model("Customer", customerSchema);
