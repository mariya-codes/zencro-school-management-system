'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-state';
import { CreateAnnouncementDialog } from '@/components/communication/create-announcement-dialog';
import { communicationService } from '@/lib/services/communication-service';
import { Announcement } from '@/types/communication';
import {
  MessageSquareIcon,
  PlusIcon,
  BellIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@/components/ui/icons';

export default function CommunicationPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const fetchAnnouncements = async (filter?: string) => {
    setIsLoading(true);
    try {
      const list = await communicationService.getAnnouncements(filter);
      setAnnouncements(list);
    } catch (err) {
      console.error('Failed to load notices', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(audienceFilter);
  }, [audienceFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="School Communication & Broadcasts"
          description="Send and track institutional notices, parent updates, and emergency circulars with audience targeting."
          icon={<MessageSquareIcon size={24} className="text-indigo-600" />}
        />
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shrink-0"
        >
          <PlusIcon size={16} className="mr-1.5" />
          Broadcast New Notice
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="border-slate-200/90 shadow-xs bg-white">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Target Audience:</span>
            <div className="w-48">
              <Select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                options={[
                  { label: 'All Notices', value: 'all' },
                  { label: 'Parents Only', value: 'parents' },
                  { label: 'Teaching Faculty Only', value: 'teachers' },
                  { label: 'Class Specific', value: 'class' },
                ]}
              />
            </div>
          </div>

          <span className="text-xs text-slate-400">
            {announcements.length} {announcements.length === 1 ? 'Notice' : 'Notices'} published
          </span>
        </CardContent>
      </Card>

      {/* Announcements Feed */}
      {isLoading ? (
        <div className="p-8">
          <LoadingState message="Loading announcements feed..." />
        </div>
      ) : announcements.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          No announcements found for this audience filter.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => {
            const isUrgent = ann.priority === 'urgent';
            const isImportant = ann.priority === 'important';

            return (
              <Card
                key={ann.id}
                className={`border transition-all shadow-xs ${
                  isUrgent
                    ? 'border-rose-300 bg-rose-50/20'
                    : isImportant
                    ? 'border-indigo-200 bg-indigo-50/10'
                    : 'border-slate-200/90 bg-white'
                }`}
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {ann.is_pinned && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-extrabold text-[10px] uppercase tracking-wider">
                            📌 Pinned
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                            isUrgent
                              ? 'bg-rose-100 text-rose-800'
                              : isImportant
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ann.priority} priority
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase">
                          Audience: {ann.target_audience}
                        </span>
                      </div>
                      <CardTitle className="text-base font-extrabold text-slate-900 mt-1">
                        {ann.title}
                      </CardTitle>
                    </div>

                    <span className="text-xs text-slate-400 shrink-0">
                      {new Date(ann.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Issued by: <strong className="text-slate-700">{ann.author_name}</strong> ({ann.author_role})
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Broadcast Dialog */}
      <CreateAnnouncementDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAnnouncementCreated={(newAnn) => setAnnouncements((prev) => [newAnn, ...prev])}
      />
    </div>
  );
}
