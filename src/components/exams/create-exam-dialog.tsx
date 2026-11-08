'use client';

import React, { useState } from 'react';
import { Exam } from '@/types/exams';
import { examService } from '@/lib/services/exam-service';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { AwardIcon, PlusIcon, CheckCircleIcon } from '@/components/ui/icons';

export interface CreateExamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExamCreated: (exam: Exam) => void;
}

export function CreateExamDialog({ isOpen, onClose, onExamCreated }: CreateExamDialogProps) {
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('cls_10');
  const [termId, setTermId] = useState('term_1');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await examService.createExam({
        name,
        class_id: classId,
        class_name: classId === 'cls_10' ? 'Class 10' : classId === 'cls_9' ? 'Class 9' : 'Class 12 - Science',
        term_id: termId,
        term_name: termId === 'term_1' ? 'Term 1 (Mid-Term)' : 'Term 2 (Final / Pre-Board)',
        start_date: startDate,
        end_date: endDate,
        status: 'scheduled',
      });
      onExamCreated(created);
      onClose();
    } catch (err) {
      console.error('Failed to create exam', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule New Examination"
      description="Configure assessment session, target class and examination schedule."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Examination Title *
          </label>
          <Input
            placeholder="e.g. Term 2 Pre-Board Assessment 2027"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class *</label>
            <Select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              options={[
                { label: 'Class 10', value: 'cls_10' },
                { label: 'Class 9', value: 'cls_9' },
                { label: 'Class 12 - Science', value: 'cls_12_sci' },
                { label: 'Class 8', value: 'cls_8' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Term *</label>
            <Select
              value={termId}
              onChange={(e) => setTermId(e.target.value)}
              options={[
                { label: 'Term 1 (Mid-Term)', value: 'term_1' },
                { label: 'Term 2 (Final Assessment)', value: 'term_2' },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">End Date *</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <CheckCircleIcon size={16} className="mr-1.5" />
            {isSubmitting ? 'Creating...' : 'Create Examination'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
