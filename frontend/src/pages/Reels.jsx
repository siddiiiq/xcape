import React from "react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import ReelCard from "../components/reels/ReelCard.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchReels } from "../api/reelsApi.js";

const Reels = () => {
  const { data, loading, error, refetch } = useFetch(fetchReels, []);
  const reels = data?.reels || [];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-40">
      <Seo title="Reels" description="Watch the world through our lens." />
      <p className="text-xs uppercase tracking-widest2 text-ember">Content</p>
      <h1 className="mt-3 font-display text-5xl tracking-wide sm:text-7xl">Reels</h1>
      <p className="mt-4 max-w-md text-fog/50">Watch the world through our lens.</p>

      <div className="mt-16">
        {loading && <Loader label="Loading reels..." />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && reels.length === 0 && <EmptyState title="No reels published yet." />}
        {!loading && !error && reels.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {reels.map((r) => (
              <ReelCard key={r._id} reel={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reels;
