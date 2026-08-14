import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchSettings } from "../api/settingsApi.js";
import { BRAND, SOCIALS_FALLBACK } from "../constants/config.js";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    brandName: BRAND.name,
    tagline: BRAND.tagline,
    heroText: BRAND.heroSubline,
    instagramUrl: SOCIALS_FALLBACK.instagramUrl,
    youtubeUrl: SOCIALS_FALLBACK.youtubeUrl,
    contactEmail: SOCIALS_FALLBACK.contactEmail,
    footerText: "Made by three friends somewhere between here and nowhere.",
    joinCrewText: "Don't just follow the journey. Join it.",
  });

  useEffect(() => {
    // If the backend isn't reachable yet, the sensible defaults above stand —
    // the site should never look broken just because the API is down.
    fetchSettings()
      .then((res) => res.settings && setSettings((prev) => ({ ...prev, ...res.settings })))
      .catch(() => {});
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;
