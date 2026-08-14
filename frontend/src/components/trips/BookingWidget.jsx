import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Smartphone, CreditCard, Landmark, CheckCircle2 } from "lucide-react";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { createBooking, verifyBookingPayment } from "../../api/bookingsApi.js";
import { loadRazorpayCheckout } from "../../utils/loadRazorpay.js";

// UI shows four named options; Debit/Credit Card both map to the same
// backend "CARD" method since a Razorpay order isn't split by card type —
// the card network itself is chosen inside the Razorpay checkout modal.
const PAYMENT_OPTIONS = [
  { id: "UPI", method: "UPI", label: "UPI", icon: Smartphone },
  { id: "DEBIT", method: "CARD", label: "Debit Card", icon: CreditCard },
  { id: "CREDIT", method: "CARD", label: "Credit Card", icon: CreditCard },
  { id: "COD", method: "COD", label: "Cash on Delivery (COD)", icon: Landmark },
];

const BookingWidget = ({ trip }) => {
  const { isAuthenticated, customer } = useCustomerAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [seats, setSeats] = useState(1);
  const [optionId, setOptionId] = useState("COD");
  const [status, setStatus] = useState("idle"); // idle | processing | confirmed | error
  const [error, setError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const maxSeats = Math.min(trip.availableSeats, 10);
  const totalAmount = trip.price * seats;

  if (!trip.published || trip.availableSeats <= 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-sm text-fog/50">
        This trip is fully booked. Check back for the next one.
      </div>
    );
  }

  // Gated: an unauthenticated visitor can browse and read every trip detail,
  // but booking requires an account. The redirect state carries them right
  // back here (not the homepage) once they've signed in or joined.
  if (!isAuthenticated) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="font-display text-xl tracking-wide">Create an account to continue</p>
        <p className="mt-2 text-sm text-fog/50">You need an account to join this trip and track your booking.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/join"
            state={{ from: location.pathname }}
            className="rounded-full bg-fog px-6 py-3 text-xs font-semibold uppercase tracking-widest2 text-ink hover:bg-ember"
          >
            Create Account
          </Link>
          <Link
            to="/sign-in"
            state={{ from: location.pathname }}
            className="rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-widest2 text-fog/70 hover:border-ember hover:text-ember"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (status === "confirmed" && confirmedBooking) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
        <CheckCircle2 size={40} className="text-ember" />
        <p className="font-display text-2xl tracking-wide">Booking Confirmed</p>
        <p className="text-sm text-fog/50">Reference: {confirmedBooking.bookingReference}</p>
        <Link
          to={`/account/bookings/${confirmedBooking._id}`}
          className="mt-2 rounded-full bg-fog px-5 py-2.5 text-xs font-semibold uppercase tracking-widest2 text-ink hover:bg-ember"
        >
          View Booking
        </Link>
      </div>
    );
  }

  const handleBook = async () => {
    setStatus("processing");
    setError("");
    const selected = PAYMENT_OPTIONS.find((o) => o.id === optionId);

    try {
      const res = await createBooking({ tripId: trip._id, seats, paymentMethod: selected.method });

      if (!res.requiresPayment) {
        // COD — already confirmed server-side.
        setConfirmedBooking(res.booking);
        setStatus("confirmed");
        return;
      }

      // Online payment — open the Razorpay checkout modal, then verify
      // server-side. The booking only becomes CONFIRMED once /verify
      // succeeds — never just because this modal reports success.
      const Razorpay = await loadRazorpayCheckout();
      const checkout = new Razorpay({
        key: res.keyId,
        amount: res.order.amount,
        currency: res.order.currency,
        order_id: res.order.id,
        name: "Xcape.FOMO",
        description: trip.title,
        prefill: { name: customer?.name, email: customer?.email, contact: customer?.phone },
        theme: { color: "#c98a4b" },
        handler: async (response) => {
          try {
            const verifyRes = await verifyBookingPayment(res.booking._id, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setConfirmedBooking(verifyRes.booking);
            setStatus("confirmed");
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed. Contact support with your booking reference.");
            setStatus("error");
          }
        },
        modal: {
          ondismiss: () => {
            setError("Payment was cancelled. Your seats have been released — you can try again.");
            setStatus("error");
          },
        },
      });
      checkout.open();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
      setStatus("error");
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <p className="mb-4 font-display text-xl tracking-wide">Book This Trip</p>

      <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">Seats</label>
      <input
        type="number"
        min={1}
        max={maxSeats}
        value={seats}
        onChange={(e) => setSeats(Math.max(1, Math.min(maxSeats, Number(e.target.value) || 1)))}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
      />
      <p className="mt-1 text-xs text-fog/40">{trip.availableSeats} seat(s) left</p>

      <p className="mb-1.5 mt-5 block text-xs uppercase tracking-widest2 text-fog/50">Payment Method</p>
      <div className="space-y-2">
        {PAYMENT_OPTIONS.map(({ id, label, icon: Icon }) => (
          <label
            key={id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
              optionId === id ? "border-ember bg-ember/10" : "border-white/10 hover:border-white/20"
            }`}
          >
            <input type="radio" name="paymentOption" checked={optionId === id} onChange={() => setOptionId(id)} className="accent-ember" />
            <Icon size={16} />
            {label}
          </label>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-sm">
        <span className="text-fog/50">Total</span>
        <span className="font-display text-2xl tracking-wide">₹{totalAmount}</span>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <button
        onClick={handleBook}
        disabled={status === "processing"}
        className="mt-5 w-full rounded-full bg-fog px-6 py-3.5 text-sm font-semibold uppercase tracking-widest2 text-ink transition hover:bg-ember disabled:opacity-50"
      >
        {status === "processing" ? "Processing..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default BookingWidget;
