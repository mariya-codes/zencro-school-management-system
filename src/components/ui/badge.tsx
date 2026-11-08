import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'destructive'
    | 'info'
    | 'purple'
    | 'orange'
    | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default:    'bg-[var(--zc-bg)] text-[var(--zc-text-secondary)] border-[var(--zc-border)]',
    success:    'bg-[var(--zc-success-bg)] text-[var(--zc-success)] border-green-200',
    warning:    'bg-[var(--zc-warning-bg)] text-[#B45309] border-amber-200',
    danger:     'bg-[var(--zc-danger-bg)] text-[var(--zc-danger)] border-red-200',
    destructive:'bg-[var(--zc-danger-bg)] text-[var(--zc-danger)] border-red-200',
    info:       'bg-[var(--zc-info-bg)] text-[var(--zc-info)] border-blue-200',
    purple:     'bg-[#F3E8FF] text-[#7C3AED] border-purple-200',
    orange:     'bg-[#FFF7ED] text-[#C2410C] border-orange-200',
    outline:    'bg-transparent text-[var(--zc-text-secondary)] border-[var(--zc-border)]',
  };

  const dotColors = {
    default:     'bg-[var(--zc-text-muted)]',
    success:     'bg-[var(--zc-success)]',
    warning:     'bg-[var(--zc-warning)]',
    danger:      'bg-[var(--zc-danger)]',
    destructive: 'bg-[var(--zc-danger)]',
    info:        'bg-[var(--zc-info)]',
    purple:      'bg-[#7C3AED]',
    orange:      'bg-[#EA580C]',
    outline:     'bg-[var(--zc-text-muted)]',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 font-semibold gap-1 rounded',
    md: 'text-[11px] px-2 py-0.5 font-semibold gap-1.5 rounded-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
}
