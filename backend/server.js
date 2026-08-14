// Must be the very first import: dotenv needs to populate process.env before
// any other module (like config/cloudinary.js, which reads env vars at
// module-load time) gets evaluated. ES module imports are hoisted, so
// calling dotenv.config() later in this file — even as the first statement
// in the body — would run too late for those modules.
import "dotenv/config";

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import founderRoutes from "./routes/founderRoutes.js";
import reelRoutes from "./routes/reelRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

// --- Core middleware ---
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Travel community API is running" });
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/founders", founderRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bookings", bookingRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
  });
};

start();

export default app;
