import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";

/**
 * Verifies a customer JWT and attaches the authenticated customer to
 * req.customer. Completely separate from admin `protect`: it requires the
 * `role: "customer"` claim AND looks the id up in the Customer collection,
 * so an admin token is structurally incapable of passing this check, and
 * this middleware never even looks at the Admin collection.
 */
export const protectCustomer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, please sign in");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "customer") {
      res.status(403);
      throw new Error("Not authorized as a customer");
    }

    const customer = await Customer.findById(decoded.id);
    if (!customer || customer.status !== "active") {
      res.status(401);
      throw new Error("Not authorized, account no longer active");
    }

    req.customer = customer;
    next();
  } catch (error) {
    res.status(res.statusCode && res.statusCode !== 200 ? res.statusCode : 401);
    next(new Error(error.message || "Not authorized, token invalid or expired"));
  }
};

export default protectCustomer;
