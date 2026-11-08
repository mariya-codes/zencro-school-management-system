'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'underline',
}: TabsProps) {
  if (variant === 'pills') {
    return (
      <div
        className={cn(
          'inline-flex p-1 rounded-xl gap-1',
          className
        )}
        style={{ backgroundColor: 'var(--zc-primary-50)' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                isActive
                  ? 'bg-white shadow-sm'
                  : 'hover:bg-white/60'
              )}
              style={{
                color: isActive ? 'var(--zc-primary)' : 'var(--zc-text-secondary)',
              }}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                    isActive
                      ? 'text-white'
                      : 'bg-slate-100 text-slate-600'
                  )}
                  style={isActive ? { backgroundColor: 'var(--zc-primary)' } : undefined}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('', className)} style={{ borderBottom: '1px solid var(--zc-border)' }}>
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap',
                isActive
                  ? 'border-[var(--zc-primary)] text-[var(--zc-primary)]'
                  : 'border-transparent hover:border-slate-300'
              )}
              style={!isActive ? { color: 'var(--zc-text-secondary)' } : undefined}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-bold ml-1',
                    isActive
                      ? 'text-white'
                      : 'bg-slate-100 text-slate-600'
                  )}
                  style={isActive ? { backgroundColor: 'var(--zc-primary-light)', color: 'var(--zc-primary)' } : undefined}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
