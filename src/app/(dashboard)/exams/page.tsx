'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-state';
import { CreateExamDialog } from '@/components/exams/create-exam-dialog';
import { MarksEntryGrid } from '@/components/exams/marks-entry-grid';
import { examService } from '@/lib/services/exam-service';
import { Exam, StudentExamPerformance } from '@/types/exams';
import {
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  FileTextIcon,
  TrendingUpIcon,
} from '@/components/ui/icons';

export default function ExamsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'marks' | 'results'>('list');
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('exam_term1_2026');
  const [resultsData, setResultsData] = useState<{
    performances: StudentExamPerformance[];
    class_average: number;
    highest_score: number;
    pass_percentage: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadExams() {
      setIsLoading(true);
      try {
        const list = await examService.getExams();
        setExams(list);
        if (list.length > 0 && !selectedExamId) {
          setSelectedExamId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load exams', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadExams();
  }, [selectedExamId]);

  useEffect(() => {
    if (activeTab === 'results' && selectedExamId) {
      examService.getExamResults(selectedExamId).then(setResultsData);
    }
  }, [activeTab, selectedExamId]);

  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Exams, Evaluations & Results"
          description="Schedule institutional examinations, enter marks with auto-grading, and analyze student performances."
          icon={<AwardIcon size={24} className="text-indigo-600" />}
        />
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shrink-0"
        >
          <PlusIcon size={16} className="mr-1.5" />
          Schedule New Exam
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'list', label: 'Examinations Roster', icon: <CalendarIcon size={16} /> },
          { id: 'marks', label: 'Keyboard Marks Entry', icon: <FileTextIcon size={16} /> },
          { id: 'results', label: 'Class Results & Ranking', icon: <TrendingUpIcon size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as 'list' | 'marks' | 'results')}
      />

      {/* TAB 1: EXAM LIST */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam) => {
              const isSelected = exam.id === selectedExamId;
              const isPublished = exam.status === 'published';

              return (
                <Card
                  key={exam.id}
                  className={`border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                      : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
                  }`}
                  onClick={() => setSelectedExamId(exam.id)}
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge
                          variant={isPublished ? 'success' : 'outline'}
                          className="text-[11px] mb-2 uppercase tracking-wider font-bold"
                        >
                          {exam.status}
                        </Badge>
                        <CardTitle className="text-base font-extrabold text-slate-900">
                          {exam.name}
                        </CardTitle>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {exam.class_name} • {exam.term_name}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Exam Schedule</span>
                        <span className="font-semibold text-xs text-slate-700">
                          {exam.start_date} to {exam.end_date}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-0">
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        <strong>{exam.subjects.length}</strong> Configured Subjects
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExamId(exam.id);
                            setActiveTab('marks');
                          }}
                          className="h-8 text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                        >
                          Marks Entry
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExamId(exam.id);
                            setActiveTab('results');
                          }}
                          className="h-8 text-xs text-slate-700 border-slate-300 hover:bg-slate-50"
                        >
                          View Results
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MARKS ENTRY SHEET */}
      {activeTab === 'marks' && (
        <MarksEntryGrid examId={selectedExamId || 'exam_term1_2026'} />
      )}

      {/* TAB 3: RESULTS & RANKING */}
      {activeTab === 'results' && resultsData && (
        <div className="space-y-5">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-500">Class Average</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                {resultsData.class_average}%
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
              <span className="text-xs font-bold uppercase text-emerald-800">Highest Score</span>
              <p className="text-3xl font-extrabold text-emerald-700 mt-1 font-mono">
                {resultsData.highest_score} / 500
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
              <span className="text-xs font-bold uppercase text-blue-800">Passing Rate</span>
              <p className="text-3xl font-extrabold text-blue-700 mt-1 font-mono">
                {resultsData.pass_percentage}%
              </p>
            </div>
          </div>

          {/* Ranking Table */}
          <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
              <CardTitle className="text-base font-bold text-slate-900">
                Consolidated Student Results & Class Rank
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4 w-14 text-center">Rank</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Admission No</th>
                      <th className="py-3 px-4 text-right">Total Marks</th>
                      <th className="py-3 px-4 text-right">Percentage</th>
                      <th className="py-3 px-4 text-center">Overall Grade</th>
                      <th className="py-3 px-4 text-center">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resultsData.performances.map((perf) => (
                      <tr key={perf.student_id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 text-center font-bold text-xs">
                          {perf.rank === 1 ? (
                            <span className="inline-block h-6 w-6 rounded-full bg-amber-400 text-slate-900 font-extrabold text-xs leading-6">
                              1
                            </span>
                          ) : perf.rank === 2 ? (
                            <span className="inline-block h-6 w-6 rounded-full bg-slate-300 text-slate-900 font-extrabold text-xs leading-6">
                              2
                            </span>
                          ) : perf.rank === 3 ? (
                            <span className="inline-block h-6 w-6 rounded-full bg-amber-600 text-white font-extrabold text-xs leading-6">
                              3
                            </span>
                          ) : (
                            perf.rank
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {perf.student_name}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-500">
                          {perf.admission_no}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {perf.total_marks_obtained} / {perf.total_max_marks}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-indigo-700">
                          {perf.percentage}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                            {perf.overall_grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="success" className="text-xs">
                            {perf.result_status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Dialog */}
      <CreateExamDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onExamCreated={(newEx) => setExams((prev) => [newEx, ...prev])}
      />
    </div>
  );
}
