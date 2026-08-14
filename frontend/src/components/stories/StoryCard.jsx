import React from "react";
import { Link } from "react-router-dom";

const StoryCard = ({ story }) => (
  <Link
    to={`/stories/${story.slug}`}
    className="group hover-pop relative block h-[420px] overflow-hidden rounded-2xl bg-charcoal"
  >
    <img
      src={story.coverImage?.url || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700"}
      alt={story.title}
      loading="lazy"
      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h3 className="font-display text-2xl leading-tight tracking-wide sm:text-3xl">{story.title}</h3>
      {story.excerpt && <p className="mt-2 line-clamp-2 text-sm text-fog/60">{story.excerpt}</p>}
    </div>
  </Link>
);

export default StoryCard;
