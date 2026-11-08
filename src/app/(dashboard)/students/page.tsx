'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StudentListItem } from '@/types/student';
import { SchoolClass, ClassSection } from '@/types/academics';
import { StudentService } from '@/lib/services/student-service';
import { ClassService } from '@/lib/services/class-service';
import { SectionService } from '@/lib/services/section-service';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { StudentFilters } from '@/components/students/student-filters';
import { StudentTable } from '@/components/students/student-table';
import { PlusIcon } from '@/components/ui/icons';

export default function StudentsPage() {
  const router = useRouter();

  // State
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<ClassSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Initial load for class & section filters
  useEffect(() => {
    async function loadFilterDependencies() {
      try {
        const [clsData, secData] = await Promise.all([
          ClassService.getAll(),
          SectionService.getAll(),
        ]);
        setClasses(clsData);
        setSections(secData);
      } catch (err: unknown) {
        console.error('Failed to load filter metadata:', err);
      }
    }
    loadFilterDependencies();
  }, []);

  // Load students based on query params
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await StudentService.getStudents({
        class_id: selectedClass !== 'all' ? selectedClass : undefined,
        section_id: selectedSection !== 'all' ? selectedSection : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        search: searchQuery.trim() !== '' ? searchQuery : undefined,
        page: currentPage,
        page_size: pageSize,
      });

      setStudents(response.students);
      setTotalCount(response.total);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Unable to load student registry');
    } finally {
      setIsLoading(false);
    }
  }, [selectedClass, selectedSection, selectedStatus, searchQuery, currentPage, pageSize]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleClearFilters = () => {
    setSelectedClass('all');
    setSelectedSection('all');
    setSelectedStatus('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedClass !== 'all' ||
    selectedSection !== 'all' ||
    selectedStatus !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Students"
        subtitle="Manage student records, guardians and academic information."
        actions={
          <Link href="/students/new">
            <Button leftIcon={<PlusIcon size={16} />}>
              + Add Student
            </Button>
          </Link>
        }
      />

      {/* Error state */}
      {errorMessage ? (
        <ErrorState
          title="Unable to load students"
          message={errorMessage}
          code="INTERNAL_ERROR"
          onRetry={fetchStudents}
        />
      ) : (
        /* Student Table & Filters */
        <StudentTable
          students={students}
          total={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          searchQuery={searchQuery}
          isLoading={isLoading}
          onSearchChange={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
          onPageChange={setCurrentPage}
          onAddStudent={() => router.push('/students/new')}
          filterControls={
            <StudentFilters
              classes={classes}
              sections={sections}
              selectedClass={selectedClass}
              selectedSection={selectedSection}
              selectedStatus={selectedStatus}
              onClassChange={(clsId) => {
                setSelectedClass(clsId);
                setSelectedSection('all'); // Reset section on class change
                setCurrentPage(1);
              }}
              onSectionChange={(secId) => {
                setSelectedSection(secId);
                setCurrentPage(1);
              }}
              onStatusChange={(status) => {
                setSelectedStatus(status);
                setCurrentPage(1);
              }}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          }
        />
      )}
    </div>
  );
}
