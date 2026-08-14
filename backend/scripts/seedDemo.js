// OPTIONAL demo/seed data — for local development only, so the site isn't
// empty on first run. This is intentionally separate from seed:admin and
// never runs automatically. Safe to run repeatedly (it upserts by slug).
// Run with: node scripts/seedDemo.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Place from "../models/Place.js";
import Founder from "../models/Founder.js";
import Reel from "../models/Reel.js";
import YouTubeVideo from "../models/YouTubeVideo.js";
import Story from "../models/Story.js";

dotenv.config();

const places = [
  {
    title: "Coorg",
    slug: "coorg",
    location: "Karnataka, India",
    shortDescription: "Misty hills, coffee plantations, and roads that disappear into cloud.",
    story: "We got lost looking for a waterfall and found a coffee estate instead. Worth it.",
    coverImage: { url: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1200", publicId: "" },
    instagramUrl: "https://instagram.com",
    tags: ["hills", "coffee", "waterfalls"],
    published: true,
    featured: true,
    order: 0,
  },
  {
    title: "Gokarna",
    slug: "gokarna",
    location: "Karnataka, India",
    shortDescription: "Quiet beaches, cliffside walks, and the best sunsets we've filmed.",
    story: "Three days, one tent, and a beach that had almost no one on it.",
    coverImage: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", publicId: "" },
    instagramUrl: "https://instagram.com",
    tags: ["beach", "sunset"],
    published: true,
    order: 1,
  },
  {
    title: "Wayanad",
    slug: "wayanad",
    location: "Kerala, India",
    shortDescription: "Rainforests, wildlife, and roads with more hairpin bends than sense.",
    story: "We got the van stuck. Twice. Still one of the best trips we've filmed.",
    coverImage: { url: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200", publicId: "" },
    instagramUrl: "https://instagram.com",
    tags: ["forest", "wildlife"],
    published: true,
    order: 2,
  },
];

const founders = [
  {
    name: "Arjun Rao",
    slug: "arjun-rao",
    role: "The Planner",
    bio: "Plans every trip in obsessive detail, then throws the plan out on day one.",
    longBio: "Arjun started this whole thing with a spreadsheet and a stubborn refusal to fly anywhere direct.",
    profileImage: { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600", publicId: "" },
    instagramUrl: "https://instagram.com",
    published: true,
    order: 0,
  },
  {
    name: "Meera Nair",
    slug: "meera-nair",
    role: "The Filmmaker",
    bio: "Shoots everything. Has genuinely missed a sunset because she was editing the last one.",
    longBio: "Meera holds the camera and the group's collective memory. Everything you see, she framed.",
    profileImage: { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600", publicId: "" },
    instagramUrl: "https://instagram.com",
    published: true,
    order: 1,
  },
];

const reels = [
  {
    title: "3am in Gokarna",
    thumbnail: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", publicId: "" },
    instagramUrl: "https://instagram.com/reel/example1",
    description: "The tide came in faster than we expected.",
    published: true,
    order: 0,
  },
  {
    title: "Getting the van unstuck",
    thumbnail: { url: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600", publicId: "" },
    instagramUrl: "https://instagram.com/reel/example2",
    description: "Wayanad, day 2.",
    published: true,
    order: 1,
  },
];

const youtubeVideos = [
  {
    title: "We Got Lost in Coorg (and it was the best trip yet)",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "A full recap of five days in the misty hills.",
    published: true,
    order: 0,
  },
];

const stories = [
  {
    title: "The Road That Wasn't on the Map",
    slug: "the-road-that-wasnt-on-the-map",
    excerpt: "We took a turn Google Maps told us not to. It was the right call.",
    content:
      "Somewhere past the third coffee estate, the paved road just... stopped. We kept going anyway.\n\nThat's most of our best stories, honestly — the ones that start with a wrong turn.",
    coverImage: { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200", publicId: "" },
    published: true,
    order: 0,
  },
];

const run = async () => {
  await connectDB();

  const placeDocs = {};
  for (const p of places) {
    const doc = await Place.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
    placeDocs[p.slug] = doc;
  }
  for (const f of founders) {
    await Founder.findOneAndUpdate({ slug: f.slug }, f, { upsert: true, new: true });
  }
  for (const r of reels) {
    await Reel.findOneAndUpdate({ title: r.title }, r, { upsert: true, new: true });
  }
  for (const v of youtubeVideos) {
    await YouTubeVideo.findOneAndUpdate({ title: v.title }, v, { upsert: true, new: true });
  }
  for (const s of stories) {
    await Story.findOneAndUpdate({ slug: s.slug }, { ...s, place: placeDocs.coorg?._id }, { upsert: true, new: true });
  }

  console.log("Demo data seeded: 3 places, 2 founders, 2 reels, 1 YouTube video, 1 story.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error("Failed to seed demo data:", error);
  process.exit(1);
});
