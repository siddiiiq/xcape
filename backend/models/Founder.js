import mongoose from "mongoose";

const founderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    role: { type: String, default: "" },
    profileImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      resourceType: { type: String, enum: ["image", "video"], default: "image" },
    },
    bio: { type: String, default: "" },
    longBio: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    socialLinks: {
      type: [
        {
          platform: { type: String },
          url: { type: String },
        },
      ],
      default: [],
    },
    gallery: {
      type: [
        {
          url: { type: String },
          publicId: { type: String },
          resourceType: { type: String, enum: ["image", "video"], default: "image" },
        },
      ],
      default: [],
    },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Founder", founderSchema);
