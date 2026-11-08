/**
 * ZenCro Exams & Results Module Types
 * Day 5 Specification & API Data Contract
 */

export type ExamStatus = 'draft' | 'scheduled' | 'in_progress' | 'grading' | 'published';

export interface ExamSubjectConfig {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  max_marks: number;
  passing_marks: number;
  exam_date: string;
  start_time?: string;
  end_time?: string;
}

export interface Exam {
  id: string;
  name: string; // e.g. "Term 1 Mid-Term Examination", "Final Board Assessment"
  academic_year_id: string;
  academic_year_name: string;
  term_id: string;
  term_name: string;
  class_id: string;
  class_name: string;
  start_date: string;
  end_date: string;
  status: ExamStatus;
  subjects: ExamSubjectConfig[];
  total_students_enrolled?: number;
  graded_subjects_count?: number;
  description?: string;
  created_at?: string;
}

export interface StudentMarksRecord {
  student_id: string;
  admission_no: string;
  student_name: string;
  roll_no?: string;
  marks_obtained: number | null;
  max_marks: number;
  grade: string;
  is_absent: boolean;
  remarks?: string;
  status: 'pending' | 'saved' | 'verified';
}

export interface SubjectMarksEntrySheet {
  exam_id: string;
  exam_name: string;
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  subject_id: string;
  subject_name: string;
  max_marks: number;
  passing_marks: number;
  records: StudentMarksRecord[];
  is_locked?: boolean;
}

export interface SaveMarksRequest {
  exam_id: string;
  subject_id: string;
  section_id: string;
  records: {
    student_id: string;
    marks_obtained: number | null;
    is_absent: boolean;
    remarks?: string;
  }[];
}

export interface StudentExamPerformance {
  student_id: string;
  admission_no: string;
  student_name: string;
  class_name: string;
  section_name: string;
  rank?: number;
  total_marks_obtained: number;
  total_max_marks: number;
  percentage: number;
  overall_grade: string;
  result_status: 'Pass' | 'Fail' | 'Compartment' | 'Withheld';
  subject_performances: {
    subject_id: string;
    subject_name: string;
    marks_obtained: number | null;
    max_marks: number;
    grade: string;
    is_absent: boolean;
    passing_marks: number;
  }[];
}
