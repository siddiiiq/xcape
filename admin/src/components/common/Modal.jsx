import React from "react";
import { X } from "lucide-react";

const Modal = ({ open, title, onClose, children, wide }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div className={`card w-full ${wide ? "max-w-3xl" : "max-w-lg"} p-6`}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded p-1 text-muted hover:bg-zinc-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
