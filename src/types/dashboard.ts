/**
 * ZenCro Role Dashboards Types
 * Day 7 Specification
 * 
 * Admin Dashboard: "What needs attention today?" (action-oriented)
 * Teacher Dashboard: "What do I need to do today?" (focused tasks)
 */

export interface ActionAlert {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  category: 'attendance' | 'fees' | 'marks' | 'forms' | 'ptm';
  title: string;
  description: string;
  action_label: string;
  action_href: string;
  count?: number;
}

export interface AdminDashboardData {
  school_name: string;
  academic_year: string;
  today_date: string;
  metrics: {
    total_students: number;
    attendance_today_percentage: number;
    total_fees_collected: number;
    fees_outstanding: number;
    fee_collection_rate: number;
    pending_forms_count: number;
    pending_marks_exams_count: number;
  };
  urgent_attention_items: ActionAlert[];
  recent_activity: {
    id: string;
    title: string;
    actor: string;
    time: string;
    type: string;
  }[];
  quick_actions: {
    label: string;
    href: string;
    icon: string;
    badge?: string;
  }[];
}

export interface TeacherTaskItem {
  id: string;
  title: string;
  due_time?: string;
  class_name: string;
  section_name: string;
  type: 'attendance' | 'marks' | 'ptm' | 'form';
  status: 'pending' | 'completed';
  action_label: string;
  action_href: string;
}

export interface TeacherDashboardData {
  teacher_name: string;
  designation: string;
  assigned_classes: {
    class_id: string;
    class_name: string;
    section_id: string;
    section_name: string;
    subject: string;
    student_count: number;
    attendance_marked_today: boolean;
  }[];
  pending_tasks: TeacherTaskItem[];
  upcoming_ptm_slots: {
    id: string;
    time: string;
    parent_name: string;
    student_name: string;
    mode: string;
  }[];
  announcements: {
    id: string;
    title: string;
    published_at: string;
    priority: string;
  }[];
}
