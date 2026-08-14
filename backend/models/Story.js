import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      resourceType: { type: String, enum: ["image", "video"], default: "image" },
    },
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", default: null },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);
