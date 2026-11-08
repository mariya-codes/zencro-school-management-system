'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import {
  SettingsIcon,
  BuildingIcon,
  CalendarIcon,
  ShieldIcon,
  DownloadIcon,
  CheckCircleIcon,
  BellIcon,
} from '@/components/ui/icons';

export default function SettingsPage() {
  const { user, school, role } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [offlineSyncAlerts, setOfflineSyncAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Settings"
        subtitle="School workspace preferences, system alerts, and module configuration."
        icon={<SettingsIcon size={24} />}
        actions={
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {isSaved ? (
              <>
                <CheckCircleIcon size={16} className="mr-1.5" />
                Settings Saved
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workspace Profile */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardHeader className="p-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <BuildingIcon size={20} />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  School Tenant Workspace
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Affiliation, board, and campus identity.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Institution Name:</span>
              <span className="font-bold text-slate-900">{school?.name || 'Delhi Public Academy'}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Affiliation Board:</span>
              <Badge variant="purple" size="sm">CBSE (All India)</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">School Code:</span>
              <span className="font-mono text-slate-800">CBSE-DEL-04910</span>
            </div>
            <div className="pt-2">
              <Link href="/setup">
                <Button variant="outline" size="sm" className="w-full">
                  Edit Full School Profile & Setup
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Academic Session */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardHeader className="p-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarIcon size={20} />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Academic Session & Calendar
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Active academic year and examination terms.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Current Session:</span>
              <span className="font-bold text-emerald-700">2026 - 2027 (Active)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Session Duration:</span>
              <span className="text-slate-700">April 1, 2026 – March 31, 2027</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Working Days / Week:</span>
              <span className="text-slate-700">6 Days (Mon - Sat)</span>
            </div>
            <div className="pt-2">
              <Link href="/academic-years">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Academic Years & Terms
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System & Notification Alerts */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardHeader className="p-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <BellIcon size={20} />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  System Alerts & Notifications
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  In-app status badges and sync warnings.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-slate-900">Attendance Defaulter Alerts</p>
                <p className="text-[11px] text-slate-400">Highlight classes with attendance below 85%.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100">
              <div>
                <p className="font-semibold text-slate-900">Offline Attendance Sync Banner</p>
                <p className="text-[11px] text-slate-400">Show persistent banner when device is offline.</p>
              </div>
              <input
                type="checkbox"
                checked={offlineSyncAlerts}
                onChange={(e) => setOfflineSyncAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </CardContent>
        </Card>

        {/* Security & Data Safeguards */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardHeader className="p-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <ShieldIcon size={20} />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Security & Data Management
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Access audits, data exports, and backups.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Audit Logging:</span>
              <Badge variant="success" size="sm">Enabled (Immutable)</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Data Export Format:</span>
              <span className="text-slate-700">CSV, XLSX, JSON</span>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <Link href="/privacy" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Audit Logs
                </Button>
              </Link>
              <Link href="/export" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Data Export
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Build and Version Info */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">ZenCro K-12 School Management System • Frontend MVP</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Version 0.1.0 • Built with Next.js, React 19, TypeScript & Tailwind CSS • Powered by ZenCro Platform
        </p>
      </div>
    </div>
  );
}
