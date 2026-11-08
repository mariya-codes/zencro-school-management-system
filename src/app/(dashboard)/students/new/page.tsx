'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudentFormData } from '@/types/student';
import { SchoolClass, ClassSection, AcademicYear } from '@/types/academics';
import { StudentService } from '@/lib/services/student-service';
import { ClassService } from '@/lib/services/class-service';
import { SectionService } from '@/lib/services/section-service';
import { AcademicYearService } from '@/lib/services/academic-year-service';
import { PageHeader } from '@/components/ui/page-header';
import { StudentForm } from '@/components/students/student-form';
import { LoadingState } from '@/components/ui/loading-state';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@/components/ui/icons';

export default function AddStudentPage() {
  const router = useRouter();

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<ClassSection[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<{ code: string; message: string; field?: string } | null>(null);

  useEffect(() => {
    async function loadFormMetadata() {
      setIsLoadingMetadata(true);
      try {
        const [clsData, secData, ayData] = await Promise.all([
          ClassService.getAll(),
          SectionService.getAll(),
          AcademicYearService.getAll(),
        ]);
        setClasses(clsData);
        setSections(secData);
        setAcademicYears(ayData);
      } catch (err) {
        console.error('Failed to load form prerequisites:', err);
      } finally {
        setIsLoadingMetadata(false);
      }
    }
    loadFormMetadata();
  }, []);

  const handleCreateStudent = async (formData: StudentFormData) => {
    setIsSaving(true);
    setApiError(null);
    try {
      const response = await StudentService.createStudent(formData);
      // Navigate directly to the new Student 360 Workspace
      router.push(`/students/${response.student.id}`);
    } catch (err: any) {
      setApiError({
        code: err.code || 'VALIDATION_ERROR',
        message: err.message || 'Failed to register student record.',
        field: err.field,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingMetadata) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Add New Student"
          subtitle="Loading academic and section registries..."
        />
        <LoadingState title="Preparing Student Admission Form..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Add New Student"
        subtitle="Register a student into the institutional registry with guardian and academic allocation."
        actions={
          <Link href="/students">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeftIcon size={14} />}>
              Back to Students
            </Button>
          </Link>
        }
      />

      <StudentForm
        classes={classes}
        sections={sections}
        academicYears={academicYears}
        onSubmit={handleCreateStudent}
        isSaving={isSaving}
        apiError={apiError}
      />
    </div>
  );
}
