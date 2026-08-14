import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/**
 * Verifies the JWT sent in the Authorization header and attaches the
 * authenticated admin (without password) to req.admin.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, no token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      res.status(401);
      throw new Error("Not authorized, admin no longer exists");
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized, token invalid or expired"));
  }
};

export default protect;
