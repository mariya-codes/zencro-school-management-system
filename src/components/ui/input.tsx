import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircleIcon } from './icons';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  requiredIndicator?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      requiredIndicator,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold"
            style={{ color: 'var(--zc-text)' }}
          >
            {label}
            {requiredIndicator && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--zc-text-muted)' }}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'block w-full rounded-lg bg-white px-3 py-2 text-sm transition-colors placeholder:text-[var(--zc-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--zc-primary)]/20 disabled:cursor-not-allowed disabled:bg-[var(--zc-bg)] disabled:text-[var(--zc-text-muted)]',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-[var(--zc-danger)] focus:ring-red-200',
              className
            )}
            style={{
              border: `1px solid ${error ? 'var(--zc-danger)' : 'var(--zc-border)'}`,
              color: 'var(--zc-text)',
            }}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center" style={{ color: 'var(--zc-text-muted)' }}>
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--zc-danger)' }}>
            <AlertCircleIcon size={13} className="shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs" style={{ color: 'var(--zc-text-muted)' }}>{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
