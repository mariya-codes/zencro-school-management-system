/**
 * ZenCro Communication, Parent Dashboard, PTM & Forms Service
 * Day 6 Specification & API Data Contract
 */

import {
  Announcement,
  PtmEvent,
  SchoolForm,
  StudentFormSubmission,
  ParentDashboardResponse,
} from '@/types/communication';
import { studentService } from './student-service';

let announcementsStore: Announcement[] = [
  {
    id: 'ann_01',
    title: 'Parent-Teacher Meeting (PTM) for Term 1 Evaluations',
    content: 'Dear Parents, the Term 1 comprehensive progress reviews will be held on Saturday, Nov 7th. Slot booking is now open on your Parent Portal. Please book an available 15-minute conference with your ward\'s class teacher.',
    author_id: 'usr_prin_1',
    author_name: 'Dr. S. Mukherjee',
    author_role: 'Principal',
    priority: 'important',
    target_audience: 'parents',
    published_at: '2026-10-25T09:00:00Z',
    is_pinned: true,
  },
  {
    id: 'ann_02',
    title: 'Annual Inter-School STEM & Robotics Exposition 2026',
    content: 'All students from Classes 8 to 12 are invited to register projects for the upcoming State STEM Festival. Submissions and prototype proposals must be handed to the Science Department by November 15th.',
    author_id: 'usr_t_01',
    author_name: 'Mrs. Kavita Rao',
    author_role: 'Head of Science Department',
    priority: 'normal',
    target_audience: 'all',
    published_at: '2026-10-24T14:30:00Z',
    is_pinned: false,
  },
  {
    id: 'ann_03',
    title: 'Urgent: Winter Uniform Transition Mandatory from Nov 1st',
    content: 'Please ensure students arrive in complete winter school blazers and ties starting next Monday. Uniform inspection will be conducted during morning assembly.',
    author_id: 'usr_adm_1',
    author_name: 'Vice Principal Office',
    author_role: 'School Administration',
    priority: 'urgent',
    target_audience: 'all',
    published_at: '2026-10-23T11:15:00Z',
    is_pinned: false,
  },
  {
    id: 'ann_04',
    title: 'Class 10 Science Practical Examination Instructions',
    content: 'Class 10 Section A students are instructed to bring signed lab manuals and calibrated observation logbooks for tomorrow\'s physics lab test.',
    author_id: 'usr_t_01',
    author_name: 'Mrs. Kavita Rao',
    author_role: 'Physics Faculty',
    priority: 'important',
    target_audience: 'class',
    target_class_id: 'cls_10',
    target_class_name: 'Class 10',
    target_section_id: 'sec_10_a',
    target_section_name: 'Section A',
    published_at: '2026-10-26T08:00:00Z',
    is_pinned: false,
  },
];

let ptmStore: PtmEvent[] = [
  {
    id: 'ptm_term1_2026',
    title: 'Term 1 Mid-Term Parent Teacher Meeting',
    date: '2026-11-07',
    class_id: 'cls_10',
    class_name: 'Class 10',
    section_id: 'sec_10_a',
    section_name: 'Section A',
    teacher_id: 'usr_t_01',
    teacher_name: 'Mrs. Kavita Rao',
    teacher_designation: 'Senior Faculty & Class 10 Teacher',
    teacher_email: 'kavita.rao@zencro-school.edu.in',
    mode: 'In-Person',
    location_or_link: 'Room 204, Senior Academic Wing (2nd Floor)',
    agenda: 'Discussion on Mid-term examination results, classroom punctuality, and board exam preparation strategy.',
    status: 'scheduled',
    slots: [
      { slot_id: 'slot_1', time: '09:00 AM - 09:15 AM', is_booked: true, booked_by_parent_name: 'Dr. Ramesh Sharma', booked_for_student_id: 'std_01', booked_for_student_name: 'Aryan Sharma', notes: 'Discuss advanced physics coaching' },
      { slot_id: 'slot_2', time: '09:15 AM - 09:30 AM', is_booked: false },
      { slot_id: 'slot_3', time: '09:30 AM - 09:45 AM', is_booked: true, booked_by_parent_name: 'Mr. Rajesh Iyer', booked_for_student_id: 'std_02', booked_for_student_name: 'Ananya Iyer' },
      { slot_id: 'slot_4', time: '09:45 AM - 10:00 AM', is_booked: false },
      { slot_id: 'slot_5', time: '10:00 AM - 10:15 AM', is_booked: false },
      { slot_id: 'slot_6', time: '10:15 AM - 10:30 AM', is_booked: false },
      { slot_id: 'slot_7', time: '10:45 AM - 11:00 AM', is_booked: false },
      { slot_id: 'slot_8', time: '11:00 AM - 11:15 AM', is_booked: false },
    ],
  },
];

