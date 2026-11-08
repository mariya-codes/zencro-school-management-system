'use client';

import React from 'react';
import { OfflineSyncState } from '@/types/attendance';
import { WifiIcon, WifiOffIcon, RefreshCwIcon, CheckCircleIcon, AlertCircleIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';

export interface OfflineSyncBannerProps {
  syncState: OfflineSyncState;
  pendingCount: number;
  onRetrySync: () => void;
  isSyncing?: boolean;
}

export function OfflineSyncBanner({
  syncState,
  pendingCount,
  onRetrySync,
  isSyncing = false,
}: OfflineSyncBannerProps) {
  if (syncState === 'online' && pendingCount === 0) {
    return (
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <WifiIcon size={14} className="text-emerald-600" />
          <span>System Online • Real-time cloud sync active</span>
        </div>
        <span className="text-emerald-700/80 text-[11px]">All records synchronized</span>
      </div>
    );
  }

  if (syncState === 'offline') {
    return (
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-sm shadow-xs">
        <div className="flex items-center gap-2.5">
          <WifiOffIcon size={18} className="text-amber-600 shrink-0" />
          <div>
            <span className="font-semibold">Offline Mode Active</span>
            <span className="text-amber-800 text-xs ml-2">
              Attendance can be taken freely and is saved securely in local storage.
            </span>
          </div>
        </div>
        {pendingCount > 0 && (
          <span className="px-2 py-0.5 rounded-md bg-amber-200/80 font-bold text-xs text-amber-900">
            {pendingCount} offline {pendingCount === 1 ? 'batch' : 'batches'} pending sync
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-sky-50 text-sky-900 border border-sky-300 text-sm shadow-xs">
      <div className="flex items-center gap-2.5">
        {syncState === 'syncing' || isSyncing ? (
          <RefreshCwIcon size={18} className="text-sky-600 animate-spin shrink-0" />
        ) : syncState === 'synced' ? (
          <CheckCircleIcon size={18} className="text-emerald-600 shrink-0" />
        ) : (
          <AlertCircleIcon size={18} className="text-amber-600 shrink-0" />
        )}
        <div>
          <span className="font-semibold">
            {syncState === 'syncing' || isSyncing
              ? 'Synchronizing Offline Attendance...'
              : `${pendingCount} Local ${pendingCount === 1 ? 'Batch' : 'Batches'} Pending Sync`}
          </span>
          <span className="text-sky-800 text-xs ml-2">
            Auto-syncs once connection stabilizes or tap retry.
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="h-8 bg-white border-sky-300 text-sky-800 hover:bg-sky-100"
        onClick={onRetrySync}
        disabled={isSyncing}
      >
        <RefreshCwIcon size={14} className={isSyncing ? 'animate-spin mr-1' : 'mr-1'} />
        {isSyncing ? 'Syncing...' : 'Sync Now'}
      </Button>
    </div>
  );
}
