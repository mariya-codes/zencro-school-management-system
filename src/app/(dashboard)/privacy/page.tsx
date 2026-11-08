'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Tabs } from '@/components/ui/tabs';
import { privacyService } from '@/lib/services/privacy-service';
import { PrivacySummaryResponse, AuditLogEntry, UserAccessRecord } from '@/types/privacy';
import {
  ShieldIcon,
  SearchIcon,
  ClockIcon,
  UsersIcon,
  LockIcon,
  FileTextIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  DownloadIcon,
  RefreshCwIcon,
} from '@/components/ui/icons';

export default function PrivacyPage() {
  const [activeTab, setActiveTab] = useState<'audit' | 'users' | 'retention'>('audit');
  const [data, setData] = useState<PrivacySummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'SUCCESS' | 'DENIED' | 'FLAGGED'>('all');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await privacyService.getPrivacySummary();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load privacy and audit data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading Data & Privacy Center..." />;
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Privacy Center Unavailable"
        message={error || 'Could not load institutional audit logs.'}
        onRetry={loadData}
      />
    );
  }

  const filteredLogs = data.recent_logs.filter((log) => {
    const matchesQuery =
      log.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip_address.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data & Privacy Center"
        subtitle="Institutional security audit logs, role-based data access tracking, and data retention safeguards."
        icon={<ShieldIcon size={24} />}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCwIcon size={14} className="mr-1.5" />
              Refresh Logs
            </Button>
          </div>
        }
      />

      {/* DPDP Technical Safeguards Notice */}
      <div className="p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/60 text-xs text-indigo-900 flex items-start gap-3">
        <LockIcon size={16} className="text-indigo-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Technical Safeguards Architecture:</span> Tenant isolation, role-based access control (RBAC), and immutable audit logs provide institutional traceability. Access to student personal records is restricted strictly to authorized faculty and linked parent guardians.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Staff Users</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {data.total_active_users}
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">All accounts verified</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <UsersIcon size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Audit Events (24h)</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {data.audit_logs_24h_count}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Logged with IP & Device signature</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <ClockIcon size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security Flagged Events</p>
              <h3 className="text-2xl font-extrabold text-rose-600 mt-1">
                {data.flagged_access_events}
              </h3>
              <p className="text-[11px] text-rose-500 font-medium mt-0.5">Access denied attempts</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
              <AlertCircleIcon size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'audit', label: 'Security & Activity Audit Logs' },
          { id: 'users', label: 'User Access & Permissions' },
          { id: 'retention', label: 'Data Retention Policies' },
        ]}
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as any)}
      />

      {/* Tab 1: Audit Logs */}
      {activeTab === 'audit' && (
        <Card className="border-slate-200/90 shadow-xs">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Institutional Access & Activity Logs
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Granular audit records of all read, mutation, and authentication events.
                </CardDescription>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <SearchIcon size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search user, action, IP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div className="flex items-center gap-1">
                  {(['all', 'SUCCESS', 'DENIED', 'FLAGGED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        statusFilter === st
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st === 'all' ? 'All' : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Timestamp</th>
                    <th className="py-3 px-4 font-semibold">Actor / User</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Action</th>
                    <th className="py-3 px-4 font-semibold">Target Resource</th>
                    <th className="py-3 px-4 font-semibold">IP & Client</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {log.user_name}
                        <div className="text-[10px] text-slate-400 font-normal">{log.user_email}</div>
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <Badge variant="outline" size="sm">
                          {log.user_role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={log.resource}>
                        {log.resource}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-500 font-mono">
                        {log.ip_address}
                        <div className="text-[10px] text-slate-400 font-sans">{log.device_info}</div>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {log.status === 'SUCCESS' ? (
                          <Badge variant="success" size="sm">
                            <CheckCircleIcon size={10} className="mr-1" />
                            Success
                          </Badge>
                        ) : log.status === 'DENIED' ? (
                          <Badge variant="destructive" size="sm">
                            <AlertCircleIcon size={10} className="mr-1" />
                            Denied
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            <AlertCircleIcon size={10} className="mr-1" />
                            Flagged
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: User Access & Permissions */}
      {activeTab === 'users' && (
        <Card className="border-slate-200/90 shadow-xs">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900">
              Active Authorized Accounts & Security Posture
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Users granted tenant workspace access under role-based boundaries.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                  <tr>
                    <th className="py-3 px-4 font-semibold">User Name</th>
                    <th className="py-3 px-4 font-semibold">Role Scope</th>
                    <th className="py-3 px-4 font-semibold">Last Active</th>
                    <th className="py-3 px-4 font-semibold text-center">Two-Factor (MFA)</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.user_access_list.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {u.name}
                        <div className="text-[10px] text-slate-400 font-normal">{u.email}</div>
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <Badge variant="purple" size="sm">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {u.last_active}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {u.mfa_enabled ? (
                          <span className="inline-flex items-center text-emerald-600 font-bold text-xs">
                            <CheckCircleIcon size={12} className="mr-1" />
                            Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-amber-600 font-semibold text-xs">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="success" size="sm">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Retention Policies */}
      {activeTab === 'retention' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.retention_policies.map((p) => (
            <Card key={p.id} className="border-slate-200/90 shadow-xs">
              <CardHeader className="p-4 sm:p-5 pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" size="sm">
                    {p.category}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    {p.retention_days} Days Retention
                  </span>
                </div>
                <CardTitle className="text-sm font-bold text-slate-900 mt-2">
                  {p.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-5 pb-5 pt-0">
                <p className="text-xs text-slate-500 leading-relaxed">
                  {p.description}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Auto-Archival Rule</span>
                  <Badge variant="success" size="sm" dot>
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
