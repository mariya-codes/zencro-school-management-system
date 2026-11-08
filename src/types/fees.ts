/**
 * ZenCro Fees Module Types
 * Day 4 Specification & API Data Contract
 * 
 * Philosophy: Extremely clear, non-bloated fee management leading with:
 * 1. Total
 * 2. Paid
 * 3. Outstanding
 * Followed by Fee Breakdown and Payment History with Receipt Generation.
 */

export type FeePaymentStatus = 'paid' | 'partial' | 'pending' | 'overdue';

export type PaymentMethod =
  | 'Cash'
  | 'Online UPI'
  | 'Net Banking'
  | 'Cheque'
  | 'Debit/Credit Card'
  | 'Bank Transfer';

export interface FeeHeadItem {
  id: string;
  name: string; // e.g., Tuition Fee - Term 1, Lab Charges, Annual Development Fee
  amount: number;
  paid_amount: number;
  outstanding_amount: number;
  due_date: string;
  status: FeePaymentStatus;
  category?: 'academic' | 'transport' | 'facilities' | 'activities';
}

export interface FeePaymentRecord {
  id: string;
  receipt_no: string;
  student_id: string;
  student_name: string;
  admission_no: string;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  reference_no?: string;
  notes?: string;
  received_by: string;
  status: 'successful' | 'pending' | 'failed';
  fee_heads_settled?: {
    fee_head_name: string;
    amount: number;
  }[];
}

export interface StudentFeeListItem {
  student_id: string;
  admission_no: string;
  student_name: string;
  class_name: string;
  section_name: string;
  guardian_name?: string;
  guardian_phone?: string;
  total_fee: number;
  paid_amount: number;
  outstanding_amount: number;
  status: FeePaymentStatus;
  next_due_date?: string;
  last_payment_date?: string;
}

export interface StudentFeeDetail {
  student_id: string;
  admission_no: string;
  student_name: string;
  class_name: string;
  section_name: string;
  academic_year: string;
  guardian_name?: string;
  guardian_phone?: string;
  // Core 3 Metrics:
  total_fee: number;
  paid_amount: number;
  outstanding_amount: number;
  // Breakdown & History:
  fee_breakdown: FeeHeadItem[];
  payment_history: FeePaymentRecord[];
}

export interface FeesSummaryResponse {
  total_fees: number;
  collected_fees: number;
  outstanding_fees: number;
  collection_percentage: number;
  total_students: number;
  fully_paid_students: number;
  partial_paid_students: number;
  defaulter_students: number;
  recent_collections: FeePaymentRecord[];
}

export interface RecordPaymentRequest {
  student_id: string;
  fee_head_id?: string;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  reference_no?: string;
  notes?: string;
}

export interface FeeReceiptData {
  receipt_no: string;
  payment_date: string;
  student_id: string;
  student_name: string;
  admission_no: string;
  class_name: string;
  section_name: string;
  guardian_name?: string;
  amount_paid: number;
  payment_method: PaymentMethod;
  reference_no?: string;
  fee_breakdown_settled: { head_name: string; amount: number }[];
  total_fee: number;
  cumulative_paid: number;
  remaining_outstanding: number;
  received_by: string;
  school_info: {
    name: string;
    code: string;
    affiliation: string;
    address: string;
    phone: string;
    email: string;
  };
}
