import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    phone: { type: String, default: "" },
    instagramUsername: { type: String, default: "" },
    city: { type: String, default: "" },
    age: { type: Number },
    travelInterests: { type: String, default: "" },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "approved", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
