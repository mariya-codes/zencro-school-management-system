/**
 * ZenCro Data & Privacy Center Service
 * Day 7 Specification
 */

import {
  AuditLogEntry,
  PrivacySummaryResponse,
} from '@/types/privacy';

const AUDIT_LOGS_MOCK: AuditLogEntry[] = [
  {
    id: 'log_01',
    timestamp: '2026-10-26 14:48:22',
    user_name: 'Mariya (Staff Admin)',
    user_email: 'mariya@zencro-school.edu.in',
    user_role: 'admin',
    action: 'VIEW_STUDENT_360',
    resource: 'Student Record: Aryan Sharma (std_01)',
    ip_address: '192.168.1.104',
    device_info: 'Chrome 130 on Windows 11',
    status: 'SUCCESS',
  },
  {
    id: 'log_02',
    timestamp: '2026-10-26 14:15:09',
    user_name: 'Rajesh Verma (Accountant)',
    user_email: 'rajesh.verma@zencro-school.edu.in',
    user_role: 'accountant',
    action: 'RECORD_FEE_PAYMENT',
    resource: 'Receipt RCP-2026-15981 (₹15,000)',
    ip_address: '192.168.1.112',
    device_info: 'Chrome 129 on macOS Sonoma',
    status: 'SUCCESS',
  },
  {
    id: 'log_03',
    timestamp: '2026-10-26 13:50:41',
    user_name: 'Unknown User',
    user_email: 'anonymous@external.net',
    user_role: 'parent',
    action: 'UNAUTHORIZED_STUDENT_ACCESS_ATTEMPT',
    resource: 'Restricted Record /api/students/std_09/fee',
    ip_address: '203.0.113.88',
    device_info: 'Safari on iOS 17.5',
    status: 'DENIED',
  },
  {
    id: 'log_04',
    timestamp: '2026-10-26 11:30:15',
    user_name: 'Mrs. Kavita Rao (Teacher)',
    user_email: 'kavita.rao@zencro-school.edu.in',
    user_role: 'teacher',
    action: 'SUBMIT_BULK_ATTENDANCE',
    resource: 'Class 10 Section A (42 records)',
    ip_address: '192.168.1.120',
    device_info: 'Firefox 131 on Windows 10',
    status: 'SUCCESS',
  },
  {
    id: 'log_05',
    timestamp: '2026-10-25 18:22:04',
    user_name: 'Dr. S. Mukherjee (Principal)',
    user_email: 'principal@zencro-school.edu.in',
    user_role: 'principal',
    action: 'EXPORT_ACADEMIC_RESULTS',
    resource: 'Class 10 Term 1 Marks Consolidated CSV',
    ip_address: '192.168.1.101',
    device_info: 'Chrome 130 on Windows 11',
    status: 'FLAGGED',
  },
];

export const privacyService = {
  async getPrivacySummary(): Promise<PrivacySummaryResponse> {
    await new Promise((res) => setTimeout(res, 200));

    return {
      total_active_users: 28,
      audit_logs_24h_count: 142,
      flagged_access_events: 2,
      recent_logs: AUDIT_LOGS_MOCK,
      retention_policies: [
        {
          id: 'ret_att',
          category: 'Daily Attendance',
          title: 'Daily Attendance Roll Data Retention',
          description: 'Keep detailed daily period and biometric logs for 3 academic years before aggregating to annual attendance summaries.',
          enabled: true,
          retention_days: 1095,
        },
        {
          id: 'ret_fee',
          category: 'Financial Logs',
          title: 'Fee Payment Audit & Banking Reconciliation Logs',
          description: 'Retain payment receipts, transaction IDs, and bank settlement tokens for statutory 7-year audit compliance.',
          enabled: true,
          retention_days: 2555,
        },
        {
          id: 'ret_forms',
          category: 'Consent & Medical',
          title: 'Temporary Consent Forms & Health Slips',
          description: 'Purge single-event excursion permission forms 90 days after trip completion.',
          enabled: true,
          retention_days: 90,
        },
      ],
      user_access_list: [
        { id: 'u_1', name: 'Mariya (Lead Frontend / Staff Admin)', email: 'mariya@zencro-school.edu.in', role: 'admin', last_active: 'Active Now', mfa_enabled: true, status: 'active' },
        { id: 'u_2', name: 'Dr. S. Mukherjee', email: 'principal@zencro-school.edu.in', role: 'principal', last_active: '2 hours ago', mfa_enabled: true, status: 'active' },
        { id: 'u_3', name: 'Mrs. Kavita Rao', email: 'kavita.rao@zencro-school.edu.in', role: 'teacher', last_active: '35 mins ago', mfa_enabled: false, status: 'active' },
        { id: 'u_4', name: 'Rajesh Verma', email: 'rajesh.verma@zencro-school.edu.in', role: 'accountant', last_active: '15 mins ago', mfa_enabled: true, status: 'active' },
        { id: 'u_5', name: 'Dr. Ramesh Sharma (Parent)', email: 'ramesh.sharma@aiims.edu.in', role: 'parent', last_active: '1 day ago', mfa_enabled: false, status: 'active' },
      ],
    };
  },
};
