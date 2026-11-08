'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { XIcon } from './icons';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white p-6 shadow-2xl transition-all z-10 my-8',
          sizeClasses[size]
        )}
        style={{ border: '1px solid var(--zc-border)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4" style={{ borderBottom: '1px solid var(--zc-border-light)' }}>
          <div>
            {title && (
              <h2 className="text-xl font-bold" style={{ color: 'var(--zc-text)' }}>
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm" style={{ color: 'var(--zc-text-secondary)' }}>
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 hover:bg-slate-100 transition-colors ml-4 cursor-pointer"
            style={{ color: 'var(--zc-text-muted)' }}
            aria-label="Close modal"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 max-h-[72vh] overflow-y-auto pr-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--zc-border-light)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
