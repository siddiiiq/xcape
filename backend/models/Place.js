import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, enum: ["image", "video"], default: "image" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const placeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    location: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    story: { type: String, default: "" },
    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      resourceType: { type: String, enum: ["image", "video"], default: "image" },
    },
    gallery: { type: [imageSchema], default: [] },
    instagramUrl: { type: String, default: "" },
    tags: { type: [String], default: [] },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

placeSchema.index({ published: 1, order: 1 });

export default mongoose.model("Place", placeSchema);
