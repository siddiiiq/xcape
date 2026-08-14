import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    thumbnail: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      resourceType: { type: String, enum: ["image", "video"], default: "image" },
    },
    videoPreview: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      resourceType: { type: String, enum: ["image", "video"], default: "video" },
    },
    instagramUrl: { type: String, required: true },
    description: { type: String, default: "" },
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", default: null },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Reel", reelSchema);
