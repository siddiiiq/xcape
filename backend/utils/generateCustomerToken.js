import jwt from "jsonwebtoken";

// Customer tokens carry an explicit role claim and are verified against the
// Customer collection only — an admin token can never satisfy this, and vice
// versa, even though both happen to use the same JWT_SECRET.
export const generateCustomerToken = (customerId) => {
  return jwt.sign({ id: customerId, role: "customer" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

export default generateCustomerToken;
