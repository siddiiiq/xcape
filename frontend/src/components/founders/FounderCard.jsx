import React from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const FounderCard = ({ founder, index = 0 }) => {
  return (
    <Link
      to={`/founders/${founder.slug}`}
      className={`
        group
        relative
        block
        overflow-hidden
        bg-charcoal
        transition-all
        duration-500

        /* ========================================
           MOBILE DESIGN
           Tall cinematic portrait
           ======================================== */

        h-[245px]
        w-[31vw]
        max-w-[120px]
        min-w-0

        /* NO rounded corners on mobile */
        rounded-none

        /* subtle overlap */
        ${index === 1 ? "-mx-2 z-20" : "z-10"}

        /* slight editorial stagger */
        ${index === 0 ? "-translate-y-2" : ""}
        ${index === 2 ? "translate-y-2" : ""}

        /* hover/touch feel */
        hover:-translate-y-3

        /* ========================================
           DESKTOP
           Original design restored
           ======================================== */

        sm:aspect-[3/4]
        sm:h-auto
        sm:w-auto
        sm:max-w-none
        sm:rounded-2xl
        sm:translate-y-0
        sm:mx-0
        sm:z-auto
      `}
    >

      {/* Founder Image */}
      <img
        src={
          founder.profileImage?.url ||
          founder.image?.url ||
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600"
        }
        alt={founder.name}
        loading="lazy"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover

          grayscale-[15%]

          transition
          duration-700

          group-hover:scale-105
          group-hover:grayscale-0
        "
      />

      {/* Dark cinematic gradient */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black
          via-black/10
          to-transparent
        "
      />

      {/* ========================================
          MOBILE CONTENT
          Minimal — prevents text from covering
          the actual founder image
          ======================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          p-3

          sm:p-6
        "
      >

        {/* Role */}
        <p
          className="
            mb-1
            truncate
            text-[8px]
            font-medium
            uppercase
            tracking-[0.16em]
            text-ember

            sm:text-xs
            sm:tracking-widest2
          "
        >
          {founder.role}
        </p>

        {/* Name */}
        <h3
          className="
            truncate
            font-display
            text-xl
            leading-none
            tracking-wide
            text-fog

            sm:text-3xl
          "
        >
          {founder.name}
        </h3>

        {/* ======================================
            DESKTOP BIO
            Hidden on mobile
            ====================================== */}

        <p
          className="
            mt-2
            hidden
            max-h-0
            overflow-hidden
            text-sm
            text-fog/60
            opacity-0
            transition-all
            duration-500

            group-hover:max-h-20
            group-hover:opacity-100

            sm:block
          "
        >
          {founder.bio}
        </p>

        {/* ======================================
            INSTAGRAM

            Hidden on mobile to keep the cards
            clean and image-focused.
            ====================================== */}

        {founder.instagramUrl && (
          <span
            className="
              mt-3
              hidden
              items-center
              gap-1.5
              text-xs
              text-fog/50
              transition
              hover:text-ember

              sm:inline-flex
            "
          >
            <Instagram size={14} />
            Follow
          </span>
        )}

      </div>

      {/* Small vertical index */}
      <span
        className="
          absolute
          right-2
          top-2
          font-mono
          text-[8px]
          tracking-widest
          text-white/50

          sm:right-4
          sm:top-4
          sm:text-[10px]
        "
      >
        0{index + 1}
      </span>

    </Link>
  );
};

export default FounderCard;