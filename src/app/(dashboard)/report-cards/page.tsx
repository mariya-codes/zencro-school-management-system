'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-state';
import { ReportCardPreviewModal } from '@/components/report-cards/report-card-preview-modal';
import { reportCardService } from '@/lib/services/report-card-service';
import { studentService } from '@/lib/services/student-service';
import { ReportCardProfile, ReportCardTemplate, StudentReportCardPayload } from '@/types/report-cards';
import { StudentListItem } from '@/types/student';
import {
  FileTextIcon,
  LayersIcon,
  AwardIcon,
  EyeIcon,
  PrinterIcon,
  CheckCircleIcon,
  BuildingIcon,
} from '@/components/ui/icons';

export default function ReportCardsPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'profiles' | 'templates'>('generate');
  const [profiles, setProfiles] = useState<ReportCardProfile[]>([]);
  const [templates, setTemplates] = useState<ReportCardTemplate[]>([]);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_01');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('rc_prof_cbse_sec');

  const [previewPayload, setPreviewPayload] = useState<StudentReportCardPayload | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [profList, tmplList, stdList] = await Promise.all([
          reportCardService.getProfiles(),
          reportCardService.getTemplates(),
          studentService.listStudents({ page: 1, page_size: 50 }),
        ]);
        setProfiles(profList);
        setTemplates(tmplList);
        setStudents(stdList.students);
        if (stdList.students.length > 0) {
          setSelectedStudentId(stdList.students[0].id);
        }
      } catch (err) {
        console.error('Failed to load report cards configuration', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleGeneratePreview = async () => {
    if (!selectedStudentId) return;
    setIsGenerating(true);
    try {
      const data = await reportCardService.generateStudentReportCard(selectedStudentId);
      setPreviewPayload(data);
      setIsPreviewOpen(true);
    } catch (err) {
      console.error('Failed to generate report card', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Report Cards & Academic Transcripts"
        description="Configurable 3-Layer Report Card Pipeline: Board → Academic Level Profile → Visual Template."
        icon={<FileTextIcon size={24} className="text-indigo-600" />}
      />

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'generate', label: 'Generate & Preview', icon: <PrinterIcon size={16} /> },
          { id: 'profiles', label: 'Layer 2: Profiles & Weights', icon: <LayersIcon size={16} /> },
          { id: 'templates', label: 'Layer 3: Templates & Signatures', icon: <FileTextIcon size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as 'generate' | 'profiles' | 'templates')}
      />

      {/* TAB 1: GENERATE & PREVIEW */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <Card className="border-slate-200/90 shadow-xs bg-white">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
              <CardTitle className="text-base font-bold text-slate-900">
                Single & Batch Report Card Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Target Student *
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Evaluation Profile (3-Layer Pipeline) *
                  </label>
                  <Select
                    value={selectedProfileId}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                    options={profiles.map((p) => ({
                      label: `${p.name} [${p.board}]`,
                      value: p.id,
                    }))}
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Transcripts compile attendance rate, scholastic subject marks, life skills, and remarks.
                </span>
                <Button
                  onClick={handleGeneratePreview}
                  disabled={isGenerating || !selectedStudentId}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  <EyeIcon size={16} className="mr-1.5" />
                  {isGenerating ? 'Generating...' : 'Preview Official Report Card'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Roster Batch Print Table */}
          <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900">
                Class 10 Section A Roster — Ready for Generation
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {students.length} Students
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Admission No</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.slice(0, 8).map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {std.first_name} {std.last_name}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-500">
                          {std.admission_no}
                        </td>
                        <td className="py-3 px-4 text-slate-700">{std.class}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                            Evaluated
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              setSelectedStudentId(std.id);
                              const data = await reportCardService.generateStudentReportCard(std.id);
                              setPreviewPayload(data);
                              setIsPreviewOpen(true);
                            }}
                            className="h-8 text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                          >
                            <EyeIcon size={14} className="mr-1.5" />
                            Preview
                          </Button>
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

      {/* TAB 2: PROFILES & WEIGHTS (Layer 2) */}
      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((prof) => (
            <Card key={prof.id} className="border-slate-200/90 shadow-xs bg-white">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase">
                      {prof.board} • {prof.level}
                    </span>
                    <CardTitle className="text-base font-extrabold text-slate-900 mt-2">
                      {prof.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Assigned Classes</span>
                  <span className="font-bold text-slate-900">{prof.class_names.join(', ')}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Term Weightage</span>
                  <span className="font-bold text-slate-900">
                    Term 1: {prof.term_weightage.term_1_percentage}% • Term 2: {prof.term_weightage.term_2_percentage}%
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block mb-1">
                    Grading System ({prof.grading_scale.length} Levels)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {prof.grading_scale.map((g) => (
                      <span key={g.grade} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold">
                        {g.grade} ({g.min_percentage}-{g.max_percentage}%)
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: TEMPLATES (Layer 3) */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tmpl) => (
            <Card key={tmpl.id} className="border-slate-200/90 shadow-xs bg-white">
              <CardHeader className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tmpl.accent_color }} />
                  <span className="text-xs font-bold uppercase text-slate-500 font-mono">
                    Template: {tmpl.layout}
                  </span>
                </div>
                <CardTitle className="text-base font-extrabold text-slate-900">
                  {tmpl.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3 text-xs">
                <div className="space-y-1 text-slate-600">
                  <p>• Principal Signature: <strong>{tmpl.principal_signature_label}</strong></p>
                  <p>• Teacher Signature: <strong>{tmpl.teacher_signature_label}</strong></p>
                  <p>• Parent Signature: <strong>{tmpl.parent_signature_label}</strong></p>
                  <p>• Digital QR Code Verification: <strong>{tmpl.show_qr_verification ? 'Enabled' : 'Disabled'}</strong></p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewPayload && (
        <ReportCardPreviewModal
          isOpen={isPreviewOpen}
          reportCard={previewPayload}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
}
