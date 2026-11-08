/**
 * ZenCro Action-Oriented Dashboard Service
 * Day 7 Specification
 * 
 * Admin Dashboard: "What needs attention today?"
 * Teacher Dashboard: "What do I need to do today?"
 */

import { AdminDashboardData, TeacherDashboardData } from '@/types/dashboard';
import { studentService } from './student-service';
import { feesService } from './fees-service';

export const dashboardService = {
  /**
   * GET /api/dashboard/admin
   * "What needs attention today?"
   */
  async getAdminDashboard(): Promise<AdminDashboardData> {
    await new Promise((res) => setTimeout(res, 200));

    const { total } = await studentService.listStudents();
    const feeSummary = await feesService.getSummary();

    return {
      school_name: 'ZenCro Public School (New Delhi Campus)',
      academic_year: '2026-2027',
      today_date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      metrics: {
        total_students: total || 42,
        attendance_today_percentage: 94.8,
        total_fees_collected: feeSummary.collected_fees,
        fees_outstanding: feeSummary.outstanding_fees,
        fee_collection_rate: feeSummary.collection_percentage,
        pending_forms_count: 8,
        pending_marks_exams_count: 2,
      },
      urgent_attention_items: [
        {
          id: 'alert_1',
          type: 'urgent',
          category: 'fees',
          title: '38 Defaulter Accounts Exceeding 45-Day Grace Period',
          description: 'Total overdue fees amount to ₹5,40,000 across Classes 9 and 10. Automated payment reminder ready to send.',
          action_label: 'Review Defaulters & Send Reminders',
          action_href: '/fees?status=overdue',
          count: 38,
        },
        {
          id: 'alert_2',
          type: 'warning',
          category: 'attendance',
          title: 'Class 9 Section B Attendance Below 85% Threshold Today',
          description: 'Current attendance is 81.4% (8 absentees without prior parent notification).',
          action_label: 'View Class 9-B Roster',
          action_href: '/attendance?class_id=cls_9&section_id=sec_9_b',
          count: 8,
        },
        {
          id: 'alert_3',
          type: 'warning',
          category: 'marks',
          title: 'Class 12 - Chemistry Mid-Term Marks Entry Pending Verification',
          description: 'Exam concluded 4 days ago. Teacher evaluation submitted but waiting for academic coordinator sign-off.',
          action_label: 'Open Marks Verification',
          action_href: '/exams',
          count: 1,
        },
        {
          id: 'alert_4',
          type: 'info',
          category: 'forms',
          title: '8 Parent Consent Forms Pending for Science Centre Field Trip',
          description: 'Field trip scheduled for Friday. 34 parents have consented; 8 remaining.',
          action_label: 'Track Form Submissions',
          action_href: '/forms',
          count: 8,
        },
      ],
      recent_activity: [
        {
          id: 'act_1',
          title: 'Fee payment receipt RCP-2026-15981 recorded for Aryan Sharma (₹15,000)',
          actor: 'Online UPI Gateway',
          time: '12 mins ago',
          type: 'fee',
        },
        {
          id: 'act_2',
          title: 'Attendance submitted for Class 10 Section A (40/42 Present - 95.2%)',
          actor: 'Mrs. Kavita Rao',
          time: '35 mins ago',
          type: 'attendance',
        },
        {
          id: 'act_3',
          title: 'New Student Admission ADM-2026-0118 (Rohan Das, Class 9) approved',
          actor: 'Staff Admin (Mariya)',
          time: '1 hour ago',
          type: 'student',
        },
        {
          id: 'act_4',
          title: 'Parent Dr. Ramesh Sharma booked PTM Slot for Saturday Nov 7th (09:00 AM)',
          actor: 'Parent Portal',
          time: '2 hours ago',
          type: 'ptm',
        },
      ],
      quick_actions: [
        { label: 'Take Attendance', href: '/attendance', icon: 'UserCheckIcon' },
        { label: 'Record Fee Payment', href: '/fees', icon: 'CreditCardIcon' },
        { label: 'Admit New Student', href: '/students/new', icon: 'UserPlusIcon' },
        { label: 'Broadcast Notice', href: '/communication', icon: 'MessageSquareIcon' },
        { label: 'Import CSV Roster', href: '/import', icon: 'UploadCloudIcon' },
        { label: 'Audit & Privacy', href: '/privacy', icon: 'ShieldIcon' },
      ],
    };
  },

  /**
   * GET /api/dashboard/teacher
   * "What do I need to do today?"
   */
  async getTeacherDashboard(teacherId?: string): Promise<TeacherDashboardData> {
    await new Promise((res) => setTimeout(res, 200));

    return {
      teacher_name: 'Mrs. Kavita Rao',
      designation: 'Senior Faculty & Class 10-A Class Teacher',
      assigned_classes: [
        {
          class_id: 'cls_10',
          class_name: 'Class 10',
          section_id: 'sec_10_a',
          section_name: 'Section A',
          subject: 'Science & Physics',
          student_count: 42,
          attendance_marked_today: true,
        },
        {
          class_id: 'cls_10',
          class_name: 'Class 10',
          section_id: 'sec_10_b',
          section_name: 'Section B',
          subject: 'Physics',
          student_count: 38,
          attendance_marked_today: false,
        },
        {
          class_id: 'cls_9',
          class_name: 'Class 9',
          section_id: 'sec_9_a',
          section_name: 'Section A',
          subject: 'General Science',
          student_count: 40,
          attendance_marked_today: false,
        },
      ],
      pending_tasks: [
        {
          id: 'task_1',
          title: 'Submit Daily Attendance for Class 10 Section B',
          due_time: 'Due by 10:30 AM',
          class_name: 'Class 10',
          section_name: 'Section B',
          type: 'attendance',
          status: 'pending',
          action_label: 'Mark Attendance Now',
          action_href: '/attendance?class_id=cls_10&section_id=sec_10_b',
        },
        {
          id: 'task_2',
          title: 'Enter Physics Marks for Term 1 Mid-Term Examination',
          due_time: 'Due today, 04:00 PM',
          class_name: 'Class 10',
          section_name: 'Section A',
          type: 'marks',
          status: 'pending',
          action_label: 'Enter Student Marks',
          action_href: '/exams',
        },
        {
          id: 'task_3',
          title: 'Confirm Slot Schedule for Upcoming PTM on Nov 7th',
          due_time: 'Next 3 days',
          class_name: 'Class 10',
          section_name: 'Section A',
          type: 'ptm',
          status: 'pending',
          action_label: 'Review Booked Slots',
          action_href: '/ptm',
        },
      ],
      upcoming_ptm_slots: [
        {
          id: 'slot_1',
          time: '09:00 AM - 09:15 AM',
          parent_name: 'Dr. Ramesh Sharma',
          student_name: 'Aryan Sharma',
          mode: 'In-Person (Room 204)',
        },
        {
          id: 'slot_3',
          time: '09:30 AM - 09:45 AM',
          parent_name: 'Mr. Rajesh Iyer',
          student_name: 'Ananya Iyer',
          mode: 'In-Person (Room 204)',
        },
      ],
      announcements: [
        {
          id: 'ann_staff_1',
          title: 'Faculty Academic Council Meeting this Thursday at 3:30 PM in Conference Room A',
          published_at: '2026-10-25',
          priority: 'important',
        },
        {
          id: 'ann_staff_2',
          title: 'Pre-Board Examination Question Paper Drafts Due by Nov 10th',
          published_at: '2026-10-23',
          priority: 'normal',
        },
      ],
    };
  },
};
