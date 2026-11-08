'use client';

import React from 'react';
import { FeesSummaryResponse } from '@/types/fees';
import { CreditCardIcon, CheckCircleIcon, AlertCircleIcon, TrendingUpIcon } from '@/components/ui/icons';

export interface FeesDashboardStatsProps {
  summary: FeesSummaryResponse | null;
}

export function FeesDashboardStats({ summary }: FeesDashboardStatsProps) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. TOTAL FEES */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Annual Fee
          </span>
          <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <CreditCardIcon size={18} />
          </div>
        </div>
        <p className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-mono mt-3">
          ₹{summary.total_fees.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {summary.total_students} enrolled students billable
        </p>
      </div>

      {/* 2. PAID (COLLECTED) */}
      <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/40 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Collected (Paid)
          </span>
          <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircleIcon size={18} />
          </div>
        </div>
        <p className="text-2xl lg:text-3xl font-extrabold text-emerald-700 font-mono mt-3">
          ₹{summary.collected_fees.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-emerald-700/80 font-medium mt-1">
          {summary.fully_paid_students} fully paid • {summary.partial_paid_students} partial
        </p>
      </div>

      {/* 3. OUTSTANDING (PENDING) */}
      <div className="rounded-2xl border border-rose-200/90 bg-rose-50/40 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
            Outstanding Due
          </span>
          <div className="h-9 w-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
            <AlertCircleIcon size={18} />
          </div>
        </div>
        <p className="text-2xl lg:text-3xl font-extrabold text-rose-700 font-mono mt-3">
          ₹{summary.outstanding_fees.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-rose-700/80 font-medium mt-1">
          {summary.defaulter_students} overdue accounts requiring follow-up
        </p>
      </div>

      {/* 4. COLLECTION RATE */}
      <div className="rounded-2xl border border-indigo-200/90 bg-indigo-50/40 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
            Collection Rate
          </span>
          <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
            <TrendingUpIcon size={18} />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <p className="text-2xl lg:text-3xl font-extrabold text-indigo-700">
            {summary.collection_percentage}%
          </p>
          <span className="text-xs font-semibold text-indigo-600">of target</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-indigo-200/60 rounded-full h-2 mt-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, summary.collection_percentage)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
