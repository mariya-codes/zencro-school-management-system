'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SectionService } from '@/lib/services/section-service';
import { ClassService } from '@/lib/services/class-service';
import { ClassSection, SchoolClass, TeacherOption } from '@/types/academics';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { useToast } from '@/components/ui/toast';
import {
  LayersIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  UserIcon,
  DoorClosedIcon,
} from '@/components/ui/icons';

function SectionsContent() {
  const searchParams = useSearchParams();
  const initialClassId = searchParams.get('classId') || 'all';

  const { success, error: toastError } = useToast();

  const [sections, setSections] = useState<ClassSection[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<ClassSection | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<ClassSection | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Form State
  const [formClassId, setFormClassId] = useState('');
  const [formName, setFormName] = useState('Section A');
  const [formRoomNumber, setFormRoomNumber] = useState('Room 101');
  const [formMaxCapacity, setFormMaxCapacity] = useState(40);
  const [formTeacherId, setFormTeacherId] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [secData, clsData, teacherData] = await Promise.all([
        SectionService.getAll(),
        ClassService.getAll(),
        SectionService.getTeachers(),
      ]);
      setSections(secData);
      setClasses(clsData);
      setTeachers(teacherData);
      if (clsData.length > 0 && !formClassId) {
        setFormClassId(clsData[0].id);
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to load sections data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingSection(null);
    setFormClassId(classes[0]?.id || '');
    setFormName('Section E');
    setFormRoomNumber('Room 205');
    setFormMaxCapacity(40);
    setFormTeacherId(teachers[0]?.id || '');
    setFormStatus('active');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sec: ClassSection) => {
    setEditingSection(sec);
    setFormClassId(sec.classId);
    setFormName(sec.name);
    setFormRoomNumber(sec.roomNumber);
    setFormMaxCapacity(sec.maxCapacity);
    setFormTeacherId(sec.classTeacherId || '');
    setFormStatus(sec.status);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formClassId) errors.classId = 'Class selection is required';
    if (!formName.trim()) errors.name = 'Section name is required (e.g. Section A)';
    if (!formRoomNumber.trim()) errors.roomNumber = 'Room number is required';
    if (formMaxCapacity <= 0) errors.maxCapacity = 'Capacity must be greater than 0';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const selectedClass = classes.find((c) => c.id === formClassId);
      const selectedTeacher = teachers.find((t) => t.id === formTeacherId);

      if (editingSection) {
        await SectionService.update(editingSection.id, {
          classId: formClassId,
          className: selectedClass?.name || editingSection.className,
          name: formName,
          roomNumber: formRoomNumber,
          maxCapacity: formMaxCapacity,
          classTeacherId: formTeacherId,
          classTeacherName: selectedTeacher?.name || 'Unassigned',
          classTeacherEmail: selectedTeacher?.email,
          status: formStatus,
        });
        success('Section Updated', `${formName} for ${selectedClass?.name || ''} has been saved.`);
      } else {
        await SectionService.create({
          classId: formClassId,
          className: selectedClass?.name || 'Class',
          name: formName,
          roomNumber: formRoomNumber,
          maxCapacity: formMaxCapacity,
          classTeacherId: formTeacherId,
          classTeacherName: selectedTeacher?.name || 'Unassigned',
          classTeacherEmail: selectedTeacher?.email,
          status: formStatus,
        });
        success('Section Created', `${formName} added.`);
      }
      setIsModalOpen(false);
      const updated = await SectionService.getAll();
      setSections(updated);
    } catch (err: unknown) {
      toastError('Save Error', (err as Error).message || 'Failed to save section');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await SectionService.delete(deleteTarget.id);
      success('Section Deleted', `${deleteTarget.className} - ${deleteTarget.name} has been removed.`);
      setDeleteTarget(null);
      const updated = await SectionService.getAll();
      setSections(updated);
    } catch (err: unknown) {
      toastError('Delete Failed', (err as Error).message || 'Cannot delete section');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSections = selectedClassId === 'all'
    ? sections
    : sections.filter((s) => s.classId === selectedClassId);

  const columns: Column<ClassSection>[] = [
    {
      key: 'name',
      header: 'Section & Class',
      sortable: true,
      accessor: (sec) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-extrabold text-xs shrink-0">
            {sec.name.slice(0, 3).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate">{sec.name}</p>
            <p className="text-xs text-slate-500">{sec.className}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'classTeacherName',
      header: 'Assigned Class Teacher',
      sortable: true,
      accessor: (sec) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <UserIcon size={14} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-xs text-slate-800 truncate">
              {sec.classTeacherName || 'Unassigned'}
            </p>
            {sec.classTeacherEmail && (
              <p className="text-[10px] text-slate-400 truncate">{sec.classTeacherEmail}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Room Allocation',
      sortable: true,
      accessor: (sec) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <DoorClosedIcon size={14} className="text-slate-400" />
          <span>{sec.roomNumber}</span>
        </div>
      ),
    },
    {
      key: 'capacity',
      header: 'Student Capacity',
      sortable: true,
      accessor: (sec) => (
        <div className="text-xs font-semibold">
          <span className="text-slate-900">{sec.currentEnrollment}</span>
          <span className="text-slate-400"> / {sec.maxCapacity} Seats</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (sec) => (
        <Badge variant={sec.status === 'active' ? 'success' : 'default'} size="sm" dot>
          {sec.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      accessor: (sec) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenEditModal(sec)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Edit Section"
          >
            <EditIcon size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget(sec)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Section"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Class Sections & Room Allocations"
        subtitle="Manage sections (A, B, C), assign faculty mentors, and allocate classroom physical spaces."
        actions={
          <Button onClick={handleOpenAddModal} leftIcon={<PlusIcon size={16} />}>
            Add New Section
          </Button>
        }
      />

      {/* Class filter dropdown & search bar */}
      <div className="flex items-center gap-3">
        <div className="w-64">
          <Select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            options={[
              { value: 'all', label: 'All Classes' },
              ...classes.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState title="Loading Sections..." message="Retrieving classroom allocations and teachers." />
      ) : errorMessage ? (
        <ErrorState
          title="Could not load sections"
          message={errorMessage}
          code="INTERNAL_ERROR"
          onRetry={loadData}
        />
      ) : (
        <DataTable
          data={filteredSections}
          columns={columns}
          keyExtractor={(sec) => sec.id}
          searchPlaceholder="Search sections by name, teacher or room..."
          searchKeys={['name', 'className', 'classTeacherName', 'roomNumber']}
          emptyTitle="No Sections Found"
          emptyDescription="No classroom sections match your selected class filter."
          emptyActionLabel="Add New Section"
          onEmptyAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Section Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSection ? `Edit Section: ${editingSection.name}` : 'Add New Classroom Section'}
        description="Allocate class grade, section code, teacher mentor, and room number."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveSection} isLoading={isSaving}>
              {editingSection ? 'Save Changes' : 'Create Section'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveSection} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Select Parent Class"
              requiredIndicator
              value={formClassId}
              error={formErrors.classId}
              onChange={(e) => setFormClassId(e.target.value)}
              options={classes.map((c) => ({ value: c.id, label: c.name }))}
            />

            <Input
              label="Section Identifier"
              requiredIndicator
              value={formName}
              error={formErrors.name}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Section A"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assigned Class Teacher"
              value={formTeacherId}
              onChange={(e) => setFormTeacherId(e.target.value)}
              options={[
                { value: '', label: 'Select a Teacher...' },
                ...teachers.map((t) => ({ value: t.id, label: `${t.name} (${t.designation})` })),
              ]}
            />

            <Input
              label="Classroom / Room Number"
              requiredIndicator
              value={formRoomNumber}
              error={formErrors.roomNumber}
              onChange={(e) => setFormRoomNumber(e.target.value)}
              placeholder="e.g. Room 201"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max Student Capacity"
              type="number"
              min={1}
              value={formMaxCapacity}
              error={formErrors.maxCapacity}
              onChange={(e) => setFormMaxCapacity(Number(e.target.value))}
            />

            <Select
              label="Status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as 'active' | 'inactive')}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Section"
        description={`Are you sure you want to remove "${deleteTarget?.name}" from ${deleteTarget?.className}?`}
        confirmLabel="Delete Section"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function SectionsPage() {
  return (
    <Suspense fallback={<LoadingState title="Loading Sections..." message="Preparing classroom configuration." />}>
      <SectionsContent />
    </Suspense>
  );
}
