// Central brand configuration. Change the brand name/copy here rather than
// hard-coding it across components — the admin Settings page can override
// most of this at runtime via the /api/settings endpoint (see SettingsContext).
export const BRAND = {
  name: "Xcape.FOMO",
  shortName: "xcape.fomo",
  tagline: "Turn FEAR of missing out INTO no more MISSING out.",
  heroSubline: "Stop watching the world through a screen. Experience it!",
  scrollHint: "SCROLL TO GET LOST",
};

export const NAV_LINKS = [
  { label: "Journeys", to: "/places" },
  { label: "Trips", to: "/trips" },
  { label: "Stories", to: "/stories" },
  { label: "Crew", to: "/founders" },
  { label: "Reels", to: "/reels" },
];

export const SOCIALS_FALLBACK = {
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  contactEmail: "hello@example.com",
};
