import React from "react";
import { X } from "lucide-react";

const Modal = ({ open, title, onClose, children, wide }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 py-6 sm:p-4 sm:py-10">
      <div className={`card w-full ${wide ? "max-w-3xl" : "max-w-lg"} p-4 sm:p-6`}>
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
          <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
          <button onClick={onClose} className="shrink-0 rounded p-1.5 text-muted hover:bg-zinc-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
