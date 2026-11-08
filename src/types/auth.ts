/**
 * ZenCro Authentication & Role Definitions
 * 
 * Approved roles ONLY: admin, principal, teacher, accountant, parent.
 * Strictly adheres to the ZenCro API / Data Contract specification.
 */

export type UserRole = 'admin' | 'principal' | 'teacher' | 'accountant' | 'parent';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  school_id: string;
  phone?: string;
  avatarUrl?: string;
  designation?: string;
  createdAt?: string;
}

export interface AuthSession {
  user: UserProfile | null;
  school: {
    id: string;
    name: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ApiMeResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    school_id: string;
  };
  school: {
    id: string;
    name: string;
  };
}

export type ApiErrorCode =
  | 'AUTH_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';

export interface ApiErrorDetail {
  code: ApiErrorCode;
  message: string;
  field?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface RolePermissions {
  canManageSchool: boolean;
  canManageAcademics: boolean;
  canManageClasses: boolean;
  canManageTeachers: boolean;
  canManageStudents: boolean;
  canViewReports: boolean;
  canManageFinances: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canManageSchool: true,
    canManageAcademics: true,
    canManageClasses: true,
    canManageTeachers: true,
    canManageStudents: true,
    canViewReports: true,
    canManageFinances: true,
  },
  principal: {
    canManageSchool: false,
    canManageAcademics: true,
    canManageClasses: true,
    canManageTeachers: true,
    canManageStudents: true,
    canViewReports: true,
    canManageFinances: false,
  },
  teacher: {
    canManageSchool: false,
    canManageAcademics: false,
    canManageClasses: false,
    canManageTeachers: false,
    canManageStudents: true,
    canViewReports: false,
    canManageFinances: false,
  },
  accountant: {
    canManageSchool: false,
    canManageAcademics: false,
    canManageClasses: false,
    canManageTeachers: false,
    canManageStudents: false,
    canViewReports: true,
    canManageFinances: true,
  },
  parent: {
    canManageSchool: false,
    canManageAcademics: false,
    canManageClasses: false,
    canManageTeachers: false,
    canManageStudents: false,
    canViewReports: false,
    canManageFinances: false,
  },
};

export const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string; description: string }> = {
  admin: {
    label: 'School Admin',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
    description: 'Full institutional configuration & oversight',
  },
  principal: {
    label: 'Principal',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Academic head & staff supervision',
  },
  teacher: {
    label: 'Teacher / Faculty',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    description: 'Classroom, attendance & marks entry',
  },
  accountant: {
    label: 'Accountant',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800',
    description: 'Fee records & invoicing',
  },
  parent: {
    label: 'Parent / Guardian',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    description: 'Ward performance & communication',
  },
};
