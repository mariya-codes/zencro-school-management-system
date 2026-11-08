'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-state';
import { importExportService } from '@/lib/services/import-export-service';
import {
  ImportColumnMapping,
  ImportValidationSummary,
  ImportJobResult,
  ImportWizardStep,
} from '@/types/import-export';
import {
  UploadCloudIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  FileCheckIcon,
  FileTextIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  RefreshCwIcon,
} from '@/components/ui/icons';

// Sample mock CSV content for rapid 1-click import testing
const SAMPLE_CSV_ROWS = [
  { 'Admission Number': 'ADM-2026-0201', 'First Name': 'Devansh', 'Last Name': 'Chauhan', 'DOB': '2010-03-12', 'Gender': 'male', 'Class': 'cls_10', 'Section': 'sec_10_a', 'Guardian Name': 'Sanjay Chauhan', 'Phone': '+91 98111 22334' },
  { 'Admission Number': 'ADM-2026-0202', 'First Name': 'Meera', 'Last Name': 'Reddy', 'DOB': '2010-07-25', 'Gender': 'female', 'Class': 'cls_10', 'Section': 'sec_10_a', 'Guardian Name': 'Venkat Reddy', 'Phone': '+91 98222 33445' },
  { 'Admission Number': 'ADM-2026-0203', 'First Name': 'Kabir', 'Last Name': 'Mehta', 'DOB': '2010-11-19', 'Gender': 'male', 'Class': 'cls_10', 'Section': 'sec_10_b', 'Guardian Name': 'Alok Mehta', 'Phone': '+91 98333 44556' },
  { 'Admission Number': 'ADM-2026-0204', 'First Name': 'Sana', 'Last Name': 'Farooqui', 'DOB': '2010-09-08', 'Gender': 'female', 'Class': 'cls_10', 'Section': 'sec_10_b', 'Guardian Name': 'Tariq Farooqui', 'Phone': '+91 98444 55667' },
  { 'Admission Number': '', 'First Name': 'InvalidRow', 'Last Name': 'MissingAdmission', 'DOB': '2010-01-01', 'Gender': 'male', 'Class': 'cls_10', 'Section': 'sec_10_a', 'Guardian Name': 'None', 'Phone': '' },
];

