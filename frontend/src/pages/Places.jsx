import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import PlacesMap from "../components/places/PlacesMap.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchPlaces } from "../api/placesApi.js";

const Places = () => {
  const { data, loading, error, refetch } = useFetch(fetchPlaces, []);
  const places = data?.places || [];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-40">
      <Seo title="Journeys" description="Every place we've gotten lost in, so far." />
      <p className="text-xs uppercase tracking-widest2 text-ember">The Journeys</p>
      <h1 className="mt-3 font-display text-5xl tracking-wide sm:text-7xl">All Places</h1>

      {!loading && !error && (
        <div className="mt-12">
          <p className="mb-4 text-xs uppercase tracking-widest2 text-fog/40">Where We've Been</p>
          <PlacesMap places={places} />
        </div>
      )}

      <div className="mt-16">
        {loading && <Loader label="Loading places..." />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && places.length === 0 && (
          <EmptyState title="No places have been added yet." subtitle="Check back soon." />
        )}
        {!loading && !error && places.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              <Link
                key={place._id}
                to={`/places/${place.slug}`}
                className="group hover-pop relative block aspect-[4/5] overflow-hidden rounded-2xl"
              >
                <img
                  src={place.coverImage?.url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700"}
                  alt={place.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-widest2 text-fog/70">
                    <MapPin size={12} /> {place.location}
                  </div>
                  <h3 className="font-display text-2xl tracking-wide">{place.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Places;
