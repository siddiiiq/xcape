import React from "react";
import { useParams, Link } from "react-router-dom";
import { Instagram, MapPin, ArrowLeft } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import PlaceGallery from "../components/places/PlaceGallery.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchPlaceBySlug } from "../api/placesApi.js";

const PlaceDetails = () => {
  const { slug } = useParams();
  const { data, loading, error, refetch } = useFetch(() => fetchPlaceBySlug(slug), [slug]);

  if (loading) return <Loader label="Loading place..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const { place, related = [] } = data || {};
  if (!place) return null;

  return (
    <div className="pb-24">
      <Seo title={place.title} description={place.shortDescription} />

      <section className="relative flex h-[70vh] min-h-[420px] items-end overflow-hidden">
        <img
          src={place.coverImage?.url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600"}
          alt={place.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-14">
          <Link to="/places" className="mb-4 inline-flex items-center gap-1.5 text-xs text-fog/60 hover:text-fog">
            <ArrowLeft size={14} /> All places
          </Link>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest2 text-ember">
            <MapPin size={12} /> {place.location}
          </div>
          <h1 className="mt-2 font-display text-5xl tracking-wide sm:text-7xl">{place.title}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 pt-16">
        {place.shortDescription && <p className="text-lg text-fog/70">{place.shortDescription}</p>}

        {place.story && (
          <div className="prose prose-invert mt-8 max-w-none whitespace-pre-line text-fog/60">
            {place.story}
          </div>
        )}

        {place.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {place.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-widest2 text-fog/50">
                {tag}
              </span>
            ))}
          </div>
        )}

        {place.instagramUrl && (
          <a
            href={place.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm text-ember hover:underline"
          >
            <Instagram size={16} /> View on Instagram
          </a>
        )}

        {place.gallery?.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-display text-3xl tracking-wide">Gallery</h2>
            <PlaceGallery images={[...place.gallery].sort((a, b) => a.order - b.order)} />
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-6 font-display text-3xl tracking-wide">Related Journeys</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <Link key={p._id} to={`/places/${p.slug}`} className="group hover-pop relative block aspect-[4/5] overflow-hidden rounded-xl">
                  <img
                    src={p.coverImage?.url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500"}
                    alt={p.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <p className="absolute bottom-3 left-3 font-display text-lg tracking-wide">{p.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetails;
