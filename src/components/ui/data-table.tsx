'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Button } from './button';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, ArrowUpDownIcon } from './icons';
import { EmptyState } from './empty-state';

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchKeys?: (keyof T | string)[];
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  filters,
  actions,
  pageSize = 10,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching the search or filter criteria.',
  emptyActionLabel,
  onEmptyAction,
  isLoading = false,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter & Search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter((item) => {
      if (searchKeys.length > 0) {
        return searchKeys.some((key) => {
          const val = item[key as keyof T];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(query);
        });
      }

      return Object.values(item).some((val) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(query);
        }
        return false;
      });
    });
  }, [data, searchQuery, searchKeys]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return sortOrder === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="w-full max-w-sm">
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<SearchIcon size={15} />}
            />
          </div>
          {filters}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl bg-white"
        style={{ border: '1px solid var(--zc-border)', boxShadow: 'var(--zc-shadow-sm)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ color: 'var(--zc-text)' }}>
            <thead
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{
                borderBottom: '1px solid var(--zc-border)',
                backgroundColor: 'var(--zc-bg)',
                color: 'var(--zc-text-secondary)',
              }}
            >
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      'px-4 py-3',
                      col.sortable && 'cursor-pointer select-none hover:bg-blue-50/50',
                      col.className
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <ArrowUpDownIcon
                          size={12}
                          style={{
                            color: sortKey === col.key ? 'var(--zc-primary)' : 'var(--zc-text-muted)',
                            opacity: sortKey === col.key ? 1 : 0.5,
                          }}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center">
                    <div className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--zc-text-secondary)' }}>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--zc-primary)', borderTopColor: 'transparent' }} />
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-8">
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                      actionLabel={emptyActionLabel}
                      onAction={onEmptyAction}
                    />
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={keyExtractor(item)}
                    className="hover:bg-blue-50/30 transition-colors"
                    style={{ borderBottom: '1px solid var(--zc-border-light)' }}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4 py-3 text-sm', col.className)}>
                        {col.accessor ? col.accessor(item) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && sortedData.length > 0 && (
          <div
            className="flex flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row"
            style={{ borderTop: '1px solid var(--zc-border)', backgroundColor: 'var(--zc-bg)' }}
          >
            <div className="text-xs" style={{ color: 'var(--zc-text-secondary)' }}>
              Showing{' '}
              <span className="font-semibold" style={{ color: 'var(--zc-text)' }}>
                {(currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold" style={{ color: 'var(--zc-text)' }}>
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>{' '}
              of{' '}
              <span className="font-semibold" style={{ color: 'var(--zc-text)' }}>
                {sortedData.length}
              </span>{' '}
              results
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                leftIcon={<ChevronLeftIcon size={14} />}
              >
                Previous
              </Button>
              <div className="text-xs font-semibold px-2" style={{ color: 'var(--zc-text-secondary)' }}>
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                rightIcon={<ChevronRightIcon size={14} />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
