import React from "react";

// Minimal generic table: columns = [{ key, label, render? }], rows = array of records.
// `render(row)` lets callers put badges/buttons/links in a cell without the
// table needing to know about any specific resource.
//
// Below the sm breakpoint, a horizontally-scrolling table is awkward to use
// with a thumb, so we render the same data as a stacked list of cards
// instead. Every page already puts the row's main identity in the first
// column and its row actions in a column with an empty label, so that's
// used as the heuristic for what to feature vs. list vs. pin to the bottom
// — no page needs to know this view exists.
const DataTable = ({ columns, rows, keyField = "_id", onRowClick }) => {
  const [primaryCol, ...restCols] = columns;
  const actionCol = restCols.find((col) => !col.label);
  const bodyCols = restCols.filter((col) => col.label);

  return (
    <>
      {/* Table view — sm screens and up */}
      <div className="card hidden overflow-x-auto sm:block">
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

      {/* Card view — mobile only */}
      <div className="space-y-3 sm:hidden">
        {rows.map((row) => (
          <div
            key={row[keyField]}
            onClick={() => onRowClick?.(row)}
            className={`card p-4 ${onRowClick ? "cursor-pointer active:bg-zinc-50" : ""}`}
          >
            <div className="text-sm">{primaryCol.render ? primaryCol.render(row) : row[primaryCol.key]}</div>

            {bodyCols.length > 0 && (
              <div className="mt-3 space-y-2 border-t border-line pt-3">
                {bodyCols.map((col) => (
                  <div key={col.key} className="flex items-center justify-between gap-3 text-sm">
                    <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted">{col.label}</span>
                    <span className="min-w-0 text-right">{col.render ? col.render(row) : row[col.key]}</span>
                  </div>
                ))}
              </div>
            )}

            {actionCol && (
              <div
                className="mt-3 flex justify-end gap-2 border-t border-line pt-3"
                onClick={(e) => e.stopPropagation()}
              >
                {actionCol.render(row)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default DataTable;
