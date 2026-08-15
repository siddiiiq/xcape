import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  Compass,
  Camera,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";

import Seo from "../components/common/Seo.jsx";
import SectionHeading from "../components/common/SectionHeading.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import PlacesCarousel from "../components/places/PlacesCarousel.jsx";
import StoryCard from "../components/stories/StoryCard.jsx";
import ReelCard from "../components/reels/ReelCard.jsx";

// We won't strictly need FounderCard since we are building the cinematic strip inline, 
// but we keep the imports intact for your project structure.
import FounderCard from "../components/founders/FounderCard.jsx"; 

import { useFetch } from "../hooks/useFetch.js";
import { fetchPlaces } from "../api/placesApi.js";
import { fetchFounders } from "../api/foundersApi.js";
import { fetchStories } from "../api/storiesApi.js";
import { fetchReels } from "../api/reelsApi.js";
import { fetchCampaignTrips } from "../api/tripsApi.js";
import { BRAND } from "../constants/config.js";

/* ================================================================== */
/* SCROLL REVEAL                                                      */
/* ================================================================== */

const ScrollReveal = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const currentRef = domRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(currentRef);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)", 
      }}
      className={`
        transition-all duration-[1200ms]
        ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-12 opacity-0 scale-[0.98]"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/* ================================================================== */
/* HIGH-PERFORMANCE PARALLAX MEDIA                                    */
/* ================================================================== */

const ParallaxMedia = ({ src, isVideo = false, speed = 0.15 }) => {
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const handleScroll = () => {
      if (!imageRef.current || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.top <= viewportHeight && rect.bottom >= 0) {
        const centerOffset = (rect.top + rect.height / 2) - (viewportHeight / 2);
        const yPos = centerOffset * speed;
        imageRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    };

    handleScroll();

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-ink">
      <div
        ref={imageRef}
        className="absolute inset-[-15%] h-[130%] w-[130%] will-change-transform"
      >
        {isVideo ? (
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover opacity-90"
          />
        ) : (
          <img
            src={src}
            loading="lazy"
            decoding="async"
            alt="Atmospheric Background"
            className="h-full w-full object-cover opacity-90"
          />
        )}
      </div>
    </div>
  );
};

/* ================================================================== */
/* LAZY VERTICAL PARALLAX (For Desktop Grid Elements)                 */
/* ================================================================== */

const LazyParallax = ({ children, speed = 0.1, className = "", disabledOnMobile = true }) => {
  const ref = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const handleScroll = () => {
      if (!ref.current) return;

      if (disabledOnMobile && window.innerWidth < 640) {
        ref.current.style.transform = `translate3d(0, 0px, 0)`;
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.top <= viewportHeight && rect.bottom >= 0) {
        const centerOffset = (rect.top - viewportHeight / 2);
        const yPos = centerOffset * speed;
        ref.current.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    };

    handleScroll();
    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, disabledOnMobile]);

  return (
    <div className={className} style={{ perspective: "1000px" }}>
      <div ref={ref} className="will-change-transform ease-out transition-transform duration-75">
        {children}
      </div>
    </div>
  );
};

/* ================================================================== */
/* LIQUID GLASS SVG FILTERS                                           */
/* ================================================================== */

const LiquidGlassFilters = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="pointer-events-none fixed left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
  >
    <defs>
      <filter id="liquid-refraction" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.011" numOctaves="2" seed="17" result="liquidNoise" />
        <feGaussianBlur in="liquidNoise" stdDeviation="2" result="softNoise" />
        <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="18" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

const LiquidLens = ({ children, className = "", rounded = "rounded-[2.5rem] sm:rounded-[3.5rem]" }) => {
  return (
    <div className={`relative isolate ${rounded} ${className}`}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${rounded}`}
        style={{
          background: "rgba(255,255,255,0.035)",
          backdropFilter: "saturate(180%) brightness(1.08) contrast(1.02)",
          WebkitBackdropFilter: "saturate(180%) brightness(1.08) contrast(1.02)",
        }}
      />
      
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-8 z-[1] overflow-hidden opacity-60 ${rounded}`}
        style={{ filter: "url(#liquid-refraction)" }}
      >
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.10), transparent 42%)" }} />
      </div>

      <div aria-hidden="true" className={`pointer-events-none absolute left-[6%] right-[6%] top-0 z-[3] h-[1px] ${rounded}`} style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.08) 85%, transparent 100%)" }} />
      
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-[4] ${rounded}`} style={{ border: "1px solid rgba(255,255,255,0.16)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -1px 0 rgba(255,255,255,0.06), inset 1px 0 0 rgba(255,255,255,0.08), inset -1px 0 0 rgba(255,255,255,0.05)" }} />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/* ================================================================== */
/* SHARED PILL                                                        */
/* ================================================================== */

