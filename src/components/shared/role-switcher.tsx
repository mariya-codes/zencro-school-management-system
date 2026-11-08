'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole, ROLE_LABELS } from '@/types/auth';
import { ShieldIcon, ChevronDownIcon } from '@/components/ui/icons';
import { DropdownMenu } from '@/components/ui/dropdown-menu';

export function RoleSwitcher() {
  const { role, switchRole } = useAuth();

  const currentRoleInfo = ROLE_LABELS[role] || ROLE_LABELS.admin;

  const approvedRoles: UserRole[] = [
    'admin',
    'principal',
    'teacher',
    'accountant',
    'parent',
  ];

  const menuItems = approvedRoles.map((r) => {
    const info = ROLE_LABELS[r];
    const isSelected = r === role;
    return {
      id: r,
      label: `${info.label} ${isSelected ? '✓' : ''}`,
      icon: <ShieldIcon size={14} className={isSelected ? 'text-indigo-600' : 'text-slate-400'} />,
      onClick: () => switchRole(r),
    };
  });

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu
        trigger={
          <button
            type="button"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-indigo-200/80 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 transition-colors cursor-pointer text-xs font-semibold"
            title="Preview interface with different role permissions"
          >
            <ShieldIcon size={14} className="text-indigo-600" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-bold">{currentRoleInfo.label}</span>
            <ChevronDownIcon size={12} className="text-indigo-500 opacity-80" />
          </button>
        }
        items={menuItems}
        align="right"
      />
    </div>
  );
}
