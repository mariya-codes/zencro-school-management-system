'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/types/auth';
import { ShieldIcon } from '@/components/ui/icons';

export interface RoleGuardProps {
  allowedRoles?: UserRole[];
  requirePermission?: (permissions: any) => boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGuard({
  allowedRoles,
  requirePermission,
  fallback,
  children,
}: RoleGuardProps) {
  const { role, permissions } = useAuth();

  const hasRoleAccess = !allowedRoles || allowedRoles.includes(role);
  const hasPermissionAccess = !requirePermission || requirePermission(permissions);

  if (hasRoleAccess && hasPermissionAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-amber-200 bg-amber-50/60 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mb-3">
        <ShieldIcon size={24} />
      </div>
      <h3 className="text-sm font-bold text-amber-900">
        Access Restricted for Current Role ({role})
      </h3>
      <p className="text-xs text-amber-700/80 max-w-xs mt-1">
        This section requires administrative privileges. You can use the Role Switcher in the top bar to preview other roles.
      </p>
    </div>
  );
}