const GLASS_PILL = `
  inline-flex items-center justify-center gap-2
  rounded-full border border-white/12 bg-white/[0.04]
  px-6 py-3
  text-sm font-semibold uppercase tracking-widest2 text-white
  shadow-[0_10px_30px_rgba(0,0,0,0.35)]
  backdrop-blur-lg backdrop-saturate-150
  transition transform duration-300
  hover:-translate-y-1 hover:scale-102 hover:border-white/30 hover:bg-white/[0.07] hover:text-white
  active:translate-y-0 active:scale-98
`;

/* ================================================================== */
/* HERO                                                               */
/* ================================================================== */

const Hero = () => {
  return (
    <section className="relative flex min-h-[70vh] md:min-h-screen items-start md:items-center justify-center overflow-visible pt-28 sm:pt-24 md:pt-20 lg:pt-24 pb-10 sm:pb-16">
      <ParallaxMedia src="/video/IMG_1779.mp4" isVideo={true} speed={0.25} />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-ink z-[1]" />

      <ScrollReveal className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <div className="mx-auto mb-4 inline-block rounded-full border border-white/20 bg-white/[0.05] px-4 py-1.5 backdrop-blur-sm">
          <p className="text-[10px] sm:text-xs uppercase tracking-widest2 text-ember">
            {BRAND.name}
          </p>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.05] tracking-wide text-white drop-shadow-2xl lg:text-9xl text-balance">
          {BRAND.tagline}
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-balance">
          {BRAND.heroSubline}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full px-6 max-w-md mx-auto">
          <Link
            to="/places"
            className={
              `w-full sm:w-auto flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
               bg-gradient-to-r from-ember to-orange-400 text-white shadow-lg
               hover:scale-105 transform transition duration-300 ease-out`
            }
            aria-label="Explore the Journey"
          >
            Explore the Journey
          </Link>

          <Link
            to="/join"
            className={`${GLASS_PILL} w-full sm:w-auto flex items-center justify-center`} 
            aria-label="Join the Community"
          >
            Join the Community
          </Link>
        </div>
      </ScrollReveal>

      {/* scroll hint removed per design request */}
    </section>
  );
};

/* ================================================================== */
/* CAMPAIGN TRIP                                                      */
/* ================================================================== */

