import React from "react";

const PageHeader = ({ title, description, action }) => (
  <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
