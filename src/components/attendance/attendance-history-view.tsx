'use client';

import React, { useState, useEffect } from 'react';
import { AttendanceHistoryRecord } from '@/types/attendance';
import { attendanceService } from '@/lib/services/attendance-service';
import { studentService } from '@/lib/services/student-service';
import { StudentListItem } from '@/types/student';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-state';
import { CalendarIcon, UserCheckIcon, AlertCircleIcon, ClockIcon } from '@/components/ui/icons';

export function AttendanceHistoryView() {
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_01');
  const [history, setHistory] = useState<AttendanceHistoryRecord[]>([]);
  const [summary, setSummary] = useState<{
    total_days: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const { students: list } = await studentService.listStudents({ page: 1, page_size: 50 });
        setStudents(list);
        if (list.length > 0 && !selectedStudentId) {
          setSelectedStudentId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load students', err);
      }
    }
    loadStudents();
  }, [selectedStudentId]);

  useEffect(() => {
    async function fetchHistory() {
      if (!selectedStudentId) return;
      setIsLoading(true);
      try {
        const data = await attendanceService.getStudentHistory(selectedStudentId);
        setHistory(data.history);
        setSummary(data.summary);
      } catch (err) {
        console.error('Failed to load student attendance history', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, [selectedStudentId]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="space-y-6">
      {/* Student Selector Card */}
      <Card className="border-slate-200/90 shadow-xs bg-white">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-sm">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Select Student for Attendance History
            </label>
            <Select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              options={students.map((s) => ({
                label: `${s.first_name} ${s.last_name} (${s.admission_no} • ${s.class})`,
                value: s.id,
              }))}
            />
          </div>

          {selectedStudent && (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
              <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                {selectedStudent.first_name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">
                  {selectedStudent.first_name} {selectedStudent.last_name}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedStudent.admission_no} • {selectedStudent.class} {selectedStudent.section}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase">Working Days</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{summary.total_days}</p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-xs">
            <span className="text-xs font-semibold text-emerald-700 uppercase">Present</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{summary.present}</p>
          </div>
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 shadow-xs">
            <span className="text-xs font-semibold text-rose-700 uppercase">Absent</span>
            <p className="text-2xl font-bold text-rose-700 mt-1">{summary.absent}</p>
          </div>
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 shadow-xs">
            <span className="text-xs font-semibold text-blue-700 uppercase">Cumulative %</span>
            <p className="text-2xl font-bold text-blue-700 mt-1">{summary.percentage}%</p>
          </div>
        </div>
      )}

      {/* History Log Table */}
      <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon size={18} className="text-blue-600" />
            Detailed Roll Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8">
              <LoadingState message="Fetching student roll history..." />
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No historical records found for this student.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Class & Section</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Remarks / Log Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-medium text-slate-900">{record.date}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {record.class_name} - {record.section_name}
                      </td>
                      <td className="py-3 px-4">
                        {record.status === 'present' ? (
                          <Badge variant="success" className="text-xs">
                            <UserCheckIcon size={12} className="mr-1" />
                            Present
                          </Badge>
                        ) : record.status === 'absent' ? (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircleIcon size={12} className="mr-1" />
                            Absent
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="text-xs">
                            <ClockIcon size={12} className="mr-1" />
                            Late
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {record.remarks || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
