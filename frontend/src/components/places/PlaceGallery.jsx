import React, { useState } from "react";
import { X, Instagram, ChevronLeft, ChevronRight } from "lucide-react";

const PlaceGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!images.length) return null;

  const active = activeIndex !== null ? images[activeIndex] : null;

  const openOrRedirect = (image, index) => {
    if (image.instagramUrl) {
      window.open(image.instagramUrl, "_blank", "noopener,noreferrer");
    } else {
      setActiveIndex(index);
    }
  };

  const step = (delta) => {
    setActiveIndex((i) => (i + delta + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image._id || index}
            onClick={() => openOrRedirect(image, index)}
            className="group hover-pop relative aspect-square overflow-hidden rounded-xl"
          >
            <img
              src={image.url}
              alt={image.title || `Gallery image ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            {image.instagramUrl && (
              <div className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 backdrop-blur">
                <Instagram size={14} />
              </div>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setActiveIndex(null)}
        >
          <button
            className="absolute right-6 top-6 text-fog/70 hover:text-fog"
            onClick={() => setActiveIndex(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-4 text-fog/50 hover:text-fog"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>
          <img
            src={active.url}
            alt={active.title || "Gallery image"}
            className="max-h-[85vh] max-w-4xl rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-fog/50 hover:text-fog"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );
};

export default PlaceGallery;
