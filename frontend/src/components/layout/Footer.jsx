import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail } from "lucide-react";
import { NAV_LINKS } from "../../constants/config.js";
import { useSettings } from "../../context/SettingsContext.jsx";

const Footer = () => {
  const settings = useSettings();

  return (
    <footer className="border-t border-white/5 bg-ink px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-2xl tracking-wide">{settings?.brandName}</p>
          <p className="mt-3 max-w-xs text-sm text-fog/40">{settings?.footerText}</p>
        </div>

        <div className="flex flex-wrap gap-x-12 gap-y-6">
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest2 text-fog/40">Explore</p>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-fog/60 hover:text-ember">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/join" className="text-fog/60 hover:text-ember">
                  Join the Crew
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-widest2 text-fog/40">Follow</p>
            <div className="flex gap-4">
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="text-fog/60 hover:text-ember">
                  <Instagram size={18} />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="text-fog/60 hover:text-ember">
                  <Youtube size={18} />
                </a>
              )}
              {settings?.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`} className="text-fog/60 hover:text-ember">
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/5 pt-6 text-xs text-fog/30">
        © {new Date().getFullYear()} {settings?.brandName}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
