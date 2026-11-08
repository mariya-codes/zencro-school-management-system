'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AttendanceStatus,
  AttendanceStudentRow,
  ClassAttendanceSummary,
} from '@/types/attendance';
import { attendanceService } from '@/lib/services/attendance-service';
import { classService } from '@/lib/services/class-service';
import { sectionService } from '@/lib/services/section-service';
import { SchoolClass, ClassSection } from '@/types/academics';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Toast } from '@/components/ui/toast';
import {
  UserCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
} from '@/components/ui/icons';

export interface AttendanceRosterProps {
  onSyncOffline?: () => void;
  isOffline?: boolean;
}

export function AttendanceRoster({ onSyncOffline, isOffline }: AttendanceRosterProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<ClassSection[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('cls_10');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec_10_a');

  const [roster, setRoster] = useState<AttendanceStudentRow[]>([]);
  const [initialRosterSnapshot, setInitialRosterSnapshot] = useState<string>('');
  const [summary, setSummary] = useState<ClassAttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; type: 'success' | 'error' } | null>(null);

  // Load academic classes & sections
  useEffect(() => {
    async function loadAcademicMeta() {
      try {
        const clsList = await classService.listClasses();
        setClasses(clsList);
        if (clsList.length > 0 && !selectedClassId) {
          setSelectedClassId(clsList[0].id);
        }
      } catch (err) {
        console.error('Failed to load classes', err);
      }
    }
    loadAcademicMeta();
  }, [selectedClassId]);

  useEffect(() => {
    async function loadSections() {
      if (!selectedClassId) return;
      try {
        const secList = await sectionService.listSections(selectedClassId);
        setSections(secList);
        if (secList.length > 0) {
          const match = secList.find((s) => s.id === selectedSectionId);
          if (!match) setSelectedSectionId(secList[0].id);
        }
      } catch (err) {
        console.error('Failed to load sections', err);
      }
    }
    loadSections();
  }, [selectedClassId, selectedSectionId]);

  // Load attendance roster
  const loadRoster = useCallback(async () => {
    if (!selectedClassId || !selectedSectionId) return;
    setIsLoading(true);
    try {
      const data = await attendanceService.getRoster(date, selectedClassId, selectedSectionId);
      setRoster(data.roster);
      setInitialRosterSnapshot(JSON.stringify(data.roster));
      setSummary(data.summary);
    } catch (err) {
      console.error('Failed to load roster', err);
      setToastMessage({ title: 'Could not load student roster.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [date, selectedClassId, selectedSectionId]);

  useEffect(() => {
    loadRoster();
  }, [loadRoster]);

  // Check unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!initialRosterSnapshot) return false;
    return JSON.stringify(roster) !== initialRosterSnapshot;
  }, [roster, initialRosterSnapshot]);

  // Real-time live counts
  const liveStats = useMemo(() => {
    const total = roster.length;
    let present = 0;
    let absent = 0;
    let late = 0;
    let halfDay = 0;

    roster.forEach((r) => {
      if (r.status === 'present') present++;
      else if (r.status === 'absent') absent++;
      else if (r.status === 'late') late++;
      else if (r.status === 'half_day') halfDay++;
    });

    const percentage = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;

    return { total, present, absent, late, halfDay, percentage };
  }, [roster]);

  // Fast single-click toggle
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRoster((prev) =>
      prev.map((item) => (item.student_id === studentId ? { ...item, status } : item))
    );
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setRoster((prev) =>
      prev.map((item) => (item.student_id === studentId ? { ...item, remarks } : item))
    );
  };

  // Mark all students present with 1 click
  const handleMarkAllPresent = () => {
    setRoster((prev) => prev.map((item) => ({ ...item, status: 'present' })));
  };

  // Bulk save
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const payload = {
        date,
        class_id: selectedClassId,
        section_id: selectedSectionId,
        records: roster.map((r) => ({
          student_id: r.student_id,
          status: r.status,
          remarks: r.remarks,
        })),
      };

      if (isOffline) {
        attendanceService.queueOfflineAttendance(payload);
        setInitialRosterSnapshot(JSON.stringify(roster));
        setToastMessage({
          title: `Attendance saved offline (${roster.length} students). Will sync when online.`,
          type: 'success',
        });
        if (onSyncOffline) onSyncOffline();
      } else {
        const result = await attendanceService.saveBulkAttendance(payload);
        setInitialRosterSnapshot(JSON.stringify(roster));
        setSummary(result.summary);
        setToastMessage({ title: result.message, type: 'success' });
      }
    } catch {
      setToastMessage({ title: 'Failed to save attendance. Try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <Toast
          variant={toastMessage.type === 'success' ? 'success' : 'destructive'}
          title={toastMessage.title}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Filter & Action Controls Header */}
      <Card className="border-slate-200/90 shadow-xs bg-white">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left Controls: Date, Class, Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Attendance Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Class</label>
                <Select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  options={
                    classes.length > 0
                      ? classes.map((c) => ({ label: c.name, value: c.id }))
                      : [
                        { label: 'Class 10', value: 'cls_10' },
                        { label: 'Class 9', value: 'cls_9' },
                        { label: 'Class 8', value: 'cls_8' },
                      ]
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Section</label>
                <Select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  options={
                    sections.length > 0
                      ? sections.map((s) => ({ label: `Section ${s.name}`, value: s.id }))
                      : [
                        { label: 'Section A', value: 'sec_10_a' },
                        { label: 'Section B', value: 'sec_10_b' },
                      ]
                  }
                />
              </div>
            </div>

            {/* Right Buttons: Fast Presets & Save Action */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllPresent}
                className="text-xs h-9 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <UserCheckIcon size={15} className="mr-1.5 text-emerald-600" />
                All Present
              </Button>

              <Button
                size="sm"
                onClick={handleSaveAttendance}
                disabled={isSaving || !hasUnsavedChanges}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs"
              >
                <CheckCircleIcon size={16} className="mr-1.5" />
                {isSaving ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </div>

          {/* Unsaved changes notice */}
          {hasUnsavedChanges && (
            <div className="mt-3.5 flex items-center justify-between px-3 py-2 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-800 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircleIcon size={14} className="text-amber-600 shrink-0" />
                <span>You have unsaved changes in this attendance roll. Remember to save before navigating away.</span>
              </div>
              <span className="font-semibold text-amber-900">Unsaved</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Roster Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{liveStats.total}</p>
          <span className="text-[11px] text-slate-400">Roster Capacity</span>
        </div>

        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Present</p>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{liveStats.present}</p>
          <span className="text-[11px] text-emerald-600 font-medium">In Classroom</span>
        </div>

        <div className="rounded-xl border border-rose-200/80 bg-rose-50/50 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Absent</p>
            <span className="h-2 w-2 rounded-full bg-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-1">{liveStats.absent}</p>
          <span className="text-[11px] text-rose-600 font-medium">Exceptions Marked</span>
        </div>

        <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Late</p>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-1">{liveStats.late}</p>
          <span className="text-[11px] text-amber-600 font-medium">Delayed Arrival</span>
        </div>

        <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-3.5 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Attendance %</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{liveStats.percentage}%</p>
          <span className="text-[11px] text-blue-600 font-medium">
            {liveStats.percentage >= 90 ? 'Healthy Attendance' : 'Below 90% Target'}
          </span>
        </div>
      </div>

      {/* Student Roster Table */}
      <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/60">
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Classroom Roster — Fast Attendance
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Defaulted to <strong className="text-emerald-700">PRESENT</strong>. Tap exceptions to toggle status.
            </p>
          </div>
          {summary?.is_submitted && (
            <Badge variant="success" className="text-xs font-medium">
              Submitted at {summary.submitted_at}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8">
              <LoadingState message="Loading student roster..." />
            </div>
          ) : roster.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No students found in this section"
                description="Verify your selected class and section or add students to the registry."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4 w-12 text-center">Roll</th>
                    <th className="py-3 px-4">Student Details</th>
                    <th className="py-3 px-4">Admission No</th>
                    <th className="py-3 px-4 w-72 text-center">Status (1-Tap Selection)</th>
                    <th className="py-3 px-4 min-w-[200px]">Remarks / Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roster.map((student) => {
                    const isPresent = student.status === 'present';
                    const isAbsent = student.status === 'absent';
                    const isLate = student.status === 'late';

                    return (
                      <tr
                        key={student.student_id}
                        className={`transition-colors hover:bg-slate-50/70 ${isAbsent ? 'bg-rose-50/20' : isLate ? 'bg-amber-50/20' : ''
                          }`}
                      >
                        {/* Roll Number */}
                        <td className="py-3 px-4 text-center font-bold text-slate-500 text-xs">
                          {student.roll_no}
                        </td>

                        {/* Student Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 ${isPresent
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isAbsent
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                            >
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 leading-tight">
                                {student.name}
                              </p>
                              <p className="text-[11px] text-slate-400 capitalize">
                                {student.gender}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Admission No */}
                        <td className="py-3 px-4 font-mono text-xs text-slate-600 font-medium">
                          {student.admission_no}
                        </td>

                        {/* Fast Status Selector */}
                        <td className="py-2.5 px-4">
                          <div className="flex items-center justify-center gap-1 bg-slate-100/90 p-1 rounded-xl max-w-xs mx-auto border border-slate-200">
                            {/* Present Toggle */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.student_id, 'present')}
                              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${isPresent
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                            >
                              <CheckCircleIcon size={13} />
                              Present
                            </button>

                            {/* Absent Toggle */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.student_id, 'absent')}
                              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${isAbsent
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-rose-700 hover:bg-slate-200/60'
                                }`}
                            >
                              <AlertCircleIcon size={13} />
                              Absent
                            </button>

                            {/* Late Toggle */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.student_id, 'late')}
                              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${isLate
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-amber-700 hover:bg-slate-200/60'
                                }`}
                            >
                              <ClockIcon size={13} />
                              Late
                            </button>
                          </div>
                        </td>

                        {/* Remarks Input */}
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            placeholder={isAbsent ? 'Reason for absence...' : isLate ? 'Minutes late / bus delay...' : 'Optional notes...'}
                            value={student.remarks || ''}
                            onChange={(e) => handleRemarkChange(student.student_id, e.target.value)}
                            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
