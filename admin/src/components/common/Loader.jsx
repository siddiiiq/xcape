import React from "react";

const Loader = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent" />
    {label}
  </div>
);

export default Loader;
