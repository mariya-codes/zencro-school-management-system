'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Student360 } from '@/types/student';
import { StudentService } from '@/lib/services/student-service';
import { StudentProfileHeader } from '@/components/students/student-profile-header';
import { StudentOverview } from '@/components/students/student-overview';
import { StudentInfo } from '@/components/students/student-info';
import { GuardianList } from '@/components/students/guardian-list';
import { AttendanceSummary } from '@/components/students/attendance-summary';
import { FeeSummary } from '@/components/students/fee-summary';
import { AcademicSummary } from '@/components/students/academic-summary';
import { FormsSummary } from '@/components/students/forms-summary';
import { PtmSummary } from '@/components/students/ptm-summary';
import { StudentActivityTimeline } from '@/components/students/student-activity-timeline';
import { Tabs, TabItem } from '@/components/ui/tabs';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import {
  LayoutDashboardIcon,
  UserIcon,
  UsersIcon,
  UserCheckIcon,
  CreditCardIcon,
  AwardIcon,
  ClipboardListIcon,
  CalendarIcon,
  ActivityIcon,
} from '@/components/ui/icons';

function Student360Content({ studentId }: { studentId: string }) {
  const router = useRouter();

  const [student360, setStudent360] = useState<Student360 | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<{ code: string; message: string } | null>(null);

  useEffect(() => {
    async function loadStudent360Data() {
      if (!studentId) return;
      setIsLoading(true);
      setErrorDetails(null);
      try {
        const data = await StudentService.getStudent360(studentId);
        setStudent360(data);
      } catch (err: any) {
        setErrorDetails({
          code: err.code || 'INTERNAL_ERROR',
          message: err.message || 'Unable to retrieve student profile.',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadStudent360Data();
  }, [studentId]);

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboardIcon size={16} />,
    },
    {
      id: 'info',
      label: 'Student Info',
      icon: <UserIcon size={16} />,
    },
    {
      id: 'guardian',
      label: 'Guardians',
      icon: <UsersIcon size={16} />,
      count: student360?.guardians?.length || 0,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <UserCheckIcon size={16} />,
    },
    {
      id: 'fees',
      label: 'Fees',
      icon: <CreditCardIcon size={16} />,
    },
    {
      id: 'results',
      label: 'Results & Academics',
      icon: <AwardIcon size={16} />,
    },
    {
      id: 'forms',
      label: 'Forms',
      icon: <ClipboardListIcon size={16} />,
      count: student360?.forms?.length || 0,
    },
    {
      id: 'ptm',
      label: 'PTM',
      icon: <CalendarIcon size={16} />,
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: <ActivityIcon size={16} />,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Profile Header Skeleton */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 animate-pulse">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-slate-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-48 rounded bg-slate-200" />
              <div className="h-3 w-64 rounded bg-slate-100" />
            </div>
          </div>
        </div>

        <LoadingState
          title="Loading Student 360 Workspace..."
          message="Fetching consolidated academics, attendance, fees, and guardian records."
        />
      </div>
    );
  }

  if (errorDetails || !student360) {
    return (
      <div className="space-y-6">
        <ErrorState
          title={errorDetails?.code === 'NOT_FOUND' ? 'Student Not Found' : 'Unable to Load Student 360'}
          message={
            errorDetails?.message ||
            'The requested student record may have been removed or you may not have sufficient access privileges.'
          }
          code={errorDetails?.code === 'NOT_FOUND' ? 'NOT_FOUND' : 'INTERNAL_ERROR'}
          onRetry={() => router.push('/students')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <StudentProfileHeader student={student360.student} />

      {/* Workspace Tabs Navigation */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <StudentOverview data={student360} onTabChange={setActiveTab} />
        )}

        {activeTab === 'info' && (
          <StudentInfo student={student360.student} />
        )}

        {activeTab === 'guardian' && (
          <GuardianList
            guardians={student360.guardians}
            studentId={student360.student.id}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceSummary data={student360.attendance_summary} />
        )}

        {activeTab === 'fees' && (
          <FeeSummary data={student360.fee_summary} />
        )}

        {activeTab === 'results' && (
          <AcademicSummary data={student360.academic_summary} />
        )}

        {activeTab === 'forms' && (
          <FormsSummary forms={student360.forms} />
        )}

        {activeTab === 'ptm' && (
          <PtmSummary data={student360.ptm} />
        )}

        {activeTab === 'activity' && (
          <StudentActivityTimeline activities={student360.recent_activity} />
        )}
      </div>
    </div>
  );
}

function Student360ParamResolver({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  return <Student360Content studentId={resolved.id} />;
}

export default function Student360Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<LoadingState title="Loading Student Profile..." />}>
      <Student360ParamResolver params={params} />
    </Suspense>
  );
}
