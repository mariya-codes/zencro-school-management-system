'use client';

import React from 'react';
import Link from 'next/link';
import { Guardian } from '@/types/student';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  UsersIcon,
  PhoneIcon,
  MailIcon,
  BuildingIcon,
  MapPinIcon,
  ShieldIcon,
  PlusIcon,
  EditIcon,
} from '@/components/ui/icons';

export interface GuardianListProps {
  guardians: Guardian[];
  studentId: string;
}

export function GuardianList({ guardians, studentId }: GuardianListProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Linked Parents & Guardians ({guardians.length})
          </h3>
          <p className="text-xs text-slate-500">
            Authorized individuals for communication, fee invoicing, and emergency notifications.
          </p>
        </div>

        <Link href={`/students/${studentId}/edit`}>
          <Button size="sm" variant="outline" leftIcon={<EditIcon size={14} />}>
            Manage Guardians
          </Button>
        </Link>
      </div>

      {guardians.length === 0 ? (
        <Card className="p-8 text-center text-xs text-slate-400 italic">
          No guardians currently linked to this student profile.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guardians.map((guardian, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-bold text-base shrink-0">
                      <UsersIcon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {guardian.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Relationship: {guardian.relationship}
                      </p>
                    </div>
                  </div>

                  {guardian.is_primary ? (
                    <Badge variant="purple" size="sm" dot>
                      Primary Guardian
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">
                      Secondary Contact
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-3.5 text-xs">
                {guardian.occupation && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <BuildingIcon size={14} className="text-slate-400 shrink-0" />
                    <span>{guardian.occupation}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 text-slate-700">
                  <PhoneIcon size={14} className="text-slate-400 shrink-0" />
                  <span className="font-mono font-bold">{guardian.phone}</span>
                </div>

                {guardian.email && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <MailIcon size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{guardian.email}</span>
                  </div>
                )}

                {guardian.address && (
                  <div className="flex items-start gap-2.5 text-slate-500 pt-2 border-t border-slate-100">
                    <MapPinIcon size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{guardian.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
