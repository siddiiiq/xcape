import React from "react";
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
import FounderCard from "../components/founders/FounderCard.jsx";
import StoryCard from "../components/stories/StoryCard.jsx";
import ReelCard from "../components/reels/ReelCard.jsx";

import { useFetch } from "../hooks/useFetch.js";
import { fetchPlaces } from "../api/placesApi.js";
import { fetchFounders } from "../api/foundersApi.js";
import { fetchStories } from "../api/storiesApi.js";
import { fetchReels } from "../api/reelsApi.js";
import { fetchCampaignTrips } from "../api/tripsApi.js";
import { BRAND } from "../constants/config.js";

const Hero = () => {
  return (
    <section className="relative flex h-screen min-h-[640px] items-center justify-center overflow-hidden">

      {/* Hero Background Video */}
      <video
        src="/video/IMG_1773.MP4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full scale-110 object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-ink" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">

        <p className="mb-4 text-xs uppercase tracking-widest2 text-ember">
          {BRAND.name}
        </p>

        <h1 className="font-display text-5xl leading-[0.95] tracking-wide sm:text-7xl md:text-8xl">
          {BRAND.tagline}
        </h1>

        <p className="mx-auto mt-6 max-w-md text-fog/60">
          {BRAND.heroSubline}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">

          <Link
            to="/places"
            className="rounded-full bg-fog px-7 py-3.5 text-xs font-semibold uppercase tracking-widest2 text-ink transition hover:bg-ember"
          >
            Explore the Journey
          </Link>

          <Link
            to="/join"
            className="glass rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-widest2 transition hover:border-ember hover:text-ember"
          >
            Join the Community
          </Link>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-fog/50">
        <span className="text-[10px] uppercase tracking-widest2">
          {BRAND.scrollHint}
        </span>

        <ArrowDown size={16} className="animate-bounce" />
      </div>

    </section>
  );
};

const CampaignTrip = () => {
  const { data, loading } = useFetch(fetchCampaignTrips, []);
  const trip = data?.trips?.[0];

  if (loading || !trip) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-28">

      <SectionHeading
        eyebrow="Right Now"
        title="THE NEXT ADVENTURE."
      />

      <Link
        to={`/trips/${trip.slug}`}
        className="hover-pop group relative mt-12 block h-[420px] overflow-hidden rounded-3xl sm:h-[480px]"
      >
        <img
          src={
            trip.coverImage?.url ||
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400"
          }
          alt={trip.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">

          <div className="mb-2 flex items-center gap-4 text-xs uppercase tracking-widest2 text-fog/70">

            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {trip.destination}
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {new Date(trip.startDate).toLocaleDateString()}
            </span>

          </div>

          <h3 className="font-display text-4xl tracking-wide sm:text-5xl">
            {trip.title}
          </h3>

          <div className="mt-5 inline-block rounded-full bg-fog px-6 py-3 text-xs font-semibold uppercase tracking-widest2 text-ink transition group-hover:bg-ember">
            Join This Trip →
          </div>

        </div>
      </Link>
    </section>
  );
};

const WhoWeAre = () => {
  const { data, loading } = useFetch(fetchFounders, []);
  const founders = data?.founders?.slice(0, 3) || [];

  return (
    <section className="mx-auto max-w-6xl px-6 py-28">

      <SectionHeading
        eyebrow="Who We Are"
        title="COME FOR THE TRIP. STAY FOR THE VIBE."
        subtitle="A travel community built by three friends who wanted to explore places, document the journey, and bring other people along for it."
      />

      <div className="mt-14">

        {loading ? (

          <Loader label="Loading the crew..." />

        ) : founders.length ? (

          /*
           * MOBILE:
           * Cinematic vertical founder strip.
           *
           * DESKTOP:
           * Original 3-column card layout.
           */
          <div className="flex items-center justify-center sm:grid sm:grid-cols-3 sm:gap-6">

            {founders.map((founder, index) => (
              <FounderCard
                key={founder._id}
                founder={founder}
                index={index}
              />
            ))}

          </div>

        ) : (

          <EmptyState title="The founders haven't been added yet." />

        )}

      </div>
    </section>
  );
};

const PlacesWeGotLost = () => {
  const { data, loading } = useFetch(fetchPlaces, []);
  const places = data?.places || [];

  return (
    <section className="py-28">

      <div className="mx-auto max-w-6xl px-6">

        <SectionHeading
          eyebrow="The Journeys"
          title={"PLACES WE\nGOT LOST."}
        />

      </div>

      <div className="mt-14">

        {loading ? (

          <Loader label="Loading places..." />

        ) : places.length ? (

          <PlacesCarousel places={places} />

        ) : (

          <div className="px-6">

            <EmptyState
              title="No places have been added yet."
              subtitle="Check back soon — the crew is always somewhere."
            />

          </div>

        )}

      </div>
    </section>
  );
};

