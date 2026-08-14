import React from "react";

// Minimal generic table: columns = [{ key, label, render? }], rows = array of records.
// `render(row)` lets callers put badges/buttons/links in a cell without the
// table needing to know about any specific resource.
const DataTable = ({ columns, rows, keyField = "_id", onRowClick }) => (
  <div className="card overflow-x-auto">
    <table className="w-full min-w-[640px] text-left text-sm">
      <thead>
        <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
          {columns.map((col) => (
            <th key={col.key} className="px-4 py-3 font-medium">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row[keyField]}
            onClick={() => onRowClick?.(row)}
            className={`border-b border-line last:border-0 ${onRowClick ? "cursor-pointer hover:bg-zinc-50" : ""}`}
          >
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-3.5">
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
