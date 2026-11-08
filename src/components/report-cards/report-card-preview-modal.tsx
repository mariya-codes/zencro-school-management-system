'use client';

import React from 'react';
import { StudentReportCardPayload } from '@/types/report-cards';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { PrinterIcon, SchoolIcon, AwardIcon } from '@/components/ui/icons';

export interface ReportCardPreviewModalProps {
  reportCard: StudentReportCardPayload | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportCardPreviewModal({
  reportCard,
  isOpen,
  onClose,
}: ReportCardPreviewModalProps) {
  if (!reportCard) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Student Progress Report Card"
      description={`Report Card for ${reportCard.student_name} (${reportCard.class_name})`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Printable Report Card Sheet */}
        <div className="border-2 border-indigo-900/40 rounded-2xl p-6 sm:p-8 bg-white text-slate-800 shadow-sm space-y-6">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-200 pb-5">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-md">
                <SchoolIcon size={26} className="text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {reportCard.school_profile.name}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {reportCard.school_profile.affiliation_no}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {reportCard.school_profile.address}
            </p>
            <div className="inline-block mt-3 px-4 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold text-xs tracking-wider uppercase">
              Academic Progress Report Card • Session {reportCard.academic_year}
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Student Name</span>
              <span className="font-extrabold text-slate-900 text-sm">{reportCard.student_name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Admission ID</span>
              <span className="font-mono font-bold text-slate-900">{reportCard.admission_no}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Class & Section</span>
              <span className="font-bold text-slate-900">
                {reportCard.class_name} - {reportCard.section_name} (Roll: {reportCard.roll_no})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Attendance</span>
              <span className="font-bold text-emerald-700">
                {reportCard.attendance.days_present} / {reportCard.attendance.total_working_days} Days ({reportCard.attendance.percentage}%)
              </span>
            </div>
          </div>

          {/* Scholastic Areas Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AwardIcon size={14} className="text-indigo-600" />
              Part 1: Scholastic Academic Evaluation
            </h4>
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3 text-center">Code</th>
                    <th className="py-2.5 px-3 text-right">Term 1</th>
                    <th className="py-2.5 px-3 text-right">Term 2</th>
                    <th className="py-2.5 px-3 text-right">Total (100)</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {reportCard.scholastic_results.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{sub.subject_name}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">{sub.subject_code}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{sub.term1_marks}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{sub.term2_marks}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {sub.total_marks}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded font-extrabold text-xs bg-indigo-100 text-indigo-800">
                          {sub.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t border-slate-300 text-slate-900">
                    <td colSpan={4} className="py-3 px-3 uppercase text-right">
                      Cumulative Score:
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm text-indigo-900">
                      {reportCard.total_marks_obtained} / {reportCard.grand_max_marks}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-extrabold text-xs">
                        {reportCard.overall_grade} ({reportCard.overall_percentage}%)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Co-Scholastic & Life Skills */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Part 2: Co-Scholastic & Life Skills Assessment (3-Point Scale A-C)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {reportCard.co_curricular_results.map((skill, sIdx) => (
                <div key={sIdx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs">
                  <span className="text-slate-600 block truncate">{skill.skill_name}</span>
                  <span className="font-extrabold text-indigo-700 text-sm mt-0.5 block">
                    Grade {skill.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher & Principal Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-700 block mb-1">Class Teacher Remarks</span>
              <p className="text-slate-600 italic">"{reportCard.class_teacher_remarks}"</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-700 block mb-1">Principal Observation</span>
              <p className="text-slate-600 italic">"{reportCard.principal_remarks}"</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-300 text-center text-xs text-slate-600">
            <div>
              <div className="h-10 border-b border-slate-400 w-36 mx-auto mb-1.5" />
              <p className="font-semibold text-slate-800">Class Teacher Signature</p>
            </div>
            <div>
              <div className="h-10 border-b border-slate-400 w-36 mx-auto mb-1.5" />
              <p className="font-semibold text-slate-800">Parent / Guardian Signature</p>
            </div>
            <div>
              <div className="h-10 border-b border-slate-400 w-36 mx-auto mb-1.5" />
              <p className="font-semibold text-slate-800">Principal / Head of School</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
            <PrinterIcon size={16} className="mr-2" />
            Print Official Report Card
          </Button>
        </div>
      </div>
    </Modal>
  );
}
