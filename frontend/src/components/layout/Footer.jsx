import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail } from "lucide-react";
import { NAV_LINKS } from "../../constants/config.js";
import { useSettings } from "../../context/SettingsContext.jsx";

const Footer = () => {
  const settings = useSettings();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-ink/60 px-6 py-16 backdrop-blur-xl transition-all">
      {/* Subtle ambient gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50" />
      
      {/* Decorative glass highlight line at the top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:justify-between">
        
        {/* Brand Section */}
        <div className="flex flex-col md:max-w-sm">
          <Link to="/" className="group inline-block w-fit">
            <h2 className="font-display text-3xl tracking-wide text-white/90 transition-colors duration-300 group-hover:text-ember">
              {settings?.brandName || "Brand Name"}
            </h2>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-fog/50">
            {settings?.footerText || "Inspiring text goes here. Creating beautiful experiences with modern design and seamless interactions."}
          </p>
        </div>

        {/* Links and Socials Container */}
        <div className="flex flex-wrap gap-x-16 gap-y-10">
          
          {/* Explore Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-fog/40">
              Explore
            </h3>
            <ul className="flex flex-col space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="inline-flex items-center text-fog/70 transition-all duration-300 hover:-translate-y-0.5 hover:text-ember"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/join" 
                  className="inline-flex items-center text-fog/70 transition-all duration-300 hover:-translate-y-0.5 hover:text-ember"
                >
                  Join the Crew
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-fog/40">
              Connect
            </h3>
            <div className="flex items-center gap-3">
              {/* Hardcoded Instagram Link */}
              <a 
                href="https://www.instagram.com/xcape.fomo/" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-fog/70 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-ember/30 hover:bg-ember/10 hover:text-ember hover:shadow-[0_0_15px_rgba(var(--ember-rgb),0.3)]"
              >
                <Instagram size={18} className="transition-transform duration-300 group-hover:scale-110" />
              </a>
              
              {/* Dynamic YouTube Link */}
              {settings?.youtubeUrl && (
                <a 
                  href={settings.youtubeUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="YouTube"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-fog/70 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-ember/30 hover:bg-ember/10 hover:text-ember hover:shadow-[0_0_15px_rgba(var(--ember-rgb),0.3)]"
                >
                  <Youtube size={18} className="transition-transform duration-300 group-hover:scale-110" />
                </a>
              )}
              
              {/* Dynamic Email Link */}
              {settings?.contactEmail && (
                <a 
                  href={`mailto:${settings.contactEmail}`} 
                  aria-label="Email"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-fog/70 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-ember/30 hover:bg-ember/10 hover:text-ember hover:shadow-[0_0_15px_rgba(var(--ember-rgb),0.3)]"
                >
                  <Mail size={18} className="transition-transform duration-300 group-hover:scale-110" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="relative z-10 mx-auto mt-16 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-fog/40 md:flex-row">
        <p>
          © {new Date().getFullYear()} <span className="font-medium text-fog/60">{settings?.brandName}</span>. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link to="/privacy" className="transition-colors hover:text-ember">Privacy Policy</Link>
          <Link to="/terms" className="transition-colors hover:text-ember">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;