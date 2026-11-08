'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StudentFeeListItem, FeePaymentStatus } from '@/types/fees';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  CreditCardIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  SearchIcon,
  EyeIcon,
  PlusIcon,
} from '@/components/ui/icons';

export interface StudentFeesTableProps {
  items: StudentFeeListItem[];
  isLoading: boolean;
  onRecordPayment: (item: StudentFeeListItem) => void;
  onFilterChange: (filters: { search: string; class_id?: string; status?: FeePaymentStatus }) => void;
}

export function StudentFeesTable({
  items,
  isLoading,
  onRecordPayment,
  onFilterChange,
}: StudentFeesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    onFilterChange({
      search: val,
      class_id: selectedClass === 'all' ? undefined : selectedClass,
      status: selectedStatus === 'all' ? undefined : (selectedStatus as FeePaymentStatus),
    });
  };

  const handleClassChange = (val: string) => {
    setSelectedClass(val);
    onFilterChange({
      search: searchTerm,
      class_id: val === 'all' ? undefined : val,
      status: selectedStatus === 'all' ? undefined : (selectedStatus as FeePaymentStatus),
    });
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    onFilterChange({
      search: searchTerm,
      class_id: selectedClass === 'all' ? undefined : selectedClass,
      status: val === 'all' ? undefined : (val as FeePaymentStatus),
    });
  };

  return (
    <Card className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
      {/* Header with Search & Filter Bars */}
      <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Student Fee Ledgers
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Live balances showing Total, Paid and Outstanding amounts.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-60">
              <SearchIcon size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or admission no..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="w-36">
              <Select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                options={[
                  { label: 'All Classes', value: 'all' },
                  { label: 'Class 10', value: 'cls_10' },
                  { label: 'Class 9', value: 'cls_9' },
                  { label: 'Class 12 - Sci', value: 'cls_12_sci' },
                  { label: 'Nursery', value: 'cls_nur' },
                ]}
              />
            </div>

            <div className="w-36">
              <Select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                options={[
                  { label: 'All Statuses', value: 'all' },
                  { label: 'Paid in Full', value: 'paid' },
                  { label: 'Partially Paid', value: 'partial' },
                  { label: 'Overdue / Defaulter', value: 'overdue' },
                ]}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Student & Admission</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-right">Total Fee</th>
                <th className="py-3 px-4 text-right">Paid to Date</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Loading student fee ledgers...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No student fee records found matching your filters.
                  </td>
                </tr>
              ) : (
                items.map((student) => {
                  const isPaid = student.status === 'paid';
                  const isPartial = student.status === 'partial';
                  const isOverdue = student.status === 'overdue';

                  return (
                    <tr
                      key={student.student_id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      {/* Student info */}
                      <td className="py-3 px-4">
                        <Link
                          href={`/fees/students/${student.student_id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                        >
                          {student.student_name}
                        </Link>
                        <p className="font-mono text-xs text-slate-500 mt-0.5">
                          {student.admission_no}
                        </p>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4 text-slate-700">
                        <span className="font-medium">{student.class_name}</span>
                        <span className="text-xs text-slate-400 block">{student.section_name}</span>
                      </td>

                      {/* Total Fee */}
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-700">
                        ₹{student.total_fee.toLocaleString('en-IN')}
                      </td>

                      {/* Paid */}
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                        ₹{student.paid_amount.toLocaleString('en-IN')}
                      </td>

                      {/* Outstanding */}
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {student.outstanding_amount === 0 ? (
                          <span className="text-slate-400">₹0</span>
                        ) : (
                          <span className="text-rose-700 font-extrabold">
                            ₹{student.outstanding_amount.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                            <CheckCircleIcon size={12} />
                            Paid
                          </span>
                        ) : isPartial ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                            <ClockIcon size={12} />
                            Partial
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                            <AlertCircleIcon size={12} />
                            Overdue
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {student.outstanding_amount > 0 && (
                            <Button
                              size="sm"
                              onClick={() => onRecordPayment(student)}
                              className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-2xs"
                            >
                              <CreditCardIcon size={13} className="mr-1" />
                              Pay
                            </Button>
                          )}
                          <Link href={`/fees/students/${student.student_id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs border-slate-300 text-slate-700 hover:bg-slate-100"
                            >
                              <EyeIcon size={13} className="mr-1" />
                              Ledger
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
