import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "success", title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4"
        aria-live="polite"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded shadow-lg border text-sm transition-all duration-300 transform translate-y-0 ${
              toast.type === "success"
                ? "bg-[#2D2A26] text-[#FAF9F6] border-[#8B6F47]"
                : toast.type === "error"
                ? "bg-[#C02B0A] text-white border-red-800"
                : "bg-[#4F2607] text-[#FAF9F6] border-[#D4B896]"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#D4B896] shrink-0 mt-0.5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-[#D4B896] shrink-0 mt-0.5" />}

            <div className="flex-1">
              {toast.title && <p className="font-semibold text-xs uppercase tracking-wider mb-0.5">{toast.title}</p>}
              <p className="leading-relaxed font-light">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-75 text-stone-300 transition"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
