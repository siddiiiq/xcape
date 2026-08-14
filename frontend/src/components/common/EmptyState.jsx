import React from "react";

const EmptyState = ({ title = "Nothing here yet.", subtitle }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
    <p className="font-display text-2xl tracking-wide text-fog/70">{title}</p>
    {subtitle && <p className="max-w-sm text-sm text-fog/40">{subtitle}</p>}
  </div>
);

export default EmptyState;
