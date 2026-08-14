import React from "react";

// Simple blocking confirm modal used before destructive actions (delete place,
// remove image, etc). Kept dependency-free.
const ConfirmDialog = ({ open, title = "Are you sure?", description, onConfirm, onCancel, confirmLabel = "Delete" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card w-full max-w-sm p-6">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
