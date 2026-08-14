// Loads the Razorpay checkout.js script once, resolving with the global
// Razorpay constructor. Only ever called after the backend confirms the
// gateway is configured (see BookingWidget) — never loaded speculatively.
let loadPromise = null;

export const loadRazorpayCheckout = () => {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load the payment checkout. Check your connection and try again."));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
};

export default loadRazorpayCheckout;
