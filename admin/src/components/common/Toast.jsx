import React, { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className={`fixed inset-x-4 bottom-4 z-[100] flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-sm ${
            toast.type === "error" ? "bg-red-600" : "bg-ink"
          }`}
        >
          {toast.type === "error" ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
