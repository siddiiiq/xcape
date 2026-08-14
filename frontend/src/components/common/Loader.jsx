import React from "react";

const Loader = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-24 text-fog/50">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-fog/20 border-t-ember" />
    <p className="text-sm tracking-widest2 uppercase">{label}</p>
  </div>
);

export default Loader;
