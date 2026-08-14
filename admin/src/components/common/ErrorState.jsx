import React from "react";

const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <p className="text-sm text-red-600">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary">
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
