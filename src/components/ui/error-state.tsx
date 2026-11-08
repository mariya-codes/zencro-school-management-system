import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { AlertCircleIcon, RefreshCwIcon } from './icons';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  code?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the service.',
  code,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-rose-200 bg-rose-50/50',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-3">
        <AlertCircleIcon size={24} />
      </div>

      <h3 className="text-base font-bold text-rose-900 mb-1">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-rose-700/90 max-w-md mb-2">
        {message}
      </p>

      {code && (
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-200/80 text-rose-800 mb-4">
          Error Code: {code}
        </span>
      )}

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCwIcon size={14} />}
          className="bg-white hover:bg-rose-50 border-rose-300 text-rose-700"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
