import React from "react";

const PageHeader = ({ title, description, action }) => (
  <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
    <div>
      <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    </div>
    {action && <div className="w-full sm:w-auto [&>*]:w-full sm:[&>*]:w-auto">{action}</div>}
  </div>
);

export default PageHeader;
