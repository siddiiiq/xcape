import React from "react";
import { Play, Instagram } from "lucide-react";

const ReelCard = ({ reel }) => (
  <a
    href={reel.instagramUrl}
    target="_blank"
    rel="noreferrer"
    className="group hover-pop relative block aspect-[9/16] overflow-hidden rounded-xl bg-charcoal"
  >
    {reel.videoPreview?.url ? (
      <video
        src={reel.videoPreview.url}
        muted
        loop
        playsInline
        onMouseEnter={(e) => e.currentTarget.play()}
        onMouseLeave={(e) => e.currentTarget.pause()}
        poster={reel.thumbnail?.url}
        className="h-full w-full object-cover"
      />
    ) : (
      <img
        src={reel.thumbnail?.url || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500"}
        alt={reel.title}
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
    <div className="absolute right-3 top-3 rounded-full bg-black/50 p-2 backdrop-blur">
      <Instagram size={14} />
    </div>
    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
      <div className="rounded-full bg-white/90 p-3">
        <Play size={20} className="fill-ink text-ink" />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-3">
      <p className="line-clamp-2 text-sm font-medium">{reel.title}</p>
    </div>
  </a>
);

export default ReelCard;
