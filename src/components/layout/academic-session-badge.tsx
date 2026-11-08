'use client';

import React, { useState, useEffect } from 'react';
import { AcademicYearService } from '@/lib/services/academic-year-service';
import { AcademicYear } from '@/types/academics';
import { CalendarIcon, ChevronDownIcon, CheckIcon } from '@/components/ui/icons';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/toast';

export function AcademicSessionBadge() {
  const [currentSession, setCurrentSession] = useState<AcademicYear | null>(null);
  const [allSessions, setAllSessions] = useState<AcademicYear[]>([]);
  const { success } = useToast();

  useEffect(() => {
    async function loadSessions() {
      const all = await AcademicYearService.getAll();
      setAllSessions(all);
      const cur = all.find((s) => s.isCurrent) || all[0];
      setCurrentSession(cur);
    }
    loadSessions();
  }, []);

  const handleSelectSession = async (session: AcademicYear) => {
    if (!session.isCurrent) {
      const updated = await AcademicYearService.setAsCurrent(session.id);
      setCurrentSession(updated);
      const all = await AcademicYearService.getAll();
      setAllSessions(all);
      success('Session Changed', `Active academic year set to ${session.name}`);
    }
  };

  if (!currentSession) {
    return (
      <div className="h-8 w-28 bg-slate-100 animate-pulse rounded-xl" />
    );
  }

  const sessionMenuItems = allSessions.map((session) => ({
    id: session.id,
    label: `${session.name} ${session.isCurrent ? '(Active)' : `(${session.status})`}`,
    icon: session.isCurrent ? (
      <CheckIcon size={14} className="text-emerald-600" />
    ) : (
      <CalendarIcon size={14} className="text-slate-400" />
    ),
    onClick: () => handleSelectSession(session),
  }));

  return (
    <DropdownMenu
      trigger={
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-200/90 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 transition-colors cursor-pointer text-xs font-semibold"
          title="Active Academic Session"
        >
          <CalendarIcon size={14} className="text-emerald-600" />
          <span className="hidden md:inline text-emerald-700 font-medium">Session:</span>
          <span className="font-bold">{currentSession.name}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <ChevronDownIcon size={12} className="text-emerald-600 opacity-70" />
        </button>
      }
      items={sessionMenuItems}
      align="right"
    />
  );
}
