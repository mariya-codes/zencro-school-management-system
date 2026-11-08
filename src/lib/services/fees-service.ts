/**
 * ZenCro Fees Service
 * Day 4 Specification & API Data Contract
 * 
 * Philosophy: Extremely clear, leading with:
 * 1. TOTAL
 * 2. PAID
 * 3. OUTSTANDING
 * Followed by Fee Breakdown and Payment History.
 */

import {
  FeePaymentStatus,
  FeePaymentRecord,
  StudentFeeListItem,
  StudentFeeDetail,
  FeesSummaryResponse,
  RecordPaymentRequest,
  FeeReceiptData,
  PaymentMethod,
} from '@/types/fees';
import { studentService } from './student-service';

// In-memory fees database for simulated real-time payments
interface StudentFeeRecord {
  student_id: string;
  total_fee: number;
  paid_amount: number;
  outstanding_amount: number;
  fee_heads: {
    id: string;
    name: string;
    amount: number;
    paid_amount: number;
    outstanding_amount: number;
    due_date: string;
    status: FeePaymentStatus;
    category?: 'academic' | 'transport' | 'facilities' | 'activities';
  }[];
  payments: FeePaymentRecord[];
}

const feeRecordsStore: Record<string, StudentFeeRecord> = {
  std_01: {
    student_id: 'std_01',
    total_fee: 75000,
    paid_amount: 60000,
    outstanding_amount: 15000,
    fee_heads: [
      { id: 'fh_01', name: 'Tuition Fee - Term 1', amount: 30000, paid_amount: 30000, outstanding_amount: 0, due_date: '2026-05-10', status: 'paid', category: 'academic' },
      { id: 'fh_02', name: 'Annual Development & IT Charges', amount: 15000, paid_amount: 15000, outstanding_amount: 0, due_date: '2026-05-10', status: 'paid', category: 'facilities' },
      { id: 'fh_03', name: 'Science Laboratory & Robotics Fee', amount: 15000, paid_amount: 15000, outstanding_amount: 0, due_date: '2026-08-15', status: 'paid', category: 'academic' },
      { id: 'fh_04', name: 'Tuition Fee - Term 2', amount: 15000, paid_amount: 0, outstanding_amount: 15000, due_date: '2026-11-15', status: 'pending', category: 'academic' },
    ],
    payments: [
      {
        id: 'pay_01',
        receipt_no: 'RCP-2026-10492',
        student_id: 'std_01',
        student_name: 'Aryan Sharma',
        admission_no: 'ADM-2026-0101',
        amount: 45000,
        payment_date: '2026-05-02',
        payment_method: 'Online UPI',
        reference_no: 'UPI/HDFC/20260502-0941',
        received_by: 'Online Gateway System',
        status: 'successful',
        fee_heads_settled: [
          { fee_head_name: 'Tuition Fee - Term 1', amount: 30000 },
          { fee_head_name: 'Annual Development & IT Charges', amount: 15000 },
        ],
      },
      {
        id: 'pay_02',
        receipt_no: 'RCP-2026-14810',
        student_id: 'std_01',
        student_name: 'Aryan Sharma',
        admission_no: 'ADM-2026-0101',
        amount: 15000,
        payment_date: '2026-08-10',
        payment_method: 'Net Banking',
        reference_no: 'NEFT-SBIN20260810-771',
        received_by: 'Accounts Desk - Rajesh Verma',
        status: 'successful',
        fee_heads_settled: [
          { fee_head_name: 'Science Laboratory & Robotics Fee', amount: 15000 },
        ],
      },
    ],
  },
  std_02: {
    student_id: 'std_02',
    total_fee: 72000,
    paid_amount: 72000,
    outstanding_amount: 0,
    fee_heads: [
      { id: 'fh_21', name: 'Tuition Fee - Term 1 & 2', amount: 50000, paid_amount: 50000, outstanding_amount: 0, due_date: '2026-05-10', status: 'paid', category: 'academic' },
      { id: 'fh_22', name: 'Annual Development Fee', amount: 12000, paid_amount: 12000, outstanding_amount: 0, due_date: '2026-05-10', status: 'paid', category: 'facilities' },
      { id: 'fh_23', name: 'Co-curricular & Sports Fee', amount: 10000, paid_amount: 10000, outstanding_amount: 0, due_date: '2026-08-15', status: 'paid', category: 'activities' },
    ],
    payments: [
      {
        id: 'pay_03',
        receipt_no: 'RCP-2026-09823',
        student_id: 'std_02',
        student_name: 'Ananya Iyer',
        admission_no: 'ADM-2026-0102',
        amount: 72000,
        payment_date: '2026-04-28',
        payment_method: 'Net Banking',
        reference_no: 'HDFC-PAY-449102',
        received_by: 'Accounts Desk',
        status: 'successful',
        fee_heads_settled: [
          { fee_head_name: 'Tuition Fee - Term 1 & 2', amount: 50000 },
          { fee_head_name: 'Annual Development Fee', amount: 12000 },
          { fee_head_name: 'Co-curricular & Sports Fee', amount: 10000 },
        ],
      },
    ],
  },
};

