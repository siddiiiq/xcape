import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    destination: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    description: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    // Seats remaining. Decremented atomically at booking time so two
    // concurrent bookings can never oversell the trip.
    availableSeats: { type: Number, required: true, min: 0 },
    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      resourceType: { type: String, enum: ["image", "video"], default: "image" },
    },
    // Shown/hidden on the public site. A separate concept from "disabled" —
    // an admin can unpublish without losing the trip or its bookings.
    published: { type: Boolean, default: false },
    // The one "active campaign" trip(s) featured prominently on the homepage.
    isCampaign: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

tripSchema.index({ published: 1, order: 1 });
tripSchema.index({ isCampaign: 1, published: 1 });

// A trip is bookable if it's published, still has seats, and hasn't ended.
tripSchema.virtual("isBookable").get(function isBookable() {
  return this.published && this.availableSeats > 0 && this.endDate >= new Date();
});
tripSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Trip", tripSchema);
