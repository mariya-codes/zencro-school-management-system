/**
 * ZenCro Data & Privacy Center Types
 * Day 7 Specification
 */

import { UserRole } from './auth';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_name: string;
  user_email: string;
  user_role: UserRole;
  action: string; // e.g. "VIEW_STUDENT_360", "EXPORT_FEES", "UPDATE_MARKS", "LOGIN_SUCCESS"
  resource: string;
  ip_address: string;
  device_info: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
}

export interface UserAccessRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  last_active: string;
  mfa_enabled: boolean;
  status: 'active' | 'suspended';
}

export interface PrivacyPolicySetting {
  id: string;
  category: string;
  title: string;
  description: string;
  enabled: boolean;
  retention_days?: number;
}

export interface DataExportLog {
  id: string;
  requested_by: string;
  target_student?: string;
  scope: string;
  status: 'completed' | 'processing' | 'expired';
  requested_at: string;
  expires_at: string;
  file_size: string;
}

export interface PrivacySummaryResponse {
  total_active_users: number;
  audit_logs_24h_count: number;
  flagged_access_events: number;
  recent_logs: AuditLogEntry[];
  retention_policies: PrivacyPolicySetting[];
  user_access_list: UserAccessRecord[];
}
