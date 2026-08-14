import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PlaceCard from "./PlaceCard.jsx";

// Modern, cinematic travel carousel for the "Places We Got Lost" section.
//
// - Touch (mobile): left entirely to native scrolling — `touchAction: pan-x`
//   plus overflow-x-auto gives the browser's own, perfectly smooth swipe
//   physics for free. We never intercept touch events.
// - Mouse (desktop): click-and-drag to scroll, implemented with the Pointer
//   Events API (ignoring touch pointers so we don't double-handle them).
// - Snapping: CSS scroll-snap keeps cards settling into place, but is
//   switched off mid-drag so it doesn't fight the user's mouse movement.
// - A drag that moves more than a few pixels suppresses the click-through
//   navigation on the card underneath it (otherwise dragging a card would
//   also follow its link, which is the classic carousel-in-a-link bug).
const PlacesCarousel = ({ places }) => {
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector("[data-carousel-card]");
    const step = firstCard ? firstCard.offsetWidth + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const onPointerDown = (e) => {
    if (e.pointerType === "touch") return; // let touch scroll natively
    const track = trackRef.current;
    if (!track) return;
    drag.current = { active: true, startX: e.clientX, startScroll: track.scrollLeft, moved: false };
    setIsDragging(true);
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 4) drag.current.moved = true;
    track.scrollLeft = drag.current.startScroll - delta;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);
  };

  // Capture-phase click handler: if the pointer just finished a real drag,
  // swallow the click so the underlying <Link> doesn't navigate.
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div className="group/carousel relative">
      {/* Edge fades hint that there's more to scroll to on either side. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-ink to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-ink to-transparent sm:w-20" />

      <div
        ref={trackRef}
        role="region"
        aria-label="Places we got lost — scroll to see more"
        className={`no-scrollbar flex gap-5 overflow-x-auto px-6 pb-4 sm:px-[calc(50vw-540px)] ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        style={{
          touchAction: "pan-x",
          scrollSnapType: isDragging ? "none" : "x mandatory",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {places.map((place) => (
          <div
            key={place._id}
            data-carousel-card
            style={{ scrollSnapAlign: "start" }}
          >
            <PlaceCard place={place} />
          </div>
        ))}
      </div>

      {/* Desktop-only arrow affordances — hidden on touch-first layouts
          where swipe is the primary (and more natural) interaction. */}
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Scroll to previous places"
        className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/50 p-3 text-fog opacity-0 backdrop-blur transition duration-300 hover:bg-black/70 group-hover/carousel:opacity-100 md:flex sm:left-4"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Scroll to more places"
        className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/50 p-3 text-fog opacity-0 backdrop-blur transition duration-300 hover:bg-black/70 group-hover/carousel:opacity-100 md:flex sm:right-4"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default PlacesCarousel;
