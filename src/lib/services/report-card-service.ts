/**
 * ZenCro 3-Layer Report Card Service
 * Day 5 Specification & Product Blueprint
 * 
 * Pipeline:
 * School Configuration -> Board/Curriculum -> Academic Level/Profile ->
 * Class Assignment -> Assessment Type -> Template -> Preview -> Generate
 */

import {
  ReportCardProfile,
  ReportCardTemplate,
  StudentReportCardPayload,
} from '@/types/report-cards';
import { studentService } from './student-service';

const INITIAL_PROFILES: ReportCardProfile[] = [
  {
    id: 'rc_prof_cbse_sec',
    name: 'CBSE Secondary (Classes 9-10) Holistic Profile',
    board: 'CBSE',
    level: 'Secondary (9th to 10th)',
    class_ids: ['cls_9', 'cls_10'],
    class_names: ['Class 9', 'Class 10'],
    template_id: 'tmpl_standard_cbse',
    grading_scale: [
      { grade: 'A1', min_percentage: 91, max_percentage: 100, grade_point: 10, description: 'Outstanding performance' },
      { grade: 'A2', min_percentage: 81, max_percentage: 90, grade_point: 9, description: 'Excellent performance' },
      { grade: 'B1', min_percentage: 71, max_percentage: 80, grade_point: 8, description: 'Very Good' },
      { grade: 'B2', min_percentage: 61, max_percentage: 70, grade_point: 7, description: 'Good' },
      { grade: 'C1', min_percentage: 51, max_percentage: 60, grade_point: 6, description: 'Satisfactory' },
      { grade: 'C2', min_percentage: 41, max_percentage: 50, grade_point: 5, description: 'Average' },
      { grade: 'D', min_percentage: 33, max_percentage: 40, grade_point: 4, description: 'Pass' },
      { grade: 'E', min_percentage: 0, max_percentage: 32, grade_point: 0, description: 'Needs Improvement / Compartment' },
    ],
    co_curricular_skills: [
      { id: 'skill_work_ed', name: 'Work Education / Practical Skills', max_grade: 'A' },
      { id: 'skill_art', name: 'Visual & Performing Arts', max_grade: 'A' },
      { id: 'skill_health_pe', name: 'Health & Physical Education (Sports)', max_grade: 'A' },
      { id: 'skill_discipline', name: 'Discipline, Ethics & Punctuality', max_grade: 'A' },
    ],
    term_weightage: {
      term_1_percentage: 40,
      term_2_percentage: 60,
    },
    show_attendance: true,
    show_rank: true,
    show_health_metrics: true,
  },
  {
    id: 'rc_prof_cbse_pri',
    name: 'CBSE Primary (Classes 1-5) Foundational Profile',
    board: 'CBSE',
    level: 'Primary (1st to 5th)',
    class_ids: ['cls_1', 'cls_2', 'cls_3', 'cls_4', 'cls_5'],
    class_names: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    template_id: 'tmpl_holistic_pri',
    grading_scale: [
      { grade: 'A*', min_percentage: 90, max_percentage: 100, description: 'Exemplary' },
      { grade: 'A', min_percentage: 75, max_percentage: 89, description: 'Proficient' },
      { grade: 'B', min_percentage: 60, max_percentage: 74, description: 'Developing' },
      { grade: 'C', min_percentage: 0, max_percentage: 59, description: 'Beginning' },
    ],
    co_curricular_skills: [
      { id: 'skill_listening', name: 'Listening & Oral Expression', max_grade: 'A*' },
      { id: 'skill_handwriting', name: 'Penmanship & Creative Arts', max_grade: 'A*' },
      { id: 'skill_social', name: 'Teamwork & Social Sensitivity', max_grade: 'A*' },
    ],
    term_weightage: {
      term_1_percentage: 50,
      term_2_percentage: 50,
    },
    show_attendance: true,
    show_rank: false,
    show_health_metrics: true,
  },
];

const TEMPLATES: ReportCardTemplate[] = [
  {
    id: 'tmpl_standard_cbse',
    name: 'Official CBSE Comprehensive Format',
    layout: 'standard_cbse',
    header_style: 'classic_shield',
    accent_color: '#2563eb', // Royal Blue
    show_school_watermark: true,
    show_qr_verification: true,
    principal_signature_label: 'Dr. S. Mukherjee (Principal)',
    teacher_signature_label: 'Mrs. Kavita Rao (Class Teacher)',
    parent_signature_label: 'Parent / Guardian Signature',
  },
  {
    id: 'tmpl_holistic_pri',
    name: 'Holistic Primary & Kindergarten Progress Record',
    layout: 'holistic_kindergarten',
    header_style: 'modern_banner',
    accent_color: '#0284c7', // Sky Blue
    show_school_watermark: false,
    show_qr_verification: true,
    principal_signature_label: 'Principal',
    teacher_signature_label: 'Class Educator',
    parent_signature_label: 'Parent / Guardian',
  },
];

let profilesStore = [...INITIAL_PROFILES];

