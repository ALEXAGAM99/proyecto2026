import React, { createContext, useContext, useState, useCallback } from "react";
import { X, Info, CheckCircle, AlertTriangle } from "lucide-react";

type ToastType = "primary" | "success" | "warning";

interface ToastData {
  message: string;
  type: ToastType;
  id: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "primary") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { message, type, id }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [],
  );

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-10 right-10 z-[99999] flex flex-col gap-3 min-w-[300px] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-in slide-in-from-right-10 fade-in duration-300"
          >
            {toast.type === "primary" && (
              <div className="px-6 py-5 bg-blue-600 text-white rounded-2xl shadow-2xl min-w-[380px] flex justify-between items-center gap-4 shadow-[0_15px_40px_rgba(37,99,235,.45)]">
                <div className="flex items-center gap-4">
                  <Info size={28} className="shrink-0" />

                  <div className="font-semibold text-sm">{toast.message}</div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-white hover:opacity-70 transition"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {toast.type === "success" && (
              <div className="px-6 py-5 bg-emerald-600 text-white rounded-2xl shadow-2xl min-w-[380px] flex justify-between items-center gap-4 shadow-[0_15px_40px_rgba(16,185,129,.45)]">
                <div className="flex items-center gap-4">
                  <CheckCircle size={28} className="shrink-0" />

                  <div className="font-semibold text-sm">{toast.message}</div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-white hover:opacity-70 transition"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {toast.type === "warning" && (
              <div className="px-6 py-5 bg-yellow-600 text-white rounded-2xl shadow-2xl min-w-[380px] flex justify-between items-center gap-4 shadow-[0_15px_40px_rgba(245,158,11,.45)]">
                <div className="flex items-center gap-4">
                  <AlertTriangle size={28} className="shrink-0" />

                  <div className="font-semibold text-sm">{toast.message}</div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-white hover:opacity-70 transition"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
