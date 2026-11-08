'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import { importExportService } from '@/lib/services/import-export-service';
import { ExportModule, ExportFormat, ExportHistoryRecord } from '@/types/import-export';
import {
  DownloadIcon,
  LayersIcon,
  CheckCircleIcon,
  FileTextIcon,
  ClockIcon,
} from '@/components/ui/icons';

export default function ExportPage() {
  const [module, setModule] = useState<ExportModule>('students');
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [history, setHistory] = useState<ExportHistoryRecord[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      const data = await importExportService.getExportHistory();
      setHistory(data);
    }
    loadHistory();
  }, []);

  const handleStartExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const newRecord: ExportHistoryRecord = {
        id: `exp_${Date.now()}`,
        module,
        filename: `ZenCro_${module.toUpperCase()}_Export_${new Date().toISOString().split('T')[0]}.${format}`,
        record_count: 42,
        format,
        created_at: 'Just now',
        created_by: 'Staff Admin (Mariya)',
        file_size_kb: 164,
        download_url: '#',
      };
      setHistory((prev) => [newRecord, ...prev]);
      setIsExporting(false);
      setToastMessage(`Generated ${newRecord.filename} successfully!`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <Toast
          variant="success"
          title={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Page Header */}
      <PageHeader
        title="Institutional Data Export Center"
        description="Generate certified data exports for school registries, board reporting, and auditing."
        icon={<DownloadIcon size={24} className="text-indigo-600" />}
      />

      {/* Export Configuration Card */}
      <Card className="border-slate-200/90 shadow-xs bg-white">
        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/60">
          <CardTitle className="text-base font-bold text-slate-900">
            Export Dataset Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data Domain / Module *
              </label>
              <Select
                value={module}
                onChange={(e) => setModule(e.target.value as ExportModule)}
                options={[
                  { label: 'Students Master Registry', value: 'students' },
                  { label: 'Daily Classroom Attendance Roll', value: 'attendance' },
                  { label: 'Fee Invoicing & Payment Records', value: 'fees' },
                  { label: 'Exam Schedules & Timetables', value: 'exams' },
                  { label: 'Scholastic Marks & Results', value: 'results' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                File Export Format *
              </label>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
                options={[
                  { label: 'CSV (Comma Separated Values)', value: 'csv' },
                  { label: 'Microsoft Excel Spreadsheet (.xlsx)', value: 'xlsx' },
                  { label: 'JSON Dataset', value: 'json' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class Scope
              </label>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={[
                  { label: 'All Classes (Whole School)', value: 'all' },
                  { label: 'Class 10', value: 'cls_10' },
                  { label: 'Class 9', value: 'cls_9' },
                  { label: 'Class 12', value: 'cls_12' },
                ]}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Exports adhere to role-based access restrictions and log security audit trails.
            </span>
            <Button
              onClick={handleStartExport}
              disabled={isExporting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              <DownloadIcon size={16} className="mr-1.5" />
              {isExporting ? 'Generating File...' : 'Generate & Export Data'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export History Table */}
      <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900">
            Export History & Generated Files
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {history.length} Files Available
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4 text-right">Records</th>
                  <th className="py-3 px-4">Generated By</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs">
                      {item.filename}
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-700 text-xs">{item.module}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-xs uppercase bg-slate-100 text-slate-800">
                        {item.format}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs">{item.record_count}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{item.created_by}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{item.created_at}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setToastMessage(`Downloading ${item.filename}...`)}
                        className="h-8 text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                      >
                        <DownloadIcon size={13} className="mr-1" />
                        Download ({item.file_size_kb} KB)
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
  );
}
