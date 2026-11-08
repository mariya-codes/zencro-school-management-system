'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircleIcon, AlertCircleIcon, InfoIcon, XIcon } from './icons';

export type ToastType = 'success' | 'error' | 'destructive' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4000) => {
      const id = 'toast_' + Math.random().toString(36).substr(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => showToast('success', title, message), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast('error', title, message), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast('info', title, message), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast('warning', title, message), [showToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        success,
        error,
        info,
        warning,
      }}
    >
      {children}

      {/* Floating Toasts Viewport */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const typeIcons = {
            success: <CheckCircleIcon className="text-emerald-600 shrink-0" size={20} />,
            error: <AlertCircleIcon className="text-rose-600 shrink-0" size={20} />,
            destructive: <AlertCircleIcon className="text-rose-600 shrink-0" size={20} />,
            warning: <AlertCircleIcon className="text-amber-600 shrink-0" size={20} />,
            info: <InfoIcon className="text-sky-600 shrink-0" size={20} />,
          };

          const typeStyles = {
            success: 'border-emerald-200 bg-white',
            error: 'border-rose-200 bg-white',
            destructive: 'border-rose-200 bg-white',
            warning: 'border-amber-200 bg-white',
            info: 'border-sky-200 bg-white',
          };

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border transition-all animate-in slide-in-from-bottom-3 duration-200',
                typeStyles[toast.type]
              )}
            >
              {typeIcons[toast.type]}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900">{toast.title}</h4>
                {toast.message && (
                  <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors cursor-pointer"
              >
                <XIcon size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function Toast({
  title,
  message,
  type = 'info',
  variant,
  onClose,
  className,
}: {
  title: string;
  message?: string;
  type?: ToastType;
  variant?: ToastType;
  onClose?: () => void;
  className?: string;
}) {
  const effectiveType = variant || type;
  const typeIcons = {
    success: <CheckCircleIcon className="text-emerald-600 shrink-0" size={18} />,
    error: <AlertCircleIcon className="text-rose-600 shrink-0" size={18} />,
    destructive: <AlertCircleIcon className="text-rose-600 shrink-0" size={18} />,
    warning: <AlertCircleIcon className="text-amber-600 shrink-0" size={18} />,
    info: <InfoIcon className="text-sky-600 shrink-0" size={18} />,
  };

  const typeStyles = {
    success: 'border-emerald-200/80 bg-emerald-50/90 text-emerald-900',
    error: 'border-rose-200/80 bg-rose-50/90 text-rose-900',
    destructive: 'border-rose-200/80 bg-rose-50/90 text-rose-900',
    warning: 'border-amber-200/80 bg-amber-50/90 text-amber-900',
    info: 'border-sky-200/80 bg-sky-50/90 text-sky-900',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3.5 rounded-xl border shadow-sm transition-all',
        typeStyles[effectiveType],
        className
      )}
    >
      {typeIcons[effectiveType]}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{title}</h4>
        {message && (
          <p className="mt-0.5 text-xs opacity-90 leading-relaxed">
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="opacity-60 hover:opacity-100 rounded-lg p-0.5 transition-opacity cursor-pointer"
        >
          <XIcon size={14} />
        </button>
      )}
    </div>
  );
}
