import React from "react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import FounderCard from "../components/founders/FounderCard.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchFounders } from "../api/foundersApi.js";

const Founders = () => {
  const { data, loading, error, refetch } = useFetch(fetchFounders, []);
  const founders = data?.founders || [];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-40">
      <Seo title="The Crew" description="The people behind the journey." />
      <p className="text-xs uppercase tracking-widest2 text-ember">Who We Are</p>
      <h1 className="mt-3 font-display text-5xl tracking-wide sm:text-7xl">The People Behind The Journey</h1>

      <div className="mt-16">
        {loading && <Loader label="Loading the crew..." />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && founders.length === 0 && <EmptyState title="No founders added yet." />}
        {!loading && !error && founders.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {founders.map((f) => (
              <FounderCard key={f._id} founder={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Founders;