export const reportCardService = {
  async getProfiles(): Promise<ReportCardProfile[]> {
    await new Promise((res) => setTimeout(res, 150));
    return profilesStore;
  },

  async getProfileById(id: string): Promise<ReportCardProfile | undefined> {
    await new Promise((res) => setTimeout(res, 100));
    return profilesStore.find((p) => p.id === id);
  },

  async saveProfile(profile: Partial<ReportCardProfile>): Promise<ReportCardProfile> {
    await new Promise((res) => setTimeout(res, 250));
    if (profile.id) {
      const idx = profilesStore.findIndex((p) => p.id === profile.id);
      if (idx !== -1) {
        profilesStore[idx] = { ...profilesStore[idx], ...profile };
        return profilesStore[idx];
      }
    }
    const newProfile: ReportCardProfile = {
      id: `rc_prof_${Date.now()}`,
      name: profile.name || 'Custom Report Card Profile',
      board: profile.board || 'CBSE',
      level: profile.level || 'Secondary (9th to 10th)',
      class_ids: profile.class_ids || ['cls_10'],
      class_names: profile.class_names || ['Class 10'],
      template_id: profile.template_id || 'tmpl_standard_cbse',
      grading_scale: profile.grading_scale || INITIAL_PROFILES[0].grading_scale,
      co_curricular_skills: profile.co_curricular_skills || INITIAL_PROFILES[0].co_curricular_skills,
      term_weightage: profile.term_weightage || { term_1_percentage: 40, term_2_percentage: 60 },
      show_attendance: profile.show_attendance ?? true,
      show_rank: profile.show_rank ?? true,
      show_health_metrics: profile.show_health_metrics ?? true,
    };
    profilesStore.push(newProfile);
    return newProfile;
  },

  async getTemplates(): Promise<ReportCardTemplate[]> {
    await new Promise((res) => setTimeout(res, 100));
    return TEMPLATES;
  },

  /**
   * Generates complete report card payload for a student
   * "ENTER ONCE -> USE EVERYWHERE"
   */
  async generateStudentReportCard(studentId: string): Promise<StudentReportCardPayload> {
    await new Promise((res) => setTimeout(res, 250));
    const student = await studentService.getStudent(studentId);

    const isTopStudent = studentId === 'std_01' || studentId === 'std_02';

    return {
      student_id: studentId,
      admission_no: student?.admission_no || 'ADM-2026-0101',
      student_name: student ? `${student.first_name} ${student.last_name}` : 'Aryan Sharma',
      dob: student?.dob || '2010-05-14',
      roll_no: '01',
      class_name: student?.class_name || 'Class 10',
      section_name: student?.section_name || 'Section A',
      academic_year: '2026-2027',
      school_profile: {
        name: 'ZenCro Public School',
        affiliation_no: 'CBSE Affiliation: 2130891 (School Code: 04910)',
        board: 'Central Board of Secondary Education (CBSE)',
        address: 'Sector 14, Institutional Area, New Delhi - 110001',
      },
      attendance: {
        total_working_days: 140,
        days_present: isTopStudent ? 134 : 126,
        percentage: isTopStudent ? 95.7 : 90.0,
      },
      scholastic_results: [
        { subject_name: 'Mathematics', subject_code: 'MAT-041', term1_marks: isTopStudent ? 94 : 82, term2_marks: isTopStudent ? 96 : 85, total_marks: isTopStudent ? 95 : 84, max_marks: 100, grade: isTopStudent ? 'A1' : 'A2' },
        { subject_name: 'Science (Theory & Practical)', subject_code: 'SCI-086', term1_marks: isTopStudent ? 91 : 78, term2_marks: isTopStudent ? 93 : 82, total_marks: isTopStudent ? 92 : 80, max_marks: 100, grade: isTopStudent ? 'A1' : 'B1' },
        { subject_name: 'English Language & Literature', subject_code: 'ENG-184', term1_marks: isTopStudent ? 88 : 84, term2_marks: isTopStudent ? 90 : 86, total_marks: isTopStudent ? 89 : 85, max_marks: 100, grade: isTopStudent ? 'A2' : 'A2' },
        { subject_name: 'Social Science', subject_code: 'SST-087', term1_marks: isTopStudent ? 92 : 79, term2_marks: isTopStudent ? 94 : 81, total_marks: isTopStudent ? 93 : 80, max_marks: 100, grade: isTopStudent ? 'A1' : 'B1' },
        { subject_name: 'Hindi Course A', subject_code: 'HIN-002', term1_marks: isTopStudent ? 86 : 80, term2_marks: isTopStudent ? 88 : 82, total_marks: isTopStudent ? 87 : 81, max_marks: 100, grade: isTopStudent ? 'A2' : 'A2' },
      ],
      co_curricular_results: [
        { skill_name: 'Work Education / IT Skills', grade: 'A' },
        { skill_name: 'Art & Design Education', grade: 'A' },
        { skill_name: 'Health & Physical Education', grade: 'A' },
        { skill_name: 'Discipline & Conduct', grade: 'A' },
      ],
      total_marks_obtained: isTopStudent ? 456 : 410,
      grand_max_marks: 500,
      overall_percentage: isTopStudent ? 91.2 : 82.0,
      overall_grade: isTopStudent ? 'A1' : 'A2',
      rank: isTopStudent ? 2 : 7,
      class_teacher_remarks: isTopStudent
        ? 'Exceptional critical thinking and leadership skills. Outstanding conceptual clarity in Mathematics and Science.'
        : 'Good effort and active classroom participation. Consistent progress across scholastic subjects.',
      principal_remarks: 'Promoted to Senior Secondary with distinction. Best wishes for academic pursuits.',
      issue_date: '2026-10-26',
    };
  },
};
