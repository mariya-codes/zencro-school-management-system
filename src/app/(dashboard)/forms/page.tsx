'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { LoadingState } from '@/components/ui/loading-state';
import { Toast } from '@/components/ui/toast';
import { communicationService } from '@/lib/services/communication-service';
import { SchoolForm } from '@/types/communication';
import {
  ClipboardListIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  FileTextIcon,
} from '@/components/ui/icons';

export default function FormsPage() {
  const [forms, setForms] = useState<SchoolForm[]>([]);
  const [activeForm, setActiveForm] = useState<SchoolForm | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [studentId, setStudentId] = useState<string>('std_01');
  const [parentName, setParentName] = useState<string>('Dr. Ramesh Sharma');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const list = await communicationService.getForms();
      setForms(list);
    } catch (err) {
      console.error('Failed to load forms', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleOpenForm = (form: SchoolForm) => {
    setActiveForm(form);
    const initialAnswers: Record<string, string | boolean> = {};
    form.fields.forEach((f) => {
      initialAnswers[f.id] = f.type === 'checkbox' ? false : '';
    });
    setAnswers(initialAnswers);
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeForm) return;

    setIsSubmitting(true);
    try {
      const res = await communicationService.submitFormResponse(
        activeForm.id,
        studentId,
        parentName,
        answers
      );
      setToastMessage(res.message);
      setActiveForm(null);
      fetchForms();
    } catch {
      setToastMessage('Failed to submit form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <Toast
          variant="success"
          title={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Page Header */}
      <PageHeader
        title="School Forms & Digital Consents"
        description="Official excursions permission slips, medical declarations, and administrative verification forms."
        icon={<ClipboardListIcon size={24} className="text-indigo-600" />}
      />

      {/* Forms Grid */}
      {isLoading ? (
        <div className="p-8">
          <LoadingState message="Loading school forms registry..." />
        </div>
      ) : forms.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          No active school forms requiring submission at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forms.map((form) => {
            const completionPct = Math.round((form.total_submitted / form.total_assigned) * 100);

            return (
              <Card key={form.id} className="border-slate-200/90 shadow-xs bg-white">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase">
                          {form.category}
                        </span>
                        {form.is_mandatory && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px] uppercase">
                            Mandatory
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-base font-extrabold text-slate-900 leading-snug">
                        {form.title}
                      </CardTitle>
                    </div>

                    <span className="text-xs text-slate-400 font-medium shrink-0">
                      Due: {form.due_date}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {form.description}
                  </p>

                  {/* Submission Rate Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Submissions Received</span>
                      <span className="font-bold text-slate-800">
                        {form.total_submitted} / {form.total_assigned} ({completionPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {form.fields.length} interactive {form.fields.length === 1 ? 'field' : 'fields'}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleOpenForm(form)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                    >
                      Fill & Submit Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Interactive Form Submission Modal */}
      {activeForm && (
        <Modal
          isOpen={true}
          onClose={() => setActiveForm(null)}
          title={activeForm.title}
          description={`Due by ${activeForm.due_date} • Category: ${activeForm.category}`}
          size="lg"
        >
          <form onSubmit={handleSubmitResponse} className="space-y-4">
            <p className="text-xs text-slate-600 p-3 rounded-lg bg-slate-50 border border-slate-200">
              {activeForm.description}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submitting For Student
                </label>
                <input
                  type="text"
                  disabled
                  value="Aryan Sharma (ADM-2026-0101 • Class 10)"
                  className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent / Signer Name *
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
                  required
                />
              </div>
            </div>

            {/* Dynamic Form Fields */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              {activeForm.fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-800">
                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                  </label>

                  {field.type === 'checkbox' ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id={field.id}
                        required={field.required}
                        checked={Boolean(answers[field.id])}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [field.id]: e.target.checked }))
                        }
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={field.id} className="text-xs text-slate-600 cursor-pointer">
                        I agree and provide formal authorization.
                      </label>
                    </div>
                  ) : field.type === 'radio' && field.options ? (
                    <div className="flex flex-wrap gap-4 pt-1">
                      {field.options.map((opt) => (
                        <label key={opt} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name={field.id}
                            value={opt}
                            required={field.required}
                            checked={answers[field.id] === opt}
                            onChange={(e) =>
                              setAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))
                            }
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={2}
                      placeholder={field.placeholder || 'Type here...'}
                      value={String(answers[field.id] || '')}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={field.placeholder || 'Enter value...'}
                      required={field.required}
                      value={String(answers[field.id] || '')}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveForm(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                <CheckCircleIcon size={16} className="mr-1.5" />
                {isSubmitting ? 'Submitting...' : 'Sign & Submit Form'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
