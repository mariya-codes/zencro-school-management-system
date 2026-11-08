import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircleIcon } from './icons';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  requiredIndicator?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, requiredIndicator, id, disabled, rows = 3, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--zc-text)' }}
          >
            {label}
            {requiredIndicator && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={disabled}
          className={cn(
            'block w-full rounded-lg px-3.5 py-2.5 text-sm transition-colors placeholder:text-[var(--zc-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--zc-primary)]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          style={{
            border: `1px solid ${error ? '#ef4444' : 'var(--zc-border)'}`,
            backgroundColor: disabled ? undefined : 'white',
            color: 'var(--zc-text)',
          }}
          {...props}
        />

        {error ? (
          <p className="flex items-center gap-1 text-xs text-rose-600">
            <AlertCircleIcon size={14} className="shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs" style={{ color: 'var(--zc-text-secondary)' }}>{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
