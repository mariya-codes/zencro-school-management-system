'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SubjectMarksEntrySheet, StudentMarksRecord } from '@/types/exams';
import { examService, calculateGrade } from '@/lib/services/exam-service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-state';
import { Toast } from '@/components/ui/toast';
import { CheckCircleIcon, AlertCircleIcon, AwardIcon } from '@/components/ui/icons';

export interface MarksEntryGridProps {
  examId: string;
  initialSubjectId?: string;
  initialSectionId?: string;
}

export function MarksEntryGrid({
  examId,
  initialSubjectId = 'sub_mat',
  initialSectionId = 'sec_10_a',
}: MarksEntryGridProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(initialSectionId);
  const [sheet, setSheet] = useState<SubjectMarksEntrySheet | null>(null);
  const [records, setRecords] = useState<StudentMarksRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // References for keyboard navigation across inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    async function loadSheet() {
      setIsLoading(true);
      try {
        const data = await examService.getMarksEntrySheet(
          examId,
          selectedSubjectId,
          selectedSectionId
        );
        setSheet(data);
        setRecords(data.records);
      } catch (err) {
        console.error('Failed to load marks sheet', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSheet();
  }, [examId, selectedSubjectId, selectedSectionId]);

  const handleMarksChange = (studentId: string, value: string, maxMarks: number) => {
    const num = value === '' ? null : Math.min(maxMarks, Math.max(0, parseFloat(value) || 0));
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.student_id === studentId) {
          return {
            ...rec,
            marks_obtained: num,
            grade: calculateGrade(num, maxMarks, rec.is_absent),
            status: num !== null ? 'saved' : 'pending',
          };
        }
        return rec;
      })
    );
  };

  const handleToggleAbsent = (studentId: string, maxMarks: number) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.student_id === studentId) {
          const newAbsent = !rec.is_absent;
          return {
            ...rec,
            is_absent: newAbsent,
            marks_obtained: newAbsent ? null : 0,
            grade: newAbsent ? 'AB' : calculateGrade(0, maxMarks),
          };
        }
        return rec;
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSave = async () => {
    if (!sheet) return;
    setIsSaving(true);
    try {
      const res = await examService.saveMarks({
        exam_id: sheet.exam_id,
        subject_id: sheet.subject_id,
        section_id: sheet.section_id,
        records: records.map((r) => ({
          student_id: r.student_id,
          marks_obtained: r.marks_obtained,
          is_absent: r.is_absent,
          remarks: r.remarks,
        })),
      });
      setToastMessage(res.message);
    } catch {
      setToastMessage('Failed to save student marks.');
    } finally {
      setIsSaving(false);
    }
  };

  // Summary counts
  const total = records.length;
  const pendingCount = records.filter((r) => r.marks_obtained === null && !r.is_absent).length;
  const gradedCount = total - pendingCount;

  return (
    <div className="space-y-5">
      {toastMessage && (
        <Toast
          variant="success"
          title={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Selector Controls Card */}
      <Card className="border-slate-200/90 shadow-xs bg-white">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-52">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
              <Select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                options={[
                  { label: 'Mathematics (MAT-041)', value: 'sub_mat' },
                  { label: 'Science (SCI-086)', value: 'sub_sci' },
                  { label: 'English Language (ENG-184)', value: 'sub_eng' },
                  { label: 'Social Science (SST-087)', value: 'sub_sst' },
                  { label: 'Hindi Course A (HIN-002)', value: 'sub_hin' },
                ]}
              />
            </div>

            <div className="w-40">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Section</label>
              <Select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                options={[
                  { label: 'Section A (Room 204)', value: 'sec_10_a' },
                  { label: 'Section B (Room 205)', value: 'sec_10_b' },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <div className="text-right text-xs">
              <span className="text-slate-500 font-medium">Evaluation Progress:</span>
              <span className="font-bold text-slate-900 ml-1">
                {gradedCount} / {total} graded
              </span>
              {pendingCount > 0 && (
                <span className="text-amber-700 block text-[11px] font-semibold">
                  {pendingCount} pending marks
                </span>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              <CheckCircleIcon size={16} className="mr-1.5" />
              {isSaving ? 'Saving...' : 'Save Marks'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Marks Sheet Table */}
      <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              {sheet?.subject_name} Evaluation Sheet
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Maximum Marks: <strong>{sheet?.max_marks || 100}</strong> • Passing Threshold: {sheet?.passing_marks || 33} marks
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            Keyboard Friendly: Press [Enter] or [↓] for next student
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8">
              <LoadingState message="Loading marks entry roster..." />
            </div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No students enrolled in this section.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4 w-14 text-center">Roll</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Admission No</th>
                    <th className="py-3 px-4 w-44">Marks Obtained (Max: {sheet?.max_marks})</th>
                    <th className="py-3 px-4 w-28 text-center">Grade</th>
                    <th className="py-3 px-4 w-28 text-center">Absent?</th>
                    <th className="py-3 px-4">Teacher Remark / Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((rec, index) => {
                    const maxMarks = sheet?.max_marks || 100;
                    const isPassing = (rec.marks_obtained || 0) >= (sheet?.passing_marks || 33);

                    return (
                      <tr
                        key={rec.student_id}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          rec.is_absent ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center font-bold text-slate-500 text-xs">
                          {rec.roll_no || String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {rec.student_name}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-500">
                          {rec.admission_no}
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="number"
                            min="0"
                            max={maxMarks}
                            disabled={rec.is_absent}
                            value={rec.marks_obtained !== null ? rec.marks_obtained : ''}
                            onChange={(e) =>
                              handleMarksChange(rec.student_id, e.target.value, maxMarks)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            placeholder="Enter marks..."
                            className={`w-32 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm focus:outline-none focus:ring-1 ${
                              rec.is_absent
                                ? 'bg-slate-100 border-slate-200 text-slate-400'
                                : rec.marks_obtained === null
                                ? 'bg-amber-50/40 border-amber-300 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500'
                                : isPassing
                                ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500'
                                : 'bg-rose-50 border-rose-300 text-rose-700'
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md font-bold text-xs ${
                              rec.grade.startsWith('A')
                                ? 'bg-emerald-100 text-emerald-800'
                                : rec.grade.startsWith('B')
                                ? 'bg-blue-100 text-blue-800'
                                : rec.grade === 'AB'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rec.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleAbsent(rec.student_id, maxMarks)}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                              rec.is_absent
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {rec.is_absent ? 'Absent' : 'Present'}
                          </button>
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            placeholder="Optional evaluation comment..."
                            value={rec.remarks || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRecords((prev) =>
                                prev.map((r) =>
                                  r.student_id === rec.student_id ? { ...r, remarks: val } : r
                                )
                              );
                            }}
                            className="w-full px-2.5 py-1 rounded-md border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
