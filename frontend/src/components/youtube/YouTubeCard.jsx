import React from "react";
import { PlayCircle } from "lucide-react";

const getYouTubeId = (url = "") => {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return match ? match[1] : null;
};

const YouTubeCard = ({ video }) => {
  const videoId = getYouTubeId(video.youtubeUrl);
  const thumb =
    video.thumbnail?.url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null);

  return (
    <a
      href={video.youtubeUrl}
      target="_blank"
      rel="noreferrer"
      className="group hover-pop relative block aspect-video overflow-hidden rounded-xl bg-charcoal"
    >
      {thumb && (
        <img
          src={thumb}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <PlayCircle size={44} className="text-fog/90 transition group-hover:scale-110 group-hover:text-ember" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="line-clamp-2 font-medium">{video.title}</p>
      </div>
    </a>
  );
};

export default YouTubeCard;
