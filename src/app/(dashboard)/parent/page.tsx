'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-state';
import { communicationService } from '@/lib/services/communication-service';
import { ParentDashboardResponse, ParentChildSummary } from '@/types/communication';
import {
  UsersIcon,
  UserCheckIcon,
  CreditCardIcon,
  AwardIcon,
  CalendarIcon,
  ClipboardListIcon,
  BellIcon,
  ArrowRightIcon,
  ClockIcon,
} from '@/components/ui/icons';

export default function ParentDashboardPage() {
  const [data, setData] = useState<ParentDashboardResponse | null>(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadParentDashboard() {
      setIsLoading(true);
      try {
        const res = await communicationService.getParentDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load parent dashboard', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadParentDashboard();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="p-8">
        <LoadingState message="Connecting to Parent Portal..." />
      </div>
    );
  }

  const currentChild: ParentChildSummary = data.children[selectedChildIndex] || data.children[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              ZenCro Parent Portal
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1">
              Welcome back, {data.parent_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Live updates, academic evaluations, attendance tracking, and fee balances for your wards.
            </p>
          </div>

          {/* Child Switcher Cards */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 shrink-0">
            {data.children.map((child, idx) => {
              const isSelected = idx === selectedChildIndex;
              return (
                <button
                  key={child.student_id}
                  onClick={() => setSelectedChildIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                    {child.first_name.charAt(0)}
                  </span>
                  <span>{child.first_name} ({child.class_name})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Child Overview Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Attendance Rate</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserCheckIcon size={16} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-700 font-mono mt-3">
            {currentChild.attendance_percentage}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Classroom roll record this term</p>
        </div>

        {/* Fee Status Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Fee Status</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <CreditCardIcon size={16} />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono mt-3">
            {currentChild.unpaid_fee_amount === 0 ? (
              <span className="text-emerald-700">₹0 Due</span>
            ) : (
              <span className="text-rose-700">₹{currentChild.unpaid_fee_amount.toLocaleString('en-IN')}</span>
            )}
          </p>
          <Link
            href={`/fees/students/${currentChild.student_id}`}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-1 inline-flex items-center gap-1"
          >
            View Breakdown & Receipts <ArrowRightIcon size={12} />
          </Link>
        </div>

        {/* Latest Exam Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Latest Assessment</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AwardIcon size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3 truncate">
            {currentChild.latest_result?.grade || 'A1'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {currentChild.latest_result?.percentage}% in {currentChild.latest_result?.exam_name}
          </p>
        </div>

        {/* Pending Action Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">School Forms</span>
            <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <ClipboardListIcon size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {currentChild.pending_forms_count > 0 ? (
              <span className="text-amber-700">{currentChild.pending_forms_count} Pending</span>
            ) : (
              <span className="text-emerald-700">All Done</span>
            )}
          </p>
          <Link
            href="/forms"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-1 inline-flex items-center gap-1"
          >
            Review Forms & Consent <ArrowRightIcon size={12} />
          </Link>
        </div>
      </div>

      {/* Child Specific Academic & PTM Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming PTM Booking Card */}
        <Card className="border-slate-200/90 shadow-xs bg-white">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon size={18} className="text-indigo-600" />
              Parent-Teacher Conference (PTM)
            </CardTitle>
            <Link href="/ptm">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Manage Slots
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-5">
            {currentChild.upcoming_ptm_slot ? (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-extrabold text-[11px] uppercase">
                    Slot Reserved
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    {currentChild.upcoming_ptm_slot.date}
                  </span>
                </div>
                <p className="text-sm font-extrabold text-slate-900">
                  {currentChild.upcoming_ptm_slot.time}
                </p>
                <p className="text-xs text-slate-700">
                  With {currentChild.upcoming_ptm_slot.teacher_name} • {currentChild.upcoming_ptm_slot.mode}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-600">
                  No conference slot currently reserved for {currentChild.first_name}.
                </p>
                <Link href="/ptm">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                    Book Available Slot
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Circulars & School Announcements */}
        <Card className="border-slate-200/90 shadow-xs bg-white">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BellIcon size={18} className="text-indigo-600" />
              Recent School Notices
            </CardTitle>
            <Link href="/communication">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {data.announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{ann.title}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(ann.published_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
