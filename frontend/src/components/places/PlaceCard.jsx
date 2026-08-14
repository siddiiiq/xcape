import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const PlaceCard = ({ place }) => {
  // The admin's cover-image uploader always persists the same shape
  // ({ url, publicId, resourceType }), so this is the single source of
  // truth for what to display — no need to guess at alternate shapes.
  const imageUrl = place?.coverImage?.url || null;

  return (
    <Link
      to={`/places/${place.slug}`}
      className="
        group
        hover-pop
        relative
        block
        h-[65vh]
        w-[78vw]
        shrink-0
        overflow-hidden
        rounded-2xl
        bg-charcoal
        sm:w-[420px]
      "
    >
      {/* 
        Only show an image when an actual uploaded image exists.
        This prevents an unrelated Unsplash image from appearing.
      */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={place.title || "Travel destination"}
          loading="lazy"
          onError={(e) => {
            // If the saved image URL is broken, don't replace it
            // with a random image.
            e.currentTarget.style.display = "none";
          }}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-700
            ease-out
            group-hover:scale-110
          "
        />
      ) : (
        /*
         * No uploaded image found.
         * Use a clean dark placeholder instead of another
         * unrelated travel photograph.
         */
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-ink to-black" />
      )}

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

      {/* Place information */}
      <div className="absolute bottom-0 left-0 right-0 p-6">

        {/* Location */}
        {place.location && (
          <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-widest2 text-fog/70">
            <MapPin size={12} />
            {place.location}
          </div>
        )}

        {/* Title */}
        <h3 className="font-display text-3xl leading-none tracking-wide sm:text-4xl">
          {place.title}
        </h3>

        {/* Description */}
        {place.shortDescription && (
          <p className="mt-2 line-clamp-2 max-w-sm text-sm text-fog/60">
            {place.shortDescription}
          </p>
        )}

      </div>
    </Link>
  );
};

export default PlaceCard;