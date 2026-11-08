export type AcademicYearStatus = 'active' | 'upcoming' | 'archived';

export interface AcademicTerm {
  id: string;
  name: string; // e.g. "Term 1 / Mid-Term", "Term 2 / Final"
  startDate: string;
  endDate: string;
  isCompleted: boolean;
}

export interface AcademicYear {
  id: string;
  name: string; // e.g., "2026-2027" or "2025-2026"
  startDate: string;
  endDate: string;
  status: AcademicYearStatus;
  isCurrent: boolean;
  terms: AcademicTerm[];
  totalWorkingDays: number;
  description?: string;
  createdAt?: string;
}

export type ClassLevel =
  | 'Pre-Primary'
  | 'Primary (1-5)'
  | 'Middle (6-8)'
  | 'Secondary (9-10)'
  | 'Senior Secondary (11-12)';

export type SeniorStream =
  | 'General'
  | 'Science (PCM)'
  | 'Science (PCB)'
  | 'Commerce'
  | 'Humanities / Arts'
  | 'Vocational';

export interface SchoolClass {
  id: string;
  name: string; // e.g. "Class 10", "Class 12 - Science", "Nursery"
  code: string; // e.g. "C10", "C12-SCI", "NUR"
  numericOrder: number; // 0 for nursery, 1 for class 1, 12 for class 12
  level: ClassLevel;
  stream?: SeniorStream;
  department?: string;
  totalSections: number;
  totalCapacity: number;
  totalEnrolled: number;
  status: 'active' | 'inactive';
  description?: string;
  createdAt?: string;
}

export interface ClassSection {
  id: string;
  classId: string;
  className: string;
  name: string; // e.g. "A", "B", "C", "Rose", "Lotus"
  roomNumber: string; // e.g. "Room 204" / "Block A - 101"
  maxCapacity: number;
  currentEnrollment: number;
  classTeacherId?: string;
  classTeacherName?: string;
  classTeacherEmail?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface TeacherOption {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
}
