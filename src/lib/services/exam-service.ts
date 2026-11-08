/**
 * ZenCro Exam & Results Service
 * Day 5 Specification & API Data Contract
 * 
 * Includes:
 * - GET /api/exams
 * - POST /api/exams
 * - Marks entry sheet with quick keyboard-friendly evaluation
 * - Student results & performance analytics
 */

import {
  Exam,
  ExamSubjectConfig,
  SubjectMarksEntrySheet,
  SaveMarksRequest,
  StudentExamPerformance,
  StudentMarksRecord,
} from '@/types/exams';
import { studentService } from './student-service';

// Mock exams store
let examsStore: Exam[] = [
  {
    id: 'exam_term1_2026',
    name: 'Term 1 Mid-Term Examination 2026',
    academic_year_id: 'ay_2026_27',
    academic_year_name: '2026-2027',
    term_id: 'term_1',
    term_name: 'Term 1 (Mid-Term)',
    class_id: 'cls_10',
    class_name: 'Class 10',
    start_date: '2026-09-15',
    end_date: '2026-09-28',
    status: 'published',
    total_students_enrolled: 42,
    graded_subjects_count: 5,
    subjects: [
      { subject_id: 'sub_mat', subject_name: 'Mathematics', subject_code: 'MAT-041', max_marks: 100, passing_marks: 33, exam_date: '2026-09-15' },
      { subject_id: 'sub_sci', subject_name: 'Science', subject_code: 'SCI-086', max_marks: 100, passing_marks: 33, exam_date: '2026-09-18' },
      { subject_id: 'sub_eng', subject_name: 'English Language & Lit', subject_code: 'ENG-184', max_marks: 100, passing_marks: 33, exam_date: '2026-09-21' },
      { subject_id: 'sub_sst', subject_name: 'Social Science', subject_code: 'SST-087', max_marks: 100, passing_marks: 33, exam_date: '2026-09-24' },
      { subject_id: 'sub_hin', subject_name: 'Hindi Course A', subject_code: 'HIN-002', max_marks: 100, passing_marks: 33, exam_date: '2026-09-28' },
    ],
  },
  {
    id: 'exam_term2_preboard',
    name: 'Pre-Board Examination 2027',
    academic_year_id: 'ay_2026_27',
    academic_year_name: '2026-2027',
    term_id: 'term_2',
    term_name: 'Term 2 (Pre-Board)',
    class_id: 'cls_10',
    class_name: 'Class 10',
    start_date: '2026-12-10',
    end_date: '2026-12-22',
    status: 'scheduled',
    total_students_enrolled: 42,
    graded_subjects_count: 0,
    subjects: [
      { subject_id: 'sub_mat', subject_name: 'Mathematics', subject_code: 'MAT-041', max_marks: 100, passing_marks: 33, exam_date: '2026-12-10' },
      { subject_id: 'sub_sci', subject_name: 'Science', subject_code: 'SCI-086', max_marks: 100, passing_marks: 33, exam_date: '2026-12-14' },
      { subject_id: 'sub_eng', subject_name: 'English Language & Lit', subject_code: 'ENG-184', max_marks: 100, passing_marks: 33, exam_date: '2026-12-17' },
    ],
  },
];

// Helper to calculate CBSE 9-point grading scale
export function calculateGrade(marks: number | null, maxMarks: number = 100, isAbsent: boolean = false): string {
  if (isAbsent) return 'AB';
  if (marks === null || marks === undefined) return '-';
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 91) return 'A1';
  if (percentage >= 81) return 'A2';
  if (percentage >= 71) return 'B1';
  if (percentage >= 61) return 'B2';
  if (percentage >= 51) return 'C1';
  if (percentage >= 41) return 'C2';
  if (percentage >= 33) return 'D';
  return 'E (Needs Improvement)';
}

// In-memory marks store: `exam_id:subject_id:section_id` -> StudentMarksRecord[]
const marksDatabase: Record<string, StudentMarksRecord[]> = {};

