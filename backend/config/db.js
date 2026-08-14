import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is not set. Add it to backend/.env");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
