'use client';

import React from 'react';
import { FeeReceiptData } from '@/types/fees';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { PrinterIcon, CheckCircleIcon, SchoolIcon } from '@/components/ui/icons';

export interface FeeReceiptModalProps {
  receipt: FeeReceiptData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FeeReceiptModal({ receipt, isOpen, onClose }: FeeReceiptModalProps) {
  if (!receipt) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Fee Receipt"
      description={`Receipt No: ${receipt.receipt_no}`}
      size="lg"
    >
      <div className="space-y-6 print:p-0">
        {/* Receipt Voucher Body (Styled for Print & Screen) */}
        <div className="border border-slate-300 rounded-2xl p-6 bg-white shadow-xs space-y-6 text-slate-800">
          {/* Institution Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <SchoolIcon size={26} className="text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                  {receipt.school_info.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {receipt.school_info.affiliation}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {receipt.school_info.address} • Phone: {receipt.school_info.phone}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                PAYMENT CONFIRMED
              </span>
              <p className="text-xs font-mono font-semibold text-slate-700 mt-1">
                {receipt.receipt_no}
              </p>
              <p className="text-[11px] text-slate-500">Date: {receipt.payment_date}</p>
            </div>
          </div>

          {/* Student Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{receipt.student_name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Admission ID</span>
              <span className="font-mono font-bold text-slate-900">{receipt.admission_no}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Class & Section</span>
              <span className="font-semibold text-slate-900">
                {receipt.class_name} ({receipt.section_name})
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Payment Method</span>
              <span className="font-semibold text-slate-900">
                {receipt.payment_method} {receipt.reference_no ? `• ${receipt.reference_no}` : ''}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Fee Heads Settled
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Settled Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receipt.fee_breakdown_settled.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{item.head_name}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/80 font-bold text-slate-900 border-t border-slate-300">
                    <td className="py-3 px-3">TOTAL AMOUNT RECEIVED</td>
                    <td className="py-3 px-3 text-right font-mono text-sm text-emerald-700">
                      ₹{receipt.amount_paid.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Account Balance Summary */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100 text-center">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Total Annual Fee</span>
              <span className="font-bold text-slate-900 text-sm">
                ₹{receipt.total_fee.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 block">Total Paid to Date</span>
              <span className="font-bold text-emerald-700 text-sm">
                ₹{receipt.cumulative_paid.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Remaining Due</span>
              <span className="font-bold text-slate-800 text-sm">
                ₹{receipt.remaining_outstanding.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Authorization & Stamp */}
          <div className="flex items-end justify-between pt-6 border-t border-slate-200 text-xs text-slate-500">
            <div>
              <p>Generated by: {receipt.received_by}</p>
              <p className="text-[10px] text-slate-400">Computer generated system voucher • No signature required</p>
            </div>
            <div className="text-right">
              <div className="h-10 border-b border-slate-400 w-44 mb-1" />
              <p className="font-semibold text-slate-700">Authorized Cashier / Bursar</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <PrinterIcon size={16} className="mr-2" />
            Print Receipt
          </Button>
        </div>
      </div>
    </Modal>
  );
}
