import { useEffect } from "react";

// Lightweight SEO helper (no extra dependency): sets document title and
// meta description per-page. Runs once per mount / whenever the values change.
const Seo = ({ title, description }) => {
  useEffect(() => {
    if (title) document.title = `${title} — Xcape.FOMO`;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
};

export default Seo;
