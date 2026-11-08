/**
 * ZenCro Import Wizard & Data Export Service
 * Day 7 Specification & API Data Contract
 */

import {
  ImportColumnMapping,
  ImportValidationSummary,
  ImportJobResult,
  ExportModule,
  ExportFormat,
  ExportHistoryRecord,
} from '@/types/import-export';
import { studentService } from './student-service';

export const importExportService = {
  /**
   * Generates default mapping from CSV headers to ZenCro student schema
   */
  detectColumns(headers: string[]): ImportColumnMapping[] {
    const defaultFields = [
      { field: 'admission_no', label: 'Admission Number', required: true, aliases: ['admission', 'adm', 'admission_no', 'id', 'student_id'] },
      { field: 'first_name', label: 'First Name', required: true, aliases: ['first_name', 'fname', 'first name', 'student first name'] },
      { field: 'last_name', label: 'Last Name', required: true, aliases: ['last_name', 'lname', 'surname', 'last name'] },
      { field: 'dob', label: 'Date of Birth (YYYY-MM-DD)', required: true, aliases: ['dob', 'date of birth', 'birth_date'] },
      { field: 'gender', label: 'Gender', required: true, aliases: ['gender', 'sex'] },
      { field: 'class_id', label: 'Class Code', required: true, aliases: ['class', 'grade', 'class_id'] },
      { field: 'section_id', label: 'Section Code', required: true, aliases: ['section', 'sec', 'division', 'section_id'] },
      { field: 'guardian_name', label: 'Primary Guardian Name', required: false, aliases: ['guardian', 'parent', 'father', 'mother', 'guardian_name'] },
      { field: 'guardian_phone', label: 'Guardian Phone', required: false, aliases: ['phone', 'mobile', 'contact', 'guardian_phone'] },
      { field: 'guardian_email', label: 'Guardian Email', required: false, aliases: ['email', 'guardian_email'] },
    ];

    return headers.map((header) => {
      const lower = header.toLowerCase().trim();
      const matched = defaultFields.find((f) =>
        f.aliases.some((alias) => lower.includes(alias))
      );

      return {
        csv_header: header,
        zencro_field: matched ? matched.field : '',
        required: matched ? matched.required : false,
        sample_values: ['Sample Record 1', 'Sample Record 2'],
      };
    });
  },

  /**
   * Validates parsed CSV data rows against mappings and duplicate checks
   */
  async validateData(
    rows: Record<string, string>[],
    mappings: ImportColumnMapping[]
  ): Promise<ImportValidationSummary> {
    await new Promise((res) => setTimeout(res, 350));

    const totalRows = rows.length;
    const errors: { row_number: number; field_name: string; invalid_value: string; error_message: string }[] = [];
    const previewRecords: Record<string, string>[] = [];
    let duplicates = 0;

    const seenAdmissionNos = new Set<string>();

    rows.forEach((row, index) => {
      const rowNum = index + 1;
      const mappedRecord: Record<string, string> = {};

      mappings.forEach((m) => {
        if (m.zencro_field) {
          mappedRecord[m.zencro_field] = row[m.csv_header] || '';
        }
      });

      // Validation 1: Required admission_no
      const adm = mappedRecord['admission_no']?.trim();
      if (!adm) {
        errors.push({
          row_number: rowNum,
          field_name: 'admission_no',
          invalid_value: 'EMPTY',
          error_message: 'Admission Number is mandatory.',
        });
      } else if (seenAdmissionNos.has(adm.toLowerCase())) {
        duplicates++;
        errors.push({
          row_number: rowNum,
          field_name: 'admission_no',
          invalid_value: adm,
          error_message: `Duplicate Admission Number "${adm}" in import dataset.`,
        });
      } else {
        seenAdmissionNos.add(adm.toLowerCase());
      }

      // Validation 2: Required first_name
      if (!mappedRecord['first_name']?.trim()) {
        errors.push({
          row_number: rowNum,
          field_name: 'first_name',
          invalid_value: 'EMPTY',
          error_message: 'First Name cannot be empty.',
        });
      }

      previewRecords.push(mappedRecord);
    });

    const invalidRowsCount = new Set(errors.map((e) => e.row_number)).size;
    const validRowsCount = totalRows - invalidRowsCount;

    return {
      total_rows: totalRows,
      valid_rows_count: validRowsCount,
      invalid_rows_count: invalidRowsCount,
      duplicate_count: duplicates,
      errors,
      preview_records: previewRecords.slice(0, 10),
    };
  },

  /**
   * Executes import of validated records into ZenCro student registry
   */
  async executeImport(records: Record<string, string>[]): Promise<ImportJobResult> {
    await new Promise((res) => setTimeout(res, 600));

    let imported = 0;
    for (const rec of records) {
      if (rec.admission_no && rec.first_name) {
        try {
          await studentService.createStudent({
            admission_no: rec.admission_no,
            first_name: rec.first_name,
            last_name: rec.last_name || '',
            dob: rec.dob || '2012-05-15',
            gender: (rec.gender?.toLowerCase() === 'female' ? 'female' : 'male') as any,
            class_id: rec.class_id || 'cls_10',
            section_id: rec.section_id || 'sec_10_a',
            guardians: rec.guardian_name
              ? [
                  {
                    name: rec.guardian_name,
                    relationship: 'Guardian',
                    phone: rec.guardian_phone || '+91 98000 00000',
                    email: rec.guardian_email,
                  },
                ]
              : [],
          });
          imported++;
        } catch {
          // Keep count
        }
      }
    }

    return {
      job_id: `job_${Date.now()}`,
      filename: 'student_roster_migration_batch.csv',
      imported_count: imported,
      failed_count: records.length - imported,
      completed_at: new Date().toISOString(),
      target_entity: 'students',
    };
  },

  /**
   * Export records by module and format
   */
  async getExportHistory(): Promise<ExportHistoryRecord[]> {
    await new Promise((res) => setTimeout(res, 150));
    return [
      {
        id: 'exp_01',
        module: 'students',
        filename: 'ZenCro_Active_Students_Roster_2026.csv',
        record_count: 42,
        format: 'csv',
        created_at: '2026-10-25 15:30',
        created_by: 'Staff Admin (Mariya)',
        file_size_kb: 148,
        download_url: '#',
      },
      {
        id: 'exp_02',
        module: 'fees',
        filename: 'Fee_Collection_Summary_Term1_2026.xlsx',
        record_count: 120,
        format: 'xlsx',
        created_at: '2026-10-22 09:45',
        created_by: 'Rajesh Verma (Accountant)',
        file_size_kb: 312,
        download_url: '#',
      },
      {
        id: 'exp_03',
        module: 'results',
        filename: 'Class_10_Term1_Marks_Consolidated.csv',
        record_count: 42,
        format: 'csv',
        created_at: '2026-10-20 18:00',
        created_by: 'Dr. S. Mukherjee (Principal)',
        file_size_kb: 89,
        download_url: '#',
      },
    ];
  },
};
