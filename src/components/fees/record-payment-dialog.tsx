'use client';

import React, { useState } from 'react';
import { RecordPaymentRequest, PaymentMethod, FeeReceiptData } from '@/types/fees';
import { feesService } from '@/lib/services/fees-service';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CreditCardIcon, CheckCircleIcon } from '@/components/ui/icons';

export interface RecordPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  admissionNo: string;
  outstandingAmount: number;
  onPaymentRecorded: (receipt: FeeReceiptData) => void;
}

export function RecordPaymentDialog({
  isOpen,
  onClose,
  studentId,
  studentName,
  admissionNo,
  outstandingAmount,
  onPaymentRecorded,
}: RecordPaymentDialogProps) {
  const [amount, setAmount] = useState<string>(
    outstandingAmount > 0 ? String(outstandingAmount) : '15000'
  );
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [method, setMethod] = useState<PaymentMethod>('Online UPI');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive payment amount.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: RecordPaymentRequest = {
        student_id: studentId,
        amount: numAmount,
        payment_date: paymentDate,
        payment_method: method,
        reference_no: referenceNo || undefined,
        notes: notes || undefined,
      };

      const result = await feesService.recordPayment(payload);
      onPaymentRecorded(result.receipt);
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to record fee payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayFull = () => {
    setAmount(String(outstandingAmount));
  };

  const handlePayHalf = () => {
    setAmount(String(Math.round(outstandingAmount / 2)));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Fee Payment"
      description={`Record collection for ${studentName} (${admissionNo})`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Student Balance Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Current Outstanding Balance</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              ₹{outstandingAmount.toLocaleString('en-IN')}
            </span>
          </div>
          {outstandingAmount > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePayHalf}
                className="px-2.5 py-1 text-xs rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
              >
                50% (₹{Math.round(outstandingAmount / 2).toLocaleString('en-IN')})
              </button>
              <button
                type="button"
                onClick={handlePayFull}
                className="px-2.5 py-1 text-xs rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold"
              >
                Full Due
              </button>
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Amount to Pay (INR) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono font-bold text-base focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        {/* Payment Date & Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Mode *
            </label>
            <Select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              options={[
                { label: 'Online UPI (GPay/PhonePe/Paytm)', value: 'Online UPI' },
                { label: 'Net Banking / NEFT / RTGS', value: 'Net Banking' },
                { label: 'Cash in Hand (Counter)', value: 'Cash' },
                { label: 'Cheque / Demand Draft', value: 'Cheque' },
                { label: 'Debit / Credit Card POS', value: 'Debit/Credit Card' },
              ]}
            />
          </div>
        </div>

        {/* Transaction Reference Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Transaction Ref / UTR / Cheque Number
          </label>
          <Input
            placeholder="e.g. UPI/HDFC/20261026-9901 or CHQ-001928"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
          />
        </div>

        {/* Internal Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Accountant Remarks / Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Paid in full for Term 1 tuition charges"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <CheckCircleIcon size={16} className="mr-1.5" />
            {isSubmitting ? 'Recording...' : 'Confirm & Generate Receipt'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
