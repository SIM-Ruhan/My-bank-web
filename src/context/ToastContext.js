"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  info:    <Info size={16} className="text-indigo-400" />,
  success: <CheckCircle2 size={16} className="text-emerald-400" />,
  warning: <AlertCircle size={16} className="text-amber-400" />,
  error:   <XCircle size={16} className="text-rose-400" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const showToast = useCallback((message, type = "info", duration = 3200) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
    return id;
  }, []);

  function dismiss(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            className="toast-enter pointer-events-auto flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl cursor-pointer max-w-xs border border-white/10"
          >
            {ICONS[t.type] || ICONS.info}
            <p className="text-sm font-semibold leading-snug">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