let formsStore: SchoolForm[] = [
  {
    id: 'form_field_trip_2026',
    title: 'Consent & Medical Clearance: National Science Centre Field Visit',
    description: 'Mandatory parent permission form for Class 10 experiential educational field trip to the National Science Centre and Planetarium on Friday, Nov 13th.',
    category: 'Consent',
    created_at: '2026-10-20',
    due_date: '2026-11-05',
    is_mandatory: true,
    target_class_id: 'cls_10',
    target_class_name: 'Class 10',
    status: 'active',
    total_assigned: 42,
    total_submitted: 34,
    fields: [
      { id: 'f_consent', label: 'I give consent for my child to attend the National Science Centre field trip on Nov 13, 2026.', type: 'checkbox', required: true },
      { id: 'f_food_pref', label: 'Meal Preference for Field Trip Lunch Box', type: 'radio', required: true, options: ['Vegetarian', 'Jain Vegetarian', 'Non-Vegetarian'] },
      { id: 'f_medical_notes', label: 'Any allergies, medical dietary restrictions, or medication requirements?', type: 'textarea', required: false, placeholder: 'e.g. Asthma inhaler required, nut allergy...' },
      { id: 'f_emergency_phone', label: 'Emergency Contact Mobile Number for Field Trip Day', type: 'text', required: true, placeholder: '+91 98101 XXXXX' },
    ],
  },
  {
    id: 'form_annual_health_update',
    title: 'Annual Student Health & Immunization Verification Form',
    description: 'Verification of blood group, immunization boosters, and emergency medical contact info for the institutional health registry.',
    category: 'Medical',
    created_at: '2026-09-01',
    due_date: '2026-11-20',
    is_mandatory: false,
    status: 'active',
    total_assigned: 150,
    total_submitted: 128,
    fields: [
      { id: 'f_blood_group', label: 'Student Confirmed Blood Group', type: 'text', required: true, placeholder: 'e.g. B+, O+, A-' },
      { id: 'f_tetanus_shot', label: 'Has received Td / Tetanus booster in the past 2 years?', type: 'radio', required: true, options: ['Yes, fully up-to-date', 'No / Due soon'] },
      { id: 'f_doctor_name', label: 'Family Doctor / Pediatrician Name & Clinic Phone', type: 'text', required: false },
    ],
  },
];

let submissionsStore: StudentFormSubmission[] = [
  {
    id: 'sub_01',
    form_id: 'form_field_trip_2026',
    form_title: 'Consent & Medical Clearance: National Science Centre Field Visit',
    student_id: 'std_01',
    student_name: 'Aryan Sharma',
    submitted_by_name: 'Dr. Ramesh Sharma (Father)',
    submitted_at: '2026-10-22T10:15:00Z',
    status: 'approved',
    answers: {
      f_consent: true,
      f_food_pref: 'Vegetarian',
      f_medical_notes: 'None. In good physical health.',
      f_emergency_phone: '+91 98101 23456',
    },
  },
];

