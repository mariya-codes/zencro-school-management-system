'use client';

import React from 'react';
import Link from 'next/link';
import { Student } from '@/types/student';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  EditIcon,
  ArrowLeftIcon,
  MailIcon,
  PhoneIcon,
  GraduationCapIcon,
  CalendarIcon,
  PrinterIcon,
} from '@/components/ui/icons';

export interface StudentProfileHeaderProps {
  student: Student;
}

export function StudentProfileHeader({ student }: StudentProfileHeaderProps) {
  const fullName = `${student.first_name} ${student.last_name}`;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success" size="md" dot>
            Active Student
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="warning" size="md">
            Inactive
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="danger" size="md">
            Suspended
          </Badge>
        );
      case 'transferred':
        return (
          <Badge variant="info" size="md">
            Transferred
          </Badge>
        );
      default:
        return (
          <Badge variant="default" size="md">
            {status}
          </Badge>
        );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/students"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeftIcon size={14} />
          <span>Back to Students List</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<PrinterIcon size={14} />}
            className="hidden sm:inline-flex"
          >
            Print Profile
          </Button>

          <Link href={`/students/${student.id}/edit`}>
            <Button size="sm" leftIcon={<EditIcon size={14} />}>
              Edit Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Profile Info Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          <Avatar
            name={fullName}
            src={student.avatar_url}
            size="xl"
            className="ring-4 ring-slate-100 shadow-sm"
          />

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {fullName}
              </h1>
              {getStatusBadge(student.status)}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                {student.admission_no}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <GraduationCapIcon size={14} className="text-slate-400" />
                {student.class_name || 'Class 10'} — {student.section_name || 'Section A'}
              </span>
              <span>•</span>
              <span className="capitalize">{student.gender || 'Student'}</span>
              {student.dob && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon size={13} className="text-slate-400" />
                    DOB: {student.dob}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Contact Box */}
        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs text-slate-600 w-full sm:w-auto">
          {student.phone && (
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
              <PhoneIcon size={13} className="text-slate-400" />
              <span className="font-mono text-slate-800">{student.phone}</span>
            </div>
          )}
          {student.email && (
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
              <MailIcon size={13} className="text-slate-400" />
              <span className="text-slate-800 truncate max-w-xs">{student.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
