// Creates (or updates the password of) the single admin account from env vars.
// Run with: npm run seed:admin
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

const run = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before seeding.");
    process.exit(1);
  }

  await connectDB();

  let admin = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() }).select("+password");

  if (admin) {
    admin.name = ADMIN_NAME || admin.name;
    admin.password = ADMIN_PASSWORD; // pre-save hook re-hashes
    await admin.save();
    console.log(`Updated existing admin: ${admin.email}`);
  } else {
    admin = await Admin.create({
      name: ADMIN_NAME || "Admin",
      email: ADMIN_EMAIL.toLowerCase(),
      password: ADMIN_PASSWORD,
    });
    console.log(`Created admin: ${admin.email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error("Failed to seed admin:", error);
  process.exit(1);
});