export const communicationService = {
  // Announcements
  async getAnnouncements(targetAudience?: string): Promise<Announcement[]> {
    await new Promise((res) => setTimeout(res, 150));
    if (targetAudience && targetAudience !== 'all') {
      return announcementsStore.filter(
        (a) => a.target_audience === 'all' || a.target_audience === targetAudience
      );
    }
    return announcementsStore;
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    await new Promise((res) => setTimeout(res, 250));
    const newAnn: Announcement = {
      id: `ann_${Date.now()}`,
      title: data.title || 'School Announcement',
      content: data.content || '',
      author_id: 'usr_staff_1',
      author_name: data.author_name || 'School Administration',
      author_role: data.author_role || 'Staff',
      priority: data.priority || 'normal',
      target_audience: data.target_audience || 'all',
      target_class_id: data.target_class_id,
      target_class_name: data.target_class_name,
      target_section_id: data.target_section_id,
      target_section_name: data.target_section_name,
      published_at: new Date().toISOString(),
      is_pinned: data.is_pinned ?? false,
    };
    announcementsStore.unshift(newAnn);
    return newAnn;
  },

  // PTM
  async getPtmEvents(): Promise<PtmEvent[]> {
    await new Promise((res) => setTimeout(res, 180));
    return ptmStore;
  },

  async bookPtmSlot(
    ptmId: string,
    slotId: string,
    studentId: string,
    parentName: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    await new Promise((res) => setTimeout(res, 300));
    const ptm = ptmStore.find((p) => p.id === ptmId);
    if (!ptm) throw new Error('PTM event not found');

    const slot = ptm.slots.find((s) => s.slot_id === slotId);
    if (!slot) throw new Error('Slot not found');
    if (slot.is_booked) throw new Error('This slot has already been reserved by another parent.');

    const student = await studentService.getStudent(studentId);

    slot.is_booked = true;
    slot.booked_by_parent_name = parentName;
    slot.booked_for_student_id = studentId;
    slot.booked_for_student_name = student ? `${student.first_name} ${student.last_name}` : 'Student';
    slot.notes = notes;

    return {
      success: true,
      message: `PTM slot on ${ptm.date} at ${slot.time} confirmed for ${slot.booked_for_student_name}!`,
    };
  },

  // Forms
  async getForms(): Promise<SchoolForm[]> {
    await new Promise((res) => setTimeout(res, 180));
    return formsStore;
  },

  async getFormById(id: string): Promise<SchoolForm | undefined> {
    await new Promise((res) => setTimeout(res, 120));
    return formsStore.find((f) => f.id === id);
  },

  async getStudentSubmissions(studentId: string): Promise<StudentFormSubmission[]> {
    await new Promise((res) => setTimeout(res, 150));
    return submissionsStore.filter((s) => s.student_id === studentId);
  },

  async submitFormResponse(
    formId: string,
    studentId: string,
    parentName: string,
    answers: Record<string, string | boolean>
  ): Promise<{ success: boolean; message: string }> {
    await new Promise((res) => setTimeout(res, 350));
    const form = formsStore.find((f) => f.id === formId);
    const student = await studentService.getStudent(studentId);

    const newSub: StudentFormSubmission = {
      id: `sub_${Date.now()}`,
      form_id: formId,
      form_title: form?.title || 'School Form',
      student_id: studentId,
      student_name: student ? `${student.first_name} ${student.last_name}` : 'Student',
      submitted_by_name: parentName,
      submitted_at: new Date().toISOString(),
      status: 'submitted',
      answers,
    };

    submissionsStore.unshift(newSub);
    if (form) form.total_submitted++;

    return {
      success: true,
      message: `Form "${form?.title}" submitted successfully! Thank you.`,
    };
  },

  // Parent Dashboard Aggregator
  async getParentDashboard(parentId?: string): Promise<ParentDashboardResponse> {
    await new Promise((res) => setTimeout(res, 220));

    // Connect real multi-child wards for logged-in parent
    // Dr. Ramesh Sharma is parent of Aryan Sharma (std_01) and sibling Ananya Sharma (Class 5)
    return {
      parent_name: 'Dr. Ramesh Sharma',
      children: [
        {
          student_id: 'std_01',
          admission_no: 'ADM-2026-0101',
          first_name: 'Aryan',
          last_name: 'Sharma',
          class_name: 'Class 10',
          section_name: 'Section A',
          roll_no: '01',
          attendance_percentage: 95.7,
          unpaid_fee_amount: 15000,
          pending_forms_count: 0,
          upcoming_ptm_slot: {
            date: 'Saturday, Nov 7, 2026',
            time: '09:00 AM - 09:15 AM',
            teacher_name: 'Mrs. Kavita Rao (Class Teacher)',
            mode: 'In-Person (Room 204)',
          },
          latest_result: {
            exam_name: 'Term 1 Mid-Term 2026',
            percentage: 91.2,
            grade: 'A1 (Rank 2)',
          },
        },
        {
          student_id: 'std_02',
          admission_no: 'ADM-2026-0102',
          first_name: 'Ananya',
          last_name: 'Sharma',
          class_name: 'Class 5',
          section_name: 'Section Lotus',
          roll_no: '08',
          attendance_percentage: 98.2,
          unpaid_fee_amount: 0,
          pending_forms_count: 1,
          upcoming_ptm_slot: {
            date: 'Saturday, Nov 7, 2026',
            time: '11:30 AM - 11:45 AM',
            teacher_name: 'Mr. Arvind Gupta',
            mode: 'In-Person (Room 102)',
          },
          latest_result: {
            exam_name: 'Term 1 Foundational Assessment',
            percentage: 96.0,
            grade: 'A* (Exemplary)',
          },
        },
      ],
      announcements: announcementsStore.slice(0, 3),
    };
  },
};
