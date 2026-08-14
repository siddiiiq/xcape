import React from "react";

const STYLES = {
  published: "bg-green-100 text-green-700",
  draft: "bg-zinc-100 text-zinc-600",
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STYLES[status] || "bg-zinc-100 text-zinc-600"}`}>
    {status}
  </span>
);

export default StatusBadge;
