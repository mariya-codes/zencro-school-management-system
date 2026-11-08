'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { StudentFeeDetail, FeePaymentRecord, FeeReceiptData } from '@/types/fees';
import { feesService } from '@/lib/services/fees-service';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { RecordPaymentDialog } from '@/components/fees/record-payment-dialog';
import { FeeReceiptModal } from '@/components/fees/fee-receipt-modal';
import {
  CreditCardIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  PrinterIcon,
  ArrowLeftIcon,
  UserIcon,
} from '@/components/ui/icons';

export default function StudentFeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const [detail, setDetail] = useState<StudentFeeDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeReceiptData | null>(null);

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const data = await feesService.getStudentFeeDetail(studentId);
      setDetail(data);
    } catch (err) {
      console.error('Failed to load student fee ledger', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading student fee profile..." />
      </div>
    );
  }

  if (!detail) {
    return (
      <ErrorState
        title="Student Fee Ledger Not Found"
        message="Unable to locate fee records for the specified student identifier."
      />
    );
  }

  const handlePaymentSuccess = (receipt: FeeReceiptData) => {
    setSelectedReceipt(receipt);
    fetchDetail();
  };

  const handleViewExistingReceipt = (pay: FeePaymentRecord) => {
    const receiptData: FeeReceiptData = {
      receipt_no: pay.receipt_no,
      payment_date: pay.payment_date,
      student_id: detail.student_id,
      student_name: detail.student_name,
      admission_no: detail.admission_no,
      class_name: detail.class_name,
      section_name: detail.section_name,
      amount_paid: pay.amount,
      payment_method: pay.payment_method,
      reference_no: pay.reference_no,
      fee_breakdown_settled: pay.fee_heads_settled
        ? pay.fee_heads_settled.map((h) => ({ head_name: h.fee_head_name, amount: h.amount }))
        : [{ head_name: 'Academic Tuition Charges', amount: pay.amount }],
      total_fee: detail.total_fee,
      cumulative_paid: detail.paid_amount,
      remaining_outstanding: detail.outstanding_amount,
      received_by: pay.received_by || 'ZenCro Accounts Department',
      school_info: {
        name: 'ZenCro Public School (Affiliated to CBSE)',
        code: 'CBSE-DEL-04910',
        affiliation: 'CBSE Affiliation No: 2130891',
        address: 'Sector 14, Institutional Area, New Delhi - 110001',
        phone: '+91 (011) 2345-6789',
        email: 'accounts@zencro-school.edu.in',
      },
    };
    setSelectedReceipt(receiptData);
  };

  return (
    <div className="space-y-6">
      {/* Back button and profile header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/fees">
            <Button variant="outline" size="sm" className="h-9 px-3 text-slate-700">
              <ArrowLeftIcon size={16} className="mr-1.5" />
              All Fees
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {detail.student_name}
              </h1>
              <Badge variant="outline" className="font-mono text-xs">
                {detail.admission_no}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {detail.class_name} • {detail.section_name} • Session {detail.academic_year}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/students/${detail.student_id}`}>
            <Button variant="outline" size="sm" className="h-9">
              <UserIcon size={15} className="mr-1.5" />
              Student 360
            </Button>
          </Link>
          {detail.outstanding_amount > 0 && (
            <Button
              onClick={() => setIsPaymentOpen(true)}
              size="sm"
              className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              <CreditCardIcon size={15} className="mr-1.5" />
              Record Payment
            </Button>
          )}
        </div>
      </div>

      {/* 3 CORE LEADING METRICS: 1. TOTAL 2. PAID 3. OUTSTANDING */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* TOTAL */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            1. Total Annual Fee
          </span>
          <p className="text-3xl font-extrabold text-slate-900 font-mono mt-2">
            ₹{detail.total_fee.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Full academic year tariff</span>
        </div>

        {/* PAID */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            2. Total Paid to Date
          </span>
          <p className="text-3xl font-extrabold text-emerald-700 font-mono mt-2">
            ₹{detail.paid_amount.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-emerald-700/80 font-medium mt-1 block">
            {detail.payment_history.length} verified payment {detail.payment_history.length === 1 ? 'receipt' : 'receipts'}
          </span>
        </div>

        {/* OUTSTANDING */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
            3. Current Outstanding
          </span>
          <p className="text-3xl font-extrabold text-rose-700 font-mono mt-2">
            ₹{detail.outstanding_amount.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-rose-700/80 font-medium mt-1 block">
            {detail.outstanding_amount === 0 ? 'Account fully settled' : 'Payment required'}
          </span>
        </div>
      </div>

      {/* FEE BREAKDOWN */}
      <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
          <CardTitle className="text-base font-bold text-slate-900">
            Fee Heads Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Fee Head / Component</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Fee Head Amount</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Outstanding</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detail.fee_breakdown.map((head) => (
                  <tr key={head.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-semibold text-slate-900">{head.name}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{head.due_date}</td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-800">
                      ₹{head.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 font-semibold">
                      ₹{head.paid_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-700">
                      ₹{head.outstanding_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {head.status === 'paid' ? (
                        <Badge variant="success" className="text-xs">
                          Paid
                        </Badge>
                      ) : head.status === 'partial' ? (
                        <Badge variant="warning" className="text-xs">
                          Partial
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Pending
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* PAYMENT HISTORY */}
      <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900">
            Payment History & Receipts
          </CardTitle>
          <span className="text-xs text-slate-400">
            {detail.payment_history.length} transactions recorded
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {detail.payment_history.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No payments have been recorded yet for this student.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Receipt Number</th>
                    <th className="py-3 px-4">Payment Date</th>
                    <th className="py-3 px-4">Mode / Ref</th>
                    <th className="py-3 px-4 text-right">Amount Paid</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {detail.payment_history.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {pay.receipt_no}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-xs">{pay.payment_date}</td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">{pay.payment_method}</span>
                        {pay.reference_no && (
                          <span className="text-slate-400 block font-mono">{pay.reference_no}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-base">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewExistingReceipt(pay)}
                          className="h-8 text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                        >
                          <PrinterIcon size={14} className="mr-1.5" />
                          View Receipt
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Payment Dialog */}
      <RecordPaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        studentId={detail.student_id}
        studentName={detail.student_name}
        admissionNo={detail.admission_no}
        outstandingAmount={detail.outstanding_amount}
        onPaymentRecorded={handlePaymentSuccess}
      />

      {/* Fee Receipt Modal */}
      {selectedReceipt && (
        <FeeReceiptModal
          isOpen={!!selectedReceipt}
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
