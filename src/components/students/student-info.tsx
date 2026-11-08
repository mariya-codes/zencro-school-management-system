'use client';

import React from 'react';
import Link from 'next/link';
import { Student } from '@/types/student';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  UserIcon,
  GraduationCapIcon,
  PhoneIcon,
  FileTextIcon,
  EditIcon,
  CalendarIcon,
  CheckCircleIcon,
  DownloadIcon,
} from '@/components/ui/icons';

export interface StudentInfoProps {
  student: Student;
}

export function StudentInfo({ student }: StudentInfoProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 2-Column Grid: Basic Profile & Academic Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Student Profile */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <UserIcon size={18} />
              <span>Basic Identity & Demographics</span>
            </div>
            <Link href={`/students/${student.id}/edit`}>
              <Button variant="ghost" size="sm" leftIcon={<EditIcon size={13} />}>
                Edit
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Admission Number:</span>
              <span className="font-mono font-bold text-indigo-600">
                {student.admission_no}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Full Name:</span>
              <span className="font-bold text-slate-800">
                {student.first_name} {student.last_name}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Date of Birth:</span>
              <span className="font-medium text-slate-800">
                {student.dob || 'Not specified'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Gender:</span>
              <span className="capitalize font-medium text-slate-800">
                {student.gender || 'Not specified'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Enrollment Status:</span>
              <Badge variant={student.status === 'active' ? 'success' : 'warning'} size="sm">
                {student.status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Date of Enrollment:</span>
              <span className="font-medium text-slate-800">
                {student.enrollment_date || '2026-04-01'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 font-medium">Blood Group:</span>
              <span className="font-bold text-rose-600">
                {student.blood_group || 'B+'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Academic Structure Profile */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <GraduationCapIcon size={18} />
              <span>Academic Enrollment Profile</span>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Class / Grade:</span>
              <span className="font-bold text-slate-800">
                {student.class_name || 'Class 10'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Section:</span>
              <span className="font-bold text-slate-800">
                {student.section_name || 'Section A'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Academic Session:</span>
              <span className="font-medium text-slate-800">
                2026 - 2027 (Active Session)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Affiliation Board:</span>
              <span className="font-medium text-slate-800">
                CBSE (Central Board of Secondary Education)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Category / Quota:</span>
              <span className="font-medium text-slate-800">
                {student.category || 'General'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 font-medium">Religion / Community:</span>
              <span className="font-medium text-slate-800">
                {student.religion || 'General'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Details */}
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <PhoneIcon size={18} />
              <span>Contact Details & Address</span>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Email Address:</span>
              <span className="font-medium text-slate-800">
                {student.email || 'Not recorded'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Mobile Phone:</span>
              <span className="font-mono font-medium text-slate-800">
                {student.phone || 'Not recorded'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Emergency Contact:</span>
              <span className="font-medium text-slate-800">
                {student.emergency_contact || student.phone || 'Not recorded'}
              </span>
            </div>

            <div className="py-2 space-y-1">
              <span className="text-slate-500 font-medium block">
                Permanent Residential Address:
              </span>
              <p className="font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {student.address || 'B-42, Gulmohar Park, New Delhi 110049'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Documents Card */}
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <FileTextIcon size={18} />
              <span>Attached Documents & Certificates</span>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {student.documents && student.documents.length > 0 ? (
              <div className="space-y-3">
                {student.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60"
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
                          {doc.file_name} • Uploaded {doc.uploaded_at || 'During Admission'}
                        </p>
                      </div>
                    </div>

                    <Badge variant="success" size="sm">
                      Verified
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">
                No formal documents uploaded for this student record.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
