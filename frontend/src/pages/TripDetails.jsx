import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import BookingWidget from "../components/trips/BookingWidget.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchTripBySlug } from "../api/tripsApi.js";

const TripDetails = () => {
  const { slug } = useParams();
  const { data, loading, error, refetch } = useFetch(() => fetchTripBySlug(slug), [slug]);

  if (loading) return <Loader label="Loading trip..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const trip = data?.trip;
  if (!trip) return null;

  return (
    <div className="pb-24">
      <Seo title={trip.title} description={trip.description} />

      <section className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden">
        <img
          src={trip.coverImage?.url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600"}
          alt={trip.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-12">
          <Link to="/trips" className="mb-4 inline-flex items-center gap-1.5 text-xs text-fog/60 hover:text-fog">
            <ArrowLeft size={14} /> All trips
          </Link>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest2 text-ember">
            <MapPin size={12} /> {trip.destination}
          </div>
          <h1 className="mt-2 font-display text-5xl tracking-wide sm:text-6xl">{trip.title}</h1>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 pt-12 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap gap-6 border-b border-white/5 pb-6 text-sm text-fog/60">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <Users size={14} /> {trip.availableSeats} / {trip.capacity} seats left
            </span>
            <span className="font-semibold text-ember">₹{trip.price} / seat</span>
          </div>

          {trip.description && (
            <div className="prose prose-invert mt-8 max-w-none whitespace-pre-line text-fog/60">{trip.description}</div>
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <BookingWidget trip={trip} />
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
