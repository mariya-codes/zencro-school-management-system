'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { FeesDashboardStats } from '@/components/fees/fees-dashboard-stats';
import { StudentFeesTable } from '@/components/fees/student-fees-table';
import { RecordPaymentDialog } from '@/components/fees/record-payment-dialog';
import { FeeReceiptModal } from '@/components/fees/fee-receipt-modal';
import { feesService } from '@/lib/services/fees-service';
import {
  FeesSummaryResponse,
  StudentFeeListItem,
  FeeReceiptData,
  FeePaymentStatus,
} from '@/types/fees';
import { CreditCardIcon, FileTextIcon, PrinterIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

export default function FeesPage() {
  const [summary, setSummary] = useState<FeesSummaryResponse | null>(null);
  const [items, setItems] = useState<StudentFeeListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dialog & Modal state
  const [activeStudentForPayment, setActiveStudentForPayment] = useState<StudentFeeListItem | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<FeeReceiptData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadFeesData = useCallback(async (filters?: {
    search?: string;
    class_id?: string;
    status?: FeePaymentStatus;
  }) => {
    setIsLoading(true);
    try {
      const [summaryData, listData] = await Promise.all([
        feesService.getSummary(),
        feesService.getStudentFees(filters),
      ]);
      setSummary(summaryData);
      setItems(listData.items);
    } catch (err) {
      console.error('Failed to load fees data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeesData();
  }, [loadFeesData]);

  const handlePaymentCompleted = (receipt: FeeReceiptData) => {
    setActiveReceipt(receipt);
    setToastMessage(`Payment of ₹${receipt.amount_paid.toLocaleString('en-IN')} recorded successfully! Receipt generated.`);
    loadFeesData();
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <Toast
          variant="success"
          title={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Page Header */}
      <PageHeader
        title="Fees & Invoicing Management"
        description="Clear, non-bloated fee collections leading with Total, Paid, and Outstanding balances."
        icon={<CreditCardIcon size={24} className="text-indigo-600" />}
      />

      {/* Top 3 Core Metrics + Collection % */}
      <FeesDashboardStats summary={summary} />

      {/* Student Fees Ledgers Table */}
      <StudentFeesTable
        items={items}
        isLoading={isLoading}
        onRecordPayment={(std) => setActiveStudentForPayment(std)}
        onFilterChange={(filters) => loadFeesData(filters)}
      />

      {/* Payment Recording Dialog */}
      {activeStudentForPayment && (
        <RecordPaymentDialog
          isOpen={!!activeStudentForPayment}
          onClose={() => setActiveStudentForPayment(null)}
          studentId={activeStudentForPayment.student_id}
          studentName={activeStudentForPayment.student_name}
          admissionNo={activeStudentForPayment.admission_no}
          outstandingAmount={activeStudentForPayment.outstanding_amount}
          onPaymentRecorded={handlePaymentCompleted}
        />
      )}

      {/* Official Printable Fee Receipt Modal */}
      {activeReceipt && (
        <FeeReceiptModal
          isOpen={!!activeReceipt}
          receipt={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}
    </div>
  );
}
