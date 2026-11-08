/**
 * ZenCro Student Management & Student 360 Type Definitions
 * 
 * Aligned strictly with API Contracts for Day 2:
 * - GET /api/students
 * - POST /api/students
 * - PATCH /api/students/:id
 * - GET /api/students/:id/360
 */

export type StudentStatus = 'active' | 'inactive' | 'suspended' | 'transferred' | 'alumni';
export type Gender = 'male' | 'female' | 'other';

export interface Guardian {
  id?: string;
  student_id?: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  occupation?: string;
  is_primary?: boolean;
  address?: string;
}

export interface StudentDocument {
  id: string;
  title: string;
  type: string;
  file_name?: string;
  uploaded_at?: string;
  status: 'verified' | 'pending' | 'missing';
}

export interface Student {
  id: string;
  admission_no: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: Gender;
  class_id: string;
  section_id: string;
  class_name?: string;
  section_name?: string;
  academic_year_id?: string;
  status: StudentStatus;
  email?: string;
  phone?: string;
  address?: string;
  blood_group?: string;
  category?: string;
  religion?: string;
  emergency_contact?: string;
  avatar_url?: string;
  enrollment_date?: string;
  documents?: StudentDocument[];
  created_at?: string;
  updated_at?: string;
}

export interface StudentListItem {
  id: string;
  admission_no: string;
  first_name: string;
  last_name: string;
  class: string;
  section: string;
  status: StudentStatus;
  gender?: Gender;
  dob?: string;
  avatar_url?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_relationship?: string;
  email?: string;
}

export interface StudentListResponse {
  students: StudentListItem[];
  total: number;
}

export interface StudentFormData {
  admission_no: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: Gender;
  status: StudentStatus;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  email?: string;
  phone?: string;
  address?: string;
  blood_group?: string;
  category?: string;
  religion?: string;
  emergency_contact?: string;
  guardians: Guardian[];
  documents?: StudentDocument[];
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'holiday';
  remarks?: string;
  period_or_session?: string;
}

export interface AttendanceSummary {
  percentage: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  half_days: number;
  total_working_days: number;
  recent_records: AttendanceRecord[];
}

export interface FeeTransaction {
  id: string;
  receipt_no: string;
  date: string;
  title: string;
  amount: number;
  payment_mode: 'Online UPI' | 'Net Banking' | 'Cash' | 'Cheque' | 'Card';
  status: 'paid' | 'pending' | 'failed';
}

export interface FeeSummary {
  total_fee: number;
  paid_fee: number;
  outstanding_fee: number;
  next_due_date?: string;
  currency?: string;
  recent_transactions: FeeTransaction[];
}

export interface SubjectResult {
  subject_name: string;
  subject_code: string;
  max_marks: number;
  obtained_marks: number;
  grade: string;
  remarks?: string;
}

export interface AcademicSummary {
  latest_exam_name: string;
  overall_percentage: number;
  grade: string;
  rank?: string;
  gpa?: string;
  subjects: SubjectResult[];
  total_marks?: number;
  max_total_marks?: number;
}

export interface StudentFormItem {
  id: string;
  title: string;
  category: string;
  submission_date?: string;
  status: 'submitted' | 'pending' | 'approved' | 'rejected';
  due_date?: string;
}

export interface PtmSession {
  id: string;
  title: string;
  date: string;
  time: string;
  teacher_name: string;
  teacher_designation?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  mode: 'In-Person' | 'Online Video';
  agenda?: string;
  feedback_notes?: string;
}

export interface PtmSummary {
  upcoming?: PtmSession | null;
  history: PtmSession[];
}

export interface StudentActivity {
  id: string;
  date: string;
  type: 'attendance' | 'academic' | 'fee' | 'ptm' | 'form' | 'general';
  title: string;
  description: string;
  actor?: string;
  time?: string;
}

export interface Student360 {
  student: Student;
  guardians: Guardian[];
  attendance_summary: AttendanceSummary;
  fee_summary: FeeSummary;
  academic_summary: AcademicSummary;
  forms: StudentFormItem[];
  ptm: PtmSummary;
  recent_activity: StudentActivity[];
}

export interface StudentFilters {
  class_id?: string;
  section_id?: string;
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
}
