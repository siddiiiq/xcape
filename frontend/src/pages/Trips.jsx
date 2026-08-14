import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchTrips } from "../api/tripsApi.js";

const Trips = () => {
  const { data, loading, error, refetch } = useFetch(fetchTrips, []);
  const trips = data?.trips || [];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-40">
      <Seo title="Trips" description="Upcoming trips you can join." />
      <p className="text-xs uppercase tracking-widest2 text-ember">Join The Journey</p>
      <h1 className="mt-3 font-display text-5xl tracking-wide sm:text-7xl">Trips</h1>

      <div className="mt-16">
        {loading && <Loader label="Loading trips..." />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && trips.length === 0 && (
          <EmptyState title="No trips available at the moment." subtitle="Check back soon — the next one's always in the works." />
        )}
        {!loading && !error && trips.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <Link
                key={trip._id}
                to={`/trips/${trip.slug}`}
                className="hover-pop group relative block aspect-[4/5] overflow-hidden rounded-2xl"
              >
                <img
                  src={trip.coverImage?.url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=700"}
                  alt={trip.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-widest2 text-fog/70">
                    <MapPin size={12} /> {trip.destination}
                  </div>
                  <h3 className="font-display text-2xl tracking-wide">{trip.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-sm text-fog/60">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} /> {new Date(trip.startDate).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-ember">₹{trip.price}</span>
                  </div>
                  {trip.availableSeats <= 0 && (
                    <span className="mt-2 inline-block rounded-full bg-red-500/20 px-2.5 py-1 text-xs text-red-300">Fully booked</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;
