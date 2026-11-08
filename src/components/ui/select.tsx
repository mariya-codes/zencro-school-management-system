import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircleIcon, ChevronDownIcon } from './icons';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  requiredIndicator?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options = [],
      placeholder,
      requiredIndicator,
      id,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold"
            style={{ color: 'var(--zc-text)' }}
          >
            {label}
            {requiredIndicator && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'block w-full appearance-none rounded-lg bg-white px-3 py-2 pr-9 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--zc-primary)]/20 disabled:cursor-not-allowed disabled:bg-[var(--zc-bg)] disabled:text-[var(--zc-text-muted)] cursor-pointer',
              error && 'border-[var(--zc-danger)]',
              className
            )}
            style={{
              border: `1px solid ${error ? 'var(--zc-danger)' : 'var(--zc-border)'}`,
              color: 'var(--zc-text)',
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.length > 0
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3" style={{ color: 'var(--zc-text-muted)' }}>
            <ChevronDownIcon size={15} />
          </div>
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

Select.displayName = 'Select';
