'use client';

import React from 'react';
import { AcademicSummary as AcademicSummaryType } from '@/types/student';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AwardIcon,
  BookOpenIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  DownloadIcon,
  InfoIcon,
} from '@/components/ui/icons';

export interface AcademicSummaryProps {
  data: AcademicSummaryType;
}

export function AcademicSummary({ data }: AcademicSummaryProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Academic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Percentage"
          value={`${data.overall_percentage}%`}
          icon={<AwardIcon size={24} />}
          trend={{ value: `Grade ${data.grade}`, isPositive: true }}
          subtitle={data.latest_exam_name}
          accentColor="indigo"
        />

        <StatCard
          title="Letter Grade"
          value={data.grade}
          icon={<CheckCircleIcon size={24} />}
          subtitle="CBSE Standard Grading"
          accentColor="emerald"
        />

        <StatCard
          title="Class Standing / Rank"
          value={data.rank || 'Top 10%'}
          icon={<TrendingUpIcon size={24} />}
          subtitle="Cohort ranking"
          accentColor="purple"
        />

        <StatCard
          title="Cumulative GPA"
          value={data.gpa || '9.2 / 10'}
          icon={<BookOpenIcon size={24} />}
          subtitle="Scholastic aggregate"
          accentColor="sky"
        />
      </div>

      {/* Subject Marks Breakdown Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">{data.latest_exam_name}</CardTitle>
            <CardDescription>
              Detailed subject marks, grading thresholds, and teacher feedback comments.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-200/80 bg-slate-50/75 font-bold uppercase tracking-wider text-slate-700">
                <tr>
                  <th className="px-5 py-3.5">Subject & Code</th>
                  <th className="px-5 py-3.5 text-center">Max Marks</th>
                  <th className="px-5 py-3.5 text-center">Marks Scored</th>
                  <th className="px-5 py-3.5 text-center">Percentage</th>
                  <th className="px-5 py-3.5 text-center">Grade</th>
                  <th className="px-5 py-3.5">Teacher Evaluation & Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.subjects.map((sub, idx) => {
                  const percent = Math.round((sub.obtained_marks / sub.max_marks) * 100);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">
                          {sub.subject_name}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                          {sub.subject_code}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono text-slate-600">
                        {sub.max_marks}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-900">
                        {sub.obtained_marks}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-slate-700">
                        {percent}%
                      </td>
                      <td className="px-5 py-3.5 text-center">
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
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 leading-relaxed max-w-xs">
                        {sub.remarks || 'Standard performance recorded.'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {data.total_marks && data.max_total_marks && (
                <tfoot className="border-t-2 border-slate-200 bg-slate-50/60 font-bold text-xs">
                  <tr>
                    <td className="px-5 py-3.5 text-slate-900">
                      Total Aggregate Marks:
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-slate-700">
                      {data.max_total_marks}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-indigo-600">
                      {data.total_marks}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-slate-900">
                      {data.overall_percentage}%
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge variant="success" size="sm">
                        {data.grade}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      Overall Academic Status: Passed with Distinction
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Scope Notice */}
      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-xs text-indigo-900">
        <InfoIcon size={16} className="text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Day 2 Scope Notice:</span> This is a student-level academic summary. Exam paper scheduling, gradebook entry, and printable CBSE report card generation belong to the later Exams & Results module.
        </p>
      </div>
    </div>
  );
}
