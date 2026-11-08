'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StudentFormData, Guardian, StudentDocument, StudentStatus, Gender } from '@/types/student';
import { SchoolClass, ClassSection, AcademicYear } from '@/types/academics';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  UserIcon,
  GraduationCapIcon,
  UsersIcon,
  PhoneIcon,
  FileTextIcon,
  PlusIcon,
  TrashIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  UploadIcon,
} from '@/components/ui/icons';

export interface StudentFormProps {
  initialData?: Partial<StudentFormData>;
  isEditing?: boolean;
  studentId?: string;
  classes: SchoolClass[];
  sections: ClassSection[];
  academicYears: AcademicYear[];
  onSubmit: (formData: StudentFormData) => Promise<void>;
  isSaving: boolean;
  apiError?: { code: string; message: string; field?: string } | null;
}

export function StudentForm({
  initialData,
  isEditing = false,
  studentId,
  classes,
  sections,
  academicYears,
  onSubmit,
  isSaving,
  apiError,
}: StudentFormProps) {
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState<StudentFormData>({
    admission_no: initialData?.admission_no || '',
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    dob: initialData?.dob || '',
    gender: (initialData?.gender as Gender) || 'male',
    status: (initialData?.status as StudentStatus) || 'active',
    academic_year_id: initialData?.academic_year_id || academicYears[0]?.id || 'ay_2026_27',
    class_id: initialData?.class_id || (classes[0]?.id || 'cls_10'),
    section_id: initialData?.section_id || (sections[0]?.id || 'sec_10_a'),
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    blood_group: initialData?.blood_group || 'B+',
    category: initialData?.category || 'General',
    religion: initialData?.religion || 'General',
    emergency_contact: initialData?.emergency_contact || '',
    guardians: initialData?.guardians && initialData.guardians.length > 0
      ? initialData.guardians
      : [
          {
            name: '',
            relationship: 'Father',
            phone: '',
            email: '',
            occupation: '',
            is_primary: true,
          },
        ],
    documents: initialData?.documents || [
      { id: 'doc_1', title: 'Birth Certificate', type: 'PDF', status: 'verified', file_name: 'birth_cert.pdf' },
      { id: 'doc_2', title: 'Aadhaar / National ID Card', type: 'PDF', status: 'verified', file_name: 'aadhaar_doc.pdf' },
    ],
  });

  // Client validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Filter sections dynamically based on selected class
  const availableSections = sections.filter((s) => s.classId === formData.class_id);

  const handleClassChange = (newClassId: string) => {
    const classSections = sections.filter((s) => s.classId === newClassId);
    const firstSectionId = classSections.length > 0 ? classSections[0].id : '';
    setFormData((prev) => ({
      ...prev,
      class_id: newClassId,
      section_id: firstSectionId,
    }));
  };

  // Guardian helpers
  const handleAddGuardian = () => {
    setFormData((prev) => ({
      ...prev,
      guardians: [
        ...prev.guardians,
        {
          name: '',
          relationship: 'Mother',
          phone: '',
          email: '',
          occupation: '',
          is_primary: false,
        },
      ],
    }));
  };

  const handleRemoveGuardian = (index: number) => {
    if (formData.guardians.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      guardians: prev.guardians.filter((_, i) => i !== index),
    }));
  };

  const handleGuardianChange = (index: number, field: keyof Guardian, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.guardians];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, guardians: updated };
    });
  };

  // Document helper (Simulated upload placeholder)
  const handleAddDocumentPlaceholder = () => {
    const title = prompt('Enter Document Name (e.g. Transfer Certificate, Medical Record):');
    if (!title) return;
    const newDoc: StudentDocument = {
      id: `doc_${Date.now()}`,
      title,
      type: 'PDF',
      file_name: `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      uploaded_at: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setFormData((prev) => ({
      ...prev,
      documents: [...(prev.documents || []), newDoc],
    }));
  };

  const handleRemoveDocument = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: (prev.documents || []).filter((d) => d.id !== docId),
    }));
  };

  // Form submission & validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.admission_no.trim()) {
      errors.admission_no = 'Admission number is required';
    }
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    if (!formData.dob) {
      errors.dob = 'Date of birth is required';
    }
    if (!formData.class_id) {
      errors.class_id = 'Class selection is required';
    }
    if (!formData.section_id) {
      errors.section_id = 'Section selection is required';
    }

    // Validate guardians
    formData.guardians.forEach((guardian, idx) => {
      if (!guardian.name.trim()) {
        errors[`guardian_${idx}_name`] = 'Guardian name is required';
      }
      if (!guardian.phone.trim()) {
        errors[`guardian_${idx}_phone`] = 'Guardian phone is required';
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFieldErrors({});
    await onSubmit(formData);
  };

  const cancelHref = isEditing && studentId ? `/students/${studentId}` : '/students';

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-200">
      {/* API Error State Banner */}
      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <AlertCircleIcon size={20} className="text-rose-600 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <p className="font-bold">{apiError.code || 'VALIDATION_ERROR'}</p>
            <p>{apiError.message}</p>
          </div>
        </div>
      )}

      {/* Section A: Basic Information */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <UserIcon size={18} />
            <span>Section A • Basic Student Information</span>
          </div>
          <CardDescription>
            Core student identity, admission number, and demographic profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Admission Number"
              placeholder="e.g. ADM-2026-0101"
              value={formData.admission_no}
              onChange={(e) => setFormData({ ...formData, admission_no: e.target.value })}
              requiredIndicator
              error={fieldErrors.admission_no || (apiError?.field === 'admission_no' ? apiError.message : undefined)}
              helperText="Unique institutional admission code"
            />

            <Input
              label="First Name"
              placeholder="Student's first name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              requiredIndicator
              error={fieldErrors.first_name}
            />

            <Input
              label="Last Name"
              placeholder="Student's last name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              requiredIndicator
              error={fieldErrors.last_name}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Input
              type="date"
              label="Date of Birth"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              requiredIndicator
              error={fieldErrors.dob}
            />

            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
              requiredIndicator
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
            />

            <Select
              label="Enrollment Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
              requiredIndicator
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'transferred', label: 'Transferred' },
                { value: 'alumni', label: 'Alumni' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section B: Academic Information */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <GraduationCapIcon size={18} />
            <span>Section B • Academic Structure & Class Allocation</span>
          </div>
          <CardDescription>
            Assign the student to an academic session, grade level, and specific classroom section.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Academic Session"
              value={formData.academic_year_id}
              onChange={(e) => setFormData({ ...formData, academic_year_id: e.target.value })}
              requiredIndicator
              options={academicYears.map((ay) => ({
                value: ay.id,
                label: `${ay.name} ${ay.isCurrent ? '(Current Session)' : ''}`,
              }))}
            />

            <Select
              label="Class / Grade"
              value={formData.class_id}
              onChange={(e) => handleClassChange(e.target.value)}
              requiredIndicator
              error={fieldErrors.class_id}
              options={classes.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />

            <Select
              label="Section & Room"
              value={formData.section_id}
              onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
              requiredIndicator
              error={fieldErrors.section_id}
              options={availableSections.map((s) => ({
                value: s.id,
                label: `${s.name} (${s.roomNumber || 'Assigned'})`,
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section C: Guardian Information */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <UsersIcon size={18} />
              <span>Section C • Guardian & Family Information</span>
            </div>
            <CardDescription>
              Parents and designated emergency guardians responsible for this student.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddGuardian}
            leftIcon={<PlusIcon size={14} />}
          >
            Add Guardian
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {formData.guardians.map((guardian, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Guardian #{index + 1}
                  </span>
                  {guardian.is_primary && (
                    <Badge variant="purple" size="sm">
                      Primary Contact
                    </Badge>
                  )}
                </div>

                {formData.guardians.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveGuardian(index)}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 px-2"
                  >
                    <TrashIcon size={14} />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="Guardian Full Name"
                  placeholder="e.g. Dr. Ramesh Sharma"
                  value={guardian.name}
                  onChange={(e) => handleGuardianChange(index, 'name', e.target.value)}
                  requiredIndicator
                  error={fieldErrors[`guardian_${index}_name`]}
                />

                <Select
                  label="Relationship"
                  value={guardian.relationship}
                  onChange={(e) => handleGuardianChange(index, 'relationship', e.target.value)}
                  options={[
                    { value: 'Father', label: 'Father' },
                    { value: 'Mother', label: 'Mother' },
                    { value: 'Guardian', label: 'Legal Guardian' },
                    { value: 'Grandparent', label: 'Grandparent' },
                    { value: 'Sibling', label: 'Elder Sibling' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />

                <Input
                  label="Mobile Phone"
                  placeholder="+91 98100 00000"
                  value={guardian.phone}
                  onChange={(e) => handleGuardianChange(index, 'phone', e.target.value)}
                  requiredIndicator
                  error={fieldErrors[`guardian_${index}_phone`]}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="parent@example.com"
                  value={guardian.email || ''}
                  onChange={(e) => handleGuardianChange(index, 'email', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <Input
                  label="Occupation / Workplace"
                  placeholder="e.g. Civil Engineer / Public Sector"
                  value={guardian.occupation || ''}
                  onChange={(e) => handleGuardianChange(index, 'occupation', e.target.value)}
                />

                <div className="flex items-center gap-2 sm:pt-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guardian.is_primary}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          guardians: prev.guardians.map((g, i) => ({
                            ...g,
                            is_primary: i === index ? isChecked : isChecked ? false : g.is_primary,
                          })),
                        }));
                      }}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span>Set as Primary Communication Contact</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section D: Contact & Demographic Information */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <PhoneIcon size={18} />
            <span>Section D • Contact & Additional Demographics</span>
          </div>
          <CardDescription>
            Residential address, emergency phone, blood group, and category.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Student Direct Email (Optional)"
              type="email"
              placeholder="student@dpa.edu.in"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Student Mobile / SMS Phone"
              placeholder="+91 98000 00000"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
              label="Emergency Contact"
              placeholder="e.g. +91 98101 23456 (Father)"
              value={formData.emergency_contact || ''}
              onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Select
              label="Blood Group"
              value={formData.blood_group}
              onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
              ]}
            />

            <Select
              label="Category / Quota"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'General', label: 'General' },
                { value: 'OBC', label: 'OBC (Other Backward Classes)' },
                { value: 'SC', label: 'SC (Scheduled Caste)' },
                { value: 'ST', label: 'ST (Scheduled Tribe)' },
                { value: 'EWS', label: 'EWS (Economically Weaker Section)' },
              ]}
            />

            <Input
              label="Religion / Community"
              placeholder="e.g. Hindu, Muslim, Sikh, Christian..."
              value={formData.religion || ''}
              onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <Textarea
              label="Permanent Residential Address"
              placeholder="House/flat no, street, locality, city, state, postal PIN code..."
              rows={2}
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section E: Basic Documents (UI Placeholder) */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <FileTextIcon size={18} />
              <span>Section E • Basic Documents & Certificates</span>
            </div>
            <CardDescription>
              Attach foundational enrollment documents (Birth certificate, Transfer Certificate, ID).
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddDocumentPlaceholder}
            leftIcon={<UploadIcon size={14} />}
          >
            Attach Document
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.documents && formData.documents.length > 0 ? (
              formData.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileTextIcon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {doc.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {doc.file_name || 'Attached PDF file'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">
                      Attached
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Remove document"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No documents attached yet.</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 bg-slate-50/50 border-t border-slate-100 px-6 py-4">
          <Link href={cancelHref} className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full sm:w-auto"
              leftIcon={<ArrowLeftIcon size={14} />}
            >
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            size="md"
            isLoading={isSaving}
            className="w-full sm:w-auto min-w-36"
            leftIcon={<CheckCircleIcon size={16} />}
          >
            {isEditing ? 'Save Changes' : 'Save Student'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
