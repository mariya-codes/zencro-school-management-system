'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-state';
import { Toast } from '@/components/ui/toast';
import { communicationService } from '@/lib/services/communication-service';
import { studentService } from '@/lib/services/student-service';
import { PtmEvent, PtmSlot } from '@/types/communication';
import { StudentListItem } from '@/types/student';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  UserCheckIcon,
  MapPinIcon,
  UsersIcon,
} from '@/components/ui/icons';

export default function PtmPage() {
  const [events, setEvents] = useState<PtmEvent[]>([]);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Slot booking modal state
  const [bookingPtm, setBookingPtm] = useState<PtmEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<PtmSlot | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_01');
  const [parentName, setParentName] = useState<string>('Dr. Ramesh Sharma');
  const [parentNotes, setParentNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPtm = async () => {
    setIsLoading(true);
    try {
      const [ptmList, stdList] = await Promise.all([
        communicationService.getPtmEvents(),
        studentService.listStudents({ page: 1, page_size: 50 }),
      ]);
      setEvents(ptmList);
      setStudents(stdList.students);
      if (stdList.students.length > 0) {
        setSelectedStudentId(stdList.students[0].id);
      }
    } catch (err) {
      console.error('Failed to load PTM events', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPtm();
  }, []);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPtm || !selectedSlot) return;

    setIsSubmitting(true);
    try {
      const res = await communicationService.bookPtmSlot(
        bookingPtm.id,
        selectedSlot.slot_id,
        selectedStudentId,
        parentName,
        parentNotes
      );
      setToastMessage(res.message);
      setSelectedSlot(null);
      setBookingPtm(null);
      fetchPtm();
    } catch (err: unknown) {
      setToastMessage((err as Error).message || 'Failed to book slot.');
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
        title="Parent-Teacher Meetings (PTM)"
        description="Schedule individual 15-minute consultations with faculty and review academic progress."
        icon={<CalendarIcon size={24} className="text-indigo-600" />}
      />

      {/* PTM Sessions List */}
      {isLoading ? (
        <div className="p-8">
          <LoadingState message="Loading scheduled PTM conferences..." />
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          No upcoming Parent-Teacher Meetings scheduled at this time.
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => {
            const bookedCount = event.slots.filter((s) => s.is_booked).length;
            const availableCount = event.slots.length - bookedCount;

            return (
              <Card key={event.id} className="border-slate-200/90 shadow-xs bg-white overflow-hidden">
                <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/60">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="success" className="text-[10px] uppercase font-bold">
                          {event.status}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-500">
                          {event.class_name} • {event.section_name}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-extrabold text-slate-900">
                        {event.title}
                      </CardTitle>
                      <p className="text-xs text-slate-600 mt-1">{event.agenda}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block font-medium">Conference Date</span>
                      <span className="text-sm font-extrabold text-slate-900 block font-mono">
                        {event.date}
                      </span>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        {event.location_or_link}
                      </span>
                    </div>
                  </div>

                  {/* Faculty Badge */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[11px]">
                        {event.teacher_name.charAt(0)}
                      </span>
                      <span className="text-slate-700">
                        Class Educator: <strong>{event.teacher_name}</strong> ({event.teacher_designation})
                      </span>
                    </div>

                    <span className="text-slate-500 font-medium">
                      <strong>{availableCount}</strong> available of {event.slots.length} slots
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Available 15-Minute Conference Time Slots
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {event.slots.map((slot) => {
                      return (
                        <div
                          key={slot.slot_id}
                          className={`p-3 rounded-xl border text-xs transition-all ${
                            slot.is_booked
                              ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-white border-slate-300 hover:border-indigo-500 hover:shadow-xs cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-slate-800">
                              {slot.time}
                            </span>
                            {slot.is_booked ? (
                              <span className="text-[10px] font-bold text-slate-400">Booked</span>
                            ) : (
                              <span className="text-[10px] font-extrabold text-emerald-600">Open</span>
                            )}
                          </div>

                          {slot.is_booked ? (
                            <p className="text-[11px] text-slate-500 truncate mt-1">
                              {slot.booked_for_student_name || 'Reserved'}
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setBookingPtm(event);
                                setSelectedSlot(slot);
                              }}
                              className="w-full mt-2 py-1 rounded bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-[11px] transition-all"
                            >
                              Reserve Slot
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Slot Booking Confirmation Modal */}
      {bookingPtm && selectedSlot && (
        <Modal
          isOpen={true}
          onClose={() => {
            setBookingPtm(null);
            setSelectedSlot(null);
          }}
          title="Reserve Conference Slot"
          description={`Confirm 15-minute slot on ${bookingPtm.date} at ${selectedSlot.time}`}
          size="md"
        >
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student / Ward *
              </label>
              <Select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                options={students.map((s) => ({
                  label: `${s.first_name} ${s.last_name} (${s.admission_no} • ${s.class})`,
                  value: s.id,
                }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent / Guardian Full Name *
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Discussion Agenda / Topics for Teacher (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Discuss term 1 exam marks, classroom focus, or extracurricular activities..."
                value={parentNotes}
                onChange={(e) => setParentNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setBookingPtm(null);
                  setSelectedSlot(null);
                }}
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
                {isSubmitting ? 'Reserving...' : 'Confirm Reservation'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
