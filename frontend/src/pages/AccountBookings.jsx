import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchMyBookings } from "../api/bookingsApi.js";

const STATUS_STYLES = {
  PAID: "bg-green-500/15 text-green-400",
  PENDING: "bg-amber-500/15 text-amber-400",
  FAILED: "bg-red-500/15 text-red-400",
  CONFIRMED: "bg-green-500/15 text-green-400",
  CANCELLED: "bg-red-500/15 text-red-400",
};

const Badge = ({ label }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[label] || "bg-white/10 text-fog/60"}`}>
    {label}
  </span>
);

const AccountBookings = () => {
  const { data, loading, error, refetch } = useFetch(fetchMyBookings, []);
  const bookings = data?.bookings || [];

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-40">
      <Seo title="My Bookings" />
      <Link to="/account" className="mb-6 inline-flex items-center gap-1.5 text-xs text-fog/60 hover:text-fog">
        <ArrowLeft size={14} /> My Account
      </Link>
      <p className="text-xs uppercase tracking-widest2 text-ember">My Account</p>
      <h1 className="mt-3 font-display text-4xl tracking-wide sm:text-5xl">My Bookings</h1>

      <div className="mt-10">
        {loading && <Loader label="Loading your bookings..." />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && bookings.length === 0 && (
          <EmptyState
            title="No bookings yet."
            action={
              <Link to="/trips" className="rounded-full bg-fog px-5 py-2.5 text-xs font-semibold uppercase tracking-widest2 text-ink hover:bg-ember">
                Browse Trips
              </Link>
            }
          />
        )}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((b) => (
              <Link
                key={b._id}
                to={`/account/bookings/${b._id}`}
                className="hover-pop glass block rounded-2xl p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-fog/40">{b.bookingReference}</p>
                    <p className="mt-1 font-display text-xl tracking-wide">{b.trip?.title || "Trip"}</p>
                    <p className="mt-1 text-sm text-fog/50">
                      {b.trip?.startDate && new Date(b.trip.startDate).toLocaleDateString()} · {b.seats} seat{b.seats > 1 ? "s" : ""} · ₹{b.totalAmount}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge label={b.paymentStatus} />
                    <Badge label={b.bookingStatus} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountBookings;
