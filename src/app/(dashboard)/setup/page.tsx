'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { SchoolService } from '@/lib/services/school-service';
import { SchoolProfile, INDIAN_STATES, SchoolBoard, SchoolCategory, SchoolLevel } from '@/types/school';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useToast } from '@/components/ui/toast';
import {
  BuildingIcon,
  CalendarIcon,
  GraduationCapIcon,
  BookOpenIcon,
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ShieldIcon,
  SparklesIcon,
} from '@/components/ui/icons';

export default function SchoolSetupWizardPage() {
  const { role, permissions } = useAuth();
  const { success, error: toastError } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSchoolData();
  }, []);

  const loadSchoolData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await SchoolService.getProfile();
      setProfile(data);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to load school profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SchoolProfile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!profile?.name?.trim()) errors.name = 'School name is required';
    if (!profile?.code?.trim()) errors.code = 'School code is required';
    if (!profile?.email?.trim()) errors.email = 'Official school email is required';
    if (!profile?.phone?.trim()) errors.phone = 'Phone number is required';
    if (!profile?.city?.trim()) errors.city = 'City is required';
    if (!profile?.state?.trim()) errors.state = 'State is required';
    if (!profile?.pincode?.trim()) errors.pincode = 'Pincode is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAndContinue = async (nextStep?: number) => {
    if (currentStep === 1 && !validateStep1()) {
      toastError('Validation Error', 'Please complete all required school profile fields.');
      return;
    }

    setIsSaving(true);
    try {
      if (profile) {
        await SchoolService.updateProfile(profile);
        success('Saved Successfully', 'School setup configuration updated.');
      }
      if (nextStep) {
        setCurrentStep(nextStep);
      } else if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (err: unknown) {
      toastError('Save Failed', (err as Error).message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [
    {
      step: 1,
      title: 'School Information',
      description: 'Institution identity, affiliation & location',
      icon: <BuildingIcon size={18} />,
      status: 'completed',
    },
    {
      step: 2,
      title: 'Academic Year',
      description: 'Active session & examination terms',
      icon: <CalendarIcon size={18} />,
      status: 'completed',
    },
    {
      step: 3,
      title: 'Classes & Sections',
      description: 'Wing hierarchy & classroom allocations',
      icon: <GraduationCapIcon size={18} />,
      status: 'completed',
    },
    {
      step: 4,
      title: 'Curriculum & Subjects',
      description: 'Standard syllabus & subject mappings',
      icon: <BookOpenIcon size={18} />,
      status: 'in_progress',
    },
    {
      step: 5,
      title: 'Roles & Permissions',
      description: 'System access matrix for faculty & staff',
      icon: <UsersIcon size={18} />,
      status: 'pending',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="School Setup Wizard"
          subtitle="Guided checklist to configure your school management instance."
        />
        <LoadingState title="Loading School Setup..." message="Retrieving institutional profile and checklist." />
      </div>
    );
  }

  if (errorMessage || !profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="School Setup Wizard"
          subtitle="Guided checklist to configure your school management instance."
        />
        <ErrorState
          title="Unable to load school configuration"
          message={errorMessage || 'School profile not found'}
          code="NOT_FOUND"
          onRetry={loadSchoolData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Institution Setup & Configuration"
        subtitle="Step-by-step institutional checklist for Delhi Public Academy."
        badge={
          <Badge variant="purple" size="md" dot>
            Step {currentStep} of 5
          </Badge>
        }
        actions={
          <Button
            onClick={() => handleSaveAndContinue()}
            isLoading={isSaving}
            leftIcon={<CheckCircleIcon size={16} />}
          >
            Save All Changes
          </Button>
        }
      />

      {/* Guided Steps Checklist Sidebar + Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Step Navigator */}
        <div className="lg:col-span-1 space-y-3">
          <Card className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
              Setup Checklist
            </h3>
            <div className="space-y-1.5">
              {steps.map((s) => {
                const isActive = s.step === currentStep;
                const isCompleted = s.step < currentStep;

                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setCurrentStep(s.step)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 border border-indigo-200/80 text-indigo-950'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircleIcon size={14} /> : s.step}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {s.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {s.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Active Step Form Container */}
        <div className="lg:col-span-3">
          {currentStep === 1 && (
            <Card className="space-y-6 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <BuildingIcon size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 1: School Information & Board Affiliation
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Specify official institutional identity, affiliation codes, and principal contact details.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Official School Name"
                  requiredIndicator
                  value={profile.name}
                  error={validationErrors.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Delhi Public Academy"
                />

                <Input
                  label="School / Branch Code"
                  requiredIndicator
                  value={profile.code}
                  error={validationErrors.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="e.g. DPA-ND-104"
                />

                <Select
                  label="Affiliation Board"
                  value={profile.affiliationBoard}
                  onChange={(e) => handleInputChange('affiliationBoard', e.target.value as SchoolBoard)}
                  options={[
                    { value: 'CBSE', label: 'CBSE (Central Board of Secondary Education)' },
                    { value: 'ICSE', label: 'ICSE / CISCE' },
                    { value: 'State Board', label: 'State Board of Education' },
                    { value: 'IB', label: 'International Baccalaureate (IB)' },
                    { value: 'Cambridge', label: 'Cambridge International' },
                  ]}
                />

                <Input
                  label="Board Affiliation Number"
                  value={profile.affiliationNumber || ''}
                  onChange={(e) => handleInputChange('affiliationNumber', e.target.value)}
                  placeholder="e.g. CBSE/AFF/2024/213089"
                />

                <Input
                  label="Indian U-DISE+ Code"
                  value={profile.udiseCode || ''}
                  onChange={(e) => handleInputChange('udiseCode', e.target.value)}
                  placeholder="e.g. 07080104523 (11 digits)"
                  helperText="Unified District Information System for Education"
                />

                <Select
                  label="School Category"
                  value={profile.category}
                  onChange={(e) => handleInputChange('category', e.target.value as SchoolCategory)}
                  options={[
                    { value: 'Co-Educational', label: 'Co-Educational' },
                    { value: 'Girls Only', label: 'Girls Only' },
                    { value: 'Boys Only', label: 'Boys Only' },
                  ]}
                />

                <Input
                  label="Official School Email"
                  type="email"
                  requiredIndicator
                  value={profile.email}
                  error={validationErrors.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="info@delhipublicacademy.edu.in"
                />

                <Input
                  label="Official Telephone / Helpline"
                  requiredIndicator
                  value={profile.phone}
                  error={validationErrors.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 11 2678 9000"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Campus Address & Location
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Address Line 1"
                    value={profile.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    placeholder="Plot No. 12, Institutional Area"
                  />

                  <Input
                    label="Address Line 2"
                    value={profile.addressLine2 || ''}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    placeholder="Sector 4, Dwarka"
                  />

                  <Input
                    label="City"
                    requiredIndicator
                    value={profile.city}
                    error={validationErrors.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New Delhi"
                  />

                  <Select
                    label="State / Union Territory"
                    requiredIndicator
                    value={profile.state}
                    error={validationErrors.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    options={INDIAN_STATES.map((st) => ({ value: st, label: st }))}
                  />

                  <Input
                    label="PIN Code"
                    requiredIndicator
                    value={profile.pincode}
                    error={validationErrors.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="110078"
                  />

                  <Input
                    label="Principal / Head of Institution"
                    value={profile.principalName}
                    onChange={(e) => handleInputChange('principalName', e.target.value)}
                    placeholder="Dr. Rajesh Sharma"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  onClick={() => handleSaveAndContinue(2)}
                  isLoading={isSaving}
                  rightIcon={<ArrowRightIcon size={16} />}
                >
                  Save & Next: Academic Year
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="space-y-6 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CalendarIcon size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 2: Academic Year & Operating Calendar
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Configure Indian school academic cycle (April–March) and term examination windows.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">
                    Current Active Session: 2026 - 2027
                  </span>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
                <p className="text-xs text-emerald-800">
                  Duration: April 1, 2026 to March 31, 2027 • Target: 220 Instructional Days
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Academic Session Start Month"
                  value={profile.academicYearStartMonth}
                  onChange={(e) => handleInputChange('academicYearStartMonth', Number(e.target.value))}
                  options={[
                    { value: 4, label: 'April (Standard for CBSE & North/West India)' },
                    { value: 6, label: 'June (Standard for Maharashtra & South India)' },
                    { value: 1, label: 'January (Calendar Year)' },
                  ]}
                />

                <Select
                  label="Working Days Per Week"
                  value={profile.workingDaysPerWeek}
                  onChange={(e) => handleInputChange('workingDaysPerWeek', Number(e.target.value) as 5 | 6)}
                  options={[
                    { value: 6, label: '6 Days (Monday – Saturday)' },
                    { value: 5, label: '5 Days (Monday – Friday)' },
                  ]}
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setCurrentStep(1)} leftIcon={<ChevronLeftIcon size={16} />}>
                  Back
                </Button>
                <Button onClick={() => handleSaveAndContinue(3)} rightIcon={<ArrowRightIcon size={16} />}>
                  Save & Next: Classes
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="space-y-6 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <GraduationCapIcon size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 3: Class Hierarchy & Wing Structure
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Hierarchical structure ready for Nursery, Primary, Middle, Secondary & Senior Secondary.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-700">Pre-Primary & Primary</p>
                  <p className="text-xs text-slate-500 mt-1">Nursery, LKG, UKG, Classes 1 to 5</p>
                  <Badge variant="purple" size="sm" className="mt-2">8 Classes Configured</Badge>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-700">Middle & Secondary</p>
                  <p className="text-xs text-slate-500 mt-1">Classes 6, 7, 8, 9 & 10 (AISSE)</p>
                  <Badge variant="purple" size="sm" className="mt-2">5 Classes Configured</Badge>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-700">Senior Secondary</p>
                  <p className="text-xs text-slate-500 mt-1">Class 11 & 12 (Science & Commerce)</p>
                  <Badge variant="purple" size="sm" className="mt-2">4 Streams Configured</Badge>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setCurrentStep(2)} leftIcon={<ChevronLeftIcon size={16} />}>
                  Back
                </Button>
                <Button onClick={() => handleSaveAndContinue(4)} rightIcon={<ArrowRightIcon size={16} />}>
                  Save & Next: Curriculum
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="space-y-6 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <BookOpenIcon size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 4: Standard Curriculum & Subjects
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Core scholastic subject mappings as per CBSE / ICSE curriculum framework.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  'English Core / Communicative',
                  'Mathematics & Applied Math',
                  'Science / Physics / Chemistry / Biology',
                  'Social Studies (History, Civics, Geo)',
                  'Hindi Core / Elective',
                  'Computer Science & IT',
                  'Accountancy & Business Studies',
                  'Economics & Statistics',
                ].map((subj, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-white">
                    <CheckCircleIcon size={16} className="text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{subj}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setCurrentStep(3)} leftIcon={<ChevronLeftIcon size={16} />}>
                  Back
                </Button>
                <Button onClick={() => handleSaveAndContinue(5)} rightIcon={<ArrowRightIcon size={16} />}>
                  Save & Next: Roles
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 5 && (
            <Card className="space-y-6 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <UsersIcon size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 5: Approved Roles & System Permissions
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Strictly aligned with ZenCro role authorization model.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { role: 'admin', label: 'School Admin', desc: 'Full institutional configuration, academic calendar, class & teacher assignments.' },
                  { role: 'principal', label: 'Principal', desc: 'Academic oversight, staff supervision, and student performance records.' },
                  { role: 'teacher', label: 'Teacher / Faculty', desc: 'Classroom management, student attendance, and subject marks entry.' },
                  { role: 'accountant', label: 'Accountant', desc: 'Fee structure management, collection registers, and receipts.' },
                  { role: 'parent', label: 'Parent / Guardian', desc: 'Ward attendance monitoring, report cards, and communication notices.' },
                ].map((r) => (
                  <div key={r.role} className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{r.label}</span>
                        <code className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                          {r.role}
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                    </div>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setCurrentStep(4)} leftIcon={<ChevronLeftIcon size={16} />}>
                  Back
                </Button>
                <Button onClick={() => handleSaveAndContinue(1)} leftIcon={<CheckCircleIcon size={16} />}>
                  Complete Setup & Return to Step 1
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
