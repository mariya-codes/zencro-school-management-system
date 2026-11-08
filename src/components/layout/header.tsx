'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import {
  MenuIcon,
  SearchIcon,
  BellIcon,
  HelpCircleIcon,
  BuildingIcon,
  LogOutIcon,
  ChevronDownIcon,
} from '@/components/ui/icons';
import { Avatar } from '@/components/ui/avatar';
import { RoleSwitcher } from '@/components/shared/role-switcher';
import { AcademicSessionBadge } from './academic-session-badge';
import { DropdownMenu } from '@/components/ui/dropdown-menu';

export interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [globalSearch, setGlobalSearch] = useState('');

  const userMenuItems = [
    {
      id: 'profile',
      label: user?.name || 'Administrator',
      icon: <BuildingIcon size={14} />,
      disabled: true,
    },
    {
      id: 'divider_1',
      label: '',
      divider: true,
    },
    {
      id: 'logout',
      label: 'Sign Out',
      icon: <LogOutIcon size={14} />,
      danger: true,
      onClick: () => signOut(),
    },
  ];

  return (
    <header
      className="sticky top-0 z-30 flex h-14 w-full items-center justify-between bg-white px-4 sm:px-5 select-none"
      style={{
        borderBottom: '1px solid var(--zc-border)',
        boxShadow: 'var(--zc-shadow-sm)',
      }}
    >
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-[var(--zc-text-secondary)] hover:bg-[var(--zc-primary-light)] md:hidden cursor-pointer shrink-0"
          aria-label="Open sidebar navigation"
        >
          <MenuIcon size={20} />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" style={{ color: 'var(--zc-text-muted)' }}>
            <SearchIcon size={14} />
          </div>
          <input
            type="text"
            placeholder="Search students, classes, or records..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full rounded-lg py-2 pl-9 pr-3 text-xs placeholder:text-[var(--zc-text-muted)] focus:outline-none focus:ring-2 transition-all"
            style={{
              border: '1px solid var(--zc-border)',
              backgroundColor: 'var(--zc-bg)',
              color: 'var(--zc-text)',
            }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Academic Session Selector */}
        <AcademicSessionBadge />

        {/* Help Icon */}
        <button
          type="button"
          className="p-2 rounded-lg text-[var(--zc-text-secondary)] hover:text-[var(--zc-primary)] hover:bg-[var(--zc-primary-light)] transition-colors cursor-pointer"
          title="Help & Documentation"
          aria-label="Help"
        >
          <HelpCircleIcon size={17} />
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-[var(--zc-text-secondary)] hover:text-[var(--zc-primary)] hover:bg-[var(--zc-primary-light)] transition-colors cursor-pointer"
          title="Notifications"
          aria-label="Notifications"
        >
          <BellIcon size={17} />
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-white"
            style={{ backgroundColor: 'var(--zc-danger)' }}
          />
        </button>

        {/* Role Switcher */}
        <RoleSwitcher />

        {/* User Avatar Menu */}
        <div className="pl-2 ml-1" style={{ borderLeft: '1px solid var(--zc-border)' }}>
          <DropdownMenu
            trigger={
              <button
                type="button"
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-[var(--zc-primary-light)] transition-colors cursor-pointer"
              >
                <Avatar name={user?.name || 'Admin'} size="sm" />
                <div className="hidden md:block text-left pr-1">
                  <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--zc-text)' }}>
                    {user?.name?.split(' ')[0] || 'Admin'}
                  </p>
                  <p className="text-[10px] leading-none" style={{ color: 'var(--zc-text-secondary)' }}>
                    {user?.designation?.split(' ')[0] || 'Administrator'}
                  </p>
                </div>
                <ChevronDownIcon size={13} className="text-[var(--zc-text-muted)] hidden md:block" />
              </button>
            }
            items={userMenuItems}
            align="right"
          />
        </div>
      </div>
    </header>
  );
}
