import Razorpay from "razorpay";
import crypto from "crypto";

// Same graceful-degradation pattern as Cloudinary/email: the app must still
// boot and COD must still work with zero payment credentials configured.
// UPI/Card simply become unavailable (with a clear message) until real
// PAYMENT_GATEWAY_* values are added to backend/.env — no code change needed
// when they are.
export const isPaymentGatewayConfigured = () =>
  Boolean(process.env.PAYMENT_GATEWAY_KEY_ID && process.env.PAYMENT_GATEWAY_KEY_SECRET);

let instance = null;

export const getRazorpayInstance = () => {
  if (!isPaymentGatewayConfigured()) return null;
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.PAYMENT_GATEWAY_KEY_ID,
      key_secret: process.env.PAYMENT_GATEWAY_KEY_SECRET,
    });
  }
  return instance;
};

// Verifies a checkout.js payment signature server-side. This is the entire
// reason a booking is never trusted "paid" just because the frontend says so.
export const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
  const expected = crypto
    .createHmac("sha256", process.env.PAYMENT_GATEWAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
};

// Verifies a webhook payload signature (separate secret from the API key).
export const verifyWebhookSignature = (rawBody, signature) => {
  if (!process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return expected === signature;
};

export default { isPaymentGatewayConfigured, getRazorpayInstance, verifyPaymentSignature, verifyWebhookSignature };
