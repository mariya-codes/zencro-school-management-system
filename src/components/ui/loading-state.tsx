import React from 'react';
import { cn } from '@/lib/utils';
import { RefreshCwIcon } from './icons';

export interface LoadingStateProps {
  title?: string;
  message?: string;
  className?: string;
}

export function LoadingState({
  title = 'Loading data...',
  message = 'Please wait while we retrieve the latest records.',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-200/80 bg-white/60',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 animate-spin">
        <RefreshCwIcon size={22} />
      </div>
      <h3 className="text-sm font-bold text-slate-800 mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 max-w-sm">
        {message}
      </p>
    </div>
  );
}
