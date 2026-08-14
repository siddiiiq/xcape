import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/**
 * Like `protect`, but never rejects the request. Used on public GET routes
 * so an authenticated admin sees unpublished content (e.g. in the CMS
 * preview) while anonymous visitors silently get the public-only view.
 */
export const attachOptionalAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (admin) req.admin = admin;
  } catch (error) {
    // Invalid/expired token on a public route just means "treat as anonymous".
  }
  next();
};

export default attachOptionalAdmin;
