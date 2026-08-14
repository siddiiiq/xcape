import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    brandName: { type: String, default: "Xcape.FOMO" },
    tagline: { type: String, default: "Three friends. One obsession. The world." },
    heroText: {
      type: String,
      default: "We travel. We wander. We film it. Come get lost with us.",
    },
    instagramUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    footerText: {
      type: String,
      default: "Made by three friends somewhere between here and nowhere.",
    },
    joinCrewText: {
      type: String,
      default: "Don't just follow the journey. Join it.",
    },
  },
  { timestamps: true }
);

// Singleton helper: always operate on the one settings document.
settingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model("Settings", settingsSchema);
