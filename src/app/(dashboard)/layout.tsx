'use client';

import React, { useState, Suspense } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Desktop Sidebar — UNTOUCHED */}
      <div className="hidden md:flex md:shrink-0">
        <Suspense fallback={<aside className="w-64 bg-slate-900 shrink-0" />}>
          <Sidebar />
        </Suspense>
      </div>

      {/* Mobile Drawer — UNTOUCHED */}
      <Suspense fallback={null}>
        <MobileNav
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      </Suspense>

      {/* Main Content Area — Redesigned */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0" style={{ backgroundColor: 'var(--zc-bg)' }}>
        <Suspense fallback={<header className="h-14 w-full border-b bg-white" style={{ borderColor: 'var(--zc-border)' }} />}>
          <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        </Suspense>

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<div className="h-48 rounded-xl bg-white animate-pulse" />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
