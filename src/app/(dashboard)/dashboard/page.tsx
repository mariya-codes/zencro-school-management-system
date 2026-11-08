'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { ClassService } from '@/lib/services/class-service';
import { SectionService } from '@/lib/services/section-service';
import { AcademicYearService } from '@/lib/services/academic-year-service';
import { dashboardService } from '@/lib/services/dashboard-service';
import { SchoolClass, ClassSection, AcademicYear } from '@/types/academics';
import { TeacherDashboardData } from '@/types/dashboard';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import {
  UsersIcon,
  GraduationCapIcon,
  LayersIcon,
  CalendarIcon,
  PlusIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  UserCheckIcon,
  AwardIcon,
  MessageSquareIcon,
  ClipboardListIcon,
  CreditCardIcon,
  FileTextIcon,
} from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/* ─── Small reusable card wrapper ──────────────────────── */
function ZCard({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white rounded-xl ${className}`}
      style={{ border: '1px solid var(--zc-border)', boxShadow: 'var(--zc-shadow-sm)' }}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── KPI stat card ─────────────────────────────────────── */
function KpiCard({
  icon,
  iconBg,
  iconColor,
  title,
  value,
  sub,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <ZCard className="p-4 flex items-center gap-3.5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium" style={{ color: 'var(--zc-text-secondary)' }}>{title}</p>
        <p className="text-lg font-bold leading-tight" style={{ color: 'var(--zc-navy)' }}>{value}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: 'var(--zc-text-muted)' }}>{sub}</p>}
      </div>
    </ZCard>
  );
}

/* ─── Section header ────────────────────────────────────── */
function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold" style={{ color: 'var(--zc-navy)' }}>{children}</h3>
      {action}
    </div>
  );
}

export default function DashboardPage() {
  const { user, school, role } = useAuth();

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<ClassSection[]>([]);
  const [currentYear, setCurrentYear] = useState<AcademicYear | null>(null);
  const [teacherData, setTeacherData] = useState<TeacherDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [role]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [clsData, secData, yearData, tData] = await Promise.all([
        ClassService.getAll(),
        SectionService.getAll(),
        AcademicYearService.getCurrent(),
        dashboardService.getTeacherDashboard(),
      ]);
      setClasses(clsData);
      setSections(secData);
      setCurrentYear(yearData || null);
      setTeacherData(tData);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const totalEnrolled = classes.reduce((sum, c) => sum + c.totalEnrolled, 0);
  const totalCapacity = classes.reduce((sum, c) => sum + c.totalCapacity, 0);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  /* ─── Priority items ──────────── */
  const priorityItems = [
    { id: 1, title: 'Incomplete student information', severity: 'high' as const, action: 'Review', href: '/students' },
    { id: 2, title: 'Outstanding fee follow-ups', severity: 'high' as const, action: 'Review', href: '/fees' },
    { id: 3, title: 'Attendance records need review', severity: 'medium' as const, action: 'Review', href: '/attendance' },
    { id: 4, title: 'Pending report cards', severity: 'medium' as const, action: 'Complete', href: '/report-cards' },
    { id: 5, title: 'Data import validation issues', severity: 'low' as const, action: 'Review', href: '/import' },
  ];

  /* ─── Quick actions ───────────── */
  const quickActions = [
    { label: 'Add Student', icon: <PlusIcon size={16} />, href: '/students/new', color: '#1677E8' },
    { label: 'Record Payment', icon: <CreditCardIcon size={16} />, href: '/fees', color: '#22C55E' },
    { label: 'Announcement', icon: <MessageSquareIcon size={16} />, href: '/communication', color: '#8B5CF6' },
    { label: 'Schedule PTM', icon: <CalendarIcon size={16} />, href: '/ptm', color: '#F59E0B' },
    { label: 'Import Data', icon: <FileTextIcon size={16} />, href: '/import', color: '#06B6D4' },
    { label: 'Export Data', icon: <LayersIcon size={16} />, href: '/export', color: '#EC4899' },
  ];

  const recentActivities = [
    { id: 1, action: 'Fee payment recorded — Aarav Sharma, Class 5-A', time: '10 mins ago', type: 'fee' },
    { id: 2, action: 'Attendance marked — Class 10-B (32 students)', time: '25 mins ago', type: 'attendance' },
    { id: 3, action: 'New student registered — Priya Patel, Class 8-A', time: '1 hour ago', type: 'student' },
    { id: 4, action: 'Result updated — Class 9 Mid-Term Science', time: '2 hours ago', type: 'exam' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--zc-navy)' }}>Dashboard</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--zc-text-secondary)' }}>Loading...</p>
        </div>
        <LoadingState title="Loading Dashboard..." message="Fetching metrics." />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--zc-navy)' }}>Dashboard</h1>
        </div>
        <ErrorState title="Failed to load dashboard" message={errorMessage} code="INTERNAL_ERROR" onRetry={loadDashboardData} />
      </div>
    );
  }

  /* ═══════════════ TEACHER DASHBOARD ═══════════════ */
  if (role === 'teacher' && teacherData) {
    return (
      <div className="space-y-5">
        {/* Welcome */}
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--zc-navy)' }}>
            Good morning, {teacherData.teacher_name} 👋
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--zc-text-secondary)' }}>
            {school?.name || 'Delhi Public Academy'} • {dateStr}
          </p>
        </div>

        {/* Today&apos;s Tasks */}
        <ZCard className="p-5">
          <SectionTitle>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Today&apos;s Tasks
            </span>
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {teacherData.pending_tasks.map((task) => (
              <div key={task.id} className="p-3 rounded-lg flex flex-col gap-2" style={{ border: '1px solid var(--zc-border)', background: 'var(--zc-bg)' }}>
                <div className="flex items-center justify-between">
                  <Badge variant={task.type === 'attendance' ? 'warning' : 'purple'} size="sm">{task.type.toUpperCase()}</Badge>
                  {task.due_time && <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--zc-warning)' }}>{task.due_time}</span>}
                </div>
                <h4 className="text-xs font-bold" style={{ color: 'var(--zc-text)' }}>{task.title}</h4>
                <p className="text-[11px]" style={{ color: 'var(--zc-text-secondary)' }}>{task.class_name} • {task.section_name}</p>
                <Link href={task.action_href}>
                  <button className="w-full text-[11px] font-semibold py-1.5 rounded-md cursor-pointer" style={{ border: '1px solid var(--zc-border)', color: 'var(--zc-primary)' }}>
                    {task.action_label}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </ZCard>

        {/* My Classes */}
        <SectionTitle>My Classes</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {teacherData.assigned_classes.map((c) => (
            <ZCard key={`${c.class_id}_${c.section_id}`} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GraduationCapIcon size={16} style={{ color: 'var(--zc-primary)' }} />
                  <span className="text-sm font-bold" style={{ color: 'var(--zc-navy)' }}>{c.class_name} - {c.section_name}</span>
                </div>
                {c.attendance_marked_today ? (
                  <Badge variant="success" size="sm">Marked</Badge>
                ) : (
                  <Badge variant="warning" size="sm">Pending</Badge>
                )}
              </div>
              <div className="text-xs space-y-1" style={{ color: 'var(--zc-text-secondary)' }}>
                <div className="flex justify-between"><span>Subject:</span><span className="font-semibold" style={{ color: 'var(--zc-text)' }}>{c.subject}</span></div>
                <div className="flex justify-between"><span>Students:</span><span className="font-bold" style={{ color: 'var(--zc-text)' }}>{c.student_count}</span></div>
              </div>
              <div className="flex gap-2 mt-3">
                <Link href={`/attendance?class_id=${c.class_id}&section_id=${c.section_id}`} className="flex-1">
                  <button className="w-full text-[11px] font-semibold py-1.5 rounded-md cursor-pointer" style={{ border: '1px solid var(--zc-border)', color: 'var(--zc-primary)' }}>Attendance</button>
                </Link>
                <Link href="/exams" className="flex-1">
                  <button className="w-full text-[11px] font-semibold py-1.5 rounded-md cursor-pointer" style={{ border: '1px solid var(--zc-border)', color: 'var(--zc-primary)' }}>Marks</button>
                </Link>
              </div>
            </ZCard>
          ))}
        </div>

        {/* PTM & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ZCard className="p-4">
            <SectionTitle action={<Link href="/ptm"><span className="text-[11px] font-semibold" style={{ color: 'var(--zc-primary)' }}>View All</span></Link>}>Upcoming PTM</SectionTitle>
            {teacherData.upcoming_ptm_slots.length > 0 ? (
              <div className="space-y-2">
                {teacherData.upcoming_ptm_slots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-2.5 rounded-lg text-xs" style={{ background: 'var(--zc-bg)', border: '1px solid var(--zc-border-light)' }}>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--zc-text)' }}>{slot.parent_name}</p>
                      <p className="text-[10px]" style={{ color: 'var(--zc-text-muted)' }}>Ward: {slot.student_name}</p>
                    </div>
                    <Badge variant="purple" size="sm">{slot.time}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs py-4 text-center" style={{ color: 'var(--zc-text-muted)' }}>No PTM meetings scheduled.</p>
            )}
          </ZCard>

          <ZCard className="p-4">
            <SectionTitle action={<Link href="/communication"><span className="text-[11px] font-semibold" style={{ color: 'var(--zc-primary)' }}>View All</span></Link>}>Recent Communication</SectionTitle>
            <div className="space-y-2">
              {teacherData.announcements.map((ann) => (
                <div key={ann.id} className="p-2.5 rounded-lg text-xs" style={{ background: 'var(--zc-bg)', border: '1px solid var(--zc-border-light)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant={ann.priority === 'urgent' ? 'destructive' : 'info'} size="sm">{ann.priority}</Badge>
                    <span className="text-[10px]" style={{ color: 'var(--zc-text-muted)' }}>{ann.published_at}</span>
                  </div>
                  <p className="font-semibold" style={{ color: 'var(--zc-text)' }}>{ann.title}</p>
                </div>
              ))}
            </div>
          </ZCard>
        </div>

        {/* Help / Support */}
        <div className="text-center py-2">
          <p className="text-[11px]" style={{ color: 'var(--zc-text-muted)' }}>Help / Support</p>
        </div>
      </div>
    );
  }

  /* ═══════════════ ADMIN DASHBOARD ═══════════════ */
  return (
    <div className="space-y-5">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--zc-navy)' }}>
            Good morning, Admin 👋
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--zc-text-secondary)' }}>
            Here&apos;s what needs your attention today. • {school?.name || 'Delhi Public Academy'} • {dateStr}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/students">
            <Button variant="outline" size="sm" leftIcon={<UsersIcon size={14} />}>Students</Button>
          </Link>
          <Link href="/students/new">
            <Button size="sm" leftIcon={<PlusIcon size={14} />}>+ Add Student</Button>
          </Link>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={<UsersIcon size={20} />}
          iconBg="var(--zc-primary-light)"
          iconColor="var(--zc-primary)"
          title="Total Students"
          value={totalEnrolled > 0 ? totalEnrolled.toLocaleString() : '480'}
          sub="+12 this month"
        />
        <KpiCard
          icon={<UserCheckIcon size={20} />}
          iconBg="var(--zc-success-bg)"
          iconColor="var(--zc-success)"
          title="Today's Attendance"
          value="94.2%"
          sub="+1.8% from yesterday"
        />
        <KpiCard
          icon={<CreditCardIcon size={20} />}
          iconBg="var(--zc-info-bg)"
          iconColor="var(--zc-info)"
          title="Fees Collected"
          value="₹ 3,48,000"
          sub="₹ 1.2L this month"
        />
        <KpiCard
          icon={<AlertCircleIcon size={20} />}
          iconBg="var(--zc-danger-bg)"
          iconColor="var(--zc-danger)"
          title="Outstanding Fees"
          value="₹ 1,52,000"
          sub="28 students pending"
        />
      </div>

      {/* Main Grid: Priorities + Quick Actions + Student Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Priorities */}
        <ZCard className="p-4 lg:col-span-2">
          <SectionTitle action={<Link href="/students"><span className="text-[11px] font-semibold" style={{ color: 'var(--zc-primary)' }}>View All</span></Link>}>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--zc-danger)' }} />
              Today&apos;s Priorities
            </span>
          </SectionTitle>
          <div className="space-y-2">
            {priorityItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 px-3 rounded-lg text-xs" style={{ background: 'var(--zc-bg)' }}>
                <div className="flex items-center gap-2.5">
                  <AlertCircleIcon size={14} style={{ color: item.severity === 'high' ? 'var(--zc-danger)' : item.severity === 'medium' ? 'var(--zc-warning)' : 'var(--zc-info)' }} />
                  <span className="font-medium" style={{ color: 'var(--zc-text)' }}>{item.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: item.severity === 'high' ? 'var(--zc-danger-bg)' : item.severity === 'medium' ? 'var(--zc-warning-bg)' : 'var(--zc-info-bg)',
                      color: item.severity === 'high' ? 'var(--zc-danger)' : item.severity === 'medium' ? 'var(--zc-warning)' : 'var(--zc-info)',
                    }}
                  >
                    {item.severity === 'high' ? 'High' : item.severity === 'medium' ? 'Medium' : 'Low'}
                  </span>
                  <Link href={item.href}>
                    <button className="text-[11px] font-semibold px-2.5 py-1 rounded-md cursor-pointer" style={{ backgroundColor: 'var(--zc-primary)', color: '#fff' }}>
                      {item.action}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ZCard>

        {/* Quick Actions */}
        <ZCard className="p-4">
          <SectionTitle>Quick Actions</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((qa) => (
              <Link key={qa.label} href={qa.href}>
                <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg cursor-pointer hover:shadow-sm transition-all" style={{ background: 'var(--zc-bg)', border: '1px solid var(--zc-border-light)' }}>
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${qa.color}15`, color: qa.color }}>
                    {qa.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: 'var(--zc-text)' }}>{qa.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </ZCard>
      </div>

      {/* Second Row: Student Overview, Fees Overview, Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Student Overview */}
        <ZCard className="p-4">
          <SectionTitle action={<Link href="/students"><span className="text-[11px] font-semibold" style={{ color: 'var(--zc-primary)' }}>View All</span></Link>}>Student Overview</SectionTitle>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: 'var(--zc-text-secondary)' }}>Active Students</span>
              <span className="font-bold" style={{ color: 'var(--zc-text)' }}>{totalEnrolled || 480}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: 'var(--zc-text-secondary)' }}>Total Capacity</span>
              <span className="font-bold" style={{ color: 'var(--zc-text)' }}>{totalCapacity || 520}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: 'var(--zc-text-secondary)' }}>Classes</span>
              <span className="font-bold" style={{ color: 'var(--zc-text)' }}>{classes.length || 12}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: 'var(--zc-text-secondary)' }}>Sections</span>
              <span className="font-bold" style={{ color: 'var(--zc-text)' }}>{sections.length || 28}</span>
            </div>
            {/* Recent Students */}
            <div className="pt-2" style={{ borderTop: '1px solid var(--zc-border-light)' }}>
              <p className="text-[10px] font-semibold mb-2" style={{ color: 'var(--zc-text-muted)' }}>RECENT ADMISSIONS</p>
              {['Aarav Sharma — Class 5-A', 'Priya Patel — Class 8-B', 'Rohan Gupta — Class 3-C'].map((s, i) => (
                <div key={i} className="flex items-center gap-2 py-1 text-[11px]" style={{ color: 'var(--zc-text-secondary)' }}>
                  <div className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: 'var(--zc-primary-light)', color: 'var(--zc-primary)' }}>
                    {s.charAt(0)}
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </ZCard>

        {/* Fees Overview */}
        <ZCard className="p-4">
          <SectionTitle action={<Link href="/fees"><span className="text-[11px] font-semibold" style={{ color: 'var(--zc-primary)' }}>View All</span></Link>}>Fees Overview</SectionTitle>
          <div className="space-y-3">
            <div className="p-3 rounded-lg" style={{ background: 'var(--zc-bg)' }}>
              <p className="text-[10px] font-medium" style={{ color: 'var(--zc-text-muted)' }}>Total Fees</p>
              <p className="text-lg font-bold" style={{ color: 'var(--zc-navy)' }}>₹ 15,50,000</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 p-2.5 rounded-lg" style={{ background: 'var(--zc-success-bg)' }}>
                <p className="text-[10px] font-medium" style={{ color: 'var(--zc-success)' }}>Collected</p>
                <p className="text-sm font-bold" style={{ color: 'var(--zc-success)' }}>₹ 8,95,000</p>
              </div>
              <div className="flex-1 p-2.5 rounded-lg" style={{ background: 'var(--zc-danger-bg)' }}>
                <p className="text-[10px] font-medium" style={{ color: 'var(--zc-danger)' }}>Outstanding</p>
                <p className="text-sm font-bold" style={{ color: 'var(--zc-danger)' }}>₹ 3,75,000</p>
              </div>
            </div>
            <Link href="/fees" className="block">
              <button className="w-full text-[11px] font-semibold py-2 rounded-md cursor-pointer" style={{ border: '1px solid var(--zc-border)', color: 'var(--zc-primary)' }}>
                View Details →
              </button>
            </Link>
          </div>
        </ZCard>

        {/* Today's Attendance */}
        <ZCard className="p-4">
          <SectionTitle action={<Link href="/attendance"><span className="text-[11px] font-semibold" style={{ color: 'var(--zc-primary)' }}>View All</span></Link>}>Today&apos;s Attendance</SectionTitle>
          <div className="flex items-center justify-center py-3">
            <div className="relative h-24 w-24">
              <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--zc-border-light)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--zc-success)" strokeWidth="3" strokeDasharray="97.4" strokeDashoffset="5.6" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold" style={{ color: 'var(--zc-navy)' }}>94.2%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--zc-success-bg)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--zc-success)' }}>452</p>
              <p className="text-[10px]" style={{ color: 'var(--zc-success)' }}>Present</p>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--zc-danger-bg)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--zc-danger)' }}>22</p>
              <p className="text-[10px]" style={{ color: 'var(--zc-danger)' }}>Absent</p>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--zc-warning-bg)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--zc-warning)' }}>6</p>
              <p className="text-[10px]" style={{ color: 'var(--zc-warning)' }}>Late</p>
            </div>
          </div>
        </ZCard>
      </div>

      {/* Third Row: Activity, PTM, Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Activity */}
        <ZCard className="p-4">
          <SectionTitle>Today&apos;s Activity</SectionTitle>
          <div className="space-y-2.5">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-2.5 text-xs">
                <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--zc-primary)' }} />
                <div className="min-w-0">
                  <p className="font-medium leading-snug" style={{ color: 'var(--zc-text)' }}>{act.action}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--zc-text-muted)' }}>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ZCard>

        {/* Upcoming PTM */}
        <ZCard className="p-4">
          <SectionTitle action={<Link href="/ptm"><span className="text-[11px] font-semibold" style={{ color: 'var(--zc-primary)' }}>View All</span></Link>}>Upcoming PTM</SectionTitle>
          <div className="space-y-2">
            {[
              { parent: 'Mrs. Sharma', class: 'Class 5-A', date: 'Nov 10', time: '10:00 AM' },
              { parent: 'Mr. Patel', class: 'Class 8-B', date: 'Nov 10', time: '11:30 AM' },
              { parent: 'Mrs. Gupta', class: 'Class 3-C', date: 'Nov 12', time: '9:00 AM' },
            ].map((ptm, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg text-xs" style={{ background: 'var(--zc-bg)', border: '1px solid var(--zc-border-light)' }}>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--zc-text)' }}>{ptm.parent}</p>
                  <p className="text-[10px]" style={{ color: 'var(--zc-text-muted)' }}>{ptm.class} • {ptm.date}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--zc-primary-light)', color: 'var(--zc-primary)' }}>
                  {ptm.time}
                </span>
              </div>
            ))}
          </div>
        </ZCard>

        {/* Recent Communication */}
        <ZCard className="p-4">
          <SectionTitle action={<Link href="/communication"><span className="text-[11px] font-semibold" style={{ color: 'var(--zc-primary)' }}>View All</span></Link>}>Recent Communication</SectionTitle>
          <div className="space-y-2">
            {[
              { title: 'Annual Day Celebration', date: 'Oct 28, 2026', audience: 'All Parents' },
              { title: 'Winter Uniform Notice', date: 'Oct 25, 2026', audience: 'Classes 1 - 12' },
              { title: 'PTM Schedule Update', date: 'Oct 22, 2026', audience: 'Class Teachers' },
            ].map((ann, i) => (
              <div key={i} className="p-2.5 rounded-lg text-xs" style={{ background: 'var(--zc-bg)', border: '1px solid var(--zc-border-light)' }}>
                <p className="font-semibold" style={{ color: 'var(--zc-text)' }}>{ann.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px]" style={{ color: 'var(--zc-text-muted)' }}>{ann.date}</span>
                  <span className="text-[10px]" style={{ color: 'var(--zc-text-secondary)' }}>{ann.audience}</span>
                </div>
              </div>
            ))}
          </div>
        </ZCard>
      </div>

      {/* Footer */}
      <div className="text-center py-2">
        <p className="text-[11px]" style={{ color: 'var(--zc-text-muted)' }}>Help / Support</p>
      </div>
    </div>
  );
}
