/**
 * ZenCro Attendance Module Types
 * Day 3 Specification & API Data Contract
 * 
 * Supports fast teacher-first roster attendance (default all PRESENT),
 * bulk save via POST /api/attendance/bulk, attendance history,
 * and offline sync foundation (Dexie / local storage caching).
 */

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'holiday';

export interface AttendanceStudentRow {
  student_id: string;
  admission_no: string;
  name: string;
  gender: string;
  status: AttendanceStatus;
  remarks?: string;
  avatar_url?: string;
  roll_no?: string;
}

export interface BulkAttendanceItem {
  student_id: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface BulkAttendanceRequest {
  date: string;
  class_id: string;
  section_id: string;
  records: BulkAttendanceItem[];
}

export interface AttendanceHistoryRecord {
  id: string;
  date: string;
  student_id: string;
  student_name: string;
  admission_no: string;
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  status: AttendanceStatus;
  remarks?: string;
  recorded_by?: string;
}

export interface ClassAttendanceSummary {
  date: string;
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  half_day_count: number;
  percentage: number;
  is_submitted: boolean;
  submitted_at?: string;
  submitted_by?: string;
}

export type OfflineSyncState =
  | 'online'
  | 'offline'
  | 'pending_sync'
  | 'synced'
  | 'syncing'
  | 'failed'
  | 'needs_attention';

export interface PendingOfflineAttendance {
  local_id: string;
  created_at: string;
  request: BulkAttendanceRequest;
  retry_count: number;
  sync_error?: string;
}
