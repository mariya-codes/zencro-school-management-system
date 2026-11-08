'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudentFormData, Student360 } from '@/types/student';
import { SchoolClass, ClassSection, AcademicYear } from '@/types/academics';
import { StudentService } from '@/lib/services/student-service';
import { ClassService } from '@/lib/services/class-service';
import { SectionService } from '@/lib/services/section-service';
import { AcademicYearService } from '@/lib/services/academic-year-service';
import { PageHeader } from '@/components/ui/page-header';
import { StudentForm } from '@/components/students/student-form';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@/components/ui/icons';

function EditStudentContent({ studentId }: { studentId: string }) {
  const router = useRouter();

  const [student360, setStudent360] = useState<Student360 | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<ClassSection[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<{ code: string; message: string; field?: string } | null>(null);

  useEffect(() => {
    async function loadStudentForEdit() {
      if (!studentId) return;
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const [studentData, clsData, secData, ayData] = await Promise.all([
          StudentService.getStudent360(studentId),
          ClassService.getAll(),
          SectionService.getAll(),
          AcademicYearService.getAll(),
        ]);
        setStudent360(studentData);
        setClasses(clsData);
        setSections(secData);
        setAcademicYears(ayData);
      } catch (err: any) {
        setErrorMessage(err.message || 'Unable to load student record for editing.');
      } finally {
        setIsLoading(false);
      }
    }

    loadStudentForEdit();
  }, [studentId]);

  const handleUpdateStudent = async (formData: StudentFormData) => {
    setIsSaving(true);
    setApiError(null);
    try {
      await StudentService.updateStudent(studentId, formData);
      // Return to Student 360 Workspace
      router.push(`/students/${studentId}`);
    } catch (err: any) {
      setApiError({
        code: err.code || 'VALIDATION_ERROR',
        message: err.message || 'Failed to update student profile.',
        field: err.field,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Student Record"
          subtitle="Loading student details and academic registry..."
        />
        <LoadingState title="Loading Student Details..." />
      </div>
    );
  }

  if (errorMessage || !student360) {
    return (
      <div className="space-y-6">
        <ErrorState
          title="Student Not Found"
          message={errorMessage || 'The requested student could not be located.'}
          code="NOT_FOUND"
          onRetry={() => router.push('/students')}
        />
      </div>
    );
  }

  const initialFormData: Partial<StudentFormData> = {
    admission_no: student360.student.admission_no,
    first_name: student360.student.first_name,
    last_name: student360.student.last_name,
    dob: student360.student.dob,
    gender: student360.student.gender,
    status: student360.student.status,
    academic_year_id: student360.student.academic_year_id || 'ay_2026_27',
    class_id: student360.student.class_id,
    section_id: student360.student.section_id,
    email: student360.student.email,
    phone: student360.student.phone,
    address: student360.student.address,
    blood_group: student360.student.blood_group,
    category: student360.student.category,
    religion: student360.student.religion,
    emergency_contact: student360.student.emergency_contact,
    guardians: student360.guardians,
    documents: student360.student.documents,
  };

  const fullName = `${student360.student.first_name} ${student360.student.last_name}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title={`Edit Student: ${fullName}`}
        subtitle={`Admission ID: ${student360.student.admission_no} • Update personal, academic, or guardian information.`}
        actions={
          <Link href={`/students/${studentId}`}>
            <Button variant="outline" size="sm" leftIcon={<ArrowLeftIcon size={14} />}>
              Back to Profile
            </Button>
          </Link>
        }
      />

      <StudentForm
        initialData={initialFormData}
        isEditing={true}
        studentId={studentId}
        classes={classes}
        sections={sections}
        academicYears={academicYears}
        onSubmit={handleUpdateStudent}
        isSaving={isSaving}
        apiError={apiError}
      />
    </div>
  );
}

function EditStudentParamResolver({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  return <EditStudentContent studentId={resolved.id} />;
}

export default function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<LoadingState title="Loading Student Details..." />}>
      <EditStudentParamResolver params={params} />
    </Suspense>
  );
}
