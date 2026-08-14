// Wraps an async route handler so thrown/rejected errors reach errorMiddleware
// instead of crashing the process or requiring try/catch in every controller.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
