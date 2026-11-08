/**
 * ZenCro Import Wizard & Data Export Types
 * Day 7 Specification
 * 
 * 8-Step Import Wizard:
 * 1. Upload -> 2. Detect File -> 3. Column Mapping -> 4. Validation ->
 * 5. Error Review -> 6. Preview -> 7. Confirm -> 8. Completed
 */

export type ImportWizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ImportColumnMapping {
  csv_header: string;
  zencro_field: string;
  required: boolean;
  sample_values: string[];
}

export interface ImportErrorRow {
  row_number: number;
  field_name: string;
  invalid_value: string;
  error_message: string;
}

export interface ImportValidationSummary {
  total_rows: number;
  valid_rows_count: number;
  invalid_rows_count: number;
  duplicate_count: number;
  errors: ImportErrorRow[];
  preview_records: Record<string, string>[];
}

export interface ImportJobResult {
  job_id: string;
  filename: string;
  imported_count: number;
  failed_count: number;
  completed_at: string;
  target_entity: 'students' | 'guardians' | 'marks' | 'fees';
}

export type ExportModule = 'students' | 'attendance' | 'fees' | 'exams' | 'results';
export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

export interface ExportHistoryRecord {
  id: string;
  module: ExportModule;
  filename: string;
  record_count: number;
  format: ExportFormat;
  created_at: string;
  created_by: string;
  file_size_kb: number;
  download_url: string;
}
