'use client';

import React from 'react';
import { FeeSummary as FeeSummaryType } from '@/types/student';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CreditCardIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  DownloadIcon,
  InfoIcon,
} from '@/components/ui/icons';

export interface FeeSummaryProps {
  data: FeeSummaryType;
}

export function FeeSummary({ data }: FeeSummaryProps) {
  const getTransactionBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" size="sm">Paid / Settled</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Due / Pending</Badge>;
      case 'failed':
        return <Badge variant="danger" size="sm">Failed</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Fee Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Annual Fee"
          value={`₹${data.total_fee.toLocaleString()}`}
          icon={<CreditCardIcon size={24} />}
          subtitle="Academic Session 2026-27"
          accentColor="indigo"
        />

        <StatCard
          title="Total Paid"
          value={`₹${data.paid_fee.toLocaleString()}`}
          icon={<CheckCircleIcon size={24} />}
          trend={{
            value: `${Math.round((data.paid_fee / data.total_fee) * 100)}% Cleared`,
            isPositive: true,
          }}
          subtitle="Receipts confirmed"
          accentColor="emerald"
        />

        <StatCard
          title="Outstanding Balance"
          value={`₹${data.outstanding_fee.toLocaleString()}`}
          icon={<AlertCircleIcon size={24} />}
          subtitle={data.next_due_date ? `Due by ${data.next_due_date}` : 'No pending balance'}
          accentColor={data.outstanding_fee > 0 ? 'amber' : 'emerald'}
        />
      </div>

      {/* Payment & Invoice Ledger */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Invoices & Payment Transactions</CardTitle>
            <CardDescription>
              Record of quarterly tuition, laboratory composite fees, and receipts.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-200/80 bg-slate-50/75 font-bold uppercase tracking-wider text-slate-700">
                <tr>
                  <th className="px-5 py-3">Receipt / Ref #</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Payment Mode</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recent_transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3 font-mono font-bold text-slate-800">
                      {tx.receipt_no}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {tx.date}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-800">
                      {tx.title}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {tx.payment_mode}
                    </td>
                    <td className="px-5 py-3 font-mono font-bold text-slate-900">
                      ₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      {getTransactionBadge(tx.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Scope Notice */}
      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-xs text-indigo-900">
        <InfoIcon size={16} className="text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Day 2 Scope Notice:</span> This is a student-level fee summary. Institutional invoicing, payment gateway callbacks, and bulk fee reconciliation will be handled in the later Fees module.
        </p>
      </div>
    </div>
  );
}