export const examService = {
  /**
   * GET /api/exams
   */
  async getExams(class_id?: string): Promise<Exam[]> {
    await new Promise((res) => setTimeout(res, 180));
    if (class_id) {
      return examsStore.filter((e) => e.class_id === class_id);
    }
    return examsStore;
  },

  /**
   * GET /api/exams/:id
   */
  async getExamById(id: string): Promise<Exam | undefined> {
    await new Promise((res) => setTimeout(res, 120));
    return examsStore.find((e) => e.id === id);
  },

  /**
   * POST /api/exams
   */
  async createExam(data: Partial<Exam>): Promise<Exam> {
    await new Promise((res) => setTimeout(res, 300));
    const newExam: Exam = {
      id: `exam_${Date.now()}`,
      name: data.name || 'New Examination',
      academic_year_id: data.academic_year_id || 'ay_2026_27',
      academic_year_name: '2026-2027',
      term_id: data.term_id || 'term_1',
      term_name: data.term_name || 'Term 1',
      class_id: data.class_id || 'cls_10',
      class_name: data.class_name || 'Class 10',
      start_date: data.start_date || new Date().toISOString().split('T')[0],
      end_date: data.end_date || new Date().toISOString().split('T')[0],
      status: data.status || 'scheduled',
      total_students_enrolled: 40,
      graded_subjects_count: 0,
      subjects: data.subjects || [
        { subject_id: 'sub_mat', subject_name: 'Mathematics', subject_code: 'MAT-041', max_marks: 100, passing_marks: 33, exam_date: '2026-11-01' },
      ],
    };
    examsStore.unshift(newExam);
    return newExam;
  },

  /**
   * GET /api/exams/:id/marks?subject_id&section_id
   * Keyboard-friendly marks evaluation sheet
   */
  async getMarksEntrySheet(
    exam_id: string,
    subject_id: string,
    section_id: string
  ): Promise<SubjectMarksEntrySheet> {
    await new Promise((res) => setTimeout(res, 200));

    const exam = examsStore.find((e) => e.id === exam_id) || examsStore[0];
    const subject = exam.subjects.find((s) => s.subject_id === subject_id) || exam.subjects[0];

    const key = `${exam_id}:${subject_id}:${section_id}`;
    let records = marksDatabase[key];

    if (!records) {
      // Connect to real enrolled students via studentService ("ENTER ONCE -> USE EVERYWHERE")
      const { students } = await studentService.listStudents({
        class_id: exam.class_id,
        section_id,
        page: 1,
        page_size: 100,
      });

      records = students.map((std, index) => {
        // Deterministic mock marks
        const mockMarks = std.id === 'std_01' ? 94 : std.id === 'std_02' ? 88 : std.id === 'std_03' ? 76 : std.id === 'std_04' ? 91 : 82;
        return {
          student_id: std.id,
          admission_no: std.admission_no,
          student_name: `${std.first_name} ${std.last_name}`,
          roll_no: String(index + 1).padStart(2, '0'),
          marks_obtained: mockMarks,
          max_marks: subject.max_marks,
          grade: calculateGrade(mockMarks, subject.max_marks),
          is_absent: false,
          status: 'saved',
        };
      });

      marksDatabase[key] = records;
    }

    return {
      exam_id: exam.id,
      exam_name: exam.name,
      class_id: exam.class_id,
      class_name: exam.class_name,
      section_id,
      section_name: section_id === 'sec_10_a' ? 'Section A' : 'Section B',
      subject_id: subject.subject_id,
      subject_name: subject.subject_name,
      max_marks: subject.max_marks,
      passing_marks: subject.passing_marks,
      records,
    };
  },

  /**
   * POST /api/exams/:id/marks
   * Saves evaluated marks
   */
  async saveMarks(payload: SaveMarksRequest): Promise<{ success: boolean; message: string }> {
    await new Promise((res) => setTimeout(res, 300));

    const key = `${payload.exam_id}:${payload.subject_id}:${payload.section_id}`;
    const exam = examsStore.find((e) => e.id === payload.exam_id) || examsStore[0];
    const subject = exam.subjects.find((s) => s.subject_id === payload.subject_id) || exam.subjects[0];

    const currentRecords = marksDatabase[key] || [];

    const updatedRecords: StudentMarksRecord[] = payload.records.map((rec) => {
      const existing = currentRecords.find((r) => r.student_id === rec.student_id);
      const marks = rec.is_absent ? null : rec.marks_obtained;
      return {
        student_id: rec.student_id,
        admission_no: existing?.admission_no || 'ADM-2026',
        student_name: existing?.student_name || 'Student',
        roll_no: existing?.roll_no,
        marks_obtained: marks,
        max_marks: subject.max_marks,
        grade: calculateGrade(marks, subject.max_marks, rec.is_absent),
        is_absent: rec.is_absent,
        remarks: rec.remarks,
        status: 'saved',
      };
    });

    marksDatabase[key] = updatedRecords;
    return {
      success: true,
      message: `Successfully saved marks for ${updatedRecords.length} students.`,
    };
  },

  /**
   * GET /api/exams/:id/results
   * Aggregated performance breakdown
   */
  async getExamResults(exam_id: string): Promise<{
    performances: StudentExamPerformance[];
    class_average: number;
    highest_score: number;
    pass_percentage: number;
  }> {
    await new Promise((res) => setTimeout(res, 220));

    const exam = examsStore.find((e) => e.id === exam_id) || examsStore[0];
    const { students } = await studentService.listStudents({ class_id: exam.class_id, page: 1, page_size: 50 });

    const performances: StudentExamPerformance[] = students.map((std, idx) => {
      const isTop = idx === 0 || idx === 1;
      const totalMarksObtained = isTop ? 472 : 410 + (idx % 4) * 15;
      const totalMaxMarks = 500;
      const pct = Math.round((totalMarksObtained / totalMaxMarks) * 1000) / 10;

      return {
        student_id: std.id,
        admission_no: std.admission_no,
        student_name: `${std.first_name} ${std.last_name}`,
        class_name: exam.class_name,
        section_name: std.section || 'Section A',
        rank: idx + 1,
        total_marks_obtained: totalMarksObtained,
        total_max_marks: totalMaxMarks,
        percentage: pct,
        overall_grade: pct >= 90 ? 'A1' : pct >= 80 ? 'A2' : 'B1',
        result_status: 'Pass',
        subject_performances: exam.subjects.map((sub, sIdx) => {
          const marks = isTop ? 94 - sIdx * 2 : 82 - sIdx * 3;
          return {
            subject_id: sub.subject_id,
            subject_name: sub.subject_name,
            marks_obtained: marks,
            max_marks: sub.max_marks,
            grade: calculateGrade(marks, sub.max_marks),
            is_absent: false,
            passing_marks: sub.passing_marks,
          };
        }),
      };
    });

    return {
      performances,
      class_average: 84.2,
      highest_score: 489,
      pass_percentage: 97.6,
    };
  },
};
