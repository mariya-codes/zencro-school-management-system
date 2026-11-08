'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClassService } from '@/lib/services/class-service';
import { SchoolClass, ClassLevel, SeniorStream } from '@/types/academics';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { useToast } from '@/components/ui/toast';
import {
  GraduationCapIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  LayersIcon,
  CheckCircleIcon,
} from '@/components/ui/icons';

export default function ClassesPage() {
  const { success, error: toastError } = useToast();

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedWing, setSelectedWing] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<SchoolClass | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formLevel, setFormLevel] = useState<ClassLevel>('Primary (1-5)');
  const [formStream, setFormStream] = useState<SeniorStream>('General');
  const [formDepartment, setFormDepartment] = useState('Primary Wing');
  const [formSections, setFormSections] = useState(2);
  const [formCapacity, setFormCapacity] = useState(80);
  const [formOrder, setFormOrder] = useState(1);
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formDescription, setFormDescription] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await ClassService.getAll();
      setClasses(data);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to load classes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingClass(null);
    setFormName('Class 6');
    setFormCode('C6');
    setFormLevel('Middle (6-8)');
    setFormStream('General');
    setFormDepartment('Middle Wing');
    setFormSections(3);
    setFormCapacity(120);
    setFormOrder(6);
    setFormStatus('active');
    setFormDescription('Middle school standard curriculum.');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cls: SchoolClass) => {
    setEditingClass(cls);
    setFormName(cls.name);
    setFormCode(cls.code);
    setFormLevel(cls.level);
    setFormStream(cls.stream || 'General');
    setFormDepartment(cls.department || '');
    setFormSections(cls.totalSections);
    setFormCapacity(cls.totalCapacity);
    setFormOrder(cls.numericOrder);
    setFormStatus(cls.status);
    setFormDescription(cls.description || '');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = 'Class name is required';
    if (!formCode.trim()) errors.code = 'Class code is required';
    if (formCapacity <= 0) errors.capacity = 'Total capacity must be greater than 0';
    if (formSections <= 0) errors.sections = 'At least 1 section is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (editingClass) {
        await ClassService.update(editingClass.id, {
          name: formName,
          code: formCode,
          level: formLevel,
          stream: formLevel === 'Senior Secondary (11-12)' ? formStream : undefined,
          department: formDepartment,
          totalSections: formSections,
          totalCapacity: formCapacity,
          numericOrder: formOrder,
          status: formStatus,
          description: formDescription,
        });
        success('Class Updated', `${formName} has been saved.`);
      } else {
        await ClassService.create({
          name: formName,
          code: formCode,
          level: formLevel,
          stream: formLevel === 'Senior Secondary (11-12)' ? formStream : undefined,
          department: formDepartment,
          totalSections: formSections,
          totalCapacity: formCapacity,
          numericOrder: formOrder,
          status: formStatus,
          description: formDescription,
        });
        success('Class Created', `${formName} added to the school.`);
      }
      setIsModalOpen(false);
      await loadClasses();
    } catch (err: unknown) {
      toastError('Save Error', (err as Error).message || 'Failed to save class');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await ClassService.delete(deleteTarget.id);
      success('Class Deleted', `${deleteTarget.name} has been removed.`);
      setDeleteTarget(null);
      await loadClasses();
    } catch (err: unknown) {
      toastError('Delete Failed', (err as Error).message || 'Cannot delete class');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredClasses = selectedWing === 'all'
    ? classes
    : classes.filter((c) => c.level === selectedWing);

  const columns: Column<SchoolClass>[] = [
    {
      key: 'name',
      header: 'Class / Grade Name',
      sortable: true,
      accessor: (cls) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs shrink-0">
            {cls.code}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate">{cls.name}</p>
            {cls.stream && (
              <p className="text-[11px] text-indigo-600 font-semibold">
                Stream: {cls.stream}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'level',
      header: 'Academic Wing',
      sortable: true,
      accessor: (cls) => (
        <Badge variant="purple" size="sm">
          {cls.level}
        </Badge>
      ),
    },
    {
      key: 'totalSections',
      header: 'Sections',
      sortable: true,
      accessor: (cls) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <LayersIcon size={14} className="text-slate-400" />
          <span>{cls.totalSections} Sections</span>
        </div>
      ),
    },
    {
      key: 'capacity',
      header: 'Enrollment / Capacity',
      sortable: true,
      accessor: (cls) => {
        const percent = cls.totalCapacity > 0 ? Math.round((cls.totalEnrolled / cls.totalCapacity) * 100) : 0;
        return (
          <div className="space-y-1 w-32">
            <div className="flex justify-between text-xs font-semibold">
              <span>{cls.totalEnrolled} / {cls.totalCapacity}</span>
              <span className="text-slate-400">{percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${percent > 90 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (cls) => (
        <Badge variant={cls.status === 'active' ? 'success' : 'default'} size="sm" dot>
          {cls.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      accessor: (cls) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/sections?classId=${cls.id}`}>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              View Sections
            </Button>
          </Link>
          <button
            onClick={() => handleOpenEditModal(cls)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Edit Class"
          >
            <EditIcon size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget(cls)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Class"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      ),
    },
  ];

  const wings: { id: string; label: string }[] = [
    { id: 'all', label: 'All Wings' },
    { id: 'Pre-Primary', label: 'Pre-Primary' },
    { id: 'Primary (1-5)', label: 'Primary (1-5)' },
    { id: 'Middle (6-8)', label: 'Middle (6-8)' },
    { id: 'Secondary (9-10)', label: 'Secondary (9-10)' },
    { id: 'Senior Secondary (11-12)', label: 'Senior Secondary' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Classes & Academic Wings"
        subtitle="Manage hierarchical grade levels, stream specializations (Science/Commerce), and capacities."
        actions={
          <Button onClick={handleOpenAddModal} leftIcon={<PlusIcon size={16} />}>
            Add New Class
          </Button>
        }
      />

      {/* Wing filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {wings.map((w) => (
          <button
            key={w.id}
            onClick={() => setSelectedWing(w.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              selectedWing === w.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingState title="Loading Classes..." message="Retrieving grade list and enrollment counts." />
      ) : errorMessage ? (
        <ErrorState
          title="Could not load classes"
          message={errorMessage}
          code="INTERNAL_ERROR"
          onRetry={loadClasses}
        />
      ) : (
        <DataTable
          data={filteredClasses}
          columns={columns}
          keyExtractor={(cls) => cls.id}
          searchPlaceholder="Search classes by name, code or stream..."
          searchKeys={['name', 'code', 'stream', 'department']}
          emptyTitle="No Classes Found"
          emptyDescription="No classes match your current search or wing filter."
          emptyActionLabel="Add New Class"
          onEmptyAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? `Edit Class: ${editingClass.name}` : 'Add New Class'}
        description="Configure grade name, wing department, streams, and student intake."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveClass} isLoading={isSaving}>
              {editingClass ? 'Save Changes' : 'Create Class'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveClass} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Class Name"
              requiredIndicator
              value={formName}
              error={formErrors.name}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Class 10"
            />

            <Input
              label="Class Short Code"
              requiredIndicator
              value={formCode}
              error={formErrors.code}
              onChange={(e) => setFormCode(e.target.value)}
              placeholder="e.g. C10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Academic Wing / Level"
              value={formLevel}
              onChange={(e) => setFormLevel(e.target.value as ClassLevel)}
              options={[
                { value: 'Pre-Primary', label: 'Pre-Primary (Nursery/LKG/UKG)' },
                { value: 'Primary (1-5)', label: 'Primary (Classes 1 - 5)' },
                { value: 'Middle (6-8)', label: 'Middle (Classes 6 - 8)' },
                { value: 'Secondary (9-10)', label: 'Secondary (Classes 9 - 10)' },
                { value: 'Senior Secondary (11-12)', label: 'Senior Secondary (Classes 11 - 12)' },
              ]}
            />

            {formLevel === 'Senior Secondary (11-12)' ? (
              <Select
                label="Stream Specialization"
                value={formStream}
                onChange={(e) => setFormStream(e.target.value as SeniorStream)}
                options={[
                  { value: 'Science (PCM)', label: 'Science (Physics, Chem, Math)' },
                  { value: 'Science (PCB)', label: 'Science (Physics, Chem, Biology)' },
                  { value: 'Commerce', label: 'Commerce (Accounts, Econ, BST)' },
                  { value: 'Humanities / Arts', label: 'Humanities / Arts' },
                  { value: 'Vocational', label: 'Vocational Stream' },
                ]}
              />
            ) : (
              <Input
                label="Department"
                value={formDepartment}
                onChange={(e) => setFormDepartment(e.target.value)}
                placeholder="e.g. Primary Wing"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Sections"
              type="number"
              min={1}
              value={formSections}
              error={formErrors.sections}
              onChange={(e) => setFormSections(Number(e.target.value))}
            />

            <Input
              label="Max Student Capacity"
              type="number"
              min={1}
              value={formCapacity}
              error={formErrors.capacity}
              onChange={(e) => setFormCapacity(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Numeric Sort Order"
              type="number"
              value={formOrder}
              onChange={(e) => setFormOrder(Number(e.target.value))}
              helperText="Order for grade sorting (e.g. 1, 2, ... 12)"
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

          <Textarea
            label="Class Notes"
            rows={2}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="e.g. CBSE AISSE Board exam batch with lab facilities."
          />
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Class"
        description={`Are you sure you want to remove "${deleteTarget?.name}"? All related sections should be re-assigned.`}
        confirmLabel="Delete Class"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
