import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Instagram, Youtube } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { fetchFounderBySlug } from "../api/foundersApi.js";

const FounderDetails = () => {
  const { slug } = useParams();
  const { data, loading, error, refetch } = useFetch(() => fetchFounderBySlug(slug), [slug]);

  if (loading) return <Loader label="Loading..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const founder = data?.founder;
  if (!founder) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-40">
      <Seo title={founder.name} description={founder.bio} />
      <Link to="/founders" className="mb-8 inline-flex items-center gap-1.5 text-xs text-fog/60 hover:text-fog">
        <ArrowLeft size={14} /> The crew
      </Link>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-[280px_1fr]">
        <div className="aspect-[3/4] overflow-hidden rounded-2xl">
          <img
            src={founder.profileImage?.url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600"}
            alt={founder.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-ember">{founder.role}</p>
          <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-6xl">{founder.name}</h1>
          <p className="mt-6 whitespace-pre-line text-fog/60">{founder.longBio || founder.bio}</p>

          <div className="mt-6 flex gap-4">
            {founder.instagramUrl && (
              <a href={founder.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-fog/60 hover:text-ember">
                <Instagram size={16} /> Instagram
              </a>
            )}
            {founder.youtubeUrl && (
              <a href={founder.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-fog/60 hover:text-ember">
                <Youtube size={16} /> YouTube
              </a>
            )}
          </div>
        </div>
      </div>

      {founder.gallery?.length > 0 && (
        <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {founder.gallery.map((img, i) => (
            <div key={img._id || i} className="hover-pop aspect-square overflow-hidden rounded-xl">
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FounderDetails;
