'use client';

import React from 'react';
import Link from 'next/link';
import { StudentListItem } from '@/types/student';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import {
  SearchIcon,
  EyeIcon,
  EditIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
  GraduationCapIcon,
} from '@/components/ui/icons';

export interface StudentTableProps {
  students: StudentListItem[];
  total: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  isLoading: boolean;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  filterControls?: React.ReactNode;
  onAddStudent?: () => void;
}

export function StudentTable({
  students,
  total,
  currentPage,
  pageSize,
  searchQuery,
  isLoading,
  onSearchChange,
  onPageChange,
  filterControls,
  onAddStudent,
}: StudentTableProps) {
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, total);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success" size="sm" dot>
            Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="warning" size="sm">
            Inactive
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="danger" size="sm">
            Suspended
          </Badge>
        );
      case 'transferred':
        return (
          <Badge variant="info" size="sm">
            Transferred
          </Badge>
        );
      default:
        return (
          <Badge variant="default" size="sm">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search by student name, admission no..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<SearchIcon size={16} />}
          />
        </div>

        {filterControls && (
          <div className="flex flex-wrap items-center gap-3">
            {filterControls}
          </div>
        )}
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200/80 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-700">
              <tr>
                <th scope="col" className="px-5 py-3.5">
                  Student
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Admission ID
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Class & Section
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Guardian / Contact
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                // Skeleton loading rows
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-slate-200 shrink-0" />
                        <div className="space-y-2">
                          <div className="h-3.5 w-32 rounded bg-slate-200" />
                          <div className="h-2.5 w-24 rounded bg-slate-100" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3.5 w-24 rounded bg-slate-200" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="h-3.5 w-20 rounded bg-slate-200" />
                        <div className="h-2.5 w-16 rounded bg-slate-100" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="h-3.5 w-28 rounded bg-slate-200" />
                        <div className="h-2.5 w-20 rounded bg-slate-100" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-6 w-16 rounded-lg bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <div className="h-8 w-16 rounded-xl bg-slate-200" />
                        <div className="h-8 w-16 rounded-xl bg-slate-200" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <EmptyState
                      title="No students found"
                      description="Try changing your search or filters, or add a new student to the registry."
                      actionLabel={onAddStudent ? '+ Add Student' : undefined}
                      onAction={onAddStudent}
                    />
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const fullName = `${student.first_name} ${student.last_name}`;
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Student Info & Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={fullName}
                            src={student.avatar_url}
                            size="md"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/students/${student.id}`}
                              className="font-bold text-slate-900 hover:text-indigo-600 transition-colors block truncate"
                            >
                              {fullName}
                            </Link>
                            <span className="text-xs text-slate-500 capitalize">
                              {student.gender || 'Student'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Admission ID */}
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-800">
                        {student.admission_no}
                      </td>

                      {/* Class & Section */}
                      <td className="px-5 py-4">
                        <div className="text-xs font-semibold text-slate-900">
                          {student.class}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {student.section}
                        </div>
                      </td>

                      {/* Guardian & Contact */}
                      <td className="px-5 py-4">
                        <div className="text-xs font-medium text-slate-900">
                          {student.guardian_name}
                          {student.guardian_relationship && (
                            <span className="text-[11px] text-slate-400 ml-1">
                              ({student.guardian_relationship})
                            </span>
                          )}
                        </div>
                        {student.guardian_phone && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <PhoneIcon size={11} className="text-slate-400" />
                            <span>{student.guardian_phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {getStatusBadge(student.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Link href={`/students/${student.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                              leftIcon={<EyeIcon size={13} />}
                            >
                              View
                            </Button>
                          </Link>
                          <Link href={`/students/${student.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900"
                              leftIcon={<EditIcon size={13} />}
                            >
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && total > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-3.5 sm:flex-row">
            <div className="text-xs text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-700">
                {startRecord}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-700">
                {endRecord}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-700">
                {total}
              </span>{' '}
              students
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                leftIcon={<ChevronLeftIcon size={14} />}
              >
                Previous
              </Button>
              <div className="text-xs font-semibold px-2 text-slate-600">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                rightIcon={<ChevronRightIcon size={14} />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
