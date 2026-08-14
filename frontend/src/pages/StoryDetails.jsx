import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchStoryBySlug } from "../api/storiesApi.js";

const StoryDetails = () => {
  const { slug } = useParams();
  const { data, loading, error, refetch } = useFetch(() => fetchStoryBySlug(slug), [slug]);

  if (loading) return <Loader label="Loading story..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const story = data?.story;
  if (!story) return null;

  return (
    <div className="pb-24">
      <Seo title={story.title} description={story.excerpt} />

      <section className="relative flex h-[60vh] min-h-[380px] items-end overflow-hidden">
        {story.coverImage?.url && (
          <img src={story.coverImage.url} alt={story.title} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-12">
          <Link to="/stories" className="mb-4 inline-flex items-center gap-1.5 text-xs text-fog/60 hover:text-fog">
            <ArrowLeft size={14} /> All stories
          </Link>
          <h1 className="font-display text-4xl tracking-wide sm:text-6xl">{story.title}</h1>
          {story.place && (
            <Link to={`/places/${story.place.slug}`} className="mt-3 inline-block text-sm text-ember hover:underline">
              {story.place.title}
            </Link>
          )}
        </div>
      </section>

      <article className="prose prose-invert mx-auto mt-16 max-w-3xl whitespace-pre-line px-6 text-fog/70">
        {story.content}
      </article>
    </div>
  );
};

export default StoryDetails;