export const feesService = {
  /**
   * GET /api/fees/summary
   * Primary fees dashboard metrics
   */
  async getSummary(): Promise<FeesSummaryResponse> {
    await new Promise((res) => setTimeout(res, 200));

    // Calculate aggregated metrics from students
    const { students } = await studentService.listStudents({ page: 1, page_size: 100 });
    
    let totalFees = 0;
    let collectedFees = 0;
    let fullyPaid = 0;
    let partialPaid = 0;
    let defaulters = 0;

    students.forEach((s) => {
      const record = feeRecordsStore[s.id] || {
        total_fee: 70000,
        paid_amount: s.id === 'std_03' ? 35000 : s.id === 'std_04' ? 0 : 70000,
        outstanding_amount: s.id === 'std_03' ? 35000 : s.id === 'std_04' ? 70000 : 0,
      };

      totalFees += record.total_fee;
      collectedFees += record.paid_amount;

      if (record.outstanding_amount === 0) fullyPaid++;
      else if (record.paid_amount > 0) partialPaid++;
      else defaulters++;
    });

    const outstandingFees = totalFees - collectedFees;
    const collectionPercentage = totalFees > 0 ? Math.round((collectedFees / totalFees) * 100) : 0;

    const recentCollections: FeePaymentRecord[] = [
      {
        id: 'pay_recent_1',
        receipt_no: 'RCP-2026-15981',
        student_id: 'std_01',
        student_name: 'Aryan Sharma',
        admission_no: 'ADM-2026-0101',
        amount: 15000,
        payment_date: '2026-10-24',
        payment_method: 'Online UPI',
        reference_no: 'UPI/HDFC/998124',
        received_by: 'Accounts Desk',
        status: 'successful',
      },
      {
        id: 'pay_recent_2',
        receipt_no: 'RCP-2026-15978',
        student_id: 'std_03',
        student_name: 'Vihaan Patel',
        admission_no: 'ADM-2026-0103',
        amount: 35000,
        payment_date: '2026-10-22',
        payment_method: 'Cheque',
        reference_no: 'CHQ-889102-SBI',
        received_by: 'Rajesh Verma (Accountant)',
        status: 'successful',
      },
      {
        id: 'pay_recent_3',
        receipt_no: 'RCP-2026-15944',
        student_id: 'std_02',
        student_name: 'Ananya Iyer',
        admission_no: 'ADM-2026-0102',
        amount: 72000,
        payment_date: '2026-10-18',
        payment_method: 'Net Banking',
        reference_no: 'NEFT-ICICI-2910',
        received_by: 'Accounts Desk',
        status: 'successful',
      },
    ];

    return {
      total_fees: totalFees,
      collected_fees: collectedFees,
      outstanding_fees: outstandingFees,
      collection_percentage: collectionPercentage,
      total_students: students.length,
      fully_paid_students: fullyPaid,
      partial_paid_students: partialPaid,
      defaulter_students: defaulters,
      recent_collections: recentCollections,
    };
  },

  /**
   * GET /api/fees/students
   * Renders the clear student fees list with status & balances
   */
  async getStudentFees(filters?: {
    search?: string;
    class_id?: string;
    status?: FeePaymentStatus;
    page?: number;
    page_size?: number;
  }): Promise<{ items: StudentFeeListItem[]; total: number }> {
    await new Promise((res) => setTimeout(res, 220));

    const { students } = await studentService.listStudents({
      search: filters?.search,
      class_id: filters?.class_id,
      page: 1,
      page_size: 100,
    });

    const items: StudentFeeListItem[] = students.map((std) => {
      const record = feeRecordsStore[std.id] || {
        total_fee: 70000,
        paid_amount: std.id === 'std_03' ? 35000 : std.id === 'std_04' ? 0 : 70000,
        outstanding_amount: std.id === 'std_03' ? 35000 : std.id === 'std_04' ? 70000 : 0,
      };

      const status: FeePaymentStatus =
        record.outstanding_amount === 0
          ? 'paid'
          : record.paid_amount > 0
          ? 'partial'
          : 'overdue';

      return {
        student_id: std.id,
        admission_no: std.admission_no,
        student_name: `${std.first_name} ${std.last_name}`,
        class_name: std.class || 'Class 10',
        section_name: std.section || 'Section A',
        guardian_name: std.guardian_name || 'Dr. Ramesh Sharma',
        guardian_phone: std.guardian_phone || '+91 98101 23456',
        total_fee: record.total_fee,
        paid_amount: record.paid_amount,
        outstanding_amount: record.outstanding_amount,
        status,
        next_due_date: record.outstanding_amount > 0 ? '2026-11-15' : undefined,
        last_payment_date: record.paid_amount > 0 ? '2026-08-10' : undefined,
      };
    });

    // Apply status filter if provided
    const filtered = filters?.status
      ? items.filter((item) => item.status === filters.status)
      : items;

    return {
      items: filtered,
      total: filtered.length,
    };
  },

  /**
   * GET /api/fees/students/:id
   * Complete student fee profile leading with Total, Paid, Outstanding
   */
  async getStudentFeeDetail(studentId: string): Promise<StudentFeeDetail> {
    await new Promise((res) => setTimeout(res, 180));

    const student = await studentService.getStudent(studentId);
    const record = feeRecordsStore[studentId] || {
      student_id: studentId,
      total_fee: 70000,
      paid_amount: studentId === 'std_03' ? 35000 : studentId === 'std_04' ? 0 : 70000,
      outstanding_amount: studentId === 'std_03' ? 35000 : studentId === 'std_04' ? 70000 : 0,
      fee_heads: [
        { id: `fh_std_1`, name: 'Tuition Fee - Term 1', amount: 35000, paid_amount: studentId === 'std_04' ? 0 : 35000, outstanding_amount: studentId === 'std_04' ? 35000 : 0, due_date: '2026-05-10', status: studentId === 'std_04' ? 'overdue' : 'paid', category: 'academic' as const },
        { id: `fh_std_2`, name: 'Tuition Fee - Term 2', amount: 35000, paid_amount: studentId === 'std_01' || studentId === 'std_03' || studentId === 'std_04' ? 0 : 35000, outstanding_amount: studentId === 'std_01' || studentId === 'std_03' || studentId === 'std_04' ? 35000 : 0, due_date: '2026-11-15', status: studentId === 'std_01' || studentId === 'std_03' || studentId === 'std_04' ? 'pending' : 'paid', category: 'academic' as const },
      ],
      payments: studentId === 'std_04' ? [] : [
        {
          id: `pay_${studentId}_01`,
          receipt_no: `RCP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          student_id: studentId,
          student_name: student ? `${student.first_name} ${student.last_name}` : 'Student',
          admission_no: student?.admission_no || 'ADM-2026',
          amount: 35000,
          payment_date: '2026-05-02',
          payment_method: 'Online UPI' as PaymentMethod,
          reference_no: 'UPI-HDFC-998811',
          received_by: 'Online Portal',
          status: 'successful' as const,
        },
      ],
    };

    return {
      student_id: studentId,
      admission_no: student?.admission_no || 'ADM-2026',
      student_name: student ? `${student.first_name} ${student.last_name}` : 'Student Name',
      class_name: student?.class_name || 'Class 10',
      section_name: student?.section_name || 'Section A',
      academic_year: '2026-2027',
      total_fee: record.total_fee,
      paid_amount: record.paid_amount,
      outstanding_amount: record.outstanding_amount,
      fee_breakdown: record.fee_heads,
      payment_history: record.payments,
    };
  },

  /**
   * POST /api/fees/payments
   * Records full or partial fee payment and generates receipt
   */
  async recordPayment(request: RecordPaymentRequest): Promise<{
    success: boolean;
    receipt: FeeReceiptData;
    updated_outstanding: number;
  }> {
    await new Promise((res) => setTimeout(res, 350));

    const student = await studentService.getStudent(request.student_id);
    let record = feeRecordsStore[request.student_id];

    if (!record) {
      record = {
        student_id: request.student_id,
        total_fee: 70000,
        paid_amount: 0,
        outstanding_amount: 70000,
        fee_heads: [
          { id: 'fh_gen_1', name: 'Tuition Fee - Term 1', amount: 35000, paid_amount: 0, outstanding_amount: 35000, due_date: '2026-05-10', status: 'pending', category: 'academic' },
          { id: 'fh_gen_2', name: 'Tuition Fee - Term 2', amount: 35000, paid_amount: 0, outstanding_amount: 35000, due_date: '2026-11-15', status: 'pending', category: 'academic' },
        ],
        payments: [],
      };
      feeRecordsStore[request.student_id] = record;
    }

    const receiptNo = `RCP-2026-${Math.floor(10000 + Math.random() * 89999)}`;
    const newPayment: FeePaymentRecord = {
      id: `pay_${Date.now()}`,
      receipt_no: receiptNo,
      student_id: request.student_id,
      student_name: student ? `${student.first_name} ${student.last_name}` : 'Student',
      admission_no: student?.admission_no || 'ADM-2026',
      amount: request.amount,
      payment_date: request.payment_date,
      payment_method: request.payment_method,
      reference_no: request.reference_no,
      notes: request.notes,
      received_by: 'Staff Admin / Accounts',
      status: 'successful',
      fee_heads_settled: [
        { fee_head_name: 'School Fee Payment', amount: request.amount },
      ],
    };

    record.paid_amount += request.amount;
    record.outstanding_amount = Math.max(0, record.total_fee - record.paid_amount);
    record.payments.unshift(newPayment);

    // Update fee heads breakdown status
    let remainingToAllocate = request.amount;
    for (const head of record.fee_heads) {
      if (remainingToAllocate <= 0) break;
      if (head.outstanding_amount > 0) {
        const alloc = Math.min(remainingToAllocate, head.outstanding_amount);
        head.paid_amount += alloc;
        head.outstanding_amount -= alloc;
        remainingToAllocate -= alloc;
        head.status = head.outstanding_amount === 0 ? 'paid' : 'partial';
      }
    }

    const receipt: FeeReceiptData = {
      receipt_no: receiptNo,
      payment_date: request.payment_date,
      student_id: request.student_id,
      student_name: student ? `${student.first_name} ${student.last_name}` : 'Student',
      admission_no: student?.admission_no || 'ADM-2026',
      class_name: student?.class_name || 'Class 10',
      section_name: student?.section_name || 'Section A',
      amount_paid: request.amount,
      payment_method: request.payment_method,
      reference_no: request.reference_no,
      fee_breakdown_settled: [{ head_name: 'School Fee Payment', amount: request.amount }],
      total_fee: record.total_fee,
      cumulative_paid: record.paid_amount,
      remaining_outstanding: record.outstanding_amount,
      received_by: 'ZenCro Accounts Department',
      school_info: {
        name: 'ZenCro Public School (Affiliated to CBSE)',
        code: 'CBSE-DEL-04910',
        affiliation: 'CBSE Affiliation No: 2130891',
        address: 'Sector 14, Institutional Area, New Delhi - 110001',
        phone: '+91 (011) 2345-6789',
        email: 'accounts@zencro-school.edu.in',
      },
    };

    return {
      success: true,
      receipt,
      updated_outstanding: record.outstanding_amount,
    };
  },
};