const CampaignTrip = () => {
  const { data, loading } = useFetch(fetchCampaignTrips, []);
  const trip = data?.trips?.[0];

  if (loading || !trip) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28">
      <ScrollReveal>
        <SectionHeading eyebrow="Right Now" title="THE NEXT ADVENTURE." />
      </ScrollReveal>

      <ScrollReveal delay={150} className="mt-10 sm:mt-12">
        <Link
          to={`/trips/${trip.slug}`}
          className="group relative block min-h-[60vh] sm:h-[640px] overflow-hidden rounded-[2rem] sm:rounded-[3rem] border border-white/10 shadow-2xl"
        >
          <img
            src={trip.coverImage?.url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400"}
            alt={trip.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:max-w-2xl">
            <LiquidLens className="p-6 sm:p-8 transition-transform duration-500 group-hover:-translate-y-2">
              <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs uppercase tracking-widest2 text-white">
                <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 backdrop-blur-md">
                  <MapPin size={12} className="text-ember" />
                  {trip.destination}
                </span>

                <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 backdrop-blur-md">
                  <Calendar size={12} className="text-ember" />
                  {new Date(trip.startDate).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-display text-4xl tracking-wide text-white sm:text-5xl md:text-6xl text-balance leading-[1.1]">
                {trip.title}
              </h3>

              <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest2 text-ink shadow-lg transition-all group-hover:bg-ember group-hover:text-white group-active:scale-95">
                Join This Trip
                <ArrowDown className="-rotate-90" size={14} />
              </div>
            </LiquidLens>
          </div>
        </Link>
      </ScrollReveal>
    </section>
  );
};

/* ================================================================== */
/* WHO WE ARE (Cinematic Founder Strip)                               */
/* ================================================================== */

const WhoWeAre = () => {
  const { data, loading } = useFetch(fetchFounders, []);
  const founders = data?.founders?.slice(0, 3) || [];
  
  // Staggered parallax speeds for desktop grid
  const speeds = [0.06, -0.04, 0.08]; 

  return (
    <section className="relative mx-auto max-w-6xl w-full px-5 sm:px-6 py-20 sm:py-32 overflow-hidden">
      <ScrollReveal>
        <SectionHeading
          eyebrow="Who We Are"
          title="COME FOR THE TRIP. STAY FOR THE VIBE."
          subtitle="A travel community built by three friends who wanted to explore places, document the journey, and bring other people along for it."
        />
      </ScrollReveal>

      <div className="mt-14 sm:mt-20">
        {loading ? (
          <Loader label="Loading the crew..." />
        ) : founders.length ? (
          <div className="
            flex justify-center items-start
            sm:grid sm:grid-cols-3 sm:gap-6
            px-1 sm:px-0
          ">
            {founders.map((founder, index) => {
              const isMiddle = index === 1;
              
              // Mobile specific layout variables
              const margin = index > 0 ? "-ml-[6%] sm:ml-0" : ""; // overlap effect
              const mobileStagger = isMiddle ? "translate-y-8" : "translate-y-0"; // vertical stagger
              const zIndex = isMiddle ? "z-10" : "z-0"; // keeps middle prominent
              
              return (
                <LazyParallax 
                  key={founder._id} 
                  speed={speeds[index % speeds.length]}
                  className={`
                    relative w-[36%] sm:w-full shrink-0
                    ${margin} ${zIndex}
                    ${mobileStagger} sm:translate-y-0
                    transition-transform duration-500
                  `}
                >
                  <ScrollReveal delay={index * 150} className="h-full w-full">
                    <Link
                      to={`/founders/${founder.slug}`}
                      className="group relative block w-full cursor-pointer
                        aspect-[9/14] sm:aspect-auto sm:h-[600px]
                        overflow-hidden rounded-xl sm:rounded-[2rem]
                        border border-white/15 bg-black shadow-2xl
                        transition-transform duration-300 hover:-translate-y-1
                      "
                    >
                      <img
                        src={
                          founder.profileImage?.url ||
                          founder.image?.url ||
                          "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800"
                        }
                        alt={founder.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-90"
                      />
                      
                      {/* Gradient for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                      
                      {/* Text Content (Only Name & Role) */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-8">
                        <h4 className="font-display text-lg leading-none tracking-wide text-white sm:text-4xl shadow-black drop-shadow-md">
                          {founder.name}
                        </h4>
                        <p className="mt-1 sm:mt-2 text-[9px] sm:text-xs font-bold uppercase tracking-widest text-ember drop-shadow-md">
                          {founder.role}
                        </p>
                      </div>
                    </Link>

                  </ScrollReveal>
                </LazyParallax>
              );
            })}
          </div>
        ) : (
          <EmptyState title="The founders haven't been added yet." />
        )}
      </div>
    </section>
  );
};

/* ================================================================== */
/* PLACES                                                             */
/* ================================================================== */

const PlacesWeGotLost = () => {
  const { data, loading } = useFetch(fetchPlaces, []);
  const places = data?.places || [];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <ScrollReveal>
          <SectionHeading eyebrow="The Journeys" title={"PLACES WE\nGOT LOST."} />
        </ScrollReveal>
      </div>

      <ScrollReveal delay={200} className="mt-10 sm:mt-14 w-full">
        {loading ? (
          <Loader label="Loading places..." />
        ) : places.length ? (
          <PlacesCarousel places={places} />
        ) : (
          <div className="px-6">
            <EmptyState title="No places have been added yet." subtitle="Check back soon — the crew is always somewhere." />
          </div>
        )}
      </ScrollReveal>
    </section>
  );
};

/* ================================================================== */
/* STORIES                                                            */
/* ================================================================== */

const Stories = () => {
  const { data, loading } = useFetch(fetchStories, []);
  const stories = data?.stories?.slice(0, 3) || [];

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28">
      <ScrollReveal>
        <SectionHeading eyebrow="Not Just Places" title="STORIES." />
      </ScrollReveal>

      <div className="mt-10 sm:mt-14">
        {loading ? (
          <Loader label="Loading stories..." />
        ) : stories.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stories.map((story, index) => (
              <ScrollReveal key={story._id} delay={index * 150}>
                <StoryCard story={story} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <EmptyState title="No stories published yet." />
        )}
      </div>
    </section>
  );
};

/* ================================================================== */
/* REELS                                                              */
/* ================================================================== */

const Reels = () => {
  const { data, loading } = useFetch(fetchReels, []);
  const reels = data?.reels?.slice(0, 6) || [];

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28">
      <ScrollReveal>
        <SectionHeading eyebrow="Content" title="WATCH THE WORLD THROUGH OUR LENS." />
      </ScrollReveal>

      <div className="mt-10 sm:mt-14">
        {loading ? (
          <Loader label="Loading reels..." />
        ) : reels.length ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-6">
              {reels.map((reel, index) => (
                <ScrollReveal key={reel._id} delay={index * 100}>
                  <ReelCard reel={reel} />
                </ScrollReveal>
              ))}
            </div>

            {data?.settings?.instagramUrl && (
              <ScrollReveal delay={200} className="mt-10 sm:mt-12 text-center">
                <a
                  href={data.settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${GLASS_PILL} w-full sm:w-auto`}
                >
                  Watch more on Instagram
                  <ArrowDown className="-rotate-90" size={14} />
                </a>
              </ScrollReveal>
            )}
          </>
        ) : (
          <EmptyState title="No reels published yet." />
        )}
      </div>
    </section>
  );
};

/* ================================================================== */
/* MANIFESTO                                                          */
/* ================================================================== */

const Manifesto = () => (
  <section className="flex min-h-[60vh] flex-col items-center justify-center bg-ink px-5 sm:px-6 py-20 sm:py-28 text-center relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] sm:w-[40vw] sm:h-[40vw] bg-ember/5 rounded-full blur-[100px] pointer-events-none" />
    
    <ScrollReveal className="relative z-10">
      <p className="font-display text-4xl leading-[1.1] tracking-wide text-fog/90 sm:text-6xl md:text-7xl text-balance">
        WE DON'T TRAVEL
        <br />
        TO ESCAPE LIFE.
      </p>
    </ScrollReveal>

    <ScrollReveal delay={150} className="relative z-10">
      <p className="mt-4 bg-gradient-to-r from-ember to-orange-400 bg-clip-text font-display text-4xl leading-[1.1] tracking-wide text-transparent sm:text-6xl md:text-7xl text-balance">
        WE TRAVEL
        <br />
        TO FEEL MORE OF IT.
      </p>
    </ScrollReveal>

    <ScrollReveal delay={300} className="relative z-10">
      <p className="mt-10 sm:mt-12 inline-block rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-[10px] sm:text-xs uppercase tracking-widest2 text-fog/70 backdrop-blur-md">
        Get lost. Find something. Come back different.
      </p>
    </ScrollReveal>
  </section>
);

/* ================================================================== */
/* FINAL CTA                                                          */
/* ================================================================== */

const FinalCta = () => (
  <section className="relative isolate flex min-h-[80dvh] items-center justify-center overflow-hidden px-5 py-24 sm:px-8 sm:py-28">
    
    <div className="absolute inset-0 z-0">
      <ParallaxMedia src="/images/IMG_1777.PNG" isVideo={false} speed={0.2} />
    </div>

    <div aria-hidden="true" className="absolute inset-0 bg-black/30 z-[1]" />
    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-ink z-[1]" />

    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] sm:h-[34rem] sm:w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 blur-[80px] sm:blur-[120px] z-[2]"
    />

    <ScrollReveal className="relative z-10 w-full">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        
        <div className="mb-6 sm:mb-8 flex items-center gap-3">
          <span className="h-px w-6 sm:w-12 bg-white/45" />
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.32em] text-white/80">
            The next chapter
          </span>
          <span className="h-px w-6 sm:w-12 bg-white/45" />
        </div>

        <h2 className="max-w-4xl font-display text-5xl leading-[1.0] tracking-wide text-white drop-shadow-[0_5px_28px_rgba(0,0,0,0.65)] sm:text-6xl md:text-7xl lg:text-8xl text-balance">
          SO... WHERE ARE WE
          <span className="block mt-2">GOING?</span>
        </h2>

        <div className="mt-8 sm:mt-10 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/20 px-5 py-2.5 text-[9px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-70" />
            <span className="relative h-2 w-2 rounded-full bg-ember shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
          </span>
          Next trip loading...
        </div>

        <p className="mt-6 max-w-md sm:max-w-xl text-sm leading-relaxed text-white/90 drop-shadow-[0_3px_15px_rgba(0,0,0,0.7)] sm:mt-7 sm:text-base sm:leading-8 text-balance">
          Somewhere new is waiting. Come along for the next story.
        </p>

        <div className="mt-10 flex w-full flex-col sm:flex-row items-stretch justify-center gap-4 sm:mt-12 sm:w-auto sm:items-center px-4">
          <Link
            to="/join"
            className="
              inline-flex min-h-[3.5rem] items-center justify-center rounded-full bg-white px-8 py-3.5 
              text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-ink 
              shadow-[0_12px_35px_rgba(0,0,0,0.35)] transition-all duration-300 
              hover:-translate-y-1 hover:scale-105 hover:bg-ember hover:text-white 
              active:scale-95 sm:min-w-[180px]
            "
          >
            Join the Crew
          </Link>

          <Link
            to="/places"
            className="
              inline-flex min-h-[3.5rem] items-center justify-center gap-2 rounded-full border border-white/30 
              bg-black/20 px-8 py-3.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-white 
              shadow-[0_8px_28px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 
              hover:-translate-y-1 hover:border-white/50 hover:bg-white/15 
              active:scale-95 sm:min-w-[215px]
            "
          >
            Follow the Journey
            <ArrowDown className="-rotate-90" size={14} />
          </Link>
        </div>

        <div className="mt-12 sm:mt-16 flex flex-col items-center gap-3">
          <span className="h-10 sm:h-12 w-px bg-gradient-to-b from-white/40 to-transparent" />
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-white/50">
            Keep wandering
          </span>
        </div>
      </div>
    </ScrollReveal>
  </section>
);

/* ================================================================== */
/* HOME WRAPPER                                                       */
/* ================================================================== */

const Home = () => {
  return (
    <div className="bg-ink text-fog selection:bg-ember selection:text-white scroll-smooth w-full overflow-x-hidden">
      <Seo
        title="Home"
        description="A travel community for people who love getting lost, discovering hidden places, and filming the journey."
      />

      <LiquidGlassFilters />

      <Hero />
      <CampaignTrip />
      <WhoWeAre />
      <PlacesWeGotLost />
      <Stories />
      <Reels />
      <Manifesto />
      <FinalCta />
    </div>
  );
};

export default Home;