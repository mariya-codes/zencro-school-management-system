'use client';

import React from 'react';
import { PtmSummary as PtmSummaryType } from '@/types/student';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  MessageSquareIcon,
  InfoIcon,
} from '@/components/ui/icons';

export interface PtmSummaryProps {
  data: PtmSummaryType;
}

export function PtmSummary({ data }: PtmSummaryProps) {
  const { upcoming, history } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Upcoming PTM Meeting */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          Upcoming Parent-Teacher Conference
        </h3>

        {upcoming ? (
          <Card className="border-l-4 border-l-indigo-600 overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="purple" size="sm" dot>
                      Confirmed Slot
                    </Badge>
                    <span className="text-xs text-slate-500">
                      Mode: {upcoming.mode}
                    </span>
                  </div>
                  <CardTitle className="text-base mt-1.5">{upcoming.title}</CardTitle>
                </div>

                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200/60 text-xs text-indigo-700 font-bold shrink-0">
                  <CalendarIcon size={14} />
                  <span>{upcoming.date} • {upcoming.time}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <UsersIcon size={16} className="text-slate-400 shrink-0" />
                <span className="font-semibold">
                  Teacher: {upcoming.teacher_name}
                </span>
                {upcoming.teacher_designation && (
                  <span className="text-slate-500">
                    ({upcoming.teacher_designation})
                  </span>
                )}
              </div>

              {upcoming.agenda && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="font-bold text-slate-800 block">
                    Meeting Agenda / Topics of Discussion:
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {upcoming.agenda}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="p-6">
            <EmptyState
              title="No upcoming PTM scheduled"
              description="There is no active conference booked for this student at the moment."
            />
          </Card>
        )}
      </div>

      {/* Past PTM History */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-slate-900">
          Previous PTM History ({history.length})
        </h3>

        {history.length === 0 ? (
          <Card className="p-6 text-center text-xs text-slate-400 italic">
            No past conference logs recorded.
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((ptm) => (
              <Card key={ptm.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="sm">
                        Completed
                      </Badge>
                      <span className="text-xs font-semibold text-slate-700">
                        {ptm.title}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Conducted by <span className="font-bold text-slate-700">{ptm.teacher_name}</span> on {ptm.date} ({ptm.mode})
                    </p>

                    {ptm.feedback_notes && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
                        <span className="font-bold text-slate-800 block mb-0.5">
                          Faculty Minutes & Feedback:
                        </span>
                        {ptm.feedback_notes}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Scope Notice */}
      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-xs text-indigo-900">
        <InfoIcon size={16} className="text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Day 2 Scope Notice:</span> Read-only PTM conference summary. Teacher slot management, parent booking system, and video conferencing will be built in the dedicated PTM module.
        </p>
      </div>
    </div>
  );
}
