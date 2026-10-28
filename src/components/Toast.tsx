import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg text-sm transition-all duration-200 ${
            toast.type === 'success'
              ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/60 text-slate-900 dark:text-slate-100'
              : toast.type === 'error'
              ? 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800/60 text-slate-900 dark:text-slate-100'
              : 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800/60 text-slate-900 dark:text-slate-100'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />}
          <p className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
