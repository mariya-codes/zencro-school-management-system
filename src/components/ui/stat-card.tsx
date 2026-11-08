import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUpIcon, TrendingDownIcon } from './icons';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number | string;
    isPositive: boolean;
    label?: string;
  };
  subtitle?: string;
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple';
  className?: string;
}

const accentMap: Record<string, { iconBg: string; iconColor: string }> = {
  indigo:  { iconBg: 'var(--zc-primary-light)', iconColor: 'var(--zc-primary)' },
  emerald: { iconBg: 'var(--zc-success-bg)',     iconColor: 'var(--zc-success)' },
  amber:   { iconBg: 'var(--zc-warning-bg)',     iconColor: 'var(--zc-warning)' },
  rose:    { iconBg: 'var(--zc-danger-bg)',      iconColor: 'var(--zc-danger)' },
  sky:     { iconBg: 'var(--zc-info-bg)',        iconColor: 'var(--zc-info)' },
  purple:  { iconBg: '#F3E8FF',                  iconColor: '#8B5CF6' },
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  accentColor = 'indigo',
  className,
}: StatCardProps) {
  const theme = accentMap[accentColor] || accentMap.indigo;

  return (
    <div
      className={cn('relative overflow-hidden rounded-xl bg-white p-4 transition-all duration-150 hover:shadow-md', className)}
      style={{ border: '1px solid var(--zc-border)', boxShadow: 'var(--zc-shadow-sm)' }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-medium" style={{ color: 'var(--zc-text-secondary)' }}>
            {title}
          </p>
          <div className="text-xl font-bold tracking-tight" style={{ color: 'var(--zc-navy)' }}>
            {value}
          </div>
        </div>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
          style={{ backgroundColor: theme.iconBg, color: theme.iconColor }}
        >
          {icon}
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 flex items-center gap-2 pt-2 text-xs" style={{ borderTop: '1px solid var(--zc-border-light)' }}>
          {trend && (
            <span
              className="inline-flex items-center gap-1 font-semibold"
              style={{ color: trend.isPositive ? 'var(--zc-success)' : 'var(--zc-danger)' }}
            >
              {trend.isPositive ? <TrendingUpIcon size={13} /> : <TrendingDownIcon size={13} />}
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="truncate" style={{ color: 'var(--zc-text-muted)' }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
