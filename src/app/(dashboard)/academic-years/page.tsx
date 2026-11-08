'use client';

import React, { useState, useEffect } from 'react';
import { AcademicYearService } from '@/lib/services/academic-year-service';
import { AcademicYear, AcademicYearStatus } from '@/types/academics';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { useToast } from '@/components/ui/toast';
import { formatDate } from '@/lib/utils';
import {
  CalendarIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@/components/ui/icons';

export default function AcademicYearsPage() {
  const { success, error: toastError } = useToast();

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<AcademicYear | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formStartDate, setFormStartDate] = useState('2026-04-01');
  const [formEndDate, setFormEndDate] = useState('2027-03-31');
  const [formStatus, setFormStatus] = useState<AcademicYearStatus>('upcoming');
  const [formWorkingDays, setFormWorkingDays] = useState(220);
  const [formDescription, setFormDescription] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAcademicYears();
  }, []);

  const loadAcademicYears = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await AcademicYearService.getAll();
      setAcademicYears(data);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to load academic years');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingYear(null);
    setFormName('2027 - 2028');
    setFormStartDate('2027-04-01');
    setFormEndDate('2028-03-31');
    setFormStatus('upcoming');
    setFormWorkingDays(220);
    setFormDescription('Annual session for Pre-Primary to Class 12.');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (year: AcademicYear) => {
    setEditingYear(year);
    setFormName(year.name);
    setFormStartDate(year.startDate);
    setFormEndDate(year.endDate);
    setFormStatus(year.status);
    setFormWorkingDays(year.totalWorkingDays);
    setFormDescription(year.description || '');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = 'Session name is required (e.g. 2026 - 2027)';
    if (!formStartDate) errors.startDate = 'Start date is required';
    if (!formEndDate) errors.endDate = 'End date is required';
    if (new Date(formStartDate) >= new Date(formEndDate)) {
      errors.endDate = 'End date must be after start date';
    }
    if (formWorkingDays <= 0) errors.workingDays = 'Working days must be greater than 0';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (editingYear) {
        await AcademicYearService.update(editingYear.id, {
          name: formName,
          startDate: formStartDate,
          endDate: formEndDate,
          status: formStatus,
          totalWorkingDays: formWorkingDays,
          description: formDescription,
        });
        success('Academic Year Updated', `${formName} has been saved.`);
      } else {
        await AcademicYearService.create({
          name: formName,
          startDate: formStartDate,
          endDate: formEndDate,
          status: formStatus,
          isCurrent: formStatus === 'active',
          totalWorkingDays: formWorkingDays,
          description: formDescription,
          terms: [
            {
              id: `term_${Date.now()}_1`,
              name: 'Term 1 / Half-Yearly',
              startDate: formStartDate,
              endDate: formStartDate.slice(0, 4) + '-09-30',
              isCompleted: false,
            },
            {
              id: `term_${Date.now()}_2`,
              name: 'Term 2 / Annual',
              startDate: formStartDate.slice(0, 4) + '-10-01',
              endDate: formEndDate,
              isCompleted: false,
            },
          ],
        });
        success('Academic Year Created', `${formName} added to the system.`);
      }
      setIsModalOpen(false);
      await loadAcademicYears();
    } catch (err: unknown) {
      toastError('Save Error', (err as Error).message || 'Failed to save academic session');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetActive = async (year: AcademicYear) => {
    try {
      await AcademicYearService.setAsCurrent(year.id);
      success('Active Session Changed', `${year.name} is now the primary active academic year.`);
      await loadAcademicYears();
    } catch (err: unknown) {
      toastError('Action Failed', (err as Error).message || 'Failed to set active year');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await AcademicYearService.delete(deleteTarget.id);
      success('Academic Year Removed', `${deleteTarget.name} has been deleted.`);
      setDeleteTarget(null);
      await loadAcademicYears();
    } catch (err: unknown) {
      toastError('Delete Failed', (err as Error).message || 'Cannot delete session');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Academic Years & Calendar"
        subtitle="Configure institutional sessions (April–March), term examinations, and instructional working days."
        actions={
          <Button onClick={handleOpenAddModal} leftIcon={<PlusIcon size={16} />}>
            New Academic Year
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState title="Loading Academic Years..." message="Retrieving sessions and term schedules." />
      ) : errorMessage ? (
        <ErrorState
          title="Could not load academic years"
          message={errorMessage}
          code="INTERNAL_ERROR"
          onRetry={loadAcademicYears}
        />
      ) : academicYears.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon size={32} />}
          title="No Academic Years Found"
          description="Create your first academic session to begin assigning classes and terms."
          actionLabel="Create Academic Year"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicYears.map((year) => {
            const isActive = year.isCurrent;

            return (
              <Card
                key={year.id}
                className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${
                  isActive
                    ? 'border-indigo-400 ring-1 ring-indigo-500/20 shadow-indigo-100/50'
                    : ''
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        year.status === 'active'
                          ? 'success'
                          : year.status === 'upcoming'
                          ? 'purple'
                          : 'default'
                      }
                      size="sm"
                      dot
                    >
                      {year.status === 'active'
                        ? 'Current Active'
                        : year.status === 'upcoming'
                        ? 'Upcoming Plan'
                        : 'Archived / Past'}
                    </Badge>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(year)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Session"
                      >
                        <EditIcon size={15} />
                      </button>
                      {!isActive && (
                        <button
                          onClick={() => setDeleteTarget(year)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Session"
                        >
                          <TrashIcon size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  <CardTitle className="text-xl mt-2">{year.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {formatDate(year.startDate)} – {formatDate(year.endDate)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-1 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-medium">Target Working Days</span>
                    <span className="font-bold text-slate-900">{year.totalWorkingDays} Days</span>
                  </div>

                  {/* Terms breakdown */}
                  <div className="space-y-2">
                    <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                      Academic Term Windows ({year.terms?.length || 2})
                    </p>
                    {year.terms?.map((term) => (
                      <div
                        key={term.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100"
                      >
                        <span className="font-medium text-slate-700 truncate max-w-[140px]">
                          {term.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(term.startDate)} – {formatDate(term.endDate)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    {!isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleSetActive(year)}
                        leftIcon={<CheckIcon size={14} />}
                      >
                        Set as Active Session
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                        <CheckCircleIcon size={14} />
                        <span>Active for all classes</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Academic Year Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingYear ? `Edit Academic Session: ${editingYear.name}` : 'Create New Academic Year'}
        description="Specify session date span (April–March) and instructional days."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveYear} isLoading={isSaving}>
              {editingYear ? 'Save Changes' : 'Create Session'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveYear} className="space-y-4">
          <Input
            label="Session Name"
            requiredIndicator
            value={formName}
            error={formErrors.name}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. 2026 - 2027"
            helperText="Standard format: YYYY - YYYY"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Session Start Date"
              type="date"
              requiredIndicator
              value={formStartDate}
              error={formErrors.startDate}
              onChange={(e) => setFormStartDate(e.target.value)}
            />

            <Input
              label="Session End Date"
              type="date"
              requiredIndicator
              value={formEndDate}
              error={formErrors.endDate}
              onChange={(e) => setFormEndDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as AcademicYearStatus)}
              options={[
                { value: 'active', label: 'Active (Current)' },
                { value: 'upcoming', label: 'Upcoming (Planned)' },
                { value: 'archived', label: 'Archived (Completed)' },
              ]}
            />

            <Input
              label="Target Working Days"
              type="number"
              value={formWorkingDays}
              error={formErrors.workingDays}
              onChange={(e) => setFormWorkingDays(Number(e.target.value))}
              placeholder="220"
            />
          </div>

          <Textarea
            label="Session Description / Notes"
            rows={2}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="e.g. Session for Nursery to Class 12 with CBSE Board AISSE & AISSCE examinations."
          />
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Academic Year"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Session"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
