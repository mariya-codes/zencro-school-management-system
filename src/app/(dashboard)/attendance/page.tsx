'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs } from '@/components/ui/tabs';
import { AttendanceRoster } from '@/components/attendance/attendance-roster';
import { AttendanceHistoryView } from '@/components/attendance/attendance-history-view';
import { OfflineSyncBanner } from '@/components/attendance/offline-sync-banner';
import { attendanceService } from '@/lib/services/attendance-service';
import { OfflineSyncState } from '@/types/attendance';
import { UserCheckIcon, CalendarIcon, ClockIcon } from '@/components/ui/icons';

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'roster' | 'history'>('roster');
  const [syncState, setSyncState] = useState<OfflineSyncState>('online');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Monitor online / offline network state and pending queue
  useEffect(() => {
    function updateOnlineStatus() {
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      const queue = attendanceService.getPendingOfflineQueue();
      setPendingCount(queue.length);

      if (!isOnline) {
        setSyncState('offline');
      } else if (queue.length > 0) {
        setSyncState('pending_sync');
      } else {
        setSyncState('online');
      }
    }

    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleRetrySync = async () => {
    setIsSyncing(true);
    setSyncState('syncing');
    try {
      const res = await attendanceService.syncOfflineQueue();
      const queue = attendanceService.getPendingOfflineQueue();
      setPendingCount(queue.length);
      if (queue.length === 0) {
        setSyncState('synced');
        setTimeout(() => setSyncState('online'), 3000);
      } else {
        setSyncState('needs_attention');
      }
    } catch {
      setSyncState('failed');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Attendance & Daily Roster"
        description="Fast teacher-first attendance recording. Students default to PRESENT — easily mark exceptions."
        icon={<UserCheckIcon size={24} className="text-blue-600" />}
      />

      {/* Offline Sync State Notification */}
      <OfflineSyncBanner
        syncState={syncState}
        pendingCount={pendingCount}
        onRetrySync={handleRetrySync}
        isSyncing={isSyncing}
      />

      {/* Tab Switcher */}
      <Tabs
        tabs={[
          {
            id: 'roster',
            label: 'Classroom Roster',
            icon: <UserCheckIcon size={16} />,
          },
          {
            id: 'history',
            label: 'Attendance History',
            icon: <CalendarIcon size={16} />,
          },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as 'roster' | 'history')}
      />

      {/* Tab Content */}
      {activeTab === 'roster' ? (
        <AttendanceRoster
          isOffline={syncState === 'offline'}
          onSyncOffline={() => {
            const queue = attendanceService.getPendingOfflineQueue();
            setPendingCount(queue.length);
            if (queue.length > 0) setSyncState('pending_sync');
          }}
        />
      ) : (
        <AttendanceHistoryView />
      )}
    </div>
  );
}