export default function ImportWizardPage() {
  const [currentStep, setCurrentStep] = useState<ImportWizardStep>(1);
  const [fileName, setFileName] = useState<string>('student_enrollment_batch_2026.csv');
  const [mappings, setMappings] = useState<ImportColumnMapping[]>([]);
  const [validation, setValidation] = useState<ImportValidationSummary | null>(null);
  const [jobResult, setJobResult] = useState<ImportJobResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // STEP 1 -> STEP 2: Detect columns
  const handleFileUpload = (simulatedName?: string) => {
    setFileName(simulatedName || 'student_enrollment_batch_2026.csv');
    const headers = Object.keys(SAMPLE_CSV_ROWS[0]);
    const detected = importExportService.detectColumns(headers);
    setMappings(detected);
    setCurrentStep(2);
  };

  // STEP 3 -> STEP 4: Validate
  const handleValidate = async () => {
    setIsProcessing(true);
    try {
      const summary = await importExportService.validateData(SAMPLE_CSV_ROWS, mappings);
      setValidation(summary);
      setCurrentStep(4);
    } catch (err) {
      console.error('Validation error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // STEP 7 -> STEP 8: Execute Import
  const handleExecuteImport = async () => {
    if (!validation) return;
    setIsProcessing(true);
    try {
      const validRecords = validation.preview_records.filter(
        (r) => r.admission_no && r.first_name
      );
      const res = await importExportService.executeImport(validRecords);
      setJobResult(res);
      setCurrentStep(8);
    } catch (err) {
      console.error('Import execution error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Upload' },
    { num: 2, label: 'Detect File' },
    { num: 3, label: 'Mapping' },
    { num: 4, label: 'Validation' },
    { num: 5, label: 'Error Review' },
    { num: 6, label: 'Preview' },
    { num: 7, label: 'Confirm' },
    { num: 8, label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Student Roster Migration & CSV Import Wizard"
        description="Multi-step import pipeline with header detection, column schema mapping, and validation review."
        icon={<UploadCloudIcon size={24} className="text-indigo-600" />}
      />

      {/* 8-Step Wizard Progress Bar */}
      <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {stepsList.map((step) => {
              const isPast = step.num < currentStep;
              const isCurrent = step.num === currentStep;

              return (
                <div key={step.num} className="flex items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                        isPast
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-indigo-600 text-white shadow-xs ring-4 ring-indigo-100'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPast ? '✓' : step.num}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent ? 'text-indigo-900 font-extrabold' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {step.num < 8 && (
                    <div className="w-6 sm:w-10 h-0.5 bg-slate-200 mx-2 sm:mx-3 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* STEP 1: UPLOAD */}
      {currentStep === 1 && (
        <Card className="border-slate-200/90 shadow-xs bg-white text-center p-10">
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloudIcon size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Upload Student Data File</h3>
              <p className="text-xs text-slate-500 mt-1">
                Supports CSV, TSV, or Excel spreadsheets with student demographic details.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 hover:bg-indigo-50/40 transition-colors">
              <input
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                id="file-upload-input"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f.name);
                }}
              />
              <label
                htmlFor="file-upload-input"
                className="cursor-pointer block text-xs text-indigo-700 font-semibold"
              >
                Click to browse files or drop here
              </label>
              <p className="text-[11px] text-slate-400 mt-1">Maximum file size: 15 MB</p>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => handleFileUpload('student_enrollment_batch_2026.csv')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
              >
                Load Sample Student Dataset (5 Records)
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 2: DETECT FILE */}
      {currentStep === 2 && (
        <Card className="border-slate-200/90 shadow-xs bg-white p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">File Detected: {fileName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Successfully parsed headers and sample entries from uploaded document.
              </p>
            </div>
            <Badge variant="success" className="text-xs">
              {mappings.length} Columns Detected
            </Badge>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase">Headers Found:</h4>
            <div className="flex flex-wrap gap-2">
              {mappings.map((m) => (
                <span key={m.csv_header} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-mono font-medium">
                  {m.csv_header}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
              <ArrowLeftIcon size={14} className="mr-1" /> Re-upload
            </Button>
            <Button size="sm" onClick={() => setCurrentStep(3)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Configure Column Mapping <ArrowRightIcon size={14} className="ml-1" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: COLUMN MAPPING */}
      {currentStep === 3 && (
        <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/60">
            <CardTitle className="text-base font-bold text-slate-900">
              Map CSV Headers to ZenCro Schema
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm which column corresponds to each student demographic field.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">CSV Column Header</th>
                    <th className="py-3 px-4">ZenCro Registry Field</th>
                    <th className="py-3 px-4 text-center">Required?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mappings.map((mapping, idx) => (
                    <tr key={mapping.csv_header} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {mapping.csv_header}
                      </td>
                      <td className="py-2 px-4">
                        <Select
                          value={mapping.zencro_field}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMappings((prev) =>
                              prev.map((m, i) => (i === idx ? { ...m, zencro_field: val } : m))
                            );
                          }}
                          options={[
                            { label: 'Do not import this column', value: '' },
                            { label: 'admission_no (Admission Number)', value: 'admission_no' },
                            { label: 'first_name (First Name)', value: 'first_name' },
                            { label: 'last_name (Last Name)', value: 'last_name' },
                            { label: 'dob (Date of Birth)', value: 'dob' },
                            { label: 'gender (Gender)', value: 'gender' },
                            { label: 'class_id (Class ID)', value: 'class_id' },
                            { label: 'section_id (Section ID)', value: 'section_id' },
                            { label: 'guardian_name (Primary Guardian)', value: 'guardian_name' },
                            { label: 'guardian_phone (Guardian Contact)', value: 'guardian_phone' },
                          ]}
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        {mapping.required ? (
                          <span className="text-rose-600 font-bold">Yes</span>
                        ) : (
                          <span className="text-slate-400">Optional</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)}>
                <ArrowLeftIcon size={14} className="mr-1" /> Back
              </Button>
              <Button
                size="sm"
                onClick={handleValidate}
                disabled={isProcessing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isProcessing ? 'Validating...' : 'Validate Schema & Check Errors'} <ArrowRightIcon size={14} className="ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4 & 5: VALIDATION & ERROR REVIEW */}
      {(currentStep === 4 || currentStep === 5) && validation && (
        <Card className="border-slate-200/90 shadow-xs bg-white p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Validation Results</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated {validation.total_rows} records against data types and required admission numbers.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                {validation.valid_rows_count} Valid Rows
              </span>
              {validation.invalid_rows_count > 0 && (
                <span className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold">
                  {validation.invalid_rows_count} Rows with Errors
                </span>
              )}
            </div>
          </div>

          {/* Errors List */}
          {validation.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-rose-700 uppercase">Detailed Validation Errors:</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {validation.errors.map((err, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
                    <span>
                      <strong>Row {err.row_number}:</strong> Field <code className="bg-rose-100 px-1 rounded">{err.field_name}</code> — {err.error_message}
                    </span>
                    <span className="font-mono text-rose-600 font-bold">Value: {err.invalid_value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)}>
              <ArrowLeftIcon size={14} className="mr-1" /> Adjust Mapping
            </Button>
            <Button size="sm" onClick={() => setCurrentStep(6)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Preview Mapped Records <ArrowRightIcon size={14} className="ml-1" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 6 & 7: PREVIEW & CONFIRM */}
      {(currentStep === 6 || currentStep === 7) && validation && (
        <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Preview Cleaned Student Records (Ready for Import)
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Invalid records will be skipped during ingestion.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {validation.valid_rows_count} records ready
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Admission ID</th>
                    <th className="py-2.5 px-3">First Name</th>
                    <th className="py-2.5 px-3">Last Name</th>
                    <th className="py-2.5 px-3">Date of Birth</th>
                    <th className="py-2.5 px-3">Gender</th>
                    <th className="py-2.5 px-3">Class & Section</th>
                    <th className="py-2.5 px-3">Guardian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {validation.preview_records
                    .filter((r) => r.admission_no && r.first_name)
                    .map((rec, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {rec.admission_no}
                        </td>
                        <td className="py-2.5 px-3 font-semibold">{rec.first_name}</td>
                        <td className="py-2.5 px-3">{rec.last_name || '—'}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{rec.dob}</td>
                        <td className="py-2.5 px-3 capitalize">{rec.gender}</td>
                        <td className="py-2.5 px-3">{rec.class_id} ({rec.section_id})</td>
                        <td className="py-2.5 px-3">{rec.guardian_name || '—'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(4)}>
                <ArrowLeftIcon size={14} className="mr-1" /> Back
              </Button>
              <Button
                size="sm"
                onClick={handleExecuteImport}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                <CheckCircleIcon size={15} className="mr-1.5" />
                {isProcessing ? 'Importing Student Records...' : 'Confirm & Ingest into Registry'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 8: COMPLETED */}
      {currentStep === 8 && jobResult && (
        <Card className="border-slate-200/90 shadow-xs bg-white text-center p-10 space-y-5">
          <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircleIcon size={36} />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Data Migration Successfully Completed!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Job Identifier: <code className="font-mono text-slate-800">{jobResult.job_id}</code>
            </p>
          </div>

          <div className="max-w-md mx-auto grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Imported Students</span>
              <span className="font-extrabold text-emerald-700 text-lg">
                {jobResult.imported_count}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Failed / Skipped</span>
              <span className="font-extrabold text-slate-600 text-lg">
                {jobResult.failed_count}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
              Import Another Batch
            </Button>
            <Button
              size="sm"
              onClick={() => (window.location.href = '/students')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              View Students Registry
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
