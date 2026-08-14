import React from "react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import YouTubeCard from "../components/youtube/YouTubeCard.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchYouTubeVideos } from "../api/youtubeApi.js";

const YouTube = () => {
  const { data, loading, error, refetch } = useFetch(fetchYouTubeVideos, []);
  const videos = data?.videos || [];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-40">
      <Seo title="Latest Adventures" description="Our latest YouTube adventures." />
      <p className="text-xs uppercase tracking-widest2 text-ember">Watch</p>
      <h1 className="mt-3 font-display text-5xl tracking-wide sm:text-7xl">Latest Adventures</h1>

      <div className="mt-16">
        {loading && <Loader label="Loading videos..." />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && videos.length === 0 && <EmptyState title="No videos published yet." />}
        {!loading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <YouTubeCard key={v._id} video={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTube;
