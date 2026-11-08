'use client';

import React from 'react';
import Link from 'next/link';
import { Student360 } from '@/types/student';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  UserCheckIcon,
  CreditCardIcon,
  AwardIcon,
  ShieldIcon,
  UsersIcon,
  CalendarIcon,
  ArrowRightIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  BuildingIcon,
  ActivityIcon,
} from '@/components/ui/icons';

export interface StudentOverviewProps {
  data: Student360;
  onTabChange: (tabId: string) => void;
}

export function StudentOverview({ data, onTabChange }: StudentOverviewProps) {
  const { student, guardians, attendance_summary, fee_summary, academic_summary, ptm, recent_activity } = data;
  const primaryGuardian = guardians.find((g) => g.is_primary) || guardians[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Attendance Card */}
        <StatCard
          title="Attendance"
          value={`${attendance_summary.percentage}%`}
          icon={<UserCheckIcon size={24} />}
          trend={{
            value: `${attendance_summary.present_days} / ${attendance_summary.total_working_days} Days`,
            isPositive: attendance_summary.percentage >= 75,
          }}
          subtitle={`${attendance_summary.absent_days} Absent • ${attendance_summary.late_days} Late`}
          accentColor={attendance_summary.percentage >= 75 ? 'emerald' : 'rose'}
        />

        {/* Fees Card */}
        <StatCard
          title="Outstanding Fees"
          value={`₹${fee_summary.outstanding_fee.toLocaleString()}`}
          icon={<CreditCardIcon size={24} />}
          trend={{
            value: `₹${fee_summary.paid_fee.toLocaleString()} Paid`,
            isPositive: fee_summary.outstanding_fee === 0,
          }}
          subtitle={fee_summary.next_due_date ? `Due ${fee_summary.next_due_date}` : 'All dues settled'}
          accentColor={fee_summary.outstanding_fee > 0 ? 'amber' : 'emerald'}
        />

        {/* Academic Card */}
        <StatCard
          title="Academic Score"
          value={`${academic_summary.overall_percentage}%`}
          icon={<AwardIcon size={24} />}
          trend={{
            value: `Grade ${academic_summary.grade}`,
            isPositive: true,
          }}
          subtitle={academic_summary.rank || 'Latest Assessment'}
          accentColor="indigo"
        />

        {/* Status Card */}
        <StatCard
          title="Enrollment Status"
          value={student.status.toUpperCase()}
          icon={<ShieldIcon size={24} />}
          subtitle={`${student.class_name || 'Class 10'} • ${student.section_name || 'Section A'}`}
          accentColor="purple"
        />
      </div>

      {/* Upcoming PTM Banner if scheduled */}
      {ptm?.upcoming && (
        <Card className="p-5 border-l-4 border-l-indigo-600">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 shrink-0">
                <CalendarIcon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="purple" size="sm">
                    Upcoming PTM Conference
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">
                    {ptm.upcoming.date} • {ptm.upcoming.time}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {ptm.upcoming.title} with {ptm.upcoming.teacher_name} ({ptm.upcoming.mode})
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {ptm.upcoming.agenda}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onTabChange('ptm')}
              className="text-xs shrink-0"
              rightIcon={<ArrowRightIcon size={14} />}
            >
              View PTM Details
            </Button>
          </div>
        </Card>
      )}

      {/* Two-Column Grid: Academic Performance + Guardian & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Academic Summary & Subject Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <CardTitle className="text-base">{academic_summary.latest_exam_name}</CardTitle>
                <CardDescription>
                  Recent examination report card and subject marks distribution.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange('results')}
                rightIcon={<ArrowRightIcon size={14} />}
              >
                All Results
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {/* Subject table mini-list */}
                <div className="divide-y divide-slate-100">
                  {academic_summary.subjects.map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 text-xs">
                      <div className="space-y-0.5 min-w-0 pr-4">
                        <p className="font-bold text-slate-800 truncate">
                          {sub.subject_name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {sub.subject_code} • {sub.remarks || 'Standard curriculum mastery'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-bold text-slate-900">
                          {sub.obtained_marks} / {sub.max_marks}
                        </span>
                        <Badge
                          variant={
                            sub.grade.startsWith('A')
                              ? 'success'
                              : sub.grade.startsWith('B')
                              ? 'info'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {sub.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primary Guardian Summary */}
            <Card className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <UsersIcon size={16} className="text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Primary Guardian
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => onTabChange('guardian')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                >
                  View All ({guardians.length})
                </button>
              </div>

              {primaryGuardian ? (
                <div className="mt-4 space-y-2 text-xs">
                  <p className="text-sm font-bold text-slate-900">
                    {primaryGuardian.name}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      ({primaryGuardian.relationship})
                    </span>
                  </p>
                  {primaryGuardian.occupation && (
                    <p className="text-slate-500">
                      {primaryGuardian.occupation}
                    </p>
                  )}
                  <div className="pt-2 space-y-1 text-slate-600">
                    <div className="flex items-center gap-2">
                      <PhoneIcon size={12} className="text-slate-400" />
                      <span className="font-mono">{primaryGuardian.phone}</span>
                    </div>
                    {primaryGuardian.email && (
                      <div className="flex items-center gap-2">
                        <MailIcon size={12} className="text-slate-400" />
                        <span className="truncate">{primaryGuardian.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-xs text-slate-400 italic">No guardian recorded.</p>
              )}
            </Card>

            {/* Attendance & Fee Snapshot */}
            <Card className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CreditCardIcon size={16} className="text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Fee Status Snapshot
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => onTabChange('fees')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                >
                  Transactions
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Annual Fee:</span>
                  <span className="font-bold text-slate-900">
                    ₹{fee_summary.total_fee.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Paid:</span>
                  <span className="font-bold text-emerald-600">
                    ₹{fee_summary.paid_fee.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-bold">
                  <span className="text-slate-700">Outstanding:</span>
                  <span className="text-rose-600">
                    ₹{fee_summary.outstanding_fee.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Recent Activity Timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ActivityIcon size={16} className="text-indigo-600" />
                <CardTitle className="text-sm">Recent Activity</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange('activity')}
                className="text-xs h-7 px-2"
              >
                Full Timeline
              </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {recent_activity.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800">
                      {act.title}
                    </p>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">
                      {act.description}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {act.date} {act.time ? `• ${act.time}` : ''} {act.actor ? `(${act.actor})` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
