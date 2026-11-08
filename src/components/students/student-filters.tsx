'use client';

import React from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterIcon, RefreshCwIcon } from '@/components/ui/icons';
import { SchoolClass, ClassSection } from '@/types/academics';

export interface StudentFiltersProps {
  classes: SchoolClass[];
  sections: ClassSection[];
  selectedClass: string;
  selectedSection: string;
  selectedStatus: string;
  onClassChange: (classId: string) => void;
  onSectionChange: (sectionId: string) => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function StudentFilters({
  classes,
  sections,
  selectedClass,
  selectedSection,
  selectedStatus,
  onClassChange,
  onSectionChange,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
}: StudentFiltersProps) {
  // Filter sections for currently selected class if one is chosen
  const availableSections = selectedClass && selectedClass !== 'all'
    ? sections.filter((s) => s.classId === selectedClass)
    : sections;

  const classOptions = [
    { value: 'all', label: 'All Classes' },
    ...classes.map((c) => ({ value: c.id, label: c.name })),
  ];

  const sectionOptions = [
    { value: 'all', label: 'All Sections' },
    ...availableSections.map((s) => ({ value: s.id, label: `${s.name} (${s.className})` })),
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'transferred', label: 'Transferred' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="w-40 sm:w-44">
        <Select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          options={classOptions}
        />
      </div>

      <div className="w-40 sm:w-44">
        <Select
          value={selectedSection}
          onChange={(e) => onSectionChange(e.target.value)}
          options={sectionOptions}
        />
      </div>

      <div className="w-36 sm:w-40">
        <Select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          options={statusOptions}
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="md"
          onClick={onClearFilters}
          className="text-slate-600 hover:text-slate-900 h-10 px-3"
          leftIcon={<RefreshCwIcon size={14} />}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
