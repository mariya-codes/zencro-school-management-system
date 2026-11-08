'use client';

import React from 'react';
import { StudentFormItem } from '@/types/student';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ClipboardListIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  InfoIcon,
} from '@/components/ui/icons';

export interface FormsSummaryProps {
  forms: StudentFormItem[];
}

export function FormsSummary({ forms }: FormsSummaryProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" size="sm">Approved</Badge>;
      case 'submitted':
        return <Badge variant="info" size="sm">Submitted (Under Review)</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending Submission</Badge>;
      case 'rejected':
        return <Badge variant="danger" size="sm">Rejected</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Institutional Forms & Consents ({forms.length})
          </h3>
          <p className="text-xs text-slate-500">
            Mandatory declarations, field trip indemnities, health cards, and bus requests.
          </p>
        </div>
      </div>

      {forms.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            title="No forms recorded"
            description="There are currently no active digital forms or declarations assigned to this student."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {forms.map((form) => (
            <Card key={form.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                    <ClipboardListIcon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {form.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-700">
                        Category: {form.category}
                      </span>
                      {form.submission_date && (
                        <>
                          <span>•</span>
                          <span>Submitted on: {form.submission_date}</span>
                        </>
                      )}
                      {form.due_date && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 font-semibold">
                            Due by: {form.due_date}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 sm:self-center">
                  {getStatusBadge(form.status)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Scope Notice */}
      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-xs text-indigo-900">
        <InfoIcon size={16} className="text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Day 2 Scope Notice:</span> Read-only student forms summary. Custom form builder, e-signatures, and administrative review workflows will be implemented in the dedicated Forms module.
        </p>
      </div>
    </div>
  );
}
