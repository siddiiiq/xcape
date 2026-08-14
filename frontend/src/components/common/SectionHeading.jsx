import React from "react";

const SectionHeading = ({ eyebrow, title, subtitle, align = "left" }) => (
  <div className={align === "center" ? "text-center" : "text-left"}>
    {eyebrow && (
      <p className="mb-3 text-xs uppercase tracking-widest2 text-ember">{eyebrow}</p>
    )}
    <h2 className="whitespace-pre-line font-display text-4xl leading-[0.95] tracking-wide sm:text-5xl md:text-6xl">
      {title}
    </h2>
    {subtitle && <p className="mt-4 max-w-xl text-fog/50">{subtitle}</p>}
  </div>
);

export default SectionHeading;
