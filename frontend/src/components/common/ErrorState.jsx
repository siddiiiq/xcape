import React from "react";

const ErrorState = ({ message = "Failed to load. Try again in a moment.", onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
    <p className="text-sm text-fog/50">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="rounded-full border border-fog/20 px-5 py-2 text-xs uppercase tracking-widest2 text-fog/70 transition hover:border-ember hover:text-ember"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
