import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { PlusIcon, LayersIcon } from './icons';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xs border border-slate-200 text-slate-400 mb-4">
        {icon || <LayersIcon size={28} />}
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} leftIcon={<PlusIcon size={16} />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
