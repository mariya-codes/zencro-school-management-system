import React from 'react';
import { cn } from '@/lib/utils';
import { RefreshCwIcon } from './icons';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'subtle';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer';

    const variants = {
      primary:
        'bg-[var(--zc-primary)] hover:bg-[var(--zc-primary-dark)] text-white focus-visible:ring-blue-400 border border-blue-700/20 shadow-sm',
      secondary:
        'bg-[var(--zc-navy)] hover:bg-[#0a3562] text-white shadow-sm focus-visible:ring-slate-400',
      outline:
        'border text-[var(--zc-text)] hover:bg-[var(--zc-bg)] focus-visible:ring-slate-300 bg-white',
      ghost:
        'text-[var(--zc-text-secondary)] hover:text-[var(--zc-text)] hover:bg-[var(--zc-bg)] focus-visible:ring-slate-300',
      danger:
        'bg-[var(--zc-danger)] hover:bg-red-600 text-white shadow-sm focus-visible:ring-red-400 border border-red-600/20',
      success:
        'bg-[var(--zc-success)] hover:bg-green-600 text-white shadow-sm focus-visible:ring-green-400 border border-green-600/20',
      subtle:
        'bg-[var(--zc-primary-light)] hover:bg-blue-100 text-[var(--zc-primary)] focus-visible:ring-blue-300',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5 h-8',
      md: 'text-sm px-3.5 py-2 rounded-lg gap-2 h-9',
      lg: 'text-sm px-5 py-2.5 rounded-lg gap-2.5 h-11',
      icon: 'h-9 w-9 rounded-lg p-0 flex items-center justify-center',
    };

    /* outline variant border color override */
    const style: React.CSSProperties = variant === 'outline' ? { borderColor: 'var(--zc-border)' } : {};

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={style}
        {...props}
      >
        {isLoading ? (
          <RefreshCwIcon className="animate-spin text-current" size={size === 'sm' ? 14 : 16} />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
