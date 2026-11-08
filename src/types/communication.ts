/**
 * ZenCro Communication, Parent Dashboard, PTM & Forms Types
 * Day 6 Specification & Product Blueprint
 */

export type AnnouncementAudience = 'all' | 'parents' | 'teachers' | 'class';
export type AnnouncementPriority = 'normal' | 'important' | 'urgent';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_role: string;
  priority: AnnouncementPriority;
  target_audience: AnnouncementAudience;
  target_class_id?: string;
  target_class_name?: string;
  target_section_id?: string;
  target_section_name?: string;
  published_at: string;
  expires_at?: string;
  is_pinned?: boolean;
  attachment_url?: string;
}

export interface PtmSlot {
  slot_id: string;
  time: string; // e.g. "09:30 AM - 09:45 AM"
  is_booked: boolean;
  booked_by_parent_name?: string;
  booked_for_student_id?: string;
  booked_for_student_name?: string;
  notes?: string;
}

export interface PtmEvent {
  id: string;
  title: string;
  date: string;
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  teacher_id: string;
  teacher_name: string;
  teacher_designation: string;
  teacher_email?: string;
  mode: 'In-Person' | 'Online Video';
  location_or_link: string;
  agenda: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  slots: PtmSlot[];
}

export type FormCategory = 'Consent' | 'Permission' | 'Medical' | 'Administrative' | 'Feedback';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'date';
  required: boolean;
  options?: string[]; // for radio or select
  placeholder?: string;
}

export interface SchoolForm {
  id: string;
  title: string;
  description: string;
  category: FormCategory;
  created_at: string;
  due_date: string;
  is_mandatory: boolean;
  target_class_id?: string;
  target_class_name?: string;
  fields: FormField[];
  status: 'active' | 'closed';
  total_assigned: number;
  total_submitted: number;
}

export interface StudentFormSubmission {
  id: string;
  form_id: string;
  form_title: string;
  student_id: string;
  student_name: string;
  submitted_by_name: string;
  submitted_at: string;
  status: 'submitted' | 'approved' | 'rejected';
  answers: Record<string, string | boolean>;
}

export interface ParentChildSummary {
  student_id: string;
  admission_no: string;
  first_name: string;
  last_name: string;
  class_name: string;
  section_name: string;
  roll_no?: string;
  avatar_url?: string;
  attendance_percentage: number;
  unpaid_fee_amount: number;
  pending_forms_count: number;
  upcoming_ptm_slot?: {
    date: string;
    time: string;
    teacher_name: string;
    mode: string;
  } | null;
  latest_result?: {
    exam_name: string;
    percentage: number;
    grade: string;
  } | null;
}

export interface ParentDashboardResponse {
  parent_name: string;
  children: ParentChildSummary[];
  announcements: Announcement[];
}
