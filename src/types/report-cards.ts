/**
 * ZenCro 3-Layer Report Card Architecture Types
 * Day 5 Specification & Product Blueprint
 * 
 * Layer 1: Board / Curriculum (CBSE, ICSE, State Board, IB, Cambridge)
 * Layer 2: Academic Level / Report Card Profile (Pre-Primary, Primary, Middle, Secondary, Higher Secondary)
 * Layer 3: Report Card Template (Custom visual layouts, co-curricular ratings, teacher remarks)
 */

import { SchoolBoard } from './school';

export type AcademicLevel =
  | 'Pre-Primary / Kindergarten'
  | 'Primary (1st to 5th)'
  | 'Middle School (6th to 8th)'
  | 'Secondary (9th to 10th)'
  | 'Senior Secondary (11th to 12th)';

export interface GradingScaleItem {
  grade: string;
  min_percentage: number;
  max_percentage: number;
  grade_point?: number;
  description: string;
}

export interface CoCurricularSkill {
  id: string;
  name: string; // e.g., "Work Education", "Art Education", "Health & Physical Education", "Discipline"
  max_grade: string;
}

export interface ReportCardProfile {
  id: string;
  name: string; // e.g. "CBSE Secondary 9-10 Profile", "Kindergarten Holistic Progress Profile"
  board: SchoolBoard;
  level: AcademicLevel;
  class_ids: string[];
  class_names: string[];
  template_id: string;
  grading_scale: GradingScaleItem[];
  co_curricular_skills: CoCurricularSkill[];
  term_weightage: {
    term_1_percentage: number;
    term_2_percentage: number;
  };
  show_attendance: boolean;
  show_rank: boolean;
  show_health_metrics: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ReportCardTemplate {
  id: string;
  name: string;
  layout: 'standard_cbse' | 'holistic_kindergarten' | 'icse_formal' | 'modern_compact';
  header_style: 'classic_shield' | 'modern_banner' | 'minimalist';
  accent_color: string;
  show_school_watermark: boolean;
  show_qr_verification: boolean;
  principal_signature_label: string;
  teacher_signature_label: string;
  parent_signature_label: string;
}

export interface StudentReportCardPayload {
  student_id: string;
  admission_no: string;
  student_name: string;
  dob: string;
  roll_no?: string;
  class_name: string;
  section_name: string;
  academic_year: string;
  school_profile: {
    name: string;
    affiliation_no: string;
    board: string;
    address: string;
    logo_url?: string;
  };
  attendance: {
    total_working_days: number;
    days_present: number;
    percentage: number;
  };
  scholastic_results: {
    subject_name: string;
    subject_code: string;
    term1_marks: number;
    term2_marks: number;
    total_marks: number;
    max_marks: number;
    grade: string;
  }[];
  co_curricular_results: {
    skill_name: string;
    grade: string;
  }[];
  total_marks_obtained: number;
  grand_max_marks: number;
  overall_percentage: number;
  overall_grade: string;
  rank?: number;
  class_teacher_remarks: string;
  principal_remarks: string;
  issue_date: string;
}
