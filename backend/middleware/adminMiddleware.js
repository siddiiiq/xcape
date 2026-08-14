/**
 * Restricts a route to admins. Must run after `protect`, which attaches
 * req.admin. Kept as its own middleware so role logic (e.g. future
 * "editor" vs "admin" roles) can grow without touching authMiddleware.
 */
export const adminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === "admin") {
    return next();
  }
  res.status(403);
  next(new Error("Not authorized as an admin"));
};

export default adminOnly;
