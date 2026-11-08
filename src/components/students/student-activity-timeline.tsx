'use client';

import React from 'react';
import { StudentActivity } from '@/types/student';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  UserCheckIcon,
  AwardIcon,
  CreditCardIcon,
  UsersIcon,
  ClipboardListIcon,
  ClockIcon,
  ActivityIcon,
} from '@/components/ui/icons';

export interface StudentActivityTimelineProps {
  activities: StudentActivity[];
}

export function StudentActivityTimeline({ activities }: StudentActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <UserCheckIcon size={16} className="text-emerald-600" />;
      case 'academic':
        return <AwardIcon size={16} className="text-indigo-600" />;
      case 'fee':
        return <CreditCardIcon size={16} className="text-amber-600" />;
      case 'ptm':
        return <UsersIcon size={16} className="text-purple-600" />;
      case 'form':
        return <ClipboardListIcon size={16} className="text-sky-600" />;
      default:
        return <ActivityIcon size={16} className="text-slate-600" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'attendance':
        return <Badge variant="success" size="sm">Attendance</Badge>;
      case 'academic':
        return <Badge variant="purple" size="sm">Academics</Badge>;
      case 'fee':
        return <Badge variant="warning" size="sm">Finance</Badge>;
      case 'ptm':
        return <Badge variant="info" size="sm">PTM</Badge>;
      case 'form':
        return <Badge variant="orange" size="sm">Forms</Badge>;
      default:
        return <Badge variant="default" size="sm">System</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Student Activity Timeline ({activities.length})
        </h3>
        <p className="text-xs text-slate-500">
          Complete audit trail of attendance, examinations, fee collections, and parent interactions.
        </p>
      </div>

      {activities.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            title="No activity history"
            description="There are no activity timeline records logged for this student yet."
          />
        </Card>
      ) : (
        <Card className="p-6">
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-6 sm:-left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-4 ring-slate-100 border border-slate-300 shrink-0">
                  {getActivityIcon(act.type)}
                </div>

                {/* Timeline content box */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60 space-y-1.5 transition-all hover:border-slate-300">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getActivityBadge(act.type)}
                      <h4 className="text-xs font-bold text-slate-900">
                        {act.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <ClockIcon size={12} />
                      <span>
                        {act.date} {act.time ? `• ${act.time}` : ''}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {act.description}
                  </p>

                  {act.actor && (
                    <div className="pt-1 text-[10px] text-slate-400 font-medium">
                      Triggered by: <span className="text-slate-600">{act.actor}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
