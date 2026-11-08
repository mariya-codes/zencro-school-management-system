import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRightIcon } from './icons';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  description,
  icon,
  breadcrumbs,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  const displaySubtitle = subtitle || description;
  return (
    <div
      className={cn(
        'flex flex-col gap-3 pb-4 md:flex-row md:items-center md:justify-between',
        className
      )}
      style={{ borderBottom: '1px solid var(--zc-border)' }}
    >
      <div className="space-y-0.5">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 text-xs mb-1" style={{ color: 'var(--zc-text-secondary)' }}>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRightIcon size={12} style={{ color: 'var(--zc-text-muted)' }} />}
                {item.href ? (
                  <a
                    href={item.href}
                    className="hover:underline transition-colors"
                    style={{ color: 'var(--zc-primary)' }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="font-semibold" style={{ color: 'var(--zc-text)' }}>
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2.5 flex-wrap">
          {icon && <span style={{ color: 'var(--zc-primary)' }} className="shrink-0">{icon}</span>}
          <h1 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--zc-navy)' }}>
            {title}
          </h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        {displaySubtitle && (
          <p className="text-xs max-w-2xl leading-relaxed" style={{ color: 'var(--zc-text-secondary)' }}>
            {displaySubtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}
