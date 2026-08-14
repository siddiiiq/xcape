import React from "react";

const EmptyState = ({ title = "Nothing here yet.", action }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <p className="text-sm text-muted">{title}</p>
    {action}
  </div>
);

export default EmptyState;
