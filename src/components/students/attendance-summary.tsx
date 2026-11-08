'use client';

import React from 'react';
import { AttendanceSummary as AttendanceSummaryType } from '@/types/student';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  UserCheckIcon,
  CalendarIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
} from '@/components/ui/icons';

export interface AttendanceSummaryProps {
  data: AttendanceSummaryType;
}

export function AttendanceSummary({ data }: AttendanceSummaryProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success" size="sm">Present</Badge>;
      case 'absent':
        return <Badge variant="danger" size="sm">Absent</Badge>;
      case 'late':
        return <Badge variant="warning" size="sm">Late Arrival</Badge>;
      case 'half_day':
        return <Badge variant="orange" size="sm">Half Day</Badge>;
      case 'holiday':
        return <Badge variant="default" size="sm">School Holiday</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${data.percentage}%`}
          icon={<UserCheckIcon size={24} />}
          trend={{
            value: data.percentage >= 75 ? 'Above CBSE Criteria (75%)' : 'Short of Criteria',
            isPositive: data.percentage >= 75,
          }}
          subtitle={`${data.total_working_days} Total Working Days`}
          accentColor={data.percentage >= 75 ? 'emerald' : 'rose'}
        />

        <StatCard
          title="Days Present"
          value={data.present_days}
          icon={<CheckCircleIcon size={24} />}
          subtitle="Regular on-time presence"
          accentColor="indigo"
        />

        <StatCard
          title="Days Absent"
          value={data.absent_days}
          icon={<AlertCircleIcon size={24} />}
          subtitle="Medical & Approved Leaves"
          accentColor="rose"
        />

        <StatCard
          title="Late Arrivals"
          value={data.late_days}
          icon={<ClockIcon size={24} />}
          subtitle="Morning gate delay records"
          accentColor="amber"
        />
      </div>

      {/* Progress Bar & Health Status */}
      <Card className="p-6 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="font-bold text-slate-900">
            Attendance Health & CBSE 75% Requirement Indicator
          </div>
          <div className="text-slate-500 font-medium">
            <span className="font-bold text-slate-900">
              {data.present_days}
            </span>{' '}
            / {data.total_working_days} days ({data.percentage}%)
          </div>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              data.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(data.percentage, 100)}%` }}
          />
        </div>
      </Card>

      {/* Recent Attendance Records Log */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Attendance Activity</CardTitle>
            <CardDescription>
              Chronological log of recent gate biometric punches and teacher markups.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-200/80 bg-slate-50/75 font-bold uppercase tracking-wider text-slate-700">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Notes / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recent_records.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      {rec.date}
                    </td>
                    <td className="px-5 py-3">
                      {getStatusBadge(rec.status)}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {rec.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Notice box */}
      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-xs text-indigo-900">
        <InfoIcon size={16} className="text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Day 2 Scope Notice:</span> This is a student-level summary view. Class-wide attendance roll call and batch biometric sync will be managed via the dedicated Attendance module.
        </p>
      </div>
    </div>
  );
}
