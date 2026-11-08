'use client';

import React, { useState } from 'react';
import { Announcement, AnnouncementAudience, AnnouncementPriority } from '@/types/communication';
import { communicationService } from '@/lib/services/communication-service';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { MessageSquareIcon, CheckCircleIcon } from '@/components/ui/icons';

export interface CreateAnnouncementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAnnouncementCreated: (ann: Announcement) => void;
}

export function CreateAnnouncementDialog({
  isOpen,
  onClose,
  onAnnouncementCreated,
}: CreateAnnouncementDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState<AnnouncementAudience>('all');
  const [priority, setPriority] = useState<AnnouncementPriority>('normal');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await communicationService.createAnnouncement({
        title,
        content,
        target_audience: audience,
        priority,
        is_pinned: isPinned,
      });
      onAnnouncementCreated(created);
      onClose();
    } catch (err) {
      console.error('Failed to broadcast notice', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Broadcast Announcement"
      description="Publish an official bulletin or circular to parents, teachers, or students."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notice Title *
          </label>
          <Input
            placeholder="e.g. Mandatory Parent-Teacher Meeting Schedule"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Audience *
            </label>
            <Select
              value={audience}
              onChange={(e) => setAudience(e.target.value as AnnouncementAudience)}
              options={[
                { label: 'All School (Parents, Staff & Students)', value: 'all' },
                { label: 'Parents Only', value: 'parents' },
                { label: 'Teaching Staff Only', value: 'teachers' },
                { label: 'Specific Class (Class 10)', value: 'class' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority Urgency *
            </label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
              options={[
                { label: 'Normal Bulletin', value: 'normal' },
                { label: 'Important Notice', value: 'important' },
                { label: 'Urgent / Action Required', value: 'urgent' },
              ]}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notice Details & Body *
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your circular details here..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="pinned-chk"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="pinned-chk" className="text-xs text-slate-700 font-medium">
            Pin notice to the top of notice boards
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <CheckCircleIcon size={16} className="mr-1.5" />
            {isSubmitting ? 'Publishing...' : 'Broadcast Notice'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
