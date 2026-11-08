import React from 'react';
import { cn, getInitials } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
}

export function Avatar({
  name = 'User',
  src,
  size = 'md',
  status,
  className,
  ...props
}: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm font-semibold',
    lg: 'h-12 w-12 text-base font-bold',
    xl: 'h-16 w-16 text-xl font-bold',
  };

  const statusColors = {
    online: 'bg-emerald-500 ring-white',
    offline: 'bg-slate-400 ring-white',
    busy: 'bg-rose-500 ring-white',
  };

  const statusSizes = {
    sm: 'h-2 w-2 ring-1',
    md: 'h-2.5 w-2.5 ring-2',
    lg: 'h-3 w-3 ring-2',
    xl: 'h-4 w-4 ring-2',
  };

  const initials = getInitials(name);

  // Derive stable pleasant background hue from name
  const hues = [
    'bg-indigo-600 text-white',
    'bg-violet-600 text-white',
    'bg-blue-600 text-white',
    'bg-emerald-600 text-white',
    'bg-amber-600 text-white',
    'bg-rose-600 text-white',
  ];
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedHue = hues[charCodeSum % hues.length];

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl shadow-xs overflow-hidden select-none border border-slate-200',
          sizeClasses[size],
          selectedHue,
          className
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
