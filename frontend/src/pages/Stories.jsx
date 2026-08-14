import React from "react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import StoryCard from "../components/stories/StoryCard.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchStories } from "../api/storiesApi.js";

const Stories = () => {
  const { data, loading, error, refetch } = useFetch(fetchStories, []);
  const stories = data?.stories || [];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-40">
      <Seo title="Stories" description="Not just places. Stories." />
      <p className="text-xs uppercase tracking-widest2 text-ember">Not Just Places</p>
      <h1 className="mt-3 font-display text-5xl tracking-wide sm:text-7xl">Stories</h1>

      <div className="mt-16">
        {loading && <Loader label="Loading stories..." />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && stories.length === 0 && <EmptyState title="No stories published yet." />}
        {!loading && !error && stories.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <StoryCard key={s._id} story={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
