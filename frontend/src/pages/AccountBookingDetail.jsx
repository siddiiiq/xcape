import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, CreditCard } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchMyBookingById } from "../api/bookingsApi.js";

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-white/5 py-3 text-sm last:border-0">
    <span className="text-fog/40">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const AccountBookingDetail = () => {
  const { id } = useParams();
  const { data, loading, error, refetch } = useFetch(() => fetchMyBookingById(id), [id]);

  if (loading) return <Loader label="Loading booking..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const booking = data?.booking;
  if (!booking) return null;
  const trip = booking.trip;

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-40">
      <Seo title={`Booking ${booking.bookingReference}`} />
      <Link to="/account/bookings" className="mb-6 inline-flex items-center gap-1.5 text-xs text-fog/60 hover:text-fog">
        <ArrowLeft size={14} /> My Bookings
      </Link>

      <p className="text-xs uppercase tracking-widest2 text-ember">{booking.bookingReference}</p>
      <h1 className="mt-3 font-display text-4xl tracking-wide sm:text-5xl">{trip?.title || "Trip"}</h1>

      {trip?.coverImage?.url && (
        <img src={trip.coverImage.url} alt={trip.title} className="mt-6 h-56 w-full rounded-2xl object-cover" />
      )}

      <div className="glass mt-8 rounded-3xl p-6">
        <p className="mb-2 text-xs uppercase tracking-widest2 text-fog/40">Trip</p>
        <div className="flex items-center gap-2 text-sm text-fog/60">
          <MapPin size={14} /> {trip?.destination}
        </div>
        {trip?.startDate && (
          <div className="mt-1 flex items-center gap-2 text-sm text-fog/60">
            <Calendar size={14} />
            {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
          </div>
        )}

        <div className="mt-6 border-t border-white/5 pt-4">
          <p className="mb-1 text-xs uppercase tracking-widest2 text-fog/40">Booking Details</p>
          <Row label="Seats" value={booking.seats} />
          <Row label="Price per seat" value={`₹${booking.pricePerSeat}`} />
          <Row label="Total Amount" value={`₹${booking.totalAmount}`} />
          <Row label="Payment Method" value={booking.paymentMethod} />
          <Row label="Payment Status" value={booking.paymentStatus} />
          <Row label="Booking Status" value={booking.bookingStatus} />
          {booking.paymentOrderId && <Row label="Order Reference" value={booking.paymentOrderId} />}
          {booking.paymentTransactionId && <Row label="Transaction ID" value={booking.paymentTransactionId} />}
          <Row label="Booked On" value={new Date(booking.createdAt).toLocaleString()} />
        </div>

        {booking.paymentMethod === "COD" && booking.paymentStatus === "PENDING" && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-ember/10 p-4 text-sm text-ember">
            <CreditCard size={16} /> Cash on Delivery — payment is still pending.
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountBookingDetail;