const Stories = () => {
  const { data, loading } = useFetch(fetchStories, []);
  const stories = data?.stories?.slice(0, 3) || [];

  return (
    <section className="mx-auto max-w-6xl px-6 py-28">

      <SectionHeading
        eyebrow="Not Just Places"
        title="STORIES."
      />

      <div className="mt-14">

        {loading ? (

          <Loader label="Loading stories..." />

        ) : stories.length ? (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">

            {stories.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
              />
            ))}

          </div>

        ) : (

          <EmptyState title="No stories published yet." />

        )}

      </div>
    </section>
  );
};

const Reels = () => {
  const { data, loading } = useFetch(fetchReels, []);
  const reels = data?.reels?.slice(0, 6) || [];

  return (
    <section className="mx-auto max-w-6xl px-6 py-28">

      <SectionHeading
        eyebrow="Content"
        title="WATCH THE WORLD THROUGH OUR LENS."
      />

      <div className="mt-14">

        {loading ? (

          <Loader label="Loading reels..." />

        ) : reels.length ? (

          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">

              {reels.map((reel) => (
                <ReelCard
                  key={reel._id}
                  reel={reel}
                />
              ))}

            </div>

            {data?.settings?.instagramUrl && (

              <div className="mt-8 text-center">

                <a
                  href={data.settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm uppercase tracking-widest2 text-ember hover:underline"
                >
                  Watch more on Instagram →
                </a>

              </div>

            )}
          </>

        ) : (

          <EmptyState title="No reels published yet." />

        )}

      </div>
    </section>
  );
};

const Community = () => {

  const items = [
    { icon: Compass, label: "Travel" },
    { icon: Camera, label: "Create" },
    { icon: Users, label: "Connect" },
    { icon: MapPin, label: "Explore" },
  ];

  return (
    <section className="relative overflow-hidden bg-charcoal px-6 py-28">

      <div className="mx-auto max-w-4xl text-center">

        <SectionHeading
          align="center"
          eyebrow="The Community"
          title="DON'T JUST FOLLOW THE JOURNEY. JOIN IT."
          subtitle="This isn't just a travel page. It's a community of people who want to discover hidden places, find travel buddies, join trips, and meet people who love travelling as much as they do."
        />

        <div className="mx-auto mt-12 flex max-w-xl flex-wrap justify-center gap-4">

          {items.map(({ icon: Icon, label }) => (

            <div
              key={label}
              className="glass flex items-center gap-2 rounded-full px-5 py-3"
            >
              <Icon
                size={16}
                className="text-ember"
              />

              <span className="text-xs uppercase tracking-widest2">
                {label}
              </span>

            </div>

          ))}

        </div>

        <Link
          to="/join"
          className="mt-12 inline-block rounded-full bg-fog px-8 py-4 text-xs font-semibold uppercase tracking-widest2 text-ink transition hover:bg-ember"
        >
          Join the Crew →
        </Link>

      </div>
    </section>
  );
};

const Manifesto = () => (

  <section className="flex min-h-[70vh] flex-col items-center justify-center bg-ink px-6 py-28 text-center">

    <p className="font-display text-4xl leading-tight tracking-wide sm:text-6xl">
      WE DON'T TRAVEL
      <br />
      TO ESCAPE LIFE.
    </p>

    <p className="mt-6 font-display text-4xl leading-tight tracking-wide text-ember sm:text-6xl">
      WE TRAVEL
      <br />
      TO FEEL MORE OF IT.
    </p>

    <p className="mt-10 text-sm uppercase tracking-widest2 text-fog/40">
      Get lost. Find something. Come back different.
    </p>

  </section>
);

const FinalCta = () => (

  <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-28">

    <img
      src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
      alt="Traveler looking out over hills"
      className="absolute inset-0 h-full w-full object-cover"
    />

    <div className="absolute inset-0 bg-black/70" />

    <div className="relative z-10 text-center">

      <h2 className="font-display text-4xl tracking-wide sm:text-6xl">
        SO... WHERE ARE WE GOING?
      </h2>

      <p className="mt-4 text-sm uppercase tracking-widest2 text-fog/50">
        Next trip loading...
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">

        <Link
          to="/join"
          className="rounded-full bg-fog px-7 py-3.5 text-xs font-semibold uppercase tracking-widest2 text-ink transition hover:bg-ember"
        >
          Join the Crew
        </Link>

        <Link
          to="/places"
          className="glass rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-widest2 transition hover:border-ember hover:text-ember"
        >
          Follow the Journey
        </Link>

      </div>
    </div>

  </section>
);

const Home = () => (
  <>
    <Seo
      title="Home"
      description="A travel community for people who love getting lost, discovering hidden places, and filming the journey."
    />

    <Hero />

    <CampaignTrip />

    <WhoWeAre />

    <PlacesWeGotLost />

    <Stories />

    <Reels />

    <Community />

    <Manifesto />

    <FinalCta />
  </>
);

export default Home;