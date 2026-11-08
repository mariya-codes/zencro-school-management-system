'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import {
  SchoolIcon,
  LayoutDashboardIcon,
  BuildingIcon,
  CalendarIcon,
  GraduationCapIcon,
  LayersIcon,
  LogOutIcon,
  ShieldIcon,
  UsersIcon,
  UserCheckIcon,
  CreditCardIcon,
  AwardIcon,
  MessageSquareIcon,
  ClipboardListIcon,
  FileTextIcon,
  SettingsIcon,
} from '@/components/ui/icons';
import { ROLE_LABELS } from '@/types/auth';

export interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user, role, signOut } = useAuth();

  const mainNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboardIcon size={18} />,
    },
    {
      label: 'Students',
      href: '/students',
      icon: <UsersIcon size={18} />,
    },
    {
      label: 'Attendance',
      href: '/attendance',
      icon: <UserCheckIcon size={18} />,
    },
    {
      label: 'Fees',
      href: '/fees',
      icon: <CreditCardIcon size={18} />,
    },
    {
      label: 'Exams & Results',
      href: '/exams',
      icon: <AwardIcon size={18} />,
    },
    {
      label: 'Report Cards',
      href: '/report-cards',
      icon: <FileTextIcon size={18} />,
    },
    {
      label: 'Communication',
      href: '/communication',
      icon: <MessageSquareIcon size={18} />,
    },
    {
      label: 'Parent Portal',
      href: '/parent',
      icon: <UsersIcon size={18} />,
    },
    {
      label: 'PTM',
      href: '/ptm',
      icon: <CalendarIcon size={18} />,
    },
    {
      label: 'Forms',
      href: '/forms',
      icon: <ClipboardListIcon size={18} />,
    },
  ];

  const academicNavItems: NavItem[] = [
    {
      label: 'Academic Years',
      href: '/academic-years',
      icon: <CalendarIcon size={18} />,
    },
    {
      label: 'Classes & Streams',
      href: '/classes',
      icon: <GraduationCapIcon size={18} />,
    },
    {
      label: 'Sections & Rooms',
      href: '/sections',
      icon: <LayersIcon size={18} />,
    },
    {
      label: 'School Setup',
      href: '/setup',
      icon: <BuildingIcon size={18} />,
    },
  ];

  const systemNavItems: NavItem[] = [
    {
      label: 'Import Wizard',
      href: '/import',
      icon: <FileTextIcon size={18} />,
    },
    {
      label: 'Data Export',
      href: '/export',
      icon: <LayersIcon size={18} />,
    },
    {
      label: 'Privacy & Audit',
      href: '/privacy',
      icon: <ShieldIcon size={18} />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <SettingsIcon size={18} />,
    },
  ];

  const roleInfo = ROLE_LABELS[role] || ROLE_LABELS.admin;

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800/80 w-64 select-none shrink-0',
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-18 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-extrabold text-lg shrink-0">
          <SchoolIcon size={22} className="text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white">ZenCro</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              K-12
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate">School Management System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Main Operational Modules */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                )}
              >
                <span
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                >
                  {item.icon}
                </span>
                <span className="truncate flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Academic Structure Section */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Structure & Setup
          </p>
          <div className="space-y-1">
            {academicNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'group flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  )}
                >
                  <span
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System & Data Management Section */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            System
          </p>
          <div className="space-y-1">
            {systemNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'group flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  )}
                >
                  <span
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: Data & Privacy Link */}
      <div className="px-4 py-2 border-t border-slate-800/60">
        <Link
          href="/privacy"
          onClick={onNavigate}
          className={cn(
            'group flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
            pathname === '/privacy' && 'bg-slate-800 text-white'
          )}
        >
          <ShieldIcon size={16} />
          <span>Data & Privacy</span>
        </Link>
      </div>

      {/* Footer User Info & Sign Out */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              <ShieldIcon size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {roleInfo.label}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition-colors cursor-pointer shrink-0"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOutIcon size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
